export type IntentDef = { name: string; bit: bigint; privileged: boolean };

export const INTENTS: IntentDef[] = [
	{ name: "Guilds", bit: 1n << 0n, privileged: false },
	{ name: "GuildMembers", bit: 1n << 1n, privileged: true },
	{ name: "GuildModeration", bit: 1n << 2n, privileged: false },
	{ name: "GuildExpressions", bit: 1n << 3n, privileged: false },
	{ name: "GuildIntegrations", bit: 1n << 4n, privileged: false },
	{ name: "GuildWebhooks", bit: 1n << 5n, privileged: false },
	{ name: "GuildInvites", bit: 1n << 6n, privileged: false },
	{ name: "GuildVoiceStates", bit: 1n << 7n, privileged: false },
	{ name: "GuildPresences", bit: 1n << 8n, privileged: true },
	{ name: "GuildMessages", bit: 1n << 9n, privileged: false },
	{ name: "MessageReactions", bit: 1n << 10n, privileged: false },
	{ name: "GuildMessageTyping", bit: 1n << 11n, privileged: false },
	{ name: "DirectMessages", bit: 1n << 12n, privileged: false },
	{ name: "DirectMessageReactions", bit: 1n << 13n, privileged: false },
	{ name: "DirectMessageTyping", bit: 1n << 14n, privileged: false },
	{ name: "MessageContent", bit: 1n << 15n, privileged: true },
	{ name: "GuildScheduledEvents", bit: 1n << 16n, privileged: false },
	{ name: "AutoModerationExecution", bit: 1n << 17n, privileged: false },
	{ name: "GuildMessagePolls", bit: 1n << 18n, privileged: false },
];

export function listIntents(bitfield: bigint): IntentDef[] {
	return INTENTS.filter(i => (bitfield & i.bit) !== 0n);
}

export function toIntentsBitfield(names: string[]): bigint {
	let bf = 0n;
	for (const name of names) {
		const def = INTENTS.find(e => e.name === name);
		if (def) bf |= def.bit;
	}
	return bf;
}

const toSnakeCase = (s: string): string =>
	s.replace(/[A-Z]/g, (m, i) => (i === 0 ? m.toLowerCase() : `_${m.toLowerCase()}`));

export function discordJsSnippet(names: string[]): string {
	const lines = names
		.filter(n => INTENTS.some(d => d.name === n))
		.map(n => `		GatewayIntentBits.${n},`);
	if (lines.length === 0) {
		return 'import { Client, GatewayIntentBits } from "discord.js";\n\nconst client = new Client({\n\tintents: [\n\t\t// no intents selected\n\t],\n});';
	}
	return `import { Client, GatewayIntentBits } from "discord.js";\n\nconst client = new Client({\n\tintents: [\n${lines.join("\n")}\n\t],\n});`;
}

export function discordPySnippet(names: string[]): string {
	const filtered = names.filter(n => INTENTS.some(d => d.name === n));
	if (filtered.length === 0) {
		return 'import discord\n\nintents = discord.Intents.none()';
	}
	const lines = filtered.map(n => `	${toSnakeCase(n)}=True,`);
	return `import discord\n\nintents = discord.Intents(\n${lines.join("\n")}\n)`;
}
