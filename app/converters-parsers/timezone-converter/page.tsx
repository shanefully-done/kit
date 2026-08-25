"use client";

import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import {
	Calendar as CalendarIcon,
	Check,
	ChevronsUpDown,
	Globe2 as GlobeIcon,
	Copy as CopyIcon,
} from "lucide-react";
import { toZonedTime, fromZonedTime } from "date-fns-tz";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import ToolPageLayout from "@/components/ToolPageLayout";
import ToolHeader from "@/components/ToolHeader";

export default function TimezoneConverterPage() {
	const [sourceTime, setSourceTime] = useState<Date | undefined>(new Date());
	const [sourceTimezone, setSourceTimezone] = useState("UTC");
	const [targetTimezone, setTargetTimezone] = useState("America/New_York");
	const [convertedTime, setConvertedTime] = useState("");
	const [timezones, setTimezones] = useState<string[]>([]);

	useEffect(() => {
		const allTimezones = Intl.supportedValuesOf("timeZone").sort();
		setTimezones(allTimezones);
	}, []);

	const convertTime = useCallback(() => {
		if (!sourceTime) {
			setConvertedTime("");
			return;
		}

		try {
			const zonedSourceTime = toZonedTime(sourceTime, sourceTimezone);
			const zonedTargetTime = fromZonedTime(zonedSourceTime, targetTimezone);
			setConvertedTime(format(zonedTargetTime, "yyyy-MM-dd HH:mm:ss zzz"));
		} catch (error) {
			console.error("Error converting timezone:", error);
			setConvertedTime("Invalid Timezone or Date");
		}
	}, [sourceTime, sourceTimezone, targetTimezone]);

	useEffect(() => {
		convertTime();
	}, [sourceTime, sourceTimezone, targetTimezone, convertTime]);

	const TimezoneSelect = ({
		selectedTimezone,
		onSelectTimezone,
	}: {
		selectedTimezone: string;
		onSelectTimezone: (timezone: string) => void;
	}) => {
		const [open, setOpen] = useState(false);
		const [searchValue, setSearchValue] = useState("");

		const filteredTimezones = timezones.filter((tz) =>
			tz.toLowerCase().includes(searchValue.toLowerCase()),
		);

		return (
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						role="combobox"
						aria-expanded={open}
						className="w-[280px] justify-between"
					>
						{selectedTimezone
							? timezones.find((timezone) => timezone === selectedTimezone)
							: "Select timezone..."}
						<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-[300px] p-0">
					<Command>
						<CommandInput
							placeholder="Search timezone..."
							value={searchValue}
							onValueChange={setSearchValue}
						/>
						<CommandList>
							<CommandEmpty>No timezone found.</CommandEmpty>
							<CommandGroup>
								{filteredTimezones.map((timezone) => (
									<CommandItem
										key={timezone}
										value={timezone}
										onSelect={(currentValue) => {
											onSelectTimezone(currentValue);
											setOpen(false);
										}}
									>
										<Check
											className={cn(
												"mr-2 h-4 w-4",
												selectedTimezone === timezone ? "opacity-100" : "opacity-0",
											)}
										/>
										{timezone}
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		);
	};

	return (
		<ToolPageLayout
			header={
				<ToolHeader
					icon={<GlobeIcon aria-hidden className="h-5 w-5" />}
					title="Timezone Converter"
				/>
			}
		>
			<div className="space-y-4">
				<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
					[ CONVERSION ]
				</p>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{/* Source Timezone */}
					<div className="border border-ink bg-muted/40 p-4 space-y-3">
						<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
							[ SOURCE ]
						</p>
						<div className="grid w-full items-center gap-2">
							<label
								htmlFor="source-time"
								className="font-mono text-[11px] uppercase tracking-[0.08em]"
							>
								DATE
							</label>
							<div className="flex items-center gap-2">
								<Popover>
									<PopoverTrigger asChild>
										<Button
											variant={"outline"}
											className={cn(
												"w-full justify-start text-left font-normal",
												!sourceTime && "text-muted-foreground",
											)}
										>
											<CalendarIcon className="mr-2 h-4 w-4" />
											{sourceTime ? format(sourceTime, "PPP") : <span>Pick a date</span>}
										</Button>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0">
										<Calendar
											mode="single"
											selected={sourceTime}
											onSelect={setSourceTime}
											initialFocus
										/>
									</PopoverContent>
								</Popover>
								<input
									type="time"
									value={sourceTime ? format(sourceTime, "HH:mm") : ""}
									onChange={(e) => {
										const [hours, minutes] = e.target.value.split(":").map(Number);
										if (sourceTime) {
											const newTime = new Date(sourceTime);
											newTime.setHours(hours, minutes);
											setSourceTime(newTime);
										}
									}}
									className="p-2 border border-ink bg-card"
								/>
							</div>
						</div>
						<div className="grid w-full items-center gap-2">
							<label
								htmlFor="source-timezone"
								className="font-mono text-[11px] uppercase tracking-[0.08em]"
							>
								TIMEZONE
							</label>
							<TimezoneSelect
								selectedTimezone={sourceTimezone}
								onSelectTimezone={setSourceTimezone}
							/>
						</div>
					</div>

					{/* Target Timezone */}
					<div className="border border-ink bg-muted/40 p-4 space-y-3">
						<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
							[ TARGET ]
						</p>
						<div className="grid w-full items-center gap-2">
							<label
								htmlFor="target-timezone"
								className="font-mono text-[11px] uppercase tracking-[0.08em]"
							>
								TIMEZONE
							</label>
							<TimezoneSelect
								selectedTimezone={targetTimezone}
								onSelectTimezone={setTargetTimezone}
							/>
						</div>
						<div>
							<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground mb-1">
								CONVERTED TIME
							</p>
							<div className="border border-ink bg-muted/40 px-3 py-3 flex items-center justify-between gap-2">
								<span
									className={cn(
										"font-mono text-lg md:text-xl break-all",
										convertedTime === "Invalid Timezone or Date" && "text-hazard-text",
									)}
								>
									{convertedTime || "—"}
								</span>
								<Button
									variant="outline"
									size="icon"
									aria-label="Copy converted time"
									onClick={() => navigator.clipboard.writeText(convertedTime)}
									disabled={!convertedTime}
								>
									<CopyIcon className="h-4 w-4" aria-hidden />
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</ToolPageLayout>
	);
}
