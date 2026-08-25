"use client";

import { useState, useEffect } from "react";

import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import cronstrue from "cronstrue";
import ToolPageLayout from "@/components/ToolPageLayout";
import ToolHeader from "@/components/ToolHeader";
import { CalendarClock as CalendarClockIcon } from "lucide-react";

export default function CronParserPage() {
	const [cronExpression, setCronExpression] = useState("");
	const [humanReadable, setHumanReadable] = useState("");
	const [error, setError] = useState("");

	const parseCron = (cron: string) => {
		if (!cron) {
			setHumanReadable("");
			setError("");
			return;
		}
		try {
			const description = cronstrue.toString(cron, {
				throwExceptionOnParseError: true,
			});
			setHumanReadable(description);
			setError("");
		} catch (err: unknown) {
			setHumanReadable("");
			setError((err as Error).message);
		}
	};

	useEffect(() => {
		parseCron(cronExpression);
	}, [cronExpression]);

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
					title="CRON Parser"
				/>
			}
		>
			<div className="space-y-4">
				<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
					[ INPUT ]
				</p>
				<div className="grid w-full items-center gap-2">
					<label
						htmlFor="cron-input"
						className="font-mono text-[11px] uppercase tracking-[0.08em]"
					>
						EXPRESSION
					</label>
					<Input
						id="cron-input"
						value={cronExpression}
						onChange={handleCronChange}
						placeholder="e.g., * * * * *"
					/>
				</div>

				<div className="grid w-full items-center gap-2">
					<label
						htmlFor="example-select"
						className="font-mono text-[11px] uppercase tracking-[0.08em]"
					>
						PRESETS
					</label>
					<Select onValueChange={handleExampleSelect}>
						<SelectTrigger id="example-select">
							<SelectValue placeholder="Select an example" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="* * * * *">Every minute</SelectItem>
							<SelectItem value="0 0 * * *">Every day at midnight</SelectItem>
							<SelectItem value="0 0 1 * *">
								First day of every month at midnight
							</SelectItem>
							<SelectItem value="0 0 * * 0">Every Sunday at midnight</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{humanReadable && (
					<>
						<div className="border-t border-ink pt-4" />
						<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
							[ HUMAN READABLE ]
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
							[ ERROR ]
						</p>
						<p className="font-mono text-sm text-hazard-text">{error}</p>
					</>
				)}
			</div>
		</ToolPageLayout>
	);
}
