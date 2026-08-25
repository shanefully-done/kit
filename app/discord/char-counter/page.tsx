"use client";

import React, { useMemo, useState } from "react";

import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gauge } from "lucide-react";
import { cn } from "@/lib/utils";
import ToolPageLayout from "@/components/ToolPageLayout";
import ToolHeader from "@/components/ToolHeader";
import { useI18n } from "@/lib/i18n";
import { TEXT_LIMITS, type LimitDef } from "@/lib/discord/limits";

type FilterTab = "all" | "messages" | "embeds" | "names";

const GROUP_ORDER: Record<string, number> = {
	messages: 0,
	embeds: 1,
	names: 2,
};

/** Range limits (note "min N") meter against max but display as "N–max". */
function displayLimit(def: LimitDef): string {
	const min = def.note?.match(/^min (\d+)/)?.[1];
	return min ? `${min}\u2013${def.value}` : def.value;
}

const CharCounterPage = () => {
	const { t } = useI18n();
	const [text, setText] = useState("");
	const [tab, setTab] = useState<FilterTab>("all");

	const codePoints = useMemo(() => [...text].length, [text]);
	const utf16Units = text.length;

	const rows = useMemo(() => {
		const active =
			tab === "all"
				? TEXT_LIMITS
				: TEXT_LIMITS.filter((def) =>
						tab === "names"
							? def.group === "names"
							: def.group === tab,
					);
		// Stable sort: keep canonical group order, over-budget rows first.
		return [...active].sort(
			(a, b) =>
				GROUP_ORDER[a.group] - GROUP_ORDER[b.group] ||
				Number(codePoints > (b.numeric ?? 0)) -
					Number(codePoints > (a.numeric ?? 0)),
		);
	}, [tab, codePoints]);

	return (
		<ToolPageLayout
			header={
				<ToolHeader
					icon={<Gauge aria-hidden className="h-5 w-5" />}
					title={t("tools.discordCharCounter.title")}
				/>
			}
		>
			<div className="space-y-4">
				<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
					{t("tools.discordCharCounter.inputLabel")}
				</p>
				<Textarea
					rows={8}
					className="font-mono"
					placeholder={t("tools.discordCharCounter.inputPlaceholder")}
					value={text}
					onChange={(e) => setText(e.target.value)}
				/>

				<div className="flex flex-wrap items-center gap-2">
					<span className="border border-ink bg-card px-2 py-1 font-mono text-[11px] tracking-[0.08em]">
						{t("tools.discordCharCounter.codePointsChip", {
							n: codePoints,
						})}
					</span>
					<span
						title={t("tools.discordCharCounter.unitsTitle")}
						className="border border-ink bg-card px-2 py-1 font-mono text-[11px] tracking-[0.08em]"
					>
						{t("tools.discordCharCounter.utf16Chip", { n: utf16Units })}
					</span>
				</div>

				<Tabs value={tab} onValueChange={(v) => setTab(v as FilterTab)}>
					<TabsList>
						<TabsTrigger value="all">
							{t("tools.discordCharCounter.tabAll")}
						</TabsTrigger>
						<TabsTrigger value="messages">
							{t("tools.discordCharCounter.tabMessages")}
						</TabsTrigger>
						<TabsTrigger value="embeds">
							{t("tools.discordCharCounter.tabEmbeds")}
						</TabsTrigger>
						<TabsTrigger value="names">
							{t("tools.discordCharCounter.tabNames")}
						</TabsTrigger>
					</TabsList>
				</Tabs>

				<div className="space-y-2" role="list">
					{rows.map((def) => {
						const limit = def.numeric ?? 0;
						const over = codePoints > limit;
						const pct = limit === 0 ? 0 : Math.min(100, (codePoints / limit) * 100);
						return (
							<div
								key={`${def.group}:${def.name}`}
								role="listitem"
								aria-label={t("tools.discordCharCounter.meterAria", {
									name: def.name,
									n: codePoints,
									limit: displayLimit(def),
								})}
								className="flex items-center gap-3"
							>
								<span
									className={cn(
										"w-52 shrink-0 truncate font-mono text-xs",
										over && "text-hazard-text",
									)}
								>
									{def.name}
								</span>
								<Progress
									value={pct}
									className={cn(
										"flex-1",
										!over &&
											"[&_[data-slot=progress-indicator]]:bg-ink",
									)}
								/>
								<span
									className={cn(
										"shrink-0 whitespace-nowrap text-right font-mono text-xs tabular-nums",
										over && "text-hazard-text",
									)}
								>
									{codePoints} / {displayLimit(def)}
								</span>
								<span className="flex w-16 shrink-0 justify-end">
									{!over && (
										<span className="border border-ink px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
											{t("tools.discordCharCounter.fitsChip")}
										</span>
									)}
								</span>
							</div>
						);
					})}
				</div>

				<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
					{t("tools.discordCharCounter.footnote")}
				</p>
			</div>

			<p className="mt-8 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
				METERED IN CODE POINTS · DISCORD COUNTS CODE UNITS
			</p>
		</ToolPageLayout>
	);
};

export default CharCounterPage;
