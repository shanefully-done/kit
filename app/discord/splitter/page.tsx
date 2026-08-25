"use client";

import React, { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Copy as CopyIcon, Scissors as ScissorsIcon } from "lucide-react";
import { toast } from "sonner";
import ToolPageLayout from "@/components/ToolPageLayout";
import ToolHeader from "@/components/ToolHeader";
import { useI18n } from "@/lib/i18n";
import { splitMessage } from "@/lib/discord/text";

const PREVIEW_LINES = 10;
const CUSTOM_MIN = 100;
const CUSTOM_MAX = 3800;

type LimitMode = "2000" | "4000" | "custom";

/** Mirrors lib/discord/text.ts numPad: digits of n twice + ": " separator. */
function prefixPad(total: number): number {
	return String(total).length * 2 + 2;
}

function clampCustomLimit(raw: string): number {
	const parsed = Number(raw);
	if (raw.trim() === "" || Number.isNaN(parsed)) return 2000;
	return Math.min(CUSTOM_MAX, Math.max(CUSTOM_MIN, Math.trunc(parsed)));
}

const SplitterPage = () => {
	const { t } = useI18n();
	const [text, setText] = useState("");
	const [limitMode, setLimitMode] = useState<LimitMode>("2000");
	const [customLimit, setCustomLimit] = useState("");
	const [numberParts, setNumberParts] = useState(false);
	const [expanded, setExpanded] = useState<Record<number, boolean>>({});

	const limit =
		limitMode === "2000"
			? 2000
			: limitMode === "4000"
				? 4000
				: clampCustomLimit(customLimit);

	const resetExpanded = () => setExpanded({});

	const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setText(e.target.value);
		resetExpanded();
	};

	const handleLimitModeChange = (mode: LimitMode) => {
		setLimitMode(mode);
		resetExpanded();
	};

	const handleCustomLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCustomLimit(e.target.value);
		resetExpanded();
	};

	const handleNumberPartsChange = (checked: boolean) => {
		setNumberParts(checked);
		resetExpanded();
	};

	const rawParts = useMemo(
		() => splitMessage(text, { limit, numberParts }),
		[text, limit, numberParts],
	);

	// The lib budgets for "{i}/{total} " prefixes; applying them is the
	// caller's job. Only multi-part outputs carry a meaningful position.
	const parts = useMemo(() => {
		if (!text) return [];
		const total = rawParts.length;
		if (!(numberParts && total > 1)) return rawParts;
		return rawParts.map((part, i) => `${i + 1}/${total} ${part}`);
	}, [text, rawParts, numberParts]);

	// Effective budget after prefix accounting — matches the lib's fixpoint.
	const effectiveBudget = useMemo(() => {
		if (!(numberParts && parts.length > 1)) return limit;
		return limit - prefixPad(parts.length);
	}, [limit, numberParts, parts.length]);

	const longLineSplit = useMemo(
		() => text.split("\n").some((line) => line.length > effectiveBudget),
		[text, effectiveBudget],
	);

	const longest = parts.reduce((max, part) => Math.max(max, part.length), 0);

	const copyPart = (part: string, n: number) => {
		navigator.clipboard
			.writeText(part)
			.then(() =>
				toast(
					t("common.copiedType", {
						what: t("tools.discordSplitter.partName", { n }),
					}),
				),
			)
			.catch(() => toast(t("common.copyFailed")));
	};

	const toggleExpanded = (i: number) => {
		setExpanded((prev) => ({ ...prev, [i]: !prev[i] }));
	};

	return (
		<ToolPageLayout
			header={
				<ToolHeader
					icon={<ScissorsIcon aria-hidden className="h-5 w-5" />}
					title={t("tools.discordSplitter.title")}
				/>
			}
		>
			<div className="space-y-4">
				<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
					{t("tools.discordSplitter.inputLabel")}
				</p>
				<Textarea
					value={text}
					onChange={handleTextChange}
					placeholder={t("tools.discordSplitter.inputPlaceholder")}
					className="font-mono"
					rows={12}
				/>

				<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
					{t("tools.discordSplitter.optionsLabel")}
				</p>
				<div className="flex flex-wrap items-center gap-3">
					<label
						htmlFor="splitter-limit-mode"
						className="font-mono text-[11px] uppercase tracking-[0.08em]"
					>
						{t("tools.discordSplitter.limitLabel")}
					</label>
					<Select
						value={limitMode}
						onValueChange={(v) => handleLimitModeChange(v as LimitMode)}
					>
						<SelectTrigger
							id="splitter-limit-mode"
							className="w-32 font-mono text-xs uppercase"
						>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="2000">
								{t("tools.discordSplitter.limit2000")}
							</SelectItem>
							<SelectItem value="4000">
								{t("tools.discordSplitter.limit4000")}
							</SelectItem>
							<SelectItem value="custom">
								{t("tools.discordSplitter.limitCustom")}
							</SelectItem>
						</SelectContent>
					</Select>
					{limitMode === "custom" && (
						<Input
							type="number"
							min={CUSTOM_MIN}
							max={CUSTOM_MAX}
							value={customLimit}
							onChange={handleCustomLimitChange}
							placeholder={t("tools.discordSplitter.customLimitPlaceholder")}
							aria-label={t("tools.discordSplitter.customLimitPlaceholder")}
							className="w-32 font-mono"
						/>
					)}
					<Switch
						id="splitter-number-parts"
						checked={numberParts}
						onCheckedChange={handleNumberPartsChange}
						aria-label={t("tools.discordSplitter.numberPartsAria")}
					/>
					<label
						htmlFor="splitter-number-parts"
						className="font-mono text-[11px] uppercase tracking-[0.08em]"
					>
						{t("tools.discordSplitter.numberPartsLabel")}
					</label>
				</div>

				{text ? (
					<p className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.08em]">
						<span className={cn(longest > limit && "text-hazard-text")}>
							{t("tools.discordSplitter.statsLine", {
								n: parts.length,
								x: longest,
								limit,
							})}
						</span>
						{longLineSplit && (
							<Badge variant="destructive">
								{t("tools.discordSplitter.longLineChip")}
							</Badge>
						)}
					</p>
				) : null}

				<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
					{t("tools.discordSplitter.outputLabel")}
				</p>

				{parts.length === 0 ? (
					<p className="font-mono text-sm text-muted-foreground">
						{t("tools.discordSplitter.emptyHint")}
					</p>
				) : (
					<div className="space-y-3">
						{parts.map((part, i) => {
							const n = i + 1;
							const overBudget = part.length > limit;
							const isExpanded = !!expanded[i];
							const lines = part.split("\n");
							const preview = isExpanded
								? part
								: lines.slice(0, PREVIEW_LINES).join("\n") +
									(lines.length > PREVIEW_LINES ? "\n…" : "");
							return (
								<Card key={n}>
									<CardHeader className="flex-row items-center justify-between gap-2 border-b border-ink py-3">
										<span
											className={cn(
												"font-mono text-[11px] uppercase tracking-[0.08em]",
												overBudget && "text-hazard-text",
											)}
										>
											{t("tools.discordSplitter.partHeader", {
												n,
												total: parts.length,
												len: part.length,
												limit,
											})}
										</span>
										<Button
											variant="outline"
											size="sm"
											onClick={() => toggleExpanded(i)}
											disabled={lines.length <= PREVIEW_LINES}
										>
											{isExpanded
												? t("tools.discordSplitter.collapseButton")
												: t("tools.discordSplitter.expandButton")}
										</Button>
									</CardHeader>
									<CardContent className="py-4">
										<pre className="whitespace-pre-wrap break-all font-mono text-xs">
											{preview}
										</pre>
									</CardContent>
									<CardFooter className="border-t border-ink py-3">
										<Button
											variant="outline"
											size="sm"
											onClick={() => copyPart(part, n)}
											aria-label={t("tools.discordSplitter.copyAria", { n })}
										>
											<CopyIcon aria-hidden className="h-4 w-4" />
											{t("tools.discordSplitter.copyButton")}
										</Button>
									</CardFooter>
								</Card>
							);
						})}
					</div>
				)}

				<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
					CUT ON FENCES · PASTE EACH PART SEPARATELY
				</p>
			</div>
		</ToolPageLayout>
	);
};

export default SplitterPage;
