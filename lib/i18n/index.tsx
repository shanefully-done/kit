"use client";

import * as React from "react";
import { en, type Dictionary } from "./en";
import { ko } from "./ko";

export type Locale = "en" | "ko";

type Paths<T, P extends string = ""> = T extends object
	? {
			[K in keyof T & string]: Paths<T[K], P extends "" ? K : `${P}.${K}`>;
		}[keyof T & string]
	: P;

/** Every dotted dictionary path, e.g. "common.copy" — literal at every t() callsite. */
export type Path = Paths<Dictionary>;

const DICTIONARIES: Record<Locale, Dictionary> = { en, ko };
const STORAGE_KEY = "devkit:locale";


function lookup(dict: object, path: string): string | undefined {
	let current: unknown = dict;
	for (const part of path.split(".")) {
		if (current === null || typeof current !== "object") return undefined;
		current = (current as Record<string, unknown>)[part];
	}
	return typeof current === "string" ? current : undefined;
}

/** Replaces {var} placeholders; unknown placeholders stay visible for debugging. */
function interpolate(
	template: string,
	vars?: Record<string, string | number>,
): string {
	return template.replace(/\{(\w+)\}/g, (match, key: string) =>
		vars && key in vars ? String(vars[key]) : match,
	);
}

type I18nContextValue = {
	locale: Locale;
	setLocale: (locale: Locale) => void;
	t: (path: Path, vars?: Record<string, string | number>) => string;
};

const I18nContext = React.createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
	// Starts "en" so SSR and first client render match (no hydration mismatch);
	// the real locale is resolved post-mount.
	const [locale, setLocaleState] = React.useState<Locale>("en");

	React.useEffect(() => {
		let stored: string | null = null;
		try {
			stored = localStorage.getItem(STORAGE_KEY);
		} catch {
			// storage unavailable — fall through to detection
		}
		if (stored !== null) {
			try {
				const parsed: unknown = JSON.parse(stored);
				if (parsed === "ko" || parsed === "en") {
					setLocaleState(parsed);
					return;
				}
			} catch {
				// corrupted value — fall through to detection
			}
		}
		// No stored choice: detect from browser languages, never persist.
		const browserLanguages =
			typeof navigator !== "undefined"
				? (navigator.languages ?? [navigator.language])
				: [];
		setLocaleState(
			browserLanguages.some((l) => l.toLowerCase().startsWith("ko"))
				? "ko"
				: "en",
		);
	}, []);

	// Covers restored, detected, and explicitly set values alike.
	React.useEffect(() => {
		document.documentElement.lang = locale;
	}, [locale]);

	const setLocale = React.useCallback((next: Locale) => {
		setLocaleState(next);
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
		} catch {
			// storage unavailable — locale lives for this session only
		}
	}, []);

	const t = React.useCallback(
		(path: Path, vars?: Record<string, string | number>) => {
			const localized = lookup(DICTIONARIES[locale], path);
			if (localized !== undefined) {
				return interpolate(localized, vars);
			}
			const fallback = lookup(en, path);
			if (fallback === undefined) {
				if (process.env.NODE_ENV !== "production") {
					console.warn(`[i18n] unknown key "${path}"`);
				}
				return path;
			}
			if (process.env.NODE_ENV !== "production") {
				console.warn(`[i18n] missing "${locale}" translation for "${path}"`);
			}
			return interpolate(fallback, vars);
		},
		[locale],
	);

	const value = React.useMemo(
		() => ({ locale, setLocale, t }),
		[locale, setLocale, t],
	);

	return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
	const ctx = React.useContext(I18nContext);
	if (!ctx) {
		throw new Error("useI18n must be used within I18nProvider");
	}
	return ctx;
}
