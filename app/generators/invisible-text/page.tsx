"use client";

import React, { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/ui/tabs";
import { Ghost, Copy as CopyIcon, Eraser } from "lucide-react";
import { toast } from "sonner";
import ToolPageLayout from "@/components/ToolPageLayout";
import ToolHeader from "@/components/ToolHeader";
import { useI18n } from "@/lib/i18n";
import { INVISIBLE_CHARS } from "@/lib/discord/text";

const INVISIBLE_SET: Record<string, true> = Object.fromEntries(
	INVISIBLE_CHARS.map((entry) => [entry.char, true as const]),
);

const escapeChar = (char: string): string => {
	const cp = char.codePointAt(0);
	if (cp === undefined) return char;
	return "U+" + cp.toString(16).toUpperCase().padStart(4, "0");
};

type FoundEntry = { char: string; name: string; count: number };

/** Unique invisible chars present in input, ordered by first occurrence, with counts. */
function scanInvisible(input: string): FoundEntry[] {
	const order: string[] = [];
	const counts = new Map<string, number>();
	for (const ch of input) {
		if (!INVISIBLE_SET[ch]) continue;
		const prev = counts.get(ch);
		if (prev === undefined) {
			counts.set(ch, 1);
			order.push(ch);
		} else {
			counts.set(ch, prev + 1);
		}
	}
	return order.map((char) => ({
		char,
		name: INVISIBLE_CHARS.find((e) => e.char === char)?.name ?? "",
		count: counts.get(char) ?? 0,
	}));
}

/** Removes exactly the INVISIBLE_CHARS set, nothing else. */
function stripInvisible(input: string): string {
	return [...input].filter((ch) => !INVISIBLE_SET[ch]).join("");
}

const InvisibleTextPage = () => {
	const { t } = useI18n();
	const [inspectInput, setInspectInput] = useState("");
	const [cleanedOutput, setCleanedOutput] = useState("");

	const found = useMemo(() => scanInvisible(inspectInput), [inspectInput]);

	const copyToClipboard = (text: string, what: string) => {
		navigator.clipboard.writeText(text).then(() => {
			toast.success(t("common.copiedType", { what }));
		}).catch(() => {
			toast.error(t("common.copyFailed"));
		});
	};
	const handleStrip = () => {
		setCleanedOutput(stripInvisible(inspectInput));
	};

	const handleCopyCleaned = () => {
		copyToClipboard(cleanedOutput, t("tools.invisibleText.cleanedText"));
	};

	return (
		<ToolPageLayout
			header={
				<ToolHeader
					icon={<Ghost aria-hidden className="h-5 w-5" />}
					title={t("tools.invisibleText.title")}
				/>
			}
		>
			<div className="space-y-4">
				<Tabs defaultValue="copy" className="w-full">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="copy">
							{t("tools.invisibleText.copyTab")}
						</TabsTrigger>
						<TabsTrigger value="inspect">
							{t("tools.invisibleText.inspectTab")}
						</TabsTrigger>
					</TabsList>

					<TabsContent value="copy" className="p-0 space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
							{INVISIBLE_CHARS.map((entry) => (
								<Card key={escapeChar(entry.char)} className="border border-border">
									<CardContent className="p-3 space-y-2">
										<p className="font-mono text-sm">{escapeChar(entry.char)}</p>
										<p className="text-sm">{entry.name}</p>
										<p className="text-xs text-muted-foreground">{entry.note}</p>
										<div className="flex gap-2 pt-1">
											<Button
												size="sm"
												variant="outline"
												className="flex-1 gap-1"
												aria-label={t("tools.invisibleText.copyCharAria", {
													name: entry.name,
												})}
												onClick={() => copyToClipboard(entry.char, entry.name)}
											>
												<CopyIcon aria-hidden className="h-3.5 w-3.5" />
												COPY ×1
											</Button>
											<Button
												size="sm"
												variant="outline"
												className="flex-1 gap-1"
												aria-label={t("tools.invisibleText.copyChar5Aria", {
													name: entry.name,
												})}
												onClick={() =>
													copyToClipboard(entry.char.repeat(5), `${entry.name} ×5`)
												}
											>
												<CopyIcon aria-hidden className="h-3.5 w-3.5" />
												COPY ×5
											</Button>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</TabsContent>

					<TabsContent value="inspect" className="p-0 space-y-4">
						<Textarea
							value={inspectInput}
							placeholder={t("tools.invisibleText.inspectPlaceholder")}
							className="min-h-[140px] font-mono text-sm"
							onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
								setInspectInput(e.target.value);
								setCleanedOutput("");
							}}
						/>

						{found.length > 0 ? (
							<div className="space-y-3">
								<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
									{t("tools.invisibleText.foundLabel")}
								</p>
								<ul className="divide-y divide-border border border-border">
									{found.map((entry) => (
										<li
											key={entry.char}
											className="flex items-center justify-between gap-3 px-3 py-2"
										>
											<span className="font-mono text-sm shrink-0">
												{escapeChar(entry.char)}
											</span>
											<span className="text-sm flex-1 truncate">{entry.name}</span>
											<span className="text-sm text-muted-foreground shrink-0">
												×{entry.count}
											</span>
										</li>
									))}
								</ul>

								<Button size="sm" className="gap-1" onClick={handleStrip}>
									<Eraser aria-hidden className="h-3.5 w-3.5" />
									{t("tools.invisibleText.stripButton")}
								</Button>

								<div className="space-y-2">
									<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
										{t("tools.invisibleText.cleanedLabel")}
									</p>
									<div className="font-mono text-sm bg-paper border border-border p-3 break-all whitespace-pre-wrap">
										{cleanedOutput}
									</div>
									<Button
										size="sm"
										variant="outline"
										className="gap-1"
										aria-label={t("tools.invisibleText.copyCleanedAria")}
										onClick={handleCopyCleaned}
									>
										<CopyIcon aria-hidden className="h-3.5 w-3.5" />
										{t("common.copy")}
									</Button>
								</div>
							</div>
						) : (
							<p className="text-center text-muted-foreground text-sm py-6">
								{t("tools.invisibleText.noneFound")}
							</p>
						)}
					</TabsContent>
				</Tabs>

				<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground text-center">
					{t("tools.invisibleText.footerWarning")}
				</p>
			</div>
		</ToolPageLayout>
	);
};

export default InvisibleTextPage;
