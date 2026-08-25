const CDN_BASE = "https://cdn.discordapp.com";

export const EMOJI_SIZES = [16, 32, 64, 128] as const;
export const AVATAR_SIZES = [16, 32, 64, 128, 256, 512, 1024, 2048, 4096] as const;

function emptyIfBlank(s: string): string {
	if (!s || !s.trim()) return "";
	return s;
}

type FormatOpt = {
	format?: "png" | "jpg" | "webp" | "gif" | "auto";
	size?: number;
};

function sizeParam(size: number | undefined, allowed: readonly number[]): string {
	if (size === undefined) return "";
	if ((allowed as readonly number[]).includes(size)) return `?size=${size}`;
	return "";
}

function resolveFormat(
	hash: string,
	opts: FormatOpt | undefined,
): string {
	if (!opts?.format || opts.format === "auto") {
		return hash.startsWith("a_") ? "gif" : "png";
	}
	return opts.format;
}

export function emojiUrl(
	id: string,
	opts?: { animated?: boolean; size?: number },
): string {
	id = emptyIfBlank(id);
	if (!id) return "";
	const ext = opts?.animated ? "gif" : "png";
	return `${CDN_BASE}/emojis/${id}.${ext}${sizeParam(opts?.size, EMOJI_SIZES)}`;
}

export function avatarUrl(
	userId: string,
	hash: string,
	opts?: FormatOpt,
): string {
	userId = emptyIfBlank(userId);
	hash = emptyIfBlank(hash);
	if (!userId || !hash) return "";
	const fmt = resolveFormat(hash, opts);
	return `${CDN_BASE}/avatars/${userId}/${hash}.${fmt}${sizeParam(opts?.size, AVATAR_SIZES)}`;
}

export function defaultAvatarUrl(userId: string): string {
	userId = emptyIfBlank(userId);
	if (!userId) return "";
	return `${CDN_BASE}/embed/avatars/${Number(BigInt(userId) % 6n)}.png`;
}

export function bannerUrl(
	userId: string,
	hash: string,
	opts?: FormatOpt,
): string {
	userId = emptyIfBlank(userId);
	hash = emptyIfBlank(hash);
	if (!userId || !hash) return "";
	const fmt = resolveFormat(hash, opts);
	return `${CDN_BASE}/banners/${userId}/${hash}.${fmt}${sizeParam(opts?.size, AVATAR_SIZES)}`;
}

export function guildIconUrl(
	guildId: string,
	hash: string,
	opts?: FormatOpt,
): string {
	guildId = emptyIfBlank(guildId);
	hash = emptyIfBlank(hash);
	if (!guildId || !hash) return "";
	const fmt = resolveFormat(hash, opts);
	return `${CDN_BASE}/icons/${guildId}/${hash}.${fmt}${sizeParam(opts?.size, AVATAR_SIZES)}`;
}

export function stickerUrl(stickerId: string): string {
	stickerId = emptyIfBlank(stickerId);
	if (!stickerId) return "";
	return `${CDN_BASE}/stickers/${stickerId}.png`;
}
