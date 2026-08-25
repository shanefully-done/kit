"use client";

import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { format, parseISO, fromUnixTime, getUnixTime, isValid } from "date-fns";
import {
	Calendar as CalendarIcon,
	Copy as CopyIcon,
	Clock as ClockIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import ToolPageLayout from "@/components/ToolPageLayout";
import ToolHeader from "@/components/ToolHeader";
import { useI18n } from "@/lib/i18n";

const TimestampConverterPage = () => {
	const { t } = useI18n();
	const [unixTimestamp, setUnixTimestamp] = useState("");
	const [humanReadableDate, setHumanReadableDate] = useState("");
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
	const [timestampError, setTimestampError] = useState("");
	const [dateError, setDateError] = useState("");

	const handleUnixTimestampChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setUnixTimestamp(value);
		setTimestampError("");

		if (value === "") {
			setHumanReadableDate("");
			setSelectedDate(undefined);
			return;
		}

		const numValue = Number(value);
		if (isNaN(numValue)) {
			setTimestampError(t("tools.timestampConverter.invalidTimestamp"));
			setHumanReadableDate("");
			setSelectedDate(undefined);
			return;
		}

		let date: Date;
		if (value.length === 13) {
			date = fromUnixTime(numValue / 1000);
		} else {
			date = fromUnixTime(numValue);
		}

		if (isValid(date)) {
			setHumanReadableDate(format(date, "yyyy-MM-dd HH:mm:ss"));
			setSelectedDate(date);
		} else {
			setTimestampError(t("tools.timestampConverter.invalidTimestamp"));
			setHumanReadableDate("");
			setSelectedDate(undefined);
		}
	};

	const handleHumanReadableDateChange = (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		const value = e.target.value;
		setHumanReadableDate(value);
		setDateError("");

		if (value === "") {
			setUnixTimestamp("");
			setSelectedDate(undefined);
			return;
		}

		const date = parseISO(value);
		if (isValid(date)) {
			setUnixTimestamp(getUnixTime(date).toString());
			setSelectedDate(date);
		} else {
			setDateError(t("tools.timestampConverter.invalidDateFormat"));
			setUnixTimestamp("");
			setSelectedDate(undefined);
		}
	};

	const handleDateSelect = (date: Date | undefined) => {
		setSelectedDate(date);
		setDateError("");
		if (date) {
			setHumanReadableDate(format(date, "yyyy-MM-dd HH:mm:ss"));
			setUnixTimestamp(getUnixTime(date).toString());
		} else {
			setHumanReadableDate("");
			setUnixTimestamp("");
		}
	};

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text).then(() => {
			toast.success(t("common.copied"));
		}).catch(() => {
			toast.error(t("common.copyFailed"));
		});
	};

	return (
		<ToolPageLayout
			header={
				<ToolHeader
					icon={<ClockIcon aria-hidden className="h-5 w-5" />}
					title={t("tools.timestampConverter.title")}
				/>
			}
		>
			<div className="space-y-4">
				<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
					{t("tools.timestampConverter.unixToHumanLabel")}
				</p>
				<div className="grid w-full items-center gap-2">
					<label
						htmlFor="unix-timestamp"
						className="font-mono text-[11px] uppercase tracking-[0.08em]"
					>
						{t("tools.timestampConverter.expressionLabel")}
					</label>
					<Input
						id="unix-timestamp"
						placeholder={t("tools.timestampConverter.unixPlaceholder")}
						value={unixTimestamp}
					onChange={handleUnixTimestampChange}
					/>
					{timestampError && (
						<p className="font-mono text-sm text-hazard-text">{timestampError}</p>
					)}
				</div>

				<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
					{t("tools.timestampConverter.humanToUnixLabel")}
				</p>
				<div className="grid w-full items-center gap-2">
					<label
						htmlFor="human-readable-input"
						className="font-mono text-[11px] uppercase tracking-[0.08em]"
					>
						{t("tools.timestampConverter.expressionLabel")}
					</label>
					<Input
						id="human-readable-input"
						placeholder={t("tools.timestampConverter.humanPlaceholder")}
						value={humanReadableDate}
						onChange={handleHumanReadableDateChange}
					/>
					{dateError && <p className="font-mono text-sm text-hazard-text">{dateError}</p>}
				</div>

				<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
					{t("tools.timestampConverter.datePickerLabel")}
				</p>
				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant={"outline"}
							className={cn(
								"w-full justify-start text-left font-normal",
								!selectedDate && "text-muted-foreground",
							)}
						>
							<CalendarIcon className="mr-2 h-4 w-4" />
							{selectedDate ? format(selectedDate, "PPP") : <span>{t("tools.timestampConverter.pickDate")}</span>}
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-auto p-0">
						<Calendar
							mode="single"
							selected={selectedDate}
							onSelect={handleDateSelect}
							initialFocus
						/>
					</PopoverContent>
				</Popover>

				<div className="border-t border-ink pt-4" />
				<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
					{t("tools.timestampConverter.readoutsLabel")}
				</p>
				<div className="space-y-3">
					<div>
						<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground mb-1">
							{t("tools.timestampConverter.unixTimestampLabel")}
						</p>
						<div className="border border-ink bg-muted/40 px-3 py-3 flex items-center justify-between gap-2">
							<span className="font-mono text-lg md:text-xl break-all">
								{unixTimestamp || "—"}
							</span>
							<Button
								variant="outline"
								size="icon"
								onClick={() => copyToClipboard(unixTimestamp)}
								disabled={!unixTimestamp}
								aria-label={t("tools.timestampConverter.copyUnixAria")}
							>
								<CopyIcon className="h-4 w-4" aria-hidden />
							</Button>
						</div>
					</div>
					<div>
						<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground mb-1">
							{t("tools.timestampConverter.iso8601Label")}
						</p>
						<div className="border border-ink bg-muted/40 px-3 py-3 flex items-center justify-between gap-2">
							<span className="font-mono text-lg md:text-xl break-all">
								{humanReadableDate || "—"}
							</span>
							<Button
								variant="outline"
								size="icon"
								onClick={() => copyToClipboard(humanReadableDate)}
								disabled={!humanReadableDate}
								aria-label={t("tools.timestampConverter.copyHumanAria")}
							>
								<CopyIcon className="h-4 w-4" aria-hidden />
							</Button>
						</div>
					</div>
				</div>
			</div>
		</ToolPageLayout>
	);
};

export default TimestampConverterPage;
