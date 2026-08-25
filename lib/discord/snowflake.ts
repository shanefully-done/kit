export const DISCORD_EPOCH = 1420070400000; // 2015-01-01T00:00:00Z

export type SnowflakeData = {
	id: string;
	createdAt: Date;
	timestampMs: number;
	worker: number;
	process: number;
	increment: number;
	binary: string; // 64-char 0-padded
};

const SNOWFLAKE_RE = /^\d{17,20}$/;

export function isValidSnowflake(id: string): boolean {
	if (!SNOWFLAKE_RE.test(id)) return false;
	const ts = Number((BigInt(id) >> 22n) + BigInt(DISCORD_EPOCH));
	return ts >= DISCORD_EPOCH && ts <= Date.now() + 86400000;
}

export function decodeSnowflake(id: string): SnowflakeData | null {
	if (!SNOWFLAKE_RE.test(id)) return null;
	const n = BigInt(id);
	const timestampMs = Number((n >> 22n) + BigInt(DISCORD_EPOCH));
	if (timestampMs < DISCORD_EPOCH) return null;
	const worker = Number((n & 0x3E0000n) >> 17n);
	const process = Number((n & 0x1F000n) >> 12n);
	const increment = Number(n & 0xFFFn);
	return {
		id,
		createdAt: new Date(timestampMs),
		timestampMs,
		worker,
		process,
		increment,
		binary: n.toString(2).padStart(64, "0"),
	};
}

function clamp(val: number, bits: number): bigint {
	const mask = (1n << BigInt(bits)) - 1n;
	let v = BigInt(val) & mask;
	if (val < 0) v = 0n;
	return v;
}

export function encodeSnowflake(
	date: Date,
	worker = 0,
	process = 0,
	increment = 0,
): string {
	const ms = Math.floor(date.getTime());
	return (
		((BigInt(ms) - BigInt(DISCORD_EPOCH)) << 22n) |
		(clamp(worker, 5) << 17n) |
		(clamp(process, 5) << 12n) |
		clamp(increment, 12)
	).toString();
}

export function randomSnowflake(at: Date = new Date()): string {
	return encodeSnowflake(
		at,
		Math.floor(Math.random() * 32),
		Math.floor(Math.random() * 32),
		Math.floor(Math.random() * 4096),
	);
}
