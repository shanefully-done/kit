"use client";

import React, { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Webhook as WebhookIcon } from "lucide-react";
import { toast } from "sonner";
import ToolPageLayout from "@/components/ToolPageLayout";
import ToolHeader from "@/components/ToolHeader";
import { useI18n } from "@/lib/i18n";
import { avatarUrl, defaultAvatarUrl } from "@/lib/discord/cdn";

const WEBHOOK_URL_REGEX =
	/^https:\/\/(?:ptb\.|canary\.)?discord(?:app)?\.com\/api\/webhooks\/\d+\/[\w-]+$/;

const CONTENT_MAX = 2000;
const USERNAME_MAX = 80;
const EMBEDS_MAX = 10;

type InspectResult = {
	name: string;
	channelId: string;
	avatar: string;
};

type SendError =
	| { kind: "rateLimited"; seconds: number }
	| { kind: "response"; code: string; message: string };

type WebhookResource = {
	id?: unknown;
	name?: unknown;
	channel_id?: unknown;
	avatar?: unknown;
};

const WebhookSenderPage = () => {
	const { t } = useI18n();

	const [url, setUrl] = useState("");
	const [inspect, setInspect] = useState<InspectResult | null>(null);
	const [content, setContent] = useState("");
	const [username, setUsername] = useState("");
	const [avatarUrlInput, setAvatarUrlInput] = useState("");
	const [embedsJson, setEmbedsJson] = useState("");
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [sending, setSending] = useState(false);
	const [sendError, setSendError] = useState<SendError | null>(null);

	const urlValid = WEBHOOK_URL_REGEX.test(url);
	const showUrlError = url.length > 0 && !urlValid;

	const embedViolations = useMemo(() => {
		const trimmed = embedsJson.trim();
		if (!trimmed) return [] as string[];
		let parsed: unknown;
		try {
			parsed = JSON.parse(trimmed);
		} catch {
			return [t("tools.discordWebhook.embedsInvalidJson")];
		}
		if (!Array.isArray(parsed)) {
			return [t("tools.discordWebhook.embedsNotArray")];
		}
		if (parsed.length > EMBEDS_MAX) {
			return [
				t("tools.discordWebhook.embedsTooMany", { count: parsed.length }),
			];
		}
		return [];
	}, [embedsJson, t]);

	const hasPayload =
		content.trim() !== "" ||
		username.trim() !== "" ||
		avatarUrlInput.trim() !== "" ||
		embedsJson.trim() !== "";
	const canSend = urlValid && hasPayload && embedViolations.length === 0;

	const buildPayload = (): Record<string, unknown> => {
		const payload: Record<string, unknown> = {};
		if (content.trim() !== "") payload.content = content;
		if (username.trim() !== "") payload.username = username;
		if (avatarUrlInput.trim() !== "") payload.avatar_url = avatarUrlInput;
		if (embedsJson.trim() !== "") {
			try {
				payload.embeds = JSON.parse(embedsJson);
			} catch {
				// unreachable: send is blocked while embeds are invalid
			}
		}
		return payload;
	};

	const handleInspect = async () => {
		if (!urlValid) return;
		setInspect(null);
		try {
			const res = await fetch(url, { method: "GET" });
			if (!res.ok) {
				toast.error(
					t("tools.discordWebhook.errorResponse", {
						code: String(res.status),
						message: res.statusText,
					}),
				);
				return;
			}
			const body = (await res.json()) as WebhookResource;
			const id = typeof body.id === "string" ? body.id : "";
			const hash = typeof body.avatar === "string" ? body.avatar : "";
			setInspect({
				name: typeof body.name === "string" ? body.name : "",
				channelId:
					typeof body.channel_id === "string" ? body.channel_id : "",
				avatar: hash ? avatarUrl(id, hash) : defaultAvatarUrl(id),
			});
		} catch {
			toast.error(t("common.copyFailed"));
		}
	};

	const handleSend = async () => {
		if (!urlValid || !hasPayload) return;
		setSending(true);
		setSendError(null);
		try {
			const res = await fetch(url, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(buildPayload()),
			});
			if (res.status === 204) {
				toast.success(t("tools.discordWebhook.sent"));
				return;
			}
			let body: Record<string, unknown> = {};
			try {
				body = (await res.json()) as Record<string, unknown>;
			} catch {
				// empty or non-JSON error body
			}
			if (res.status === 429) {
				const seconds =
					typeof body.retry_after === "number"
						? body.retry_after
						: Number(body.retry_after) || 0;
				setSendError({ kind: "rateLimited", seconds });
				return;
			}
			setSendError({
				kind: "response",
				code:
					body.code !== undefined ? String(body.code) : String(res.status),
				message:
					typeof body.message === "string"
						? body.message
						: res.statusText,
			});
		} catch {
			toast.error(t("common.copyFailed"));
		} finally {
			setSending(false);
			setConfirmOpen(false);
		}
	};

	return (
		<ToolPageLayout
			header={
				<ToolHeader
					icon={<WebhookIcon aria-hidden className="h-5 w-5" />}
					title={t("tools.discordWebhook.title")}
				/>
			}
		>
			<div className="space-y-4">
				{/* Webhook URL */}
				<div className="grid w-full items-center gap-2">
					<label
						htmlFor="webhook-url"
						className="font-mono text-[11px] uppercase tracking-[0.08em]"
					>
						{t("tools.discordWebhook.urlLabel")}
					</label>
					<Input
						id="webhook-url"
						type="url"
						spellCheck={false}
						autoComplete="off"
						className="font-mono"
						value={url}
						onChange={(e) => setUrl(e.target.value)}
					/>
					{showUrlError && (
						<p className="font-mono text-sm text-hazard-text">
							{t("tools.discordWebhook.invalidWebhookUrl")}
						</p>
					)}
					<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
						{t("tools.discordWebhook.urlNotice")}
					</p>
					<div>
						<Button
							variant="outline"
							disabled={!urlValid}
							onClick={handleInspect}
						>
							{t("tools.discordWebhook.inspectButton")}
						</Button>
					</div>
				</div>

				{/* Inspection result */}
				{inspect && (
					<Card>
						<CardContent className="p-4">
							<pre className="overflow-x-auto font-mono text-xs">
								<span className="text-muted-foreground">
									{t("tools.discordWebhook.inspectName")}{" "}
								</span>
								{inspect.name || "-"}
								{"\n"}
								<span className="text-muted-foreground">
									{t("tools.discordWebhook.inspectChannel")}{" "}
								</span>
								{inspect.channelId || "-"}
								{"\n"}
								<span className="text-muted-foreground">
									{t("tools.discordWebhook.inspectAvatar")}{" "}
								</span>
								{inspect.avatar || "-"}
							</pre>
						</CardContent>
					</Card>
				)}

				{/* Message form */}
				<div className="grid w-full items-center gap-2">
					<label
						htmlFor="webhook-content"
						className="font-mono text-[11px] uppercase tracking-[0.08em]"
					>
						{t("tools.discordWebhook.contentLabel")}
					</label>
					<Textarea
						id="webhook-content"
						rows={4}
						value={content}
						onChange={(e) => setContent(e.target.value)}
					/>
					<p
						className={`text-right font-mono text-[11px]${
							content.length > CONTENT_MAX ? " text-hazard-text" : ""
						}`}
					>
						{content.length}/{CONTENT_MAX}
					</p>

					<label
						htmlFor="webhook-username"
						className="font-mono text-[11px] uppercase tracking-[0.08em]"
					>
						{t("tools.discordWebhook.usernameLabel")}
					</label>
					<Input
						id="webhook-username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>
					<p
						className={`text-right font-mono text-[11px]${
							username.length > USERNAME_MAX ? " text-hazard-text" : ""
						}`}
					>
						{username.length}/{USERNAME_MAX}
					</p>

					<label
						htmlFor="webhook-avatar-url"
						className="font-mono text-[11px] uppercase tracking-[0.08em]"
					>
						{t("tools.discordWebhook.avatarUrlLabel")}
					</label>
					<Input
						id="webhook-avatar-url"
						type="url"
						spellCheck={false}
						autoComplete="off"
						value={avatarUrlInput}
						onChange={(e) => setAvatarUrlInput(e.target.value)}
					/>

					<label
						htmlFor="webhook-embeds"
						className="font-mono text-[11px] uppercase tracking-[0.08em]"
					>
						{t("tools.discordWebhook.embedsLabel")}
					</label>
					<Textarea
						id="webhook-embeds"
						rows={6}
						spellCheck={false}
						className="font-mono"
						placeholder='[{"title": "..."}]'
						value={embedsJson}
						onChange={(e) => setEmbedsJson(e.target.value)}
					/>
					{embedViolations.map((violation) => (
						<p
							key={violation}
							className="font-mono text-xs text-hazard-text"
						>
							{violation}
						</p>
					))}
				</div>

				{/* Send */}
				<AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
					<Button
						variant="outline"
						className="border-hazard text-hazard-text hover:bg-hazard hover:text-paper"
						disabled={!canSend || sending}
						onClick={() => setConfirmOpen(true)}
					>
						{t("tools.discordWebhook.sendButton")}
					</Button>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>
								{t("tools.discordWebhook.confirmTitle")}
							</AlertDialogTitle>
							<AlertDialogDescription>
								{t("tools.discordWebhook.confirmDescription")}
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel disabled={sending}>
								{t("tools.discordWebhook.cancelButton")}
							</AlertDialogCancel>
							<AlertDialogAction onClick={handleSend}>
								{t("tools.discordWebhook.sendButton")}
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>

				{/* Response errors */}
				{sendError?.kind === "rateLimited" && (
					<Card className="border-hazard">
						<CardContent className="p-4">
							<p className="font-mono text-xs text-hazard-text">
								{t("tools.discordWebhook.rateLimited", {
									seconds: sendError.seconds,
								})}
							</p>
						</CardContent>
					</Card>
				)}
				{sendError?.kind === "response" && (
					<Card className="border-hazard">
						<CardContent className="p-4">
							<p className="font-mono text-xs text-hazard-text">
								{t("tools.discordWebhook.errorResponse", {
									code: sendError.code,
									message: sendError.message,
								})}
							</p>
						</CardContent>
					</Card>
				)}
			</div>
		</ToolPageLayout>
	);
};

export default WebhookSenderPage;
