"use client";

import { useState, useMemo, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { ToolHeader } from "@/components/ToolHeader";
import { Languages } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

type CharInfo = {
	char: string;
	code: string;
	dec: number;
	utf8Hex: string;
	jsEscape: string;
	htmlEntity: string;
};

function getUtf8Bytes(codePoint: number): number[] {
	if (codePoint <= 0x7f) return [codePoint];
	if (codePoint <= 0x7ff)
		return [0xc0 | (codePoint >> 6), 0x80 | (codePoint & 0x3f)];
	if (codePoint <= 0xffff)
		return [
			0xe0 | (codePoint >> 12),
			0x80 | ((codePoint >> 6) & 0x3f),
			0x80 | (codePoint & 0x3f),
		];
	return [
		0xf0 | (codePoint >> 18),
		0x80 | ((codePoint >> 12) & 0x3f),
		0x80 | ((codePoint >> 6) & 0x3f),
		0x80 | (codePoint & 0x3f),
	];
}

function isControlOrWhitespace(ch: string): boolean {
	const cp = ch.codePointAt(0) ?? 0;
	if (cp <= 0x20) return true;
	if (cp === 0x7f) return true;
	if (cp >= 0x80 && cp <= 0x9f) return true;
	return false;
}

function analyzeChars(text: string): CharInfo[] {
	return [...text].map((ch) => {
		const cp = ch.codePointAt(0) ?? 0;
		const utf8 = getUtf8Bytes(cp);
		return {
			char: ch,
			code: cp.toString(16).toUpperCase().padStart(4, "0"),
			dec: cp,
			utf8Hex: utf8.map((b) => b.toString(16).toUpperCase().padStart(2, "0")).join(" "),
			jsEscape: cp <= 0xffff
				? `\\u${cp.toString(16).toUpperCase().padStart(4, "0")}`
				: `\\u{${cp.toString(16).toUpperCase()}}`,
			htmlEntity: cp <= 0xffff
				? `&#${cp};`
				: `&#${cp};`,
		};
	});
}

function escapeAll(text: string): string {
	return [...text]
		.map((ch) => {
			const cp = ch.codePointAt(0) ?? 0;
			return `\\u${cp.toString(16).toUpperCase().padStart(4, "0")}`;
		})
		.join("");
}

function unescape(text: string): string {
	try {
		return text.replace(/\\u\{?([0-9a-fA-F]+)\}?/g, (_, hex) =>
			String.fromCodePoint(Number.parseInt(hex, 16)),
		);
	} catch {
		return text;
	}
}

export default function UnicodeInspectorPage() {
	const { t } = useI18n();
	const [text, setText] = useState("KIT \u00ae 2.6 \ud55c");
	const [transformOutput, setTransformOutput] = useState("");

	const chars = useMemo(() => analyzeChars(text), [text]);

	const handleEscapeAll = useCallback(() => {
		const result = escapeAll(text);
		setTransformOutput(result);
		navigator.clipboard.writeText(result);
		toast.success(t("common.copied"));
	}, [text, t]);

	const handleUnescape = useCallback(() => {
		const result = unescape(text);
		setTransformOutput(result);
		navigator.clipboard.writeText(result);
		toast.success(t("common.copied"));
	}, [text, t]);

	const handleCopyOutput = useCallback(() => {
		navigator.clipboard.writeText(transformOutput);
		toast.success(t("common.copied"));
	}, [transformOutput, t]);

	return (
		<ToolPageLayout
			header={
				<ToolHeader icon={<Languages aria-hidden />} title={t("tools.unicodeInspector.title")} />
			}
		>
			<div className="space-y-4">
				<div className="space-y-2">
					<Label className="font-mono text-[11px] uppercase tracking-[0.08em]">
						{t("tools.unicodeInspector.inputLabel")}
					</Label>
					<Textarea
						value={text}
						onChange={(e) => setText(e.target.value)}
						className="font-mono"
					/>
				</div>

				{chars.length === 0 ? (
					<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
						{t("tools.unicodeInspector.awaitingInput")}
					</p>
				) : (
					<>
						<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
							{t("tools.unicodeInspector.breakdownLabel")}
						</p>
						<div className="border border-ink overflow-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="font-mono text-[11px] uppercase tracking-[0.08em]">
											{t("tools.unicodeInspector.headerChar")}
										</TableHead>
										<TableHead className="font-mono text-[11px] uppercase tracking-[0.08em]">
											{t("tools.unicodeInspector.headerCode")}
										</TableHead>
										<TableHead className="font-mono text-[11px] uppercase tracking-[0.08em]">
											{t("tools.unicodeInspector.headerDec")}
										</TableHead>
										<TableHead className="font-mono text-[11px] uppercase tracking-[0.08em]">
											{t("tools.unicodeInspector.headerUtf8")}
										</TableHead>
										<TableHead className="font-mono text-[11px] uppercase tracking-[0.08em]">
											{t("tools.unicodeInspector.headerJsEscape")}
										</TableHead>
										<TableHead className="font-mono text-[11px] uppercase tracking-[0.08em]">
											{t("tools.unicodeInspector.headerHtml")}
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{chars.map((c, i) => (
										<TableRow key={i}>
											<TableCell className="font-mono text-base">
												{isControlOrWhitespace(c.char) ? (
													<span className="text-muted-foreground">·</span>
												) : (
													c.char
												)}
											</TableCell>
											<TableCell className="font-mono text-xs">U+{c.code}</TableCell>
											<TableCell className="font-mono text-xs">{c.dec}</TableCell>
											<TableCell className="font-mono text-xs">{c.utf8Hex}</TableCell>
											<TableCell className="font-mono text-xs">{c.jsEscape}</TableCell>
											<TableCell className="font-mono text-xs">{c.htmlEntity}</TableCell>
										</TableRow>
								))}
								</TableBody>
							</Table>
						</div>
					</>
				)}

				<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
					{t("tools.unicodeInspector.transformLabel")}
				</p>
				<div className="flex gap-2">
					<Button variant="outline" onClick={handleEscapeAll}>
						{t("tools.unicodeInspector.escapeAll")}
					</Button>
					<Button variant="outline" onClick={handleUnescape}>
						{t("tools.unicodeInspector.unescape")}
					</Button>
				</div>

				{transformOutput && (
					<>
						<div className="flex items-center justify-between border border-ink bg-muted/40 px-3 py-2">
							<span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
								{t("tools.unicodeInspector.outputLabel")}
							</span>
							<Button variant="outline" size="sm" onClick={handleCopyOutput}>
								{t("common.copy")}
							</Button>
						</div>
						<pre className="border border-ink bg-muted/40 p-3 font-mono text-sm whitespace-pre-wrap break-all overflow-auto max-h-64">
							{transformOutput}
						</pre>
					</>
				)}
			</div>
		</ToolPageLayout>
	);
}
