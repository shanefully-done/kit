export type PermissionDef = {
	name: string;
	bit: bigint;
	group: "general" | "membership" | "text" | "voice" | "advanced";
	note?: string;
};

export const PERMISSIONS: PermissionDef[] = [
	{ name: "CREATE_INSTANT_INVITE", bit: 0x1n, group: "general" },
	{ name: "KICK_MEMBERS", bit: 0x2n, group: "membership" },
	{ name: "BAN_MEMBERS", bit: 0x4n, group: "membership" },
	{ name: "ADMINISTRATOR", bit: 0x8n, group: "advanced", note: "Bypasses all other checks" },
	{ name: "MANAGE_CHANNELS", bit: 0x10n, group: "general" },
	{ name: "MANAGE_GUILD", bit: 0x20n, group: "general" },
	{ name: "ADD_REACTIONS", bit: 0x40n, group: "text" },
	{ name: "VIEW_AUDIT_LOG", bit: 0x80n, group: "general" },
	{ name: "PRIORITY_SPEAKER", bit: 0x100n, group: "voice" },
	{ name: "STREAM", bit: 0x200n, group: "voice" },
	{ name: "VIEW_CHANNEL", bit: 0x400n, group: "general" },
	{ name: "SEND_MESSAGES", bit: 0x800n, group: "text" },
	{ name: "SEND_TTS_MESSAGES", bit: 0x1000n, group: "text" },
	{ name: "MANAGE_MESSAGES", bit: 0x2000n, group: "text" },
	{ name: "EMBED_LINKS", bit: 0x4000n, group: "text" },
	{ name: "ATTACH_FILES", bit: 0x8000n, group: "text" },
	{ name: "READ_MESSAGE_HISTORY", bit: 0x10000n, group: "text" },
	{ name: "MENTION_EVERYONE", bit: 0x20000n, group: "text" },
	{ name: "USE_EXTERNAL_EMOJIS", bit: 0x40000n, group: "text" },
	{ name: "VIEW_GUILD_INSIGHTS", bit: 0x80000n, group: "general" },
	{ name: "CONNECT", bit: 0x100000n, group: "voice" },
	{ name: "SPEAK", bit: 0x200000n, group: "voice" },
	{ name: "MUTE_MEMBERS", bit: 0x400000n, group: "voice" },
	{ name: "DEAFEN_MEMBERS", bit: 0x800000n, group: "voice" },
	{ name: "MOVE_MEMBERS", bit: 0x1000000n, group: "voice" },
	{ name: "USE_VAD", bit: 0x2000000n, group: "voice", note: "Voice activity detection" },
	{ name: "CHANGE_NICKNAME", bit: 0x4000000n, group: "membership" },
	{ name: "MANAGE_NICKNAMES", bit: 0x8000000n, group: "membership" },
	{ name: "MANAGE_ROLES", bit: 0x10000000n, group: "membership" },
	{ name: "MANAGE_WEBHOOKS", bit: 0x20000000n, group: "advanced" },
	{ name: "MANAGE_GUILD_EXPRESSIONS", bit: 0x40000000n, group: "general", note: "Emojis, stickers, soundboard" },
	{ name: "USE_APPLICATION_COMMANDS", bit: 0x80000000n, group: "text" },
	{ name: "REQUEST_TO_SPEAK", bit: 0x100000000n, group: "voice" },
	{ name: "MANAGE_EVENTS", bit: 0x200000000n, group: "general" },
	{ name: "MANAGE_THREADS", bit: 0x400000000n, group: "text" },
	{ name: "CREATE_PUBLIC_THREADS", bit: 0x800000000n, group: "text" },
	{ name: "CREATE_PRIVATE_THREADS", bit: 0x1000000000n, group: "text" },
	{ name: "USE_EXTERNAL_STICKERS", bit: 0x2000000000n, group: "text" },
	{ name: "SEND_MESSAGES_IN_THREADS", bit: 0x4000000000n, group: "text" },
	{ name: "USE_EMBEDDED_ACTIVITIES", bit: 0x8000000000n, group: "voice" },
	{ name: "MODERATE_MEMBERS", bit: 0x10000000000n, group: "membership" },
	{ name: "VIEW_CREATOR_MONETIZATION_ANALYTICS", bit: 0x20000000000n, group: "general" },
	{ name: "USE_SOUNDBOARD", bit: 0x40000000000n, group: "voice" },
	{ name: "CREATE_GUILD_EXPRESSIONS", bit: 0x80000000000n, group: "general" },
	{ name: "CREATE_EVENTS", bit: 0x100000000000n, group: "general" },
	{ name: "USE_EXTERNAL_SOUNDS", bit: 0x200000000000n, group: "voice" },
	{ name: "SEND_VOICE_MESSAGES", bit: 0x400000000000n, group: "text" },
	{ name: "SEND_POLLS", bit: 0x800000000000n, group: "text" },
	{ name: "USE_EXTERNAL_APPS", bit: 0x1000000000000n, group: "general" },
];

export const ADMINISTRATOR_BIT = 0x8n;

export function listPermissions(bitfield: bigint): PermissionDef[] {
	if (bitfield & ADMINISTRATOR_BIT) return PERMISSIONS;
	return PERMISSIONS.filter(p => (bitfield & p.bit) !== 0n);
}

export function toBitfield(names: string[]): bigint {
	let bf = 0n;
	for (const name of names) {
		const p = PERMISSIONS.find(e => e.name === name);
		if (p) bf |= p.bit;
	}
	return bf;
}
