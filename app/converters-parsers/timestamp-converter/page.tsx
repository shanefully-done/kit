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

const TimestampConverterPage = () => {
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
			setTimestampError("Invalid timestamp");
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
			setTimestampError("Invalid timestamp");
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
			setDateError("Invalid date format (e.g., YYYY-MM-DD HH:mm:ss)");
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
		navigator.clipboard.writeText(text);
		toast.success("Copied to clipboard!");
	};

	return (
		<ToolPageLayout
			header={
				<ToolHeader
					icon={<ClockIcon aria-hidden className="h-5 w-5" />}
					title="Timestamp Converter"
				/>
			}
		>
			<div className="space-y-4">
				<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
					[ UNIX → HUMAN ]
				</p>
				<div className="grid w-full items-center gap-2">
					<label
						htmlFor="unix-timestamp"
						className="font-mono text-[11px] uppercase tracking-[0.08em]"
					>
						EXPRESSION
					</label>
					<Input
						id="unix-timestamp"
						placeholder="e.g., 1678886400 or 1678886400000"
						value={unixTimestamp}
						onChange={handleUnixTimestampChange}
					/>
					{timestampError && (
						<p className="font-mono text-sm text-hazard">{timestampError}</p>
					)}
				</div>

				<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
					[ HUMAN → UNIX ]
				</p>
				<div className="grid w-full items-center gap-2">
					<label
						htmlFor="human-readable-input"
						className="font-mono text-[11px] uppercase tracking-[0.08em]"
					>
						EXPRESSION
					</label>
					<Input
						id="human-readable-input"
						placeholder="e.g., 2023-03-15 00:00:00"
						value={humanReadableDate}
						onChange={handleHumanReadableDateChange}
					/>
					{dateError && <p className="font-mono text-sm text-hazard">{dateError}</p>}
				</div>

				<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
					[ DATE PICKER ]
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
							{selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
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
					[ READOUTS ]
				</p>
				<div className="space-y-3">
					<div>
						<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground mb-1">
							UNIX TIMESTAMP
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
								aria-label="Copy unix timestamp"
							>
								<CopyIcon className="h-4 w-4" aria-hidden />
							</Button>
						</div>
					</div>
					<div>
						<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground mb-1">
							ISO 8601
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
								aria-label="Copy human readable"
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
