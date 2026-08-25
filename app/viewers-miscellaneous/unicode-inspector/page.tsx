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
	const cp = ch.codePointAt(0)!;
	if (cp <= 0x20 && cp !== 0x20) return true; // space is not control
	if (cp === 0x7f) return true;
	if (cp >= 0x80 && cp <= 0x9f) return true;
	return false;
}

function analyzeChars(text: string): CharInfo[] {
	const result: CharInfo[] = [];
	for (const ch of text) {
		const cp = ch.codePointAt(0)!;
		const utf8Bytes = getUtf8Bytes(cp);
		result.push({
			char: ch,
			code: cp.toString(16).toUpperCase().padStart(4, "0"),
			dec: cp,
			utf8Hex: utf8Bytes
				.map((b) => b.toString(16).toUpperCase().padStart(2, "0"))
				.join(" "),
			jsEscape:
				cp <= 0xffff
					? `\\u${cp.toString(16).toUpperCase().padStart(4, "0")}`
					: `\\u{${cp.toString(16).toUpperCase()}}`,
			htmlEntity: `&#${cp};`,
		});
	}
	return result;
}

function escapeAll(text: string): string {
	let result = "";
	for (const ch of text) {
		const cp = ch.codePointAt(0)!;
		if (cp <= 0xffff) {
			result += `\\u${cp.toString(16).toUpperCase().padStart(4, "0")}`;
		} else {
			result += `\\u{${cp.toString(16).toUpperCase()}}`;
		}
	}
	return result;
}

function unescape(text: string): string {
	let result = "";
	let i = 0;
	while (i < text.length) {
		if (text[i] === "\\" && text[i + 1] === "u") {
			if (text[i + 2] === "{") {
				const close = text.indexOf("}", i + 3);
				if (close !== -1) {
					const hex = text.slice(i + 3, close);
					const cp = parseInt(hex, 16);
					if (!isNaN(cp)) {
						result += String.fromCodePoint(cp);
						i = close + 1;
						continue;
					}
				}
			} else {
				const hex = text.slice(i + 2, i + 6);
				if (hex.length === 4) {
					const cp = parseInt(hex, 16);
					if (!isNaN(cp)) {
						result += String.fromCodePoint(cp);
						i += 6;
						continue;
					}
				}
			}
		}
		result += text[i];
		i++;
	}
	return result;
}

export default function UnicodeInspectorPage() {
	const [text, setText] = useState("KIT \u00ae 2.6 \ud55c");
	const [transformOutput, setTransformOutput] = useState("");

	const chars = useMemo(() => analyzeChars(text), [text]);

	const handleEscapeAll = useCallback(() => {
		const result = escapeAll(text);
		setTransformOutput(result);
		navigator.clipboard.writeText(result);
		toast.success("COPIED");
	}, [text]);

	const handleUnescape = useCallback(() => {
		const result = unescape(text);
		setTransformOutput(result);
		navigator.clipboard.writeText(result);
		toast.success("COPIED");
	}, [text]);

	const handleCopyOutput = useCallback(() => {
		navigator.clipboard.writeText(transformOutput);
		toast.success("COPIED");
	}, [transformOutput]);

	return (
		<ToolPageLayout
			header={
				<ToolHeader icon={<Languages aria-hidden />} title="Unicode Inspector" />
			}
		>
			<div className="space-y-4">
				<div className="space-y-2">
					<Label className="font-mono text-[11px] uppercase tracking-[0.08em]">
						Input
					</Label>
					<Textarea
						value={text}
						onChange={(e) => setText(e.target.value)}
						className="font-mono"
					/>
				</div>

				{chars.length === 0 ? (
					<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
						[ AWAITING INPUT ]
					</p>
				) : (
					<>
						<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
							[ Character Breakdown ]
						</p>
						<div className="border border-ink overflow-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="font-mono text-[11px] uppercase tracking-[0.08em]">
											Char
										</TableHead>
										<TableHead className="font-mono text-[11px] uppercase tracking-[0.08em]">
											U+Code
										</TableHead>
										<TableHead className="font-mono text-[11px] uppercase tracking-[0.08em]">
											Dec
										</TableHead>
										<TableHead className="font-mono text-[11px] uppercase tracking-[0.08em]">
											UTF-8 Bytes
										</TableHead>
										<TableHead className="font-mono text-[11px] uppercase tracking-[0.08em]">
											JS Escape
										</TableHead>
										<TableHead className="font-mono text-[11px] uppercase tracking-[0.08em]">
											HTML
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
					[ Transform ]
				</p>
				<div className="flex gap-2">
					<Button variant="outline" onClick={handleEscapeAll}>
						Escape All
					</Button>
					<Button variant="outline" onClick={handleUnescape}>
						Unescape
					</Button>
				</div>

				{transformOutput && (
					<>
						<div className="flex items-center justify-between border border-ink bg-muted/40 px-3 py-2">
							<span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
								Output
							</span>
							<Button variant="outline" size="sm" onClick={handleCopyOutput}>
								Copy
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
