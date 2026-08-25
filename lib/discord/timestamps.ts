import { formatDistanceToNowStrict } from "date-fns";
import { enUS, ko } from "date-fns/locale";

export type TimestampStyle = "t" | "T" | "d" | "D" | "f" | "F" | "R";

export const TIMESTAMP_STYLES: TimestampStyle[] = ["t", "T", "d", "D", "f", "F", "R"];

export function toDiscordTag(unixSeconds: number, style?: TimestampStyle): string {
	return `<t:${unixSeconds}${style ? ":" + style : ""}>`;
}

const STYLE_OPTIONS: Record<string, Intl.DateTimeFormatOptions> = {
	t: { hour: "numeric", minute: "2-digit" },
	T: { hour: "numeric", minute: "2-digit", second: "2-digit" },
	d: { day: "numeric", month: "numeric", year: "numeric" },
	D: { day: "numeric", month: "long", year: "numeric" },
	f: { day: "numeric", month: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" },
	F: { weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "numeric", minute: "2-digit" },
};

export function formatStyle(date: Date, style: TimestampStyle, locale: string): string {
	if (style === "R") {
		const loc = locale.startsWith("ko") ? ko : enUS;
		return formatDistanceToNowStrict(date, { addSuffix: true, locale: loc });
	}
	const opts = STYLE_OPTIONS[style];
	if (!opts) return "";
	return new Intl.DateTimeFormat(locale, opts).format(date);
}

// --- parseNatural ---

const UNIT_MS: Record<string, (n: number, d: Date) => number> = {
	s: (n) => n * 1000,
	sec: (n) => n * 1000,
	seconds: (n) => n * 1000,
	m: (n) => n * 60000,
	min: (n) => n * 60000,
	minutes: (n) => n * 60000,
	h: (n) => n * 3600000,
	hr: (n) => n * 3600000,
	hours: (n) => n * 3600000,
	d: (n) => n * 86400000,
	days: (n) => n * 86400000,
	w: (n) => n * 604800000,
	weeks: (n) => n * 604800000,
	mo: (n, d) => calendarMonthAdd(d, n),
	months: (n, d) => calendarMonthAdd(d, n),
	y: (n, d) => calendarYearAdd(d, n),
	yr: (n, d) => calendarYearAdd(d, n),
	years: (n, d) => calendarYearAdd(d, n),
};

function calendarMonthAdd(d: Date, n: number): number {
	return new Date(d.getFullYear(), d.getMonth() + n, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds()).getTime() - d.getTime();
}

function calendarYearAdd(d: Date, n: number): number {
	const result = new Date(d);
	result.setFullYear(result.getFullYear() + n);
	return result.getTime() - d.getTime();
}

const WEEKDAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

function addMs(d: Date, ms: number): Date {
	return new Date(d.getTime() + ms);
}

function nextWeekday(d: Date, targetDay: number): Date {
	const result = new Date(d);
	const current = result.getDay();
	let diff = targetDay - current;
	if (diff <= 0) diff += 7;
	result.setDate(result.getDate() + diff);
	return result;
}

function setTime(d: Date, h: number, m: number, s: number): Date {
	const result = new Date(d);
	result.setHours(h, m, s, 0);
	return result;
}

function parseTime(str: string): { h: number; m: number; s: number } | null {
	str = str.trim();
	// HH:MM:SS or HH:MM or HH
	const parts = str.split(":").map(Number);
	if (parts.some(isNaN)) return null;
	const h = parts[0] ?? 0;
	const m = parts[1] ?? 0;
	const s = parts[2] ?? 0;
	if (h < 0 || h > 23 || m < 0 || m > 59 || s < 0 || s > 59) return null;
	return { h, m, s };
}

function applyAmPm(h: number, period: string): number {
	const p = period.toLowerCase();
	if (p === "am") return h === 12 ? 0 : h;
	if (p === "pm") return h === 12 ? 12 : h + 12;
	return h;
}

export function parseNatural(text: string, base: Date = new Date()): Date | null {
	const t = text.trim().toLowerCase();
	if (!t) return null;

	// ISO: YYYY-MM-DD[T ]HH:MM[:SS]
	const isoMatch = t.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?)?$/);
	if (isoMatch) {
		const [, y, mo, d, hh, mm, ss] = isoMatch;
		const date = new Date(+y!, +mo! - 1, +d!, +(hh ?? 0), +(mm ?? 0), +(ss ?? 0));
		if (!isNaN(date.getTime())) return date;
	}

	// "in N unit"
	const inMatch = t.match(/^in\s+(\d+)\s+(\S+)/);
	if (inMatch) {
		const n = +inMatch[1]!;
		const unit = inMatch[2]!;
		const fn = UNIT_MS[unit];
		if (fn) return addMs(base, fn(n, base));
	}

	// "+N unit"
	const plusMatch = t.match(/^\+(\d+)\s*(\S+)$/);
	if (plusMatch) {
		const n = +plusMatch[1]!;
		const unit = plusMatch[2]!;
		const fn = UNIT_MS[unit];
		if (fn) return addMs(base, fn(n, base));
	}

	// "N unit ago"
	const agoMatch = t.match(/^(\d+)\s+(\S+)\s+ago$/);
	if (agoMatch) {
		const n = +agoMatch[1]!;
		const unit = agoMatch[2]!;
		const fn = UNIT_MS[unit];
		if (fn) return addMs(base, -fn(n, base));
	}

	// "tomorrow [at ]HH[:MM[:SS]]"
	const tomorrowMatch = t.match(/^tomorrow(?:\s+(?:at\s+)?(\d{1,2}(?::\d{2}(?::\d{2})?)?)\s*(am|pm)?)$/);
	if (tomorrowMatch) {
		const time = tomorrowMatch[1] ? parseTime(tomorrowMatch[1]) : { h: base.getHours(), m: base.getMinutes(), s: base.getSeconds() };
		if (time) {
			const result = new Date(base);
			result.setDate(result.getDate() + 1);
			result.setHours(applyAmPm(time.h, tomorrowMatch[2] ?? ""), time.m, time.s, 0);
			return result;
		}
	}

	// "next <weekday>"
	const nextWkdayMatch = t.match(/^next\s+(\w+)$/);
	if (nextWkdayMatch) {
		const dayIdx = WEEKDAYS.indexOf(nextWkdayMatch[1]!);
		if (dayIdx >= 0) return nextWeekday(base, dayIdx);
	}

	// "<weekday> [at HH:MM]" (next occurrence incl. today-if-future)
	const wkdayAtMatch = t.match(/^(\w+)(?:\s+(?:at\s+)?(\d{1,2}(?::\d{2}(?::\d{2})?)?)\s*(am|pm)?)?$/);
	if (wkdayAtMatch && !t.startsWith("next") && !t.startsWith("in") && !t.startsWith("tomorrow")) {
		const dayIdx = WEEKDAYS.indexOf(wkdayAtMatch[1]!);
		if (dayIdx >= 0) {
			let result = nextWeekday(base, dayIdx);
			if (wkdayAtMatch[2]) {
				const time = parseTime(wkdayAtMatch[2]!);
				if (time) {
					result = setTime(result, applyAmPm(time.h, wkdayAtMatch[3] ?? ""), time.m, time.s);
					if (result < base) {
						result.setDate(result.getDate() + 7);
					}
				}
			}
			return result;
		}
	}

	// "HH[:MM[:SS]] ?(am|pm)" — today, tomorrow if already past
	const clockMatch = t.match(/^(\d{1,2}(?::\d{2}(?::\d{2})?)?)\s*(am|pm)?$/);
	if (clockMatch) {
		const hasAmPm = clockMatch[2] !== undefined;
		if (!hasAmPm && t.includes(" ")) return null;
		const time = parseTime(clockMatch[1]!);
		if (time) {
			let h = time.h;
			if (clockMatch[2]) h = applyAmPm(h, clockMatch[2]!);
			const result = setTime(base, h, time.m, time.s);
			if (result < base) {
				result.setDate(result.getDate() + 1);
			}
			return result;
		}
	}

	return null;
}
