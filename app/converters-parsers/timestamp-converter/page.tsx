"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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
		e: React.ChangeEvent<HTMLInputElement>
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
				{/* InputArea */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Left: Unix Timestamp -> Human */}
					<div className="grid w-full items-center gap-4">
						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="unix-timestamp" className="text-sm">
								Input Unix Timestamp
							</Label>
							<Input
								id="unix-timestamp"
								placeholder="e.g., 1678886400 or 1678886400000"
								value={unixTimestamp}
								onChange={handleUnixTimestampChange}
							/>
							{timestampError && (
								<p className="text-red-500 text-sm">{timestampError}</p>
							)}
						</div>
						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="human-readable-output" className="text-sm">
								Human-Readable Date/Time
							</Label>
							<div className="flex items-center gap-2">
								<Input
									id="human-readable-output"
									value={humanReadableDate}
									readOnly
									className="flex-1"
								/>
								<Button
									variant="ghost"
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

					{/* Right: Human -> Unix */}
					<div className="grid w-full items-center gap-4">
						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="human-readable-input" className="text-sm">
								Input Date/Time
							</Label>
							<Input
								id="human-readable-input"
								placeholder="e.g., 2023-03-15 00:00:00"
								value={humanReadableDate}
								onChange={handleHumanReadableDateChange}
							/>
							{dateError && <p className="text-red-500 text-sm">{dateError}</p>}
						</div>
						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="date-picker" className="text-sm">
								Select Date
							</Label>
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant={"outline"}
										className={cn(
											"w-full justify-start text-left font-normal",
											!selectedDate && "text-muted-foreground"
										)}
									>
										<CalendarIcon className="mr-2 h-4 w-4" />
										{selectedDate ? (
											format(selectedDate, "PPP")
										) : (
											<span>Pick a date</span>
										)}
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
						</div>
						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="unix-timestamp-output" className="text-sm">
								Unix Timestamp
							</Label>
							<div className="flex items-center gap-2">
								<Input
									id="unix-timestamp-output"
									value={unixTimestamp}
									readOnly
									className="flex-1"
								/>
								<Button
									variant="ghost"
									size="icon"
									onClick={() => copyToClipboard(unixTimestamp)}
									disabled={!unixTimestamp}
									aria-label="Copy unix timestamp"
								>
									<CopyIcon className="h-4 w-4" aria-hidden />
								</Button>
							</div>
						</div>
					</div>
				</div>

				{/* ActionButtons */}
				<div className="flex flex-wrap gap-2" aria-hidden />

				{/* AdditionalSettings */}
				<div aria-hidden />

				{/* ResultDisplay */}
				<div aria-hidden />
			</div>
		</ToolPageLayout>
	);
};

export default TimestampConverterPage;
