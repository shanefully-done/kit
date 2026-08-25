"use client";

import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import ToolHeader from "@/components/ToolHeader";
import { BookOpen as BookOpenIcon } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { LIMITS, type LimitDef } from "@/lib/discord/limits";
import { toast } from "sonner";

const GROUP_ORDER = (() => {
	const order: string[] = [];
	for (const limit of LIMITS) {
		if (!order.includes(limit.group)) order.push(limit.group);
	}
	return order;
})();

export default function DiscordLimitsPage() {
	const { t } = useI18n();
	const [searchTerm, setSearchTerm] = useState("");

	const filtered = useMemo(() => {
		if (!searchTerm) return LIMITS;
		const q = searchTerm.toLowerCase();
		return LIMITS.filter(
			(l) =>
				l.name.toLowerCase().includes(q) || l.group.toLowerCase().includes(q),
		);
	}, [searchTerm]);

	const grouped = useMemo(() => {
		return GROUP_ORDER.map((group) => ({
			group,
			items: filtered.filter((l) => l.group === group),
		})).filter((section) => section.items.length > 0);
	}, [filtered]);

	const hasAny = filtered.length > 0;

	const copyValue = (limit: LimitDef) => {
		navigator.clipboard
			.writeText(limit.value)
			.then(() =>
				toast(t("common.copiedType", { what: `${limit.name} (${limit.value})` })),
			)
			.catch(() => toast(t("common.copyFailed")));
	};

	return (
		<ToolPageLayout
			header={
				<ToolHeader
					icon={<BookOpenIcon aria-hidden />}
					title={t("tools.discordLimits.title")}
				/>
			}
			footer={
				<div className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
					DATA FROM DISCORD DOCS · CLICK A VALUE TO COPY
				</div>
			}
		>
			<div className="space-y-0">
				<div className="pb-3">
					<Input
						type="text"
						placeholder={t("tools.discordLimits.filterPlaceholder")}
						aria-label={t("tools.discordLimits.filterAria")}
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="font-mono"
					/>
				</div>

				{hasAny ? (
					grouped.map((section) => (
						<div key={section.group}>
							<div className="border-y border-ink bg-muted px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em]">
								<span>{section.group.toUpperCase()}</span>{" "}
								<span className="text-muted-foreground">
									({section.items.length})
								</span>
							</div>
							<div className="border border-t-0 border-ink">
								{section.items.map((limit, i) => (
									<div
										key={limit.name}
										className={`flex items-baseline gap-3 px-3 py-2 text-sm ${i > 0 ? "border-t border-ink" : ""}`}
									>
										<span className="w-56 shrink-0 font-mono">
											{limit.name}
										</span>
										<button
											type="button"
											onClick={() => copyValue(limit)}
											className="cursor-pointer font-bold hover:text-hazard-text"
											title={t("common.copy")}
										>
											{limit.value}
										</button>
										{limit.note ? (
											<span className="min-w-0 flex-1 truncate text-right text-xs text-muted-foreground">
												{limit.note}
											</span>
										) : null}
									</div>
								))}
							</div>
						</div>
					))
				) : (
					<div className="border-y border-ink bg-muted/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
						[ NO MATCH ]
					</div>
				)}
			</div>
		</ToolPageLayout>
	);
}
