import type { Mention } from "./parse";
import type { TimestampStyle } from "./timestamps";

export type Inline =
	| { kind: "text"; text: string }
	| { kind: "bold" | "italic" | "underline" | "strike" | "spoiler" | "inlineCode"; children: Inline[] }
	| { kind: "lineBreak" }
	| { kind: "link"; text: string; url: string }
	| { kind: "mention"; mention: Mention }
	| { kind: "timestamp"; unix: number; style?: TimestampStyle }
	| { kind: "emoji"; animated: boolean; name: string; id: string };

export type Block =
	| { kind: "paragraph"; inlines: Inline[] }
	| { kind: "heading"; level: 1 | 2 | 3; text: string }
	| { kind: "blockquote"; blocks: Block[] }
	| { kind: "code"; lang?: string; content: string }
	| { kind: "list"; ordered: boolean; items: Inline[][] };

// --- inline scanner ---

function scanInlines(text: string): Inline[] {
	const out: Inline[] = [];
	let i = 0;
	const len = text.length;

	function pushText(s: string) {
		if (!s) return;
		const last = out[out.length - 1];
		if (last?.kind === "text") last.text += s;
		else out.push({ kind: "text", text: s });
	}

	while (i < len) {
		// inline code — greedy, no nesting
		if (text[i] === "`" && text[i + 1] !== "`") {
			const end = text.indexOf("`", i + 1);
			if (end === -1) { pushText(text[i]); i++; continue; }
			out.push({ kind: "inlineCode", children: [{ kind: "text", text: text.slice(i + 1, end) }] });
			i = end + 1;
			continue;
		}

		// paired markers — check bold/underline before italic siblings
		// bold **…**
		if (text[i] === "*" && text[i + 1] === "*") {
			const end = text.indexOf("**", i + 2);
			if (end !== -1) {
				const inner = text.slice(i + 2, end);
				out.push({ kind: "bold", children: scanInlines(inner) });
				i = end + 2; continue;
			}
		}
		// underline __…__
		if (text[i] === "_" && text[i + 1] === "_") {
			const end = text.indexOf("__", i + 2);
			if (end !== -1) {
				const inner = text.slice(i + 2, end);
				out.push({ kind: "underline", children: scanInlines(inner) });
				i = end + 2; continue;
			}
		}
		// italic *…*
		if (text[i] === "*" && text[i + 1] !== "*") {
			const end = text.indexOf("*", i + 1);
			if (end !== -1) {
				const inner = text.slice(i + 1, end);
				out.push({ kind: "italic", children: scanInlines(inner) });
				i = end + 1; continue;
			}
		}
		// italic _…_
		if (text[i] === "_" && text[i + 1] !== "_") {
			const end = text.indexOf("_", i + 1);
			if (end !== -1) {
				const inner = text.slice(i + 1, end);
				out.push({ kind: "italic", children: scanInlines(inner) });
				i = end + 1; continue;
			}
		}
		// strike ~~…~~
		if (text[i] === "~" && text[i + 1] === "~") {
			const end = text.indexOf("~~", i + 2);
			if (end !== -1) {
				const inner = text.slice(i + 2, end);
				out.push({ kind: "strike", children: scanInlines(inner) });
				i = end + 2; continue;
			}
		}
		// spoiler ||…||
		if (text[i] === "|" && text[i + 1] === "|") {
			const end = text.indexOf("||", i + 2);
			if (end !== -1) {
				const inner = text.slice(i + 2, end);
				out.push({ kind: "spoiler", children: scanInlines(inner) });
				i = end + 2; continue;
			}
		}

		// links [text](https?://...)
		if (text[i] === "[" && !out.some((n) => n.kind === "text" && /[^\s]$/.test(n.text) === false && n.text.includes("["))) {
			const closeBracket = text.indexOf("]", i + 1);
			if (closeBracket !== -1 && text[closeBracket + 1] === "(" && text.indexOf("http", closeBracket + 2) === closeBracket + 2) {
				const closeParen = text.indexOf(")", closeBracket + 2);
				if (closeParen !== -1) {
					const linkText = text.slice(i + 1, closeBracket);
					const url = text.slice(closeBracket + 2, closeParen);
					out.push({ kind: "link", text: linkText, url });
					i = closeParen + 1; continue;
				}
			}
		}

		// mention / emoji / timestamp tokens starting with <
		if (text[i] === "<") {
			const m = text.slice(i).match(/^<(@!?&?|#|\/|a?:|t:[^>]+|:[^>]+:[^>]+)[^>]*>/);
			if (m) {
				const token = m[0];
				const inner = token.slice(1, -1);
				// timestamp <t:unix:style>
				if (inner.startsWith("t:")) {
					const parts = inner.slice(2).split(":");
					out.push({ kind: "timestamp", unix: Number(parts[0]), style: (parts[1] as TimestampStyle) ?? undefined });
					i += token.length; continue;
				}
				// emoji <a:name:id> or <:name:id>
				if (/^a?:[^:]+:[^>]+$/.test(inner)) {
					const anim = inner[0] === "a";
					const rest = anim ? inner.slice(2) : inner.slice(1);
					const colon = rest.indexOf(":");
					if (colon !== -1) {
						const name = rest.slice(0, colon);
						const id = rest.slice(colon + 1);
						out.push({ kind: "emoji", animated: anim, name, id });
						i += token.length; continue;
					}
				}
				// mention <@id> <@!id> <@&id> <#id> </name:id>
				const mention: Mention = {
					type: "user",
					raw: token,
					id: "",
					name: undefined,
				};
				if (inner.startsWith("@&")) { mention.type = "role"; mention.id = inner.slice(2); }
				else if (inner.startsWith("@!")) { mention.type = "user"; mention.id = inner.slice(2); }
				else if (inner.startsWith("@")) { mention.type = "user"; mention.id = inner.slice(1); }
				else if (inner.startsWith("#")) { mention.type = "channel"; mention.id = inner.slice(1); }
				else if (inner.startsWith("/")) {
					mention.type = "slash";
					const ci = inner.indexOf(":");
					if (ci !== -1) { mention.name = inner.slice(1, ci); mention.id = inner.slice(ci + 1); }
				}
				out.push({ kind: "mention", mention });
				i += token.length; continue;
			}
		}

		// line break (single newline inside paragraph)
		if (text[i] === "\n") {
			out.push({ kind: "lineBreak" });
			i++; continue;
		}

		pushText(text[i]);
		i++;
	}
	return out;
}

// --- block parser ---

export function parseDiscordMarkdown(text: string): Block[] {
	const lines = text.split("\n");
	const blocks: Block[] = [];
	let i = 0;

	while (i < lines.length) {
		const line = lines[i];

		// fenced code block
		const fenceMatch = line.match(/^(\x60{3,}|~{3,})\s*(\S*)/);
		if (fenceMatch) {
			const marker = fenceMatch[1][0] + fenceMatch[1][0] + fenceMatch[1][0];
			const lang = fenceMatch[2] || undefined;
			const codeLines: string[] = [];
			i++;
			while (i < lines.length && !lines[i].startsWith(marker)) {
				codeLines.push(lines[i]);
				i++;
			}
			i++; // skip close fence if found
			blocks.push({ kind: "code", lang, content: codeLines.join("\n") });
			continue;
		}

		// heading
		const headMatch = line.match(/^(#{1,3})\s+(.+)/);
		if (headMatch) {
			const level = headMatch[1].length as 1 | 2 | 3;
			blocks.push({ kind: "heading", level, text: headMatch[2] });
			i++; continue;
		}

		// blockquote
		if (line.startsWith("> ") || line === ">") {
			const bqLines: string[] = [];
			while (i < lines.length && (lines[i].startsWith("> ") || lines[i] === ">")) {
				bqLines.push(lines[i].startsWith("> ") ? lines[i].slice(2) : "");
				i++;
			}
			blocks.push({ kind: "blockquote", blocks: parseDiscordMarkdown(bqLines.join("\n")) });
			continue;
		}

		// list
		const listMatch = line.match(/^\s*([-*+]|\d+\.)\s+/);
		if (listMatch) {
			const ordered = /^\s*\d+\./.test(line);
			const items: Inline[][] = [];
			while (i < lines.length) {
				const itemMatch = lines[i].match(/^\s*([-*+]|\d+\.)\s+(.*)/);
				if (!itemMatch) break;
				items.push(scanInlines(itemMatch[2]));
				i++;
			}
			blocks.push({ kind: "list", ordered, items });
			continue;
		}

		// paragraph — accumulate until blank line or special block
		if (line.trim() !== "") {
			const paraLines: string[] = [];
			while (i < lines.length && lines[i].trim() !== "" &&
				!lines[i].match(/^(\x60{3,}|~{3,})\s*(\S*)/) &&
				!lines[i].match(/^#{1,3}\s+/) &&
				!(lines[i].startsWith("> ") || lines[i] === ">") &&
				!lines[i].match(/^\s*([-*+]|\d+\.)\s+/)) {
				paraLines.push(lines[i]);
				i++;
			}
			blocks.push({ kind: "paragraph", inlines: scanInlines(paraLines.join("\n")) });
			continue;
		}

		i++; // skip blank
	}
	return blocks;
}

// Escape all Discord markdown metacharacters plus pings
export function escapeDiscordMarkdown(text: string): string {
	// Backslash-escape: \ ` * _ ~ | # > plus @everyone/@here pings
	return text.replace(/([\\`*_~|>#]|@(?:everyone|here))/g, "\\$1");
}
