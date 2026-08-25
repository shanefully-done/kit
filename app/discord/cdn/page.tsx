"use client";

import React, { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Copy as CopyIcon,
	ExternalLink as ExternalLinkIcon,
	Link2,
} from "lucide-react";
import { toast } from "sonner";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { ToolHeader } from "@/components/ToolHeader";
import { useI18n } from "@/lib/i18n";
import {
	AVATAR_SIZES,
	EMOJI_SIZES,
	avatarUrl,
	bannerUrl,
	defaultAvatarUrl,
	emojiUrl,
	guildIconUrl,
	stickerUrl,
} from "@/lib/discord/cdn";
import { extractMentions } from "@/lib/discord/parse";

const NUMERIC_RE = /^\d+$/;

type HashFormat = "auto" | "png" | "jpg" | "webp" | "gif";

const HASH_FORMATS: HashFormat[] = ["auto", "png", "jpg", "webp", "gif"];
function copyUrl(url: string, copiedMsg: string, failMsg: string) {
	navigator.clipboard
		.writeText(url)
		.then(() => toast.success(copiedMsg))
		.catch(() => toast.error(failMsg));
}

type OutputRowProps = {
	url: string;
	copyAria: string;
	openAria: string;
	onCopy: () => void;
};

function OutputRow({ url, copyAria, openAria, onCopy }: OutputRowProps) {
	return (
		<div className="border border-ink bg-muted/40 px-3 py-2 flex items-center gap-2">
			<Input
				readOnly
				value={url}
				tabIndex={-1}
				className="flex-1 border-0 bg-transparent px-0 font-mono text-xs text-ellipsis overflow-hidden focus-visible:ring-0"
			/>
			<Button
				variant="ghost"
				size="icon"
				disabled={!url}
				onClick={onCopy}
				aria-label={copyAria}
			>
				<CopyIcon className="h-4 w-4" aria-hidden />
			</Button>
			<Button variant="ghost" size="icon" asChild>
				<a
					href={url || undefined}
					target="_blank"
					rel="noreferrer"
					aria-label={openAria}
					className={url ? undefined : "pointer-events-none opacity-50"}
				>
					<ExternalLinkIcon className="h-4 w-4" aria-hidden />
				</a>
			</Button>
		</div>
	);
}


function FieldError({ message }: { message?: string }) {
	if (!message) return null;
	return <p className="font-mono text-[11px] text-hazard-text">{message}</p>;
}

function SizeSelect({
	value,
	onChange,
	sizes,
	label,
}: {
	value: number;
	onChange: (size: number) => void;
	sizes: readonly number[];
	label: string;
}) {
	return (
		<div className="grid gap-1">
			<Label>{label}</Label>
			<Select
				value={String(value)}
				onValueChange={(v) => onChange(Number(v))}
			>
				<SelectTrigger className="w-full font-mono">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					{sizes.map((s) => (
						<SelectItem key={s} value={String(s)} className="font-mono">
							{s}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}

function FormatSelect<T extends string>({
	value,
	onChange,
	options,
	disabledOptions,
	label,
}: {
	value: T;
	onChange: (format: T) => void;
	options: readonly T[];
	disabledOptions?: ReadonlySet<string>;
	label: string;
}) {
	return (
		<div className="grid gap-1">
			<Label>{label}</Label>
			<Select value={value} onValueChange={(v) => onChange(v as T)}>
				<SelectTrigger className="w-full font-mono">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					{options.map((f) => (
						<SelectItem
							key={f}
							value={f}
							disabled={disabledOptions?.has(f)}
							className="font-mono uppercase"
						>
							{f.toUpperCase()}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}

// ── Emoji tab ────────────────────────────────────────────────────────────────

function EmojiTab() {
	const { t } = useI18n();
	const [rawInput, setRawInput] = useState("");
	const [emojiId, setEmojiId] = useState("");
	const [name, setName] = useState("");
	const [nameLocked, setNameLocked] = useState(false);
	const [animated, setAnimated] = useState(false);
	const [useGif, setUseGif] = useState(false);
	const [size, setSize] = useState<number>(128);
	const [error, setError] = useState("");

	const handleChange = (value: string) => {
		setRawInput(value);
		if (value.trim() === "") {
			setEmojiId("");
			setName("");
			setNameLocked(false);
			setAnimated(false);
			setUseGif(false);
			setError("");
			return;
		}
		const emojiMention = extractMentions(value).find(
			(m) => m.type === "emoji",
		);
		if (emojiMention) {
			setEmojiId(emojiMention.id);
			setName(emojiMention.name ?? "");
			setNameLocked(true);
			setAnimated(Boolean(emojiMention.animated));
			setUseGif(Boolean(emojiMention.animated));
			setError("");
			return;
		}
		if (NUMERIC_RE.test(value.trim())) {
			setEmojiId(value.trim());
			setName("");
			setNameLocked(false);
			setAnimated(false);
			setUseGif(false);
			setError("");
			return;
		}
		setEmojiId("");
		setName("");
		setNameLocked(false);
		setAnimated(false);
		setUseGif(false);
		setError(t("tools.discordCdn.emojiParseError"));
	};

	const url = useMemo(
		() => (emojiId ? emojiUrl(emojiId, { animated: useGif, size }) : ""),
		[emojiId, useGif, size],
	);

	const markdown =
		emojiId && name ? `<${animated ? "a" : ""}:${name}:${emojiId}>` : "";

	return (
		<div className="space-y-4">
			<div className="grid gap-1">
				<Label htmlFor="cdn-emoji-input">
					{t("tools.discordCdn.emojiInputLabel")}
				</Label>
				<Input
					id="cdn-emoji-input"
					placeholder={t("tools.discordCdn.emojiInputPlaceholder")}
					value={rawInput}
					onChange={(e) => handleChange(e.target.value)}
					className="font-mono"
				/>
				<FieldError message={error} />
			</div>

			<div className="grid gap-1">
				<Label htmlFor="cdn-emoji-name">
					{t("tools.discordCdn.emojiNameLabel")}
				</Label>
				<Input
					id="cdn-emoji-name"
					value={name}
					readOnly={nameLocked}
					disabled={nameLocked}
					onChange={(e) => setName(e.target.value)}
					className="font-mono"
				/>
			</div>

			<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
				<FormatSelect
					label={t("tools.discordCdn.formatLabel")}
					value={useGif ? "gif" : "png"}
					onChange={(f) => setUseGif(f === "gif")}
					options={["png", "gif"] as const}
					disabledOptions={new Set(animated ? [] : ["gif"])}
				/>
				<SizeSelect
					label={t("tools.discordCdn.sizeLabel")}
					value={size}
					onChange={setSize}
					sizes={EMOJI_SIZES}
				/>
			</div>

			<OutputRow
				url={url}
				copyAria={t("tools.discordCdn.copyAria")}
				openAria={t("tools.discordCdn.openAria")}
				onCopy={() =>
					copyUrl(url, t("common.copied"), t("common.copyFailed"))
				}
			/>

			{markdown ? (
				<div className="space-y-1">
					<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
						{t("tools.discordCdn.chatMarkdownHint")}
					</p>
					<Badge variant="secondary" className="font-mono">
						{markdown}
					</Badge>
				</div>
			) : null}
		</div>
	);
}

// ── Shared hash-based asset tab (avatar / banner / guild icon) ──────────────

function HashAssetTab({
	idLabel,
	hashLabel,
	formats,
	build,
}: {
	idLabel: string;
	hashLabel: string;
	formats: readonly HashFormat[];
	build: (
		id: string,
		hash: string,
		opts: { format: HashFormat; size: number },
	) => string;
}) {
	const { t } = useI18n();
	const [id, setId] = useState("");
	const [hash, setHash] = useState("");
	const [format, setFormat] = useState<HashFormat>(formats[0]);
	const [size, setSize] = useState<number>(1024);

	const animatedHash = hash.startsWith("a_");
	const touched = id !== "" || hash !== "";

	const url = useMemo(
		() => (id && hash ? build(id, hash, { format, size }) : ""),
		[id, hash, format, size, build],
	);

	return (
		<div className="space-y-4">
			<div className="grid gap-1">
				<Label htmlFor={`cdn-id-${idLabel}`}>{idLabel}</Label>
				<Input
					id={`cdn-id-${idLabel}`}
					value={id}
					onChange={(e) => setId(e.target.value)}
					className="font-mono"
				/>
				{touched && !id ? (
					<FieldError message={t("tools.discordCdn.userIdRequired")} />
				) : null}
			</div>

			<div className="grid gap-1">
				<Label htmlFor={`cdn-hash-${idLabel}`}>{hashLabel}</Label>
				<Input
					id={`cdn-hash-${idLabel}`}
					value={hash}
					onChange={(e) => setHash(e.target.value)}
					className="font-mono"
				/>
				{touched && !hash ? (
					<FieldError message={t("tools.discordCdn.hashRequired")} />
				) : null}
			</div>

			<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
				<FormatSelect
					label={t("tools.discordCdn.formatLabel")}
					value={format}
					onChange={setFormat}
					options={formats}
					disabledOptions={
						animatedHash ? undefined : new Set(["gif"])
					}
				/>
				<SizeSelect
					label={t("tools.discordCdn.sizeLabel")}
					value={size}
					onChange={setSize}
					sizes={AVATAR_SIZES}
				/>
			</div>

			{touched && id && hash && !url ? (
				<FieldError message={t("tools.discordCdn.invalidInput")} />
			) : null}

			<OutputRow
				url={url}
				copyAria={t("tools.discordCdn.copyAria")}
				openAria={t("tools.discordCdn.openAria")}
				onCopy={() =>
					copyUrl(url, t("common.copied"), t("common.copyFailed"))
				}
			/>
		</div>
	);
}

// ── Default avatar tab ───────────────────────────────────────────────────────

function DefaultAvatarTab() {
	const { t } = useI18n();
	const [userId, setUserId] = useState("");

	const valid = NUMERIC_RE.test(userId);
	const url = useMemo(
		() => (valid ? defaultAvatarUrl(userId) : ""),
		[valid, userId],
	);

	return (
		<div className="space-y-4">
			<div className="grid gap-1">
				<Label htmlFor="cdn-default-avatar-user">
					{t("tools.discordCdn.userIdLabel")}
				</Label>
				<Input
					id="cdn-default-avatar-user"
					value={userId}
					onChange={(e) => setUserId(e.target.value)}
					className="font-mono"
				/>
				{userId !== "" && !valid ? (
					<FieldError message={t("tools.discordCdn.invalidInput")} />
				) : null}
			</div>

			<OutputRow
				url={url}
				copyAria={t("tools.discordCdn.copyAria")}
				openAria={t("tools.discordCdn.openAria")}
				onCopy={() =>
					copyUrl(url, t("common.copied"), t("common.copyFailed"))
				}
			/>

			<p className="font-mono text-[11px] uppercase tracking-[0.08em] text-hazard-text">
				{t("tools.discordCdn.defaultAvatarNote")}
			</p>
		</div>
	);
}

// ── Sticker tab ──────────────────────────────────────────────────────────────

function StickerTab() {
	const { t } = useI18n();
	const [stickerId, setStickerId] = useState("");

	const valid = NUMERIC_RE.test(stickerId);
	const url = stickerId && valid ? stickerUrl(stickerId) : "";

	return (
		<div className="space-y-4">
			<div className="grid gap-1">
				<Label htmlFor="cdn-sticker-id">
					{t("tools.discordCdn.stickerIdLabel")}
				</Label>
				<Input
					id="cdn-sticker-id"
					value={stickerId}
					onChange={(e) => setStickerId(e.target.value)}
					className="font-mono"
				/>
				{stickerId !== "" && !valid ? (
					<FieldError message={t("tools.discordCdn.invalidInput")} />
				) : null}
			</div>

			<OutputRow
				url={url}
				copyAria={t("tools.discordCdn.copyAria")}
				openAria={t("tools.discordCdn.openAria")}
				onCopy={() =>
					copyUrl(url, t("common.copied"), t("common.copyFailed"))
				}
			/>
		</div>
	);
}

// ── Page ─────────────────────────────────────────────────────────────────────

const CdnPage = () => {
	const { t } = useI18n();

	return (
		<ToolPageLayout
			header={
				<ToolHeader
					icon={<Link2 aria-hidden className="h-5 w-5" />}
					title={t("tools.discordCdn.title")}
				/>
			}
			footer={
				<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
					CDN LINKS DO NOT REQUIRE AUTHENTICATION
				</p>
			}
		>
			<Tabs defaultValue="emoji">
				<TabsList className="flex-wrap h-auto w-full justify-start">
					<TabsTrigger value="emoji">
						{t("tools.discordCdn.tabEmoji")}
					</TabsTrigger>
					<TabsTrigger value="avatar">
						{t("tools.discordCdn.tabAvatar")}
					</TabsTrigger>
					<TabsTrigger value="default-avatar">
						{t("tools.discordCdn.tabDefaultAvatar")}
					</TabsTrigger>
					<TabsTrigger value="banner">
						{t("tools.discordCdn.tabBanner")}
					</TabsTrigger>
					<TabsTrigger value="guild-icon">
						{t("tools.discordCdn.tabGuildIcon")}
					</TabsTrigger>
					<TabsTrigger value="sticker">
						{t("tools.discordCdn.tabSticker")}
					</TabsTrigger>
				</TabsList>

				<TabsContent value="emoji">
					<EmojiTab />
				</TabsContent>

				<TabsContent value="avatar">
					<HashAssetTab
						idLabel={t("tools.discordCdn.userIdLabel")}
						hashLabel={t("tools.discordCdn.avatarHashLabel")}
						formats={HASH_FORMATS}
						build={(userId, hash, opts) =>
							avatarUrl(userId, hash, {
								format: opts.format,
								size: opts.size,
							})
						}
					/>
				</TabsContent>

				<TabsContent value="default-avatar">
					<DefaultAvatarTab />
				</TabsContent>

				<TabsContent value="banner">
					<HashAssetTab
						idLabel={t("tools.discordCdn.userIdLabel")}
						hashLabel={t("tools.discordCdn.hashLabel")}
						formats={HASH_FORMATS}
						build={(userId, hash, opts) =>
							bannerUrl(userId, hash, {
								format: opts.format,
								size: opts.size,
							})
						}
					/>
				</TabsContent>

				<TabsContent value="guild-icon">
					<HashAssetTab
						idLabel={t("tools.discordCdn.guildIdLabel")}
						hashLabel={t("tools.discordCdn.hashLabel")}
						formats={HASH_FORMATS}
						build={(guildId, hash, opts) =>
							guildIconUrl(guildId, hash, {
								format: opts.format,
								size: opts.size,
							})
						}
					/>
				</TabsContent>

				<TabsContent value="sticker">
					<StickerTab />
				</TabsContent>
			</Tabs>
		</ToolPageLayout>
	);
};

export default CdnPage;
