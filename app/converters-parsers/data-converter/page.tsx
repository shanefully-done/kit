"use client";

import { useCallback, useMemo, useState } from "react";
import { usePersistentState } from "@/hooks/use-persistent-state";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { ToolHeader } from "@/components/ToolHeader";
import { Braces, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";
import * as yaml from "js-yaml";
import * as toml from "smol-toml";

type Format = "JSON" | "YAML" | "TOML" | "CSV";

const FORMATS: Format[] = ["JSON", "YAML", "TOML", "CSV"];

const DEFAULT_INPUT = JSON.stringify({ kit: [1, 2, 3], rev: "2.6" }, null, 2);

function parseCSV(input: string): Record<string, string>[] {
	const rows: string[][] = [];
	let row: string[] = [];
	let field = "";
	let inQuotes = false;

	for (let i = 0; i < input.length; i++) {
		const ch = input[i];
		const next = input[i + 1];

		if (inQuotes) {
			if (ch === '"') {
				if (next === '"') {
					field += '"';
					i++;
				} else {
					inQuotes = false;
				}
			} else {
				field += ch;
			}
		} else {
			if (ch === '"') {
				inQuotes = true;
			} else if (ch === ",") {
				row.push(field);
				field = "";
			} else if (ch === "\r") {
				if (next === "\n") i++;
				row.push(field);
				field = "";
				if (row.some((c) => c !== "")) rows.push(row);
				row = [];
			} else if (ch === "\n") {
				row.push(field);
				field = "";
				if (row.some((c) => c !== "")) rows.push(row);
				row = [];
			} else {
				field += ch;
			}
		}
	}
	// flush final field/row
	row.push(field);
	if (row.some((c) => c !== "")) rows.push(row);

	if (rows.length < 2) return [];

	const headers = rows[0];
	return rows.slice(1).map((r) => {
		const obj: Record<string, string> = {};
		for (let j = 0; j < headers.length; j++) {
			obj[headers[j]] = j < r.length ? r[j] : "";
		}
		return obj;
	});
}

function parse(input: string, format: Format): unknown {
	const trimmed = input.trim();
	if (!trimmed) return undefined;

	switch (format) {
		case "JSON":
			return JSON.parse(trimmed);
		case "YAML":
			return yaml.load(trimmed, { schema: yaml.JSON_SCHEMA });
		case "TOML":
			return toml.parse(trimmed);
		case "CSV":
			return parseCSV(trimmed);
	}
}

function serialize(
	value: unknown,
	format: Format,
): { output: string; warning?: string } {
	switch (format) {
		case "JSON":
			return { output: JSON.stringify(value, null, 2) };
		case "YAML":
			return { output: yaml.dump(value, { noRefs: true, lineWidth: -1 }) };
		case "TOML": {
			try {
				return { output: toml.stringify(value as Record<string, unknown>) };
			} catch {
				return {
					output: "",
					warning:
						"[ UNSUPPORTED STRUCTURE ] TOML does not support nested arrays or mixed structures",
				};
			}
		}
		case "CSV": {
			if (
				Array.isArray(value) &&
				value.length > 0 &&
				typeof value[0] === "object" &&
				value[0] !== null &&
				!Array.isArray(value[0])
			) {
				const objs = value as Record<string, unknown>[];
				const headerSet: Record<string, true> = {};
				for (const obj of objs) {
					for (const k of Object.keys(obj)) headerSet[k] = true;
				}
				const headerArr = Object.keys(headerSet);
				let warning: string | undefined;
				const escape = (v: string) =>
					v.includes(",") || v.includes('"') || v.includes("\n") || v.includes("\r")
						? '"' + v.replace(/"/g, '""') + '"'
						: v;
				const lines: string[] = [headerArr.map(escape).join(",")];
				for (const obj of objs) {
					const row = headerArr.map((h) => {
						const v = obj[h];
						if (v === undefined || v === null) return "";
						const s = typeof v === "object" ? JSON.stringify(v) : String(v);
						if (typeof v === "object") warning = "[ NESTED VALUES STRINGIFIED ]";
						return escape(s);
					});
					lines.push(row.join(","));
				}
				return { output: lines.join("\n"), warning };
			}
			if (typeof value === "object" && value !== null && !Array.isArray(value)) {
				const obj = value as Record<string, unknown>;
				const escape = (v: string) =>
					v.includes(",") || v.includes('"') || v.includes("\n") || v.includes("\r")
						? '"' + v.replace(/"/g, '""') + '"'
						: v;
				const lines: string[] = ["key,value"];
				for (const [k, v] of Object.entries(obj)) {
					const s =
						typeof v === "object" && v !== null ? JSON.stringify(v) : String(v);
					lines.push(`${escape(k)},${escape(s)}`);
				}
				return { output: lines.join("\n") };
			}
			// fallback: stringify per cell
			return {
				output: JSON.stringify(value, null, 2),
				warning: "[ NESTED VALUES STRINGIFIED ]",
			};
		}
	}
}

export default function DataConverterPage() {
	const { t } = useI18n();
	const [fromFormat, setFromFormat] = usePersistentState<Format>(
		"data-converter:fromFormat",
		"JSON",
	);
	const [toFormat, setToFormat] = usePersistentState<Format>(
		"data-converter:toFormat",
		"YAML",
	);
	const [input, setInput] = useState(DEFAULT_INPUT);

	const result = useMemo(() => {
		const trimmed = input.trim();
		if (!trimmed) return { output: "", error: undefined, warning: undefined };

		try {
			const parsed = parse(input, fromFormat);
			if (parsed === undefined)
				return { output: "", error: undefined, warning: undefined };
			const serialized = serialize(parsed, toFormat);
			if (serialized.warning && !serialized.output) {
				return { output: "", error: serialized.warning, warning: undefined };
			}
			return {
				output: serialized.output,
				error: undefined,
				warning: serialized.warning,
			};
		} catch (e) {
			const msg = e instanceof Error ? e.message : String(e);
			return { output: "", error: msg, warning: undefined };
		}
	}, [input, fromFormat, toFormat]);

	const handleCopy = useCallback(() => {
		navigator.clipboard.writeText(result.output);
		toast.success(t("tools.dataConverter.copied"));
	}, [result.output, t]);

	return (
		<ToolPageLayout
			header={<ToolHeader icon={<Braces aria-hidden />} title={t("tools.dataConverter.title")} />}
		>
			<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
				{t("tools.dataConverter.formatConversionLabel")}
			</p>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="space-y-3">
					<Label className="font-mono text-[11px] uppercase tracking-[0.08em]">
						{t("tools.dataConverter.fromLabel")}
					</Label>
					<Select
						value={fromFormat}
						onValueChange={(v) => setFromFormat(v as Format)}
					>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{FORMATS.map((f) => (
								<SelectItem key={f} value={f}>
									{f}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Textarea
						value={input}
						onChange={(e) => setInput(e.target.value)}
						className="font-mono text-sm min-h-40 resize-y"
						placeholder={t("tools.dataConverter.placeholder")}
					/>
				</div>

				<div className="space-y-3">
					<div className="flex items-center justify-between">
						<Label className="font-mono text-[11px] uppercase tracking-[0.08em]">
							{t("tools.dataConverter.toLabel")}
						</Label>
						{result.output && (
							<Button variant="outline" size="sm" onClick={handleCopy}>
								<Copy className="size-3.5" />
							</Button>
						)}
					</div>
					<Select value={toFormat} onValueChange={(v) => setToFormat(v as Format)}>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{FORMATS.map((f) => (
								<SelectItem key={f} value={f}>
									{f}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{result.error ? (
						<>
							<div className="border border-hazard text-hazard-text font-mono text-xs px-3 py-2">
								{t("tools.dataConverter.parseError")}
							</div>
							<div className="border border-hazard bg-muted/40 p-3 font-mono text-xs text-hazard-text break-all min-h-40">
								{result.error}
							</div>
						</>
					) : (
						<div className="border border-ink bg-muted/40 p-3 font-mono text-sm whitespace-pre-wrap break-all min-h-40">
							{result.output}
						</div>
					)}
					{result.warning && (
						<p className="font-mono text-[10px] text-muted-foreground">
							{result.warning}
						</p>
					)}
				</div>
			</div>
		</ToolPageLayout>
	);
}
