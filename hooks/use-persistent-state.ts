import * as React from "react";

const STORAGE_PREFIX = "devkit:";

/**
 * Drop-in useState replacement that persists to localStorage under
 * `devkit:<key>`. Use only for small, non-sensitive user preferences
 * (selects, toggles, sliders, counts, colors) — never for inputs,
 * outputs, file contents, or secrets.
 *
 * First render returns `defaultValue` (SSR-safe, no hydration mismatch);
 * the stored value is applied in an effect right after mount, so derived
 * output effects re-run once with the restored config.
 */
export function usePersistentState<T>(
	key: string,
	defaultValue: T,
	isValid?: (value: unknown) => value is T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
	const [value, setValue] = React.useState<T>(defaultValue);
	const [hydrated, setHydrated] = React.useState(false);

	React.useEffect(() => {
		try {
			const raw = window.localStorage.getItem(STORAGE_PREFIX + key);
			if (raw !== null) {
				const parsed: unknown = JSON.parse(raw);
				if (isValid ? isValid(parsed) : typeof parsed === typeof defaultValue) {
					setValue(parsed as T);
				} else {
					window.localStorage.removeItem(STORAGE_PREFIX + key);
				}
			}
		} catch {
			// Corrupted entry — fall back to the default.
		}
		setHydrated(true);
		// key/default are static per callsite; depending on object-default
		// identity would re-run this every render.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [key]);

	React.useEffect(() => {
		if (!hydrated) return;
		try {
			window.localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
		} catch {
			// Storage full/unavailable — persistence is best-effort.
		}
	}, [hydrated, key, value]);

	return [value, setValue];
}
