export const ANSI_ESC = "\u001b[";
export const ANSI_RESET = "\u001b[0m";

export const ANSI_FG: Record<string, string> = {
	black: "30", red: "31", green: "32", yellow: "33",
	blue: "34", magenta: "35", cyan: "36", white: "37",
};
export const ANSI_FG_BRIGHT: Record<string, string> = {
	gray: "90", redBright: "91", greenBright: "92", yellowBright: "93",
	blueBright: "94", magentaBright: "95", cyanBright: "96", whiteBright: "97",
};
export const ANSI_BG: Record<string, string> = {
	black: "40", red: "41", green: "42", yellow: "43",
	blue: "44", magenta: "45", cyan: "46", white: "47",
};
export const ANSI_BG_BRIGHT: Record<string, string> = {
	gray: "100", redBright: "101", greenBright: "102", yellowBright: "103",
	blueBright: "104", magentaBright: "105", cyanBright: "106", whiteBright: "107",
};

export type AnsiSegment = {
	text: string;
	fg?: string;
	bg?: string;
	bold?: boolean;
	underline?: boolean;
};

export function buildAnsiBlock(segments: AnsiSegment[]): string {
	let body = "";
	for (const seg of segments) {
		if (!seg.text) continue;
		const codes: string[] = [];
		if (seg.bold) codes.push("1");
		if (seg.underline) codes.push("4");
		const fgCode = seg.fg ? (ANSI_FG[seg.fg] ?? ANSI_FG_BRIGHT[seg.fg]) : undefined;
		if (fgCode) codes.push(fgCode);
		const bgCode = seg.bg ? (ANSI_BG[seg.bg] ?? ANSI_BG_BRIGHT[seg.bg]) : undefined;
		if (bgCode) codes.push(bgCode);
		body += codes.length
			? ANSI_ESC + codes.join(";") + "m" + seg.text + ANSI_RESET
			: seg.text;
	}
	return "```ansi\n" + body + "\n```";
}

const FG_NAME: Record<string, string> = {
	"30": "black", "31": "red", "32": "green", "33": "yellow",
	"34": "blue", "35": "magenta", "36": "cyan", "37": "white",
	"90": "gray", "91": "redBright", "92": "greenBright", "93": "yellowBright",
	"94": "blueBright", "95": "magentaBright", "96": "cyanBright", "97": "whiteBright",
};
const BG_NAME: Record<string, string> = {
	"40": "black", "41": "red", "42": "green", "43": "yellow",
	"44": "blue", "45": "magenta", "46": "cyan", "47": "white",
	"100": "gray", "101": "redBright", "102": "greenBright", "103": "yellowBright",
	"104": "blueBright", "105": "magentaBright", "106": "cyanBright", "107": "whiteBright",
};

export function parseAnsiBlock(text: string): AnsiSegment[] {
	let src = text.trim();
	if (src.startsWith("```ansi")) src = src.slice(7);
	else if (src.startsWith("```")) src = src.slice(3);
	if (src.endsWith("```")) src = src.slice(0, -3);
	src = src.replace(/^\n/, "").replace(/\n$/, "");

	const segments: AnsiSegment[] = [];
	const re = /\x1b\[([0-9;]*)m/g;
	let last = 0;
	let cur: AnsiSegment = { text: "" };

	let m: RegExpExecArray | null;
	while ((m = re.exec(src)) !== null) {
		const pending = src.slice(last, m.index);
		if (pending) segments.push({ ...cur, text: pending });
		last = re.lastIndex;
		for (const c of m[1].split(";")) {
			if (c === "" || c === "0") cur = { text: "" };
			else if (c === "1" && !cur.bold) cur.bold = true;
			else if (c === "4" && !cur.underline) cur.underline = true;
			else if (FG_NAME[c] && !cur.fg) cur.fg = FG_NAME[c];
			else if (BG_NAME[c] && !cur.bg) cur.bg = BG_NAME[c];
		}
	}

	const tail = src.slice(last);
	if (tail) segments.push({ ...cur, text: tail });
	return segments;
}
