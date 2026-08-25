"use client";

import React, { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Clock as ClockIcon, Copy as CopyIcon } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import ToolPageLayout from "@/components/ToolPageLayout";
import ToolHeader from "@/components/ToolHeader";
import { useI18n } from "@/lib/i18n";
import {
	TIMESTAMP_STYLES,
	formatStyle,
	parseNatural,
	toDiscordTag,
	type TimestampStyle,
} from "@/lib/discord/timestamps";
const HOUR_MS = 3_600_000;
const DAY_MS = 86_400_000;
/** datetime-local value: local wall time at minute precision. */
const LOCAL_INPUT_FORMAT = "yyyy-MM-dd'T'HH:mm";

/** UTC first, then the IANA list sorted — deterministic on server and client. */
const TIME_ZONES: string[] = (() => {
	try {
		return [
			"UTC",
			...Intl.supportedValuesOf("timeZone").filter((tz) => tz !== "UTC").sort(),
		];
	} catch {
		return ["UTC"];
	}
})();

/** Signed compact offset: "+2h 15m" / "−3d 4h" / "NOW". */
function formatOffset(ms: number): string {
	if (ms === 0) return "NOW";
	const sign = ms > 0 ? "+" : "−";
	let rest = Math.floor(Math.abs(ms) / 1000);
	const days = Math.floor(rest / 86400);
	rest -= days * 86400;
	const hours = Math.floor(rest / 3600);
	rest -= hours * 3600;
	const minutes = Math.floor(rest / 60);
	const seconds = rest - minutes * 60;
	let label: string;
	if (days > 0) label = `${days}d ${hours}h`;
	else if (hours > 0) label = `${hours}h ${minutes}m`;
	else if (minutes > 0) label = `${minutes}m ${seconds}s`;
	else label = `${seconds}s`;
	return `${sign}${label}`;
}

/**
 * Absolute-style options mirror lib STYLE_OPTIONS; formatStyle has no
 * timeZone parameter, so timezone-aware previews are rendered here.
 * Relative ("R") is timezone-independent and delegates to formatStyle.
 */
const PREVIEW_OPTIONS: Record<Exclude<TimestampStyle, "R">, Intl.DateTimeFormatOptions> = {
	t: { hour: "numeric", minute: "2-digit" },
	T: { hour: "numeric", minute: "2-digit", second: "2-digit" },
	d: { day: "numeric", month: "numeric", year: "numeric" },
	D: { day: "numeric", month: "long", year: "numeric" },
	f: {
		day: "numeric",
		month: "numeric",
		year: "numeric",
		hour: "numeric",
		minute: "2-digit",
	},
	F: {
		weekday: "long",
		day: "numeric",
		month: "long",
		year: "numeric",
		hour: "numeric",
		minute: "2-digit",
	},
};

function renderPreview(
	date: Date,
	style: TimestampStyle,
	locale: string,
	timeZone: string,
): string {
	if (style === "R") return formatStyle(date, style, locale);
	return new Intl.DateTimeFormat(locale, {
		...PREVIEW_OPTIONS[style],
		timeZone,
	}).format(date);
}

function nextNineAmLocal(): Date {
	const now = new Date();
	const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, 0, 0);
	if (target.getTime() <= now.getTime()) target.setDate(target.getDate() + 1);
	return target;
}

const DiscordTimestampPage = () => {
	const { t, locale } = useI18n();

	const [date, setDate] = useState<Date | null>(null);
	const [dtLocal, setDtLocal] = useState("");
	const [unixInput, setUnixInput] = useState("");
	const [naturalInput, setNaturalInput] = useState("");
	const [naturalError, setNaturalError] = useState(false);
	const [unixError, setUnixError] = useState(false);
	const [timezone, setTimezone] = useState("UTC");
	const [, setTick] = useState(0);

	// Mount: seed with current time and the user's local zone (client only —
	// keeps SSR markup stable so there is no hydration mismatch).
	useEffect(() => {
		const now = new Date();
		setDate(now);
		setDtLocal(format(now, LOCAL_INPUT_FORMAT));
		setUnixInput(String(Math.floor(now.getTime() / 1000)));
		try {
			const local = Intl.DateTimeFormat().resolvedOptions().timeZone;
			if (local) setTimezone(local);
		} catch {
			// keep UTC
		}
	}, []);

	// Relative preview ticks once per second.
	useEffect(() => {
		const id = window.setInterval(() => setTick((n) => n + 1), 1000);
		return () => window.clearInterval(id);
	}, []);

	const applyDate = useCallback((next: Date) => {
		setDate(next);
		setDtLocal(format(next, LOCAL_INPUT_FORMAT));
		setUnixInput(String(Math.floor(next.getTime() / 1000)));
		setUnixError(false);
	}, []);

	const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setDtLocal(value);
		setNaturalError(false);
		if (!value) return;
		const parsed = new Date(value);
		if (Number.isNaN(parsed.getTime())) {
			// datetime-local emits valid values; defensive only.
			setDate(null);
			setUnixInput("");
			return;
		}
		applyDate(parsed);
	};

	const handleUnixChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const raw = e.target.value;
		setUnixInput(raw);
		setNaturalError(false);
		const trimmed = raw.trim();
		if (!trimmed) {
			setUnixError(false);
			return;
		}
		const n = Number(trimmed);
		const parsedDate = new Date(n * 1000);
		if (!Number.isFinite(n) || !Number.isInteger(n) || n < 0 || Number.isNaN(parsedDate.getTime())) {
			setUnixError(true);
			setDate(null);
			setDtLocal("");
			return;
		}
		applyDate(parsedDate);
	};

	const handleNaturalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNaturalInput(e.target.value);
		setNaturalError(false);
	};

	// Natural language commits on Enter or blur.
	const commitNatural = useCallback(() => {
		const text = naturalInput.trim();
		if (!text) return;
		const parsed = parseNatural(text);
		if (!parsed) {
			setNaturalError(true);
			return;
		}
		setNaturalError(false);
		applyDate(parsed);
	}, [naturalInput, applyDate]);

	const copySyntax = async (syntax: string) => {
		try {
			await navigator.clipboard.writeText(syntax);
			toast(t("common.copiedType", { what: t("tools.discordTimestamp.copiedTag") }));
		} catch {
			toast(t("common.copyFailed"));
		}
	};

	const styleNames: Record<TimestampStyle, string> = {
		t: t("tools.discordTimestamp.styleShortTime"),
		T: t("tools.discordTimestamp.styleLongTime"),
		d: t("tools.discordTimestamp.styleShortDate"),
		D: t("tools.discordTimestamp.styleLongDate"),
		f: t("tools.discordTimestamp.styleShortDateTime"),
		F: t("tools.discordTimestamp.styleFull"),
		R: t("tools.discordTimestamp.styleRelative"),
	};

	const unixSeconds = date ? Math.floor(date.getTime() / 1000) : null;

	return (
		<ToolPageLayout
			header={
				<ToolHeader
					icon={<ClockIcon aria-hidden className="h-5 w-5" />}
					title={t("tools.discordTimestamp.title")}
				/>
			}
			footer={
				<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
					DISCORD TIMESTAMP TAG BUILDER
				</p>
			}
		>
			<div className="space-y-4">
				{/* Input zone */}
				<div className="grid gap-3 md:grid-cols-3">
					<div>
						<Input
							id="discord-ts-datetime"
							type="datetime-local"
							value={dtLocal}
							onChange={handleDateTimeChange}
						/>
					</div>
					<Input
						id="discord-ts-unix"
						type="number"
						step={1}
						min={0}
						placeholder="1700000000"
						value={unixInput}
						onChange={handleUnixChange}
					/>
					<Input
						id="discord-ts-natural"
						type="text"
						placeholder={t("tools.discordTimestamp.naturalPlaceholder")}
						value={naturalInput}
						onChange={handleNaturalChange}
						onBlur={commitNatural}
						onKeyDown={(e) => {
							if (e.key === "Enter") commitNatural();
						}}
					/>
				</div>

				{/* Quick chips */}
				<div className="flex flex-wrap gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => applyDate(new Date())}
					>
						{t("tools.discordTimestamp.chipNow")}
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => applyDate(new Date(Date.now() + HOUR_MS))}
					>
						{t("tools.discordTimestamp.chipPlus1h")}
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => applyDate(new Date(Date.now() + DAY_MS))}
					>
						{t("tools.discordTimestamp.chipPlus1d")}
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => applyDate(nextNineAmLocal())}
					>
						{t("tools.discordTimestamp.chipTomorrow9")}
					</Button>
				</div>

				{/* Timezone select + note */}
				<div className="space-y-1">
					<Select value={timezone} onValueChange={(v) => setTimezone(v)}>
						<SelectTrigger className="w-full md:w-80">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{TIME_ZONES.map((tz) => (
								<SelectItem key={tz} value={tz}>
									{tz}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<p className="text-muted-foreground font-mono text-[10px] uppercase tracking-[0.08em]">
						{t("tools.discordTimestamp.timezoneNote")}
					</p>
				</div>

				{/* Relative-distance badge */}
				{date && (
					<Badge variant="outline">
						{t("tools.discordTimestamp.targetLabel", {
							offset: formatOffset(date.getTime() - Date.now()),
						})}
					</Badge>
				)}

				{/* Inline errors */}
				{naturalError && (
					<p className="font-mono text-sm text-hazard-text">
						{t("tools.discordTimestamp.parseError")}
					</p>
				)}
				{unixError && (
					<p className="font-mono text-sm text-hazard-text">
						{t("tools.discordTimestamp.invalidUnix")}
					</p>
				)}

				{/* Output styles table */}
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="font-mono uppercase tracking-[0.08em]">
								{t("tools.discordTimestamp.colStyle")}
							</TableHead>
							<TableHead className="font-mono uppercase tracking-[0.08em]">
								{t("tools.discordTimestamp.colSyntax")}
							</TableHead>
							<TableHead className="font-mono uppercase tracking-[0.08em]">
								{t("tools.discordTimestamp.colPreview")}
							</TableHead>
							<TableHead className="w-12" />
						</TableRow>
					</TableHeader>
					<TableBody>
						{TIMESTAMP_STYLES.map((style) => {
							const syntax =
								unixSeconds !== null ? toDiscordTag(unixSeconds, style) : "";
							const preview = date
								? renderPreview(date, style, locale, timezone)
								: "";
							return (
								<TableRow key={style}>
									<TableCell>
										<span className="font-mono font-bold">{style}</span>
										<span className="ml-2 text-muted-foreground font-mono text-[10px] uppercase tracking-[0.08em]">
											{styleNames[style]}
										</span>
									</TableCell>
									<TableCell>
										<code className="font-mono text-xs">{syntax}</code>
									</TableCell>
									<TableCell>{preview}</TableCell>
									<TableCell>
										<Button
											variant="ghost"
											size="icon"
											disabled={!syntax}
											onClick={() => copySyntax(syntax)}
											aria-label={t("tools.discordTimestamp.copyRowAria", {
												style,
											})}
										>
											<CopyIcon aria-hidden className="h-4 w-4" />
										</Button>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</div>
		</ToolPageLayout>
	);
};

export default DiscordTimestampPage;
