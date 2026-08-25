"use client";

import { useCallback, useEffect, useState } from "react";
import { usePersistentState } from "@/hooks/use-persistent-state";
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
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

export default function TimezoneConverterPage() {
	const { t } = useI18n();
	const [sourceTime, setSourceTime] = useState<Date | undefined>(new Date());
	const [sourceTimezone, setSourceTimezone] = usePersistentState(
		"timezone-converter:sourceTimezone",
		"UTC",
	);
	const [targetTimezone, setTargetTimezone] = usePersistentState(
		"timezone-converter:targetTimezone",
		"America/New_York",
	);
	const [convertedTime, setConvertedTime] = useState("");
	const [conversionError, setConversionError] = useState(false);
	const [timezones, setTimezones] = useState<string[]>([]);

	useEffect(() => {
		const allTimezones = Intl.supportedValuesOf("timeZone").sort();
		setTimezones(allTimezones);
	}, []);

	const convertTime = useCallback(() => {
		if (!sourceTime) {
			setConvertedTime("");
			setConversionError(false);
			return;
		}

		try {
			const zonedSourceTime = toZonedTime(sourceTime, sourceTimezone);
			const zonedTargetTime = fromZonedTime(zonedSourceTime, targetTimezone);
			setConvertedTime(format(zonedTargetTime, "yyyy-MM-dd HH:mm:ss zzz"));
			setConversionError(false);
		} catch (error) {
			console.error("Error converting timezone:", error);
			setConvertedTime("");
			setConversionError(true);
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
							: t("tools.timezoneConverter.selectTimezone")}
						<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-[300px] p-0">
					<Command>
						<CommandInput
							placeholder={t("tools.timezoneConverter.searchTimezonePlaceholder")}
							value={searchValue}
							onValueChange={setSearchValue}
						/>
						<CommandList>
							<CommandEmpty>{t("tools.timezoneConverter.noTimezoneFound")}</CommandEmpty>
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
					title={t("tools.timezoneConverter.title")}
				/>
			}
		>
			<div className="space-y-4">
				<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
					{t("tools.timezoneConverter.conversionLabel")}
				</p>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{/* Source Timezone */}
					<div className="border border-ink bg-muted/40 p-4 space-y-3">
						<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
							{t("tools.timezoneConverter.sourceLabel")}
						</p>
						<div className="grid w-full items-center gap-2">
							<label
								htmlFor="source-time"
								className="font-mono text-[11px] uppercase tracking-[0.08em]"
							>
								{t("tools.timezoneConverter.dateLabel")}
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
											{sourceTime ? format(sourceTime, "PPP") : <span>{t("tools.timezoneConverter.pickDate")}</span>}
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
								{t("tools.timezoneConverter.timezoneLabel")}
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
							{t("tools.timezoneConverter.targetLabel")}
						</p>
						<div className="grid w-full items-center gap-2">
							<label
								htmlFor="target-timezone"
								className="font-mono text-[11px] uppercase tracking-[0.08em]"
							>
								{t("tools.timezoneConverter.timezoneLabel")}
							</label>
							<TimezoneSelect
								selectedTimezone={targetTimezone}
								onSelectTimezone={setTargetTimezone}
							/>
						</div>
						<div>
							<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground mb-1">
								{t("tools.timezoneConverter.convertedTimeLabel")}
							</p>
							<div className="border border-ink bg-muted/40 px-3 py-3 flex items-center justify-between gap-2">
								<span
									className={cn(
										"font-mono text-lg md:text-xl break-all",
										conversionError && "text-hazard-text",
									)}
								>
									{conversionError
										? t("tools.timezoneConverter.invalidTimezone")
										: (convertedTime || "—")}
								</span>
								<Button
									variant="outline"
									size="icon"
									aria-label={t("tools.timezoneConverter.copyConvertedAria")}
							onClick={() =>
								navigator.clipboard.writeText(convertedTime).catch(() => {
									toast.error(t("common.copyFailed"));
								})
							}
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
