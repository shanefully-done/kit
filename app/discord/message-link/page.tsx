"use client";

import React, { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Copy as CopyIcon,
	ExternalLink as ExternalLinkIcon,
	Link as LinkIcon,
} from "lucide-react";
import { formatDistanceToNowStrict } from "date-fns";
import Link from "next/link";
import { toast } from "sonner";
import ToolPageLayout from "@/components/ToolPageLayout";
import ToolHeader from "@/components/ToolHeader";
import { useI18n } from "@/lib/i18n";
import {
	buildMessageLink,
	parseInviteCode,
	parseMessageLink,
	type MessageLinkParts,
} from "@/lib/discord/parse";
import { decodeSnowflake } from "@/lib/discord/snowflake";

type ParsedResult =
	| { kind: "message"; parts: MessageLinkParts }
	| {
			kind: "invite";
			code: string;
			params: [string, string][];
	  }
	| null;

function parseUrlInput(input: string): ParsedResult {
	const trimmed = input.trim();
	if (!trimmed) return null;
	const message = parseMessageLink(trimmed);
	if (message) return { kind: "message", parts: message };
	const invite = parseInviteCode(trimmed);
	if (invite) return { kind: "invite", code: invite.code, params: Array.from(invite.params.entries()) };
	return null;
}

const MessageLinkPage = () => {
	const { t } = useI18n();

	const [tab, setTab] = useState("parse");
	const [parseInput, setParseInput] = useState("");
	const parsed = useMemo(() => parseUrlInput(parseInput), [parseInput]);
	const [buildGuild, setBuildGuild] = useState("");
	const [buildChannel, setBuildChannel] = useState("");
	const [buildMessage, setBuildMessage] = useState("");

	const copyToClipboard = (text: string) => {
		navigator.clipboard
			.writeText(text)
			.then(() => toast.success(t("common.copied")))
			.catch(() => toast.error(t("common.copyFailed")));
	};

	const handleTabChange = (value: string) => {
		setTab(value);
		setParseInput("");
		setBuildGuild("");
		setBuildChannel("");
		setBuildMessage("");
	};

	const channelError =
		buildChannel.trim() === "" ? t("tools.discordMessageLink.channelIdRequired") : "";
	const messageError = /^\d+$/.test(buildMessage.trim())
		? ""
		: t("tools.discordMessageLink.messageIdNumeric");
	const buildValid = !channelError && !messageError;
	const builtUrl = buildValid
		? buildMessageLink({
				guildId: buildGuild.trim() === "" ? "@me" : buildGuild.trim(),
				channelId: buildChannel.trim(),
				messageId: buildMessage.trim(),
		  })
		: "";

	return (
		<ToolPageLayout
			header={
				<ToolHeader
					icon={<LinkIcon aria-hidden className="h-5 w-5" />}
					title={t("tools.discordMessageLink.title")}
				/>
			}
			footer={
				<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
					LINKS WORK WITHOUT SPECIAL PERMISSIONS
				</p>
			}
		>
			<Tabs value={tab} onValueChange={handleTabChange} className="w-full">
				<TabsList>
					<TabsTrigger value="parse">
						{t("tools.discordMessageLink.tabParse")}
					</TabsTrigger>
					<TabsTrigger value="build">
						{t("tools.discordMessageLink.tabBuild")}
					</TabsTrigger>
				</TabsList>

				{/* ── PARSE ─────────────────────────────────────────────── */}
				<TabsContent value="parse" className="space-y-4 pt-2">
					<div className="grid w-full gap-2">
						<Input
							id="message-link-input"
							placeholder={t("tools.discordMessageLink.parsePlaceholder")}
							value={parseInput}
							onChange={(e) => setParseInput(e.target.value)}
							className="font-mono"
						/>
						{parseInput.trim() !== "" && parsed === null && (
							<p className="font-mono text-sm text-hazard-text">
								{t("tools.discordMessageLink.parseError")}
							</p>
						)}
					</div>

					{parsed?.kind === "message" ? (
						<MessageRows parts={parsed.parts} />
					) : null}

					{parsed?.kind === "invite" ? (
						<InviteRows code={parsed.code} params={parsed.params} />
					) : null}
				</TabsContent>

				{/* ── BUILD ─────────────────────────────────────────────── */}
				<TabsContent value="build" className="space-y-4 pt-2">
					<div className="grid w-full gap-2">
						<Label
							htmlFor="build-guild"
							className="font-mono text-[11px] uppercase tracking-[0.08em]"
						>
							{t("tools.discordMessageLink.buildGuildLabel")}
						</Label>
						<Input
							id="build-guild"
							placeholder={t("tools.discordMessageLink.buildGuildPlaceholder")}
							value={buildGuild}
							onChange={(e) => setBuildGuild(e.target.value)}
							className="font-mono"
						/>
					</div>

					<div className="grid w-full gap-2">
						<Label
							htmlFor="build-channel"
							className="font-mono text-[11px] uppercase tracking-[0.08em]"
						>
							{t("tools.discordMessageLink.buildChannelLabel")}
						</Label>
						<Input
							id="build-channel"
							value={buildChannel}
							onChange={(e) => setBuildChannel(e.target.value)}
							className="font-mono"
						/>
						{channelError && (
							<p className="font-mono text-sm text-hazard-text">{channelError}</p>
						)}
					</div>

					<div className="grid w-full gap-2">
						<Label
							htmlFor="build-message"
							className="font-mono text-[11px] uppercase tracking-[0.08em]"
						>
							{t("tools.discordMessageLink.buildMessageLabel")}
						</Label>
						<Input
							id="build-message"
							value={buildMessage}
							onChange={(e) => setBuildMessage(e.target.value)}
							className="font-mono"
						/>
						{messageError && (
							<p className="font-mono text-sm text-hazard-text">{messageError}</p>
						)}
					</div>

					{builtUrl ? (
						<div className="grid w-full gap-2">
							<Label
								htmlFor="build-output"
								className="font-mono text-[11px] uppercase tracking-[0.08em]"
							>
								URL
							</Label>
							<div className="flex items-center gap-2">
								<Input
									id="build-output"
									readOnly
									value={builtUrl}
									className="min-w-0 flex-1 truncate font-mono"
								/>
								<Button
									variant="outline"
									size="sm"
									onClick={() => copyToClipboard(builtUrl)}
								>
									<CopyIcon aria-hidden className="h-3.5 w-3.5" />
									{t("common.copy")}
								</Button>
								<a
									href={builtUrl}
									target="_blank"
									rel="noreferrer"
									aria-label={t("tools.discordMessageLink.openAria")}
									className="inline-flex h-9 items-center border border-ink px-3 hover:bg-muted"
								>
									<ExternalLinkIcon aria-hidden className="h-3.5 w-3.5" />
								</a>
							</div>
						</div>
					) : null}
				</TabsContent>
			</Tabs>
		</ToolPageLayout>
	);
};

/* ── Parse result rows ─────────────────────────────────────── */

function InfoRow({
	label,
	children,
}: {
	label: string;
	children: React.ReactNode;
}) {
	return (
		<div className="flex items-center justify-between gap-3 border border-ink px-3 py-2">
			<span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
				{label}
			</span>
			<div className="flex min-w-0 items-center gap-2">{children}</div>
		</div>
	);
}

function CopyButton({ value }: { value: string }) {
	const { t } = useI18n();
	return (
		<Button
			variant="outline"
			size="sm"
			aria-label={t("tools.discordMessageLink.copyAria")}
			onClick={() => {
				navigator.clipboard
					.writeText(value)
					.then(() => toast.success(t("common.copied")))
					.catch(() => toast.error(t("common.copyFailed")));
			}}
		>
			<CopyIcon aria-hidden className="h-3.5 w-3.5" />
		</Button>
	);
}

function OpenAnchor({ href }: { href: string }) {
	const { t } = useI18n();
	return (
		<a
			href={href}
			target="_blank"
			rel="noreferrer"
			aria-label={t("tools.discordMessageLink.openAria")}
			className="inline-flex h-9 shrink-0 items-center border border-ink px-3 hover:bg-muted"
		>
			<ExternalLinkIcon aria-hidden className="h-3.5 w-3.5" />
		</a>
	);
}

function MessageRows({
	parts,
}: {
	parts: MessageLinkParts;
}) {
	const { t } = useI18n();
	const decoded = useMemo(() => decodeSnowflake(parts.messageId), [parts.messageId]);
	const canonical = buildMessageLink(parts);
	const isDm = parts.guildId === "@me";

	return (
		<div className="space-y-2">
			<InfoRow label={t("tools.discordMessageLink.guildLabel")}>
				{isDm ? (
					<span className="truncate font-mono text-sm">
						{t("tools.discordMessageLink.dmLabel")}
					</span>
				) : (
					<>
						<span className="truncate font-mono text-sm">{parts.guildId}</span>
						<CopyButton value={parts.guildId} />
					</>
				)}
			</InfoRow>

			<InfoRow label={t("tools.discordMessageLink.channelLabel")}>
				<span className="truncate font-mono text-sm">{parts.channelId}</span>
				<CopyButton value={parts.channelId} />
			</InfoRow>

			<InfoRow label={t("tools.discordMessageLink.messageLabel")}>
				<span className="truncate font-mono text-sm">{parts.messageId}</span>
				<CopyButton value={parts.messageId} />
			</InfoRow>

			{decoded ? (
				<InfoRow label={t("tools.discordMessageLink.createdLabel")}>
					<span className="text-sm text-muted-foreground">
						{formatDistanceToNowStrict(decoded.createdAt, { addSuffix: true })}
					</span>
					<Link
						href={`/discord/snowflake?id=${parts.messageId}`}
						className="font-mono text-xs underline decoration-ink underline-offset-2 hover:text-muted-foreground"
					>
						{t("tools.discordMessageLink.decodeLink")}
					</Link>
				</InfoRow>
			) : null}

			<InfoRow label={t("tools.discordMessageLink.canonicalUrlLabel")}>
				<span className="truncate font-mono text-sm">{canonical}</span>
				<CopyButton value={canonical} />
				<OpenAnchor href={canonical} />
			</InfoRow>
		</div>
	);
}

function InviteRows({
	code,
	params,
}: {
	code: string;
	params: [string, string][];
}) {
	const { t } = useI18n();
	return (
		<div className="space-y-2">
			<InfoRow label={t("tools.discordMessageLink.codeLabel")}>
				<span className="truncate font-mono text-sm">{code}</span>
				<CopyButton value={code} />
			</InfoRow>
			{params.map(([key, value]) => (
				<InfoRow key={key} label={key.toUpperCase()}>
					<span className="truncate font-mono text-sm">{value}</span>
					<CopyButton value={value} />
				</InfoRow>
			))}
		</div>
	);
}

export default MessageLinkPage;
