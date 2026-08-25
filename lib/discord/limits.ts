export type LimitDef = {
	group: string;
	name: string;
	value: string;
	numeric?: number;
	note?: string;
};

export const TEXT_LIMITS: LimitDef[] = [
	// messages
	{ group: "messages", name: "Message", value: "2000", numeric: 2000 },
	{ group: "messages", name: "Nitro message", value: "4000", numeric: 4000 },
	{ group: "messages", name: "Webhook content", value: "2000", numeric: 2000 },
	// embeds
	{ group: "embeds", name: "Embed title", value: "256", numeric: 256 },
	{ group: "embeds", name: "Embed description", value: "4096", numeric: 4096 },
	{ group: "embeds", name: "Embed field name", value: "256", numeric: 256 },
	{ group: "embeds", name: "Embed field value", value: "1024", numeric: 1024 },
	{ group: "embeds", name: "Fields per embed", value: "25", numeric: 25 },
	{ group: "embeds", name: "Embed footer", value: "2048", numeric: 2048 },
	{ group: "embeds", name: "Embed author name", value: "256", numeric: 256 },
	{ group: "embeds", name: "Embed total", value: "6000", numeric: 6000 },
	{ group: "embeds", name: "Embeds per message", value: "10", numeric: 10 },
	// names
	{ group: "names", name: "Webhook username", value: "80", numeric: 80 },
	{ group: "names", name: "Display name", value: "32", numeric: 32 },
	{ group: "names", name: "Username", value: "32", numeric: 32 },
	{ group: "names", name: "Nickname", value: "32", numeric: 32 },
	{ group: "names", name: "Role name", value: "100", numeric: 100 },
	{ group: "names", name: "Channel name", value: "100", numeric: 100 },
	{ group: "names", name: "Channel topic", value: "1024", numeric: 1024 },
	{ group: "names", name: "Server name", value: "100", numeric: 100 },
	{ group: "names", name: "Server description", value: "120", numeric: 120 },
	{ group: "names", name: "Custom status", value: "128", numeric: 128 },
	{ group: "names", name: "About Me", value: "190", numeric: 190 },
	{ group: "names", name: "Emoji name", value: "32", numeric: 32, note: "min 2" },
	{ group: "names", name: "Sticker name", value: "30", numeric: 30, note: "min 2" },
	{ group: "names", name: "Slash command name", value: "32", numeric: 32, note: "min 1, lowercase" },
	{ group: "names", name: "Slash command description", value: "100", numeric: 100, note: "min 1" },
];

export const LIMITS: LimitDef[] = [
	...TEXT_LIMITS,
	// uploads
	{ group: "uploads", name: "Free upload", value: "10 MB", note: "per file" },
	{ group: "uploads", name: "Nitro Basic", value: "50 MB", note: "per file" },
	{ group: "uploads", name: "Nitro", value: "500 MB", note: "per file" },
	// servers
	{ group: "servers", name: "Emoji slots", value: "50 + 50", note: "static + animated" },
	{ group: "servers", name: "Emoji tier 1", value: "100 + 100", note: "boost level 1" },
	{ group: "servers", name: "Emoji tier 2", value: "150 + 150", note: "boost level 2" },
	{ group: "servers", name: "Emoji tier 3", value: "250 + 250", note: "boost level 3" },
	{ group: "servers", name: "Stickers", value: "60", note: "90/120/240 at boost tiers 1/2/3" },
	{ group: "servers", name: "Roles per server", value: "250" },
	{ group: "servers", name: "Channels per server", value: "500" },
	{ group: "servers", name: "Category groups", value: "50" },
	// voice
	{ group: "voice", name: "Bitrate tier 0", value: "64 kbps" },
	{ group: "voice", name: "Bitrate tier 1", value: "128 kbps" },
	{ group: "voice", name: "Bitrate tier 2", value: "256 kbps" },
	{ group: "voice", name: "Bitrate tier 3", value: "384 kbps" },
];
