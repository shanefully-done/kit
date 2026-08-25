"use client";

import React, { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { format } from "date-fns";
import { Copy as CopyIcon, ExternalLink as ExternalLinkIcon, UserPlus as UserPlusIcon, Wand2 as Wand2Icon } from "lucide-react";
import { toast } from "sonner";
import ToolPageLayout from "@/components/ToolPageLayout";
import ToolHeader from "@/components/ToolHeader";
import { useI18n } from "@/lib/i18n";
import {
	decodeSnowflake,
	isValidSnowflake,
} from "@/lib/discord/snowflake";

const OAUTH_BASE_URL = "https://discord.com/oauth2/authorize";

const SCOPES = [
	"bot",
	"applications.commands",
	"identify",
	"connections",
	"email",
	"guilds",
	"guilds.join",
	"gdm.join",
	"webhooks.incoming",
	"rpc",
] as const;

const KNOWN_PARAMS = [
	"client_id",
	"scope",
	"permissions",
	"guild_id",
	"disable_guild_select",
	"redirect_uri",
	"response_type",
] as const;

const InviteUrlBuilderPage = () => {
	const { t } = useI18n();

	const [activeTab, setActiveTab] = useState("build");

	const [clientId, setClientId] = useState("");
	const [checkedScopes, setCheckedScopes] = useState<string[]>([]);
	const [permissions, setPermissions] = useState("");
	const [guildId, setGuildId] = useState("");
	const [disableGuildSelect, setDisableGuildSelect] = useState(false);
	const [redirectUri, setRedirectUri] = useState("");
	const [responseType, setResponseType] = useState("code");

	const [parseInput, setParseInput] = useState("");
	const [unknownParams, setUnknownParams] = useState<string[]>([]);

	const toggleScope = (scope: string, checked: boolean) => {
		setCheckedScopes((prev) =>
			checked ? [...prev, scope] : prev.filter((s) => s !== scope),
		);
	};

	const assembledUrl = useMemo(() => {
		const params = new URLSearchParams();
		if (clientId.trim()) params.set("client_id", clientId.trim());
		if (checkedScopes.length > 0) params.set("scope", checkedScopes.join(" "));
		if (permissions.trim()) params.set("permissions", permissions.trim());
		if (guildId.trim()) params.set("guild_id", guildId.trim());
		if (disableGuildSelect) params.set("disable_guild_select", "true");
		if (redirectUri.trim()) params.set("redirect_uri", redirectUri.trim());
		params.set("response_type", responseType);
		return `${OAUTH_BASE_URL}?${params.toString()}`;
	}, [
		clientId,
		checkedScopes,
		permissions,
		guildId,
		disableGuildSelect,
		redirectUri,
		responseType,
	]);

	const clientIdValid = isValidSnowflake(clientId);
	const decodedClient =
		clientIdValid ? decodeSnowflake(clientId) : null;

	const copyUrl = () => {
		navigator.clipboard
			.writeText(assembledUrl)
			.then(() => {
				toast.success(
					t("common.copiedType", {
						what: t("tools.discordInvite.inviteUrl"),
					}),
				);
			})
			.catch(() => {
				toast.error(t("common.copyFailed"));
			});
	};

	const handleParse = () => {
		let url: URL;
		try {
			url = new URL(parseInput.trim());
		} catch {
			toast.error(t("common.copyFailed"));
			return;
		}

		const known: Record<string, string> = {};
		const unknown: string[] = [];
		url.searchParams.forEach((value, key) => {
			if ((KNOWN_PARAMS as readonly string[]).includes(key)) {
				known[key] = value;
			} else {
				unknown.push(`${key}=${value}`);
			}
		});

		setClientId(known.client_id ?? "");
		setCheckedScopes(known.scope ? known.scope.split(" ").filter(Boolean) : []);
		setPermissions(known.permissions ?? "");
		setGuildId(known.guild_id ?? "");
		setDisableGuildSelect(
			(known.disable_guild_select ?? "").toLowerCase() === "true",
		);
		setRedirectUri(known.redirect_uri ?? "");
		setResponseType(
			known.response_type === "token" ? "token" : "code",
		);
		setUnknownParams(unknown);

		setActiveTab("build");
	};

	return (
		<ToolPageLayout
			header={
				<ToolHeader
					icon={<UserPlusIcon aria-hidden className="h-5 w-5" />}
					title={t("tools.discordInvite.title")}
				/>
			}
		>
			<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
				<span className="sr-only">{t("tools.discordInvite.srTabsDescription")}</span>
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="build">
						{t("tools.discordInvite.buildTab")}
					</TabsTrigger>
					<TabsTrigger value="parse">
						{t("tools.discordInvite.parseTab")}
					</TabsTrigger>
				</TabsList>

				<TabsContent value="build" className="mt-4 space-y-5">
					{/* CLIENT ID */}
					<div className="space-y-2">
						<label
							htmlFor="invite-client-id"
							className="font-mono text-[11px] uppercase tracking-[0.08em]"
						>
							{t("tools.discordInvite.clientIdLabel")}
						</label>
						<Input
							id="invite-client-id"
							className="font-mono"
							value={clientId}
							onChange={(e) => setClientId(e.target.value)}
						/>
						{clientId !== "" && !clientIdValid && (
							<p className="font-mono text-sm text-hazard-text">
								{t("tools.discordInvite.invalidSnowflake")}
							</p>
						)}
						{decodedClient && (
							<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
								{t("tools.discordInvite.snowflakeCreated", {
									date: format(decodedClient.createdAt, "yyyy-MM-dd HH:mm:ss"),
								})}
							</p>
						)}
					</div>

					{/* SCOPES */}
					<div className="space-y-2">
						<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
							{t("tools.discordInvite.scopesLabel")}
						</p>
						<div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
							{SCOPES.map((scope) => (
								<label
									key={scope}
									htmlFor={`invite-scope-${scope}`}
									className="flex cursor-pointer items-center gap-2 border border-ink px-3 py-2"
								>
									<Checkbox
										id={`invite-scope-${scope}`}
										checked={checkedScopes.includes(scope)}
										onCheckedChange={(checked) =>
											toggleScope(scope, checked === true)
										}
									/>
									<span className="font-mono text-xs break-all">{scope}</span>
								</label>
							))}
						</div>
					</div>

					{/* PERMISSIONS */}
					<div className="space-y-2">
						<label
							htmlFor="invite-permissions"
							className="font-mono text-[11px] uppercase tracking-[0.08em]"
						>
							{t("tools.discordInvite.permissionsLabel")}
						</label>
						<div className="flex items-center gap-2">
							<Input
								id="invite-permissions"
								placeholder="0"
								className="font-mono flex-1"
								value={permissions}
								onChange={(e) => setPermissions(e.target.value)}
							/>
							<Select value="" onValueChange={() => undefined}>
								<SelectTrigger className="w-40" aria-label={t("tools.discordInvite.presetPlaceholder")}>
									<SelectValue placeholder={t("tools.discordInvite.presetPlaceholder")} />
								</SelectTrigger>
								<SelectContent />
							</Select>
						</div>
						<Link
							href="/discord/permissions"
							className="inline-block font-mono text-[10px] uppercase tracking-[0.08em] underline underline-offset-4 hover:text-hazard-text"
						>
							{t("tools.discordInvite.openPermissionsCalc")}
						</Link>
					</div>

					{/* GUILD ID */}
					<div className="space-y-2">
						<label
							htmlFor="invite-guild-id"
							className="font-mono text-[11px] uppercase tracking-[0.08em]"
						>
							{t("tools.discordInvite.guildIdLabel")}
						</label>
						<Input
							id="invite-guild-id"
							className="font-mono"
							value={guildId}
							onChange={(e) => setGuildId(e.target.value)}
						/>
					</div>

					{/* DISABLE GUILD SELECT */}
					<div className="flex items-center gap-3 border border-ink px-3 py-3">
						<Switch
							id="invite-disable-guild-select"
							checked={disableGuildSelect}
							onCheckedChange={(checked) => setDisableGuildSelect(checked)}
						/>
						<label
							htmlFor="invite-disable-guild-select"
							className="cursor-pointer font-mono text-[11px] uppercase tracking-[0.08em]"
						>
							{t("tools.discordInvite.disableGuildSelectLabel")}
						</label>
					</div>

					{/* REDIRECT URI */}
					<div className="space-y-2">
						<label
							htmlFor="invite-redirect-uri"
							className="font-mono text-[11px] uppercase tracking-[0.08em]"
						>
							{t("tools.discordInvite.redirectUriLabel")}
						</label>
						<Input
							id="invite-redirect-uri"
							className="font-mono"
							value={redirectUri}
							onChange={(e) => setRedirectUri(e.target.value)}
						/>
					</div>

					{/* RESPONSE TYPE */}
					<div className="space-y-2">
						<label
							htmlFor="invite-response-type-trigger"
							className="font-mono text-[11px] uppercase tracking-[0.08em]"
						>
							{t("tools.discordInvite.responseTypeLabel")}
						</label>
						<Select value={responseType} onValueChange={setResponseType}>
							<SelectTrigger id="invite-response-type-trigger" className="font-mono">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="code">code</SelectItem>
								<SelectItem value="token">token</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* OUTPUT */}
					<div className="border-t border-ink pt-4 space-y-3">
						<pre className="overflow-x-auto border border-ink bg-muted/40 p-3 font-mono text-xs break-all whitespace-pre-wrap">
							{assembledUrl}
						</pre>
						<div className="flex flex-wrap gap-2">
							<Button variant="outline" onClick={copyUrl}>
								<CopyIcon className="mr-2 h-4 w-4" aria-hidden />
								{t("tools.discordInvite.copyButton")}
							</Button>
							<Button asChild>
								<a href={assembledUrl} target="_blank" rel="noreferrer">
									<ExternalLinkIcon className="mr-2 h-4 w-4" aria-hidden />
									{t("tools.discordInvite.openButton")}
								</a>
							</Button>
						</div>
					</div>
				</TabsContent>

				<TabsContent value="parse" className="mt-4 space-y-4">
					<Textarea
						placeholder={t("tools.discordInvite.parsePlaceholder")}
						className="min-h-28 font-mono"
						value={parseInput}
						onChange={(e) => setParseInput(e.target.value)}
					/>
					<Button onClick={handleParse}>
						<Wand2Icon className="mr-2 h-4 w-4" aria-hidden />
						{t("tools.discordInvite.parseButton")}
					</Button>
					{unknownParams.length > 0 && (
						<div className="space-y-1">
							<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
								{t("tools.discordInvite.unknownParamsLabel")}
							</p>
							<pre className="overflow-x-auto border border-ink bg-muted/40 p-3 font-mono text-xs break-all whitespace-pre-wrap text-muted-foreground">
								{unknownParams.join("\n")}
							</pre>
						</div>
					)}
				</TabsContent>
			</Tabs>
		</ToolPageLayout>
	);
};

export default InviteUrlBuilderPage;
