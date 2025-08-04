"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
				{/* InputArea */}
				<div className="grid gap-4">
					<div>
						<Label htmlFor="cron-input" className="text-sm">
							CRON Expression
						</Label>
						<Input
							id="cron-input"
							value={cronExpression}
							onChange={handleCronChange}
							placeholder="e.g., * * * * *"
						/>
					</div>

					{/* AdditionalSettings */}
					<div>
						<Label htmlFor="example-select" className="text-sm">
							Examples
						</Label>
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
				</div>

				{/* ActionButtons - none required */}
				<div className="flex flex-wrap gap-2" aria-hidden />

				{/* ResultDisplay */}
				<div className="space-y-2">
					{humanReadable && (
						<div>
							<span className="sr-only">Human-Readable Schedule</span>
							<p className="p-2 border rounded-md bg-gray-100 dark:bg-gray-800">
								{humanReadable}
							</p>
						</div>
					)}
					{error && (
						<div>
							<span className="sr-only">Error</span>
							<p className="p-2 border rounded-md bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300">
								{error}
							</p>
						</div>
					)}
				</div>
			</div>
		</ToolPageLayout>
	);
}
