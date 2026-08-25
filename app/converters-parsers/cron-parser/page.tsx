"use client";

import { useState, useEffect, useCallback } from "react";

import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import cronstrue from "cronstrue/i18n";
import ToolPageLayout from "@/components/ToolPageLayout";
import ToolHeader from "@/components/ToolHeader";
import { CalendarClock as CalendarClockIcon } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function CronParserPage() {
	const { t, locale } = useI18n();
	const [cronExpression, setCronExpression] = useState("");
	const [humanReadable, setHumanReadable] = useState("");
	const [error, setError] = useState("");

	const parseCron = useCallback(
		(cron: string) => {
			if (!cron) {
				setHumanReadable("");
				setError("");
				return;
			}
			try {
				const description = cronstrue.toString(cron, {
					throwExceptionOnParseError: true,
					locale: locale === "ko" ? "ko" : "en",
				});
				setHumanReadable(description);
				setError("");
			} catch (err: unknown) {
				setHumanReadable("");
				setError((err as Error).message);
			}
		},
		[locale],
	);

	useEffect(() => {
		parseCron(cronExpression);
	}, [cronExpression, parseCron]);

	const handleCronChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCronExpression(e.target.value);
	};

	const handleExampleSelect = (value: string) => {
		setCronExpression(value);
	};

	return (
		<ToolPageLayout
			header={
				<ToolHeader
					icon={<CalendarClockIcon aria-hidden className="h-5 w-5" />}
				title={t("tools.cronParser.title")}
				/>
			}
		>
			<div className="space-y-4">
				<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
				{t("tools.cronParser.inputLabel")}
				</p>
				<div className="grid w-full items-center gap-2">
					<label
						htmlFor="cron-input"
						className="font-mono text-[11px] uppercase tracking-[0.08em]"
					>
					{t("tools.cronParser.expressionLabel")}
					</label>
					<Input
						id="cron-input"
						value={cronExpression}
						onChange={handleCronChange}
					placeholder={t("tools.cronParser.examplePlaceholder")}
					/>
				</div>

				<div className="grid w-full items-center gap-2">
					<label
						htmlFor="example-select"
						className="font-mono text-[11px] uppercase tracking-[0.08em]"
					>
					{t("tools.cronParser.presetsLabel")}
					</label>
					<Select onValueChange={handleExampleSelect}>
						<SelectTrigger id="example-select">
						<SelectValue placeholder={t("tools.cronParser.selectExamplePlaceholder")} />
						</SelectTrigger>
						<SelectContent>
						<SelectItem value="* * * * *">
							{t("tools.cronParser.presetEveryMinute")}
						</SelectItem>
						<SelectItem value="0 0 * * *">
							{t("tools.cronParser.presetDailyMidnight")}
						</SelectItem>
						<SelectItem value="0 0 1 * *">
							{t("tools.cronParser.presetMonthlyFirstMidnight")}
						</SelectItem>
						<SelectItem value="0 0 * * 0">
							{t("tools.cronParser.presetSundayMidnight")}
						</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{humanReadable && (
					<>
						<div className="border-t border-ink pt-4" />
						<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
						{t("tools.cronParser.humanReadableLabel")}
						</p>
						<div className="border-2 border-ink px-4 py-4 font-mono text-base md:text-lg">
							{humanReadable}
						</div>
					</>
				)}

				{error && (
					<>
						<div className="border-t border-ink pt-4" />
						<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
						{t("tools.cronParser.errorLabel")}
						</p>
						<p className="font-mono text-sm text-hazard-text">{error}</p>
					</>
				)}
			</div>
		</ToolPageLayout>
	);
}
