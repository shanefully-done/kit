export type MentionType = "user" | "role" | "channel" | "slash" | "emoji" | "timestamp";

export type Mention = {
	type: MentionType;
	raw: string;
	id: string;
	name?: string;
	animated?: boolean;
	style?: string;
};

// Single global regex with alternation for all mention types
// Groups: 1=user(!), 2=role, 3=channel, 4=slash, 5=emoji(animated), 6=emoji(static), 7=timestamp
export const MENTION_REGEX = /<(@!?)\d+>|<@&\d+>|<#\d+>|<\/[a-z0-9_-]+:\d+>|<a?:[a-z0-9_-]+:\d+>|<t:\d+(?::[tTdDfFR])?>/g;

function parseMentionToken(raw: string): Mention | null {
	if (raw.startsWith("<@!") && raw.endsWith(">"))
		return { type: "user", raw, id: raw.slice(3, -1) };
	if (raw.startsWith("<@&") && raw.endsWith(">"))
		return { type: "role", raw, id: raw.slice(3, -1) };
	if (raw.startsWith("<@") && raw.endsWith(">"))
		return { type: "user", raw, id: raw.slice(2, -1) };
	if (raw.startsWith("<@&") && raw.endsWith(">"))
		return { type: "role", raw, id: raw.slice(3, -1) };
	if (raw.startsWith("<#") && raw.endsWith(">"))
		return { type: "channel", raw, id: raw.slice(2, -1) };
	if (raw.startsWith("</")) {
		const inner = raw.slice(2, -1); // name:id
		const colon = inner.lastIndexOf(":");
		if (colon > 0)
			return { type: "slash", raw, id: inner.slice(colon + 1), name: inner.slice(0, colon) };
	}
	if (raw.startsWith("<t:")) {
		const inner = raw.slice(3, -1); // unix[:style]
		const colon = inner.indexOf(":");
		if (colon === -1) return { type: "timestamp", raw, id: inner };
		return { type: "timestamp", raw, id: inner.slice(0, colon), style: inner.slice(colon + 1) };
	}
	// emoji: <a:name:id> or <:name:id>
	if (raw.startsWith("<a:") || raw.startsWith("<:")) {
		const animated = raw[1] === "a";
		const inner = raw.slice(animated ? 3 : 2, -1); // name:id
		const colon = inner.lastIndexOf(":");
		if (colon > 0)
			return { type: "emoji", raw, id: inner.slice(colon + 1), name: inner.slice(0, colon), animated };
	}
	return null;
}

export function extractMentions(text: string): Mention[] {
	const regex = new RegExp(MENTION_REGEX.source, "g");
	const seen = new Set<string>();
	const results: Mention[] = [];
	let match: RegExpExecArray | null;
	while ((match = regex.exec(text)) !== null) {
		const raw = match[0];
		if (seen.has(raw)) continue;
		seen.add(raw);
		const parsed = parseMentionToken(raw);
		if (parsed) results.push(parsed);
	}
	return results;
}

export function buildMention(
	type: MentionType,
	id: string,
	name?: string,
	animated?: boolean,
): string {
	switch (type) {
		case "user":
			return `<@${id}>`;
		case "role":
			return `<@&${id}>`;
		case "channel":
			return `<#${id}>`;
		case "slash":
			return `</${name ?? "cmd"}:${id}>`;
		case "emoji":
			return `<${animated ? "a" : ""}:${name ?? "emoji"}:${id}>`;
		case "timestamp":
			return `<t:${id}${name ? `:${name}` : ""}>`;
	}
}

export type MessageLinkParts = {
	guildId: string | "@me";
	channelId: string;
	messageId: string;
};

const DISCORD_HOST_RE = /^(?:[a-z0-9-]+\.)?discord(?:app)?\.com$/i;
const MESSAGE_PATH_RE = /^\/channels\/(\d+|@me)\/(\d+)\/(\d+)$/;

export function parseMessageLink(input: string): MessageLinkParts | null {
	try {
		const url = new URL(input.trim());
		if (!DISCORD_HOST_RE.test(url.hostname)) return null;
		const m = MESSAGE_PATH_RE.exec(url.pathname);
		if (!m) return null;
		return { guildId: m[1], channelId: m[2], messageId: m[3] };
	} catch {
		return null;
	}
}

export function buildMessageLink(parts: MessageLinkParts): string {
	return `https://discord.com/channels/${parts.guildId}/${parts.channelId}/${parts.messageId}`;
}

const INVITE_HOST_RE = /^(?:[a-z0-9-]+\.)?discord\.gg$/i;
const INVITE_PATH_RE = /^\/(?:invite\/)?([\w-]+)$/;

export function parseInviteCode(
	input: string,
): { code: string; params: URLSearchParams } | null {
	try {
		const url = new URL(input.trim());
		if (!INVITE_HOST_RE.test(url.hostname)) return null;
		const m = INVITE_PATH_RE.exec(url.pathname);
		if (!m) return null;
		return { code: m[1], params: url.searchParams };
	} catch {
		return null;
	}
}
