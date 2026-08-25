export type FancyStyle = { id: string; name: string; map: Record<string, string> };

function buildMap(upperBase: number, lowerBase: number, digitBase?: number): Record<string, string> {
	const m: Record<string, string> = {};
	for (let i = 0; i < 26; i++) {
		m[String.fromCharCode(65 + i)] = String.fromCodePoint(upperBase + i);
		m[String.fromCharCode(97 + i)] = String.fromCodePoint(lowerBase + i);
	}
	if (digitBase != null) {
		for (let d = 0; d <= 9; d++) m[String(d)] = String.fromCodePoint(digitBase + d);
	}
	return m;
}

export const FANCY_STYLES: FancyStyle[] = [
	{ id: "bold", name: "Mathematical Bold", map: Object.assign(buildMap(0x1D400, 0x1D41A, 0x1D7CE)) },
	{
		id: "italic", name: "Mathematical Italic",
		map: Object.assign(buildMap(0x1D434, 0x1D44E), { h: "ℎ" } as Record<string, string>),
	},
	{ id: "boldItalic", name: "Mathematical Bold Italic", map: buildMap(0x1D468, 0x1D482) },
	{
		id: "script", name: "Script",
		map: Object.assign(buildMap(0x1D49C, 0x1D4B6), {
			B: "ℬ", E: "ℰ", F: "ℱ", H: "ℋ", I: "ℐ",
			L: "ℒ", M: "ℳ", R: "ℛ",
			e: "ℯ", g: "ℊ", o: "ℴ",
		} as Record<string, string>),
	},
	{ id: "boldScript", name: "Bold Script", map: buildMap(0x1D4D0, 0x1D4EA) },
	{
		id: "fraktur", name: "Fraktur",
		map: Object.assign(buildMap(0x1D504, 0x1D51E), {
			C: "ℭ", H: "ℌ", I: "ℑ", R: "ℜ", Z: "ℨ",
		} as Record<string, string>),
	},
	{ id: "boldFraktur", name: "Bold Fraktur", map: buildMap(0x1D56C, 0x1D586) },
	{
		id: "doubleStruck", name: "Double-Struck",
		map: Object.assign(buildMap(0x1D538, 0x1D552, 0x1D7D8), {
			C: "ℂ", H: "ℍ", N: "ℕ", P: "ℙ",
			Q: "ℝ", R: "ℜ", Z: "ℤ",
		} as Record<string, string>),
	},
	{ id: "sans", name: "Sans", map: buildMap(0x1D5A0, 0x1D5BA, 0x1D7E2) },
	{ id: "sansBold", name: "Sans Bold", map: buildMap(0x1D5D4, 0x1D5EE, 0x1D7EC) },
	{ id: "sansItalic", name: "Sans Italic", map: buildMap(0x1D608, 0x1D622) },
	{ id: "sansBoldItalic", name: "Sans Bold Italic", map: buildMap(0x1D63C, 0x1D656) },
	{ id: "mono", name: "Monospace", map: buildMap(0x1D670, 0x1D68A, 0x1D7F6) },
	{
		id: "circled", name: "Circled",
		map: (() => {
			const m = buildMap(0x24B6, 0x24D0);
			m["0"] = "\u24EA";
			for (let d = 1; d <= 9; d++) m[String(d)] = String.fromCodePoint(0x245F + d);
			return m;
		})(),
	},
	{ id: "squared", name: "Squared", map: (() => { const m: Record<string, string> = {}; for (let i = 0; i < 26; i++) m[String.fromCharCode(65 + i)] = String.fromCodePoint(0x1F130 + i); return m; })() },
	{ id: "negativeSquared", name: "Negative Squared", map: (() => { const m: Record<string, string> = {}; for (let i = 0; i < 26; i++) m[String.fromCharCode(65 + i)] = String.fromCodePoint(0x1F170 + i); return m; })() },
	{ id: "regional", name: "Regional Indicator", map: (() => { const m: Record<string, string> = {}; for (let i = 0; i < 26; i++) m[String.fromCharCode(65 + i)] = String.fromCodePoint(0x1F1E6 + i); return m; })() },
	{ id: "fullwidth", name: "Fullwidth", map: buildMap(0xFF21, 0xFF41, 0xFF10) },
	{
		id: "smallCaps", name: "Small Caps",
		map: (() => {
			const lower = "ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘꞯʀꜱᴛᴜᴠᴡxʏᴢ";
			const m: Record<string, string> = {};
			for (let i = 0; i < 26; i++) {
				m[String.fromCharCode(97 + i)] = lower[i];
				m[String.fromCharCode(65 + i)] = lower[i];
			}
			return m;
		})(),
	},
	{
		id: "superscript", name: "Superscript",
		map: (() => {
			const lower = "ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖqʳˢᵗᵘᵛʷˣʸᶻ";
			const digits = "⁰¹²³⁴⁵⁶⁷⁸⁹";
			const m: Record<string, string> = {};
			for (let i = 0; i < 26; i++) {
				m[String.fromCharCode(97 + i)] = lower[i];
				m[String.fromCharCode(65 + i)] = lower[i];
			}
			for (let d = 0; d <= 9; d++) m[String(d)] = digits[d];
			m["q"] = "q";
			m["Q"] = "q";
			return m;
		})(),
	},
	{
		id: "upsideDown", name: "Upside Down",
		map: (() => {
			const flip: Record<string, string> = {
				a: "ɐ", b: "q", c: "ɔ", d: "p", e: "ǝ", f: "\uA731",
				g: "ƃ", h: "ɥ", i: "ᴉ", j: "\u027E", k: "ʞ",
				l: "l", m: "ɯ", n: "u", o: "o", p: "d", q: "b",
				r: "ɹ", s: "s", t: "ʇ", u: "n", v: "ʌ",
				w: "ʍ", x: "x", y: "ʎ", z: "z",
			};
			const digitFlip: Record<string, string> = { "0": "0", "1": "\u0196", "2": "\u3135", "3": "\u0190", "4": "\u3123", "5": "\u03DB", "6": "9", "7": "\u3145", "8": "8", "9": "6" };
			const m: Record<string, string> = {};
			for (const [k, v] of Object.entries(flip)) {
				m[k] = v;
				m[k.toUpperCase()] = v;
			}
			for (const [k, v] of Object.entries(digitFlip)) m[k] = v;
			return m;
		})(),
	},
	{ id: "underlined", name: "Underlined (combining)", map: {} },
	{ id: "strikethrough", name: "Strikethrough (combining)", map: {} },
];

export function applyFancyStyle(text: string, styleId: string): string {
	if (styleId === "underlined") return [...text].map((c) => c + "\u0332").join("");
	if (styleId === "strikethrough") return [...text].map((c) => c + "\u0336").join("");
	const style = FANCY_STYLES.find((s) => s.id === styleId);
	if (!style) return text;
	if (styleId === "upsideDown") {
		const mapped = [...text].map((c) => style.map[c] ?? c).join("");
		return [...mapped].reverse().join("");
	}
	return [...text].map((c) => style.map[c] ?? c).join("");
}

export const INVISIBLE_CHARS: { char: string; name: string; note: string }[] = [
	{ char: "\u200B", name: "Zero Width Space", note: "Works in messages" },
	{ char: "\u200C", name: "Zero Width Non-Joiner", note: "Joins/breaks scripts" },
	{ char: "\u200D", name: "Zero Width Joiner", note: "Emoji joiner — visible effects" },
	{ char: "\u2060", name: "Word Joiner", note: "No-break joiner" },
	{ char: "\uFEFF", name: "Byte Order Mark", note: "Often stripped" },
	{ char: "\u3164", name: "Hangul Filler", note: "Classic blank nickname" },
	{ char: "\u115F", name: "Hangul Choseong Filler", note: "Blank nickname alt" },
	{ char: "\u2800", name: "Braille Pattern Blank", note: "Visible-ish blank cell" },
	{ char: "\u1D159", name: "Musical Symbol Null", note: "May not render" },
];

export type SplitOptions = { limit: number; numberParts: boolean };

export function splitMessage(text: string, opts: SplitOptions): string[] {
	const rawLimit = opts.limit;
	if (text.length <= rawLimit) return [text];

	const numPad = opts.numberParts
		? (n: number) => String(n).length * 2 + 2
		: () => 0;

	// Pre-compute per-line fence metadata
	const lines = text.split("\n");
	interface LineFence { isFence: boolean; marker: string; lang: string }
	const fenceInfo: LineFence[] = lines.map((l) => {
		const trimmed = l.trimStart();
		const m = trimmed.match(/^(\x60{3,}|~{3,})(\S*)/);
		return m ? { isFence: true, marker: m[1], lang: m[2] || "" } : { isFence: false, marker: "", lang: "" };
	});

	// Pre-compute cumulative lengths and line-end character positions
	// lineEnd[i] = character position just after line i's newline (or end of text)
	const lineEnd: number[] = [];
	let pos = 0;
	for (let i = 0; i < lines.length; i++) {
		pos += lines[i].length;
		if (i < lines.length - 1) pos++; // newline
		lineEnd.push(pos);
	}


	function doSplit(budget: number): string[] {
		const parts: string[] = [];
		let lineIdx = 0;
		let globalFenceDepth = 0;
		let globalFenceMarker = "";
		let globalFenceLang = "";

		while (lineIdx < lines.length) {
			const partStart = lineIdx;
			let partEnd = partStart;
		const nextLineCloses = globalFenceDepth > 0 && lineIdx < lines.length
			&& fenceInfo[lineIdx].isFence && fenceInfo[lineIdx].marker === globalFenceMarker;
		const reopenLen = globalFenceDepth > 0 && !nextLineCloses
			? globalFenceMarker.length + (globalFenceLang ? 1 + globalFenceLang.length : 0) + 1
			: 0;
			let len = reopenLen;
			let lastBlankIdx = -1;

			for (let i = lineIdx; i < lines.length; i++) {
				const lineLen = i < lines.length - 1 ? lines[i].length + 1 : lines[i].length;
				if (len + lineLen > budget && i > partStart) {
					partEnd = lastBlankIdx > partStart ? lastBlankIdx + 1 : i;
					break;
				}
				len += lineLen;
				if (lines[i].trim() === "" && i > partStart) lastBlankIdx = i;
				partEnd = i + 1;
			}

			// single line > budget → hard split
			const startChar = partStart > 0 ? lineEnd[partStart - 1] : 0;
			const endChar = lineEnd[partEnd - 1];
			const rawLen = endChar - startChar + reopenLen;
			if (partEnd === partStart + 1 && rawLen > budget) {
				const line = lines[partStart];
				let rem = line;
				while (rem.length > budget) {
					parts.push(rem.slice(0, budget));
					rem = rem.slice(budget);
				}
				if (rem) parts.push(rem);
				lineIdx = partStart + 1;
				continue;
			}

			// build part text
			let partText = text.slice(startChar, endChar);

		// prepend reopen if inside fence AND the first line isn't a matching close
		const firstLineIsClose = globalFenceDepth > 0 && partEnd > partStart
			&& fenceInfo[partStart].isFence && fenceInfo[partStart].marker === globalFenceMarker;
		if (globalFenceDepth > 0 && !firstLineIsClose) {
			partText = globalFenceMarker + (globalFenceLang ? " " + globalFenceLang : "") + "\n" + partText;
		}

			// track fence state through these lines
			for (let i = partStart; i < partEnd; i++) {
				const f = fenceInfo[i];
				if (!f.isFence) continue;
				if (globalFenceDepth === 0) {
					globalFenceDepth = 1;
					globalFenceMarker = f.marker;
					globalFenceLang = f.lang;
				} else if (f.marker === globalFenceMarker) {
					globalFenceDepth = 0;
				}
			}

			// if still inside fence, close and flag for reopen
			if (globalFenceDepth > 0) {
				partText += globalFenceMarker + "\n";
			}

			parts.push(partText);
			lineIdx = partEnd;
		}

		while (parts.length > 1 && parts[parts.length - 1].trim() === "") parts.pop();
		return parts;
	}

	// fixpoint for numberParts
	let budget = rawLimit;
	for (let iter = 0; iter < 3; iter++) {
		const result = doSplit(budget);
		if (!opts.numberParts) return result;
		const n = result.length;
		if (n <= 1) return result;
		const newBudget = rawLimit - numPad(n);
		if (newBudget === budget) return result;
		budget = newBudget;
	}
	return doSplit(budget);
}
