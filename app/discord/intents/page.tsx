"use client";

import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy as CopyIcon, Radio as RadioIcon } from "lucide-react";
import ToolPageLayout from "@/components/ToolPageLayout";
import ToolHeader from "@/components/ToolHeader";
import { useI18n } from "@/lib/i18n";
import {
	INTENTS,
	listIntents,
	toIntentsBitfield,
	discordJsSnippet,
	discordPySnippet,
	type IntentDef,
} from "@/lib/discord/intents";
import { toast } from "sonner";

const INTENT_BY_NAME: Record<string, IntentDef> = Object.fromEntries(
	INTENTS.map((intent) => [intent.name, intent]),
);
type GroupLabelKey =
	| "tools.discordIntents.groupGuild"
	| "tools.discordIntents.groupMessages"
	| "tools.discordIntents.groupDirectMessages"
	| "tools.discordIntents.groupScheduling";

const GROUPS: { labelKey: GroupLabelKey; names: string[] }[] = [
	{
		labelKey: "tools.discordIntents.groupGuild",
		names: [
			"Guilds",
			"GuildMembers",
			"GuildModeration",
			"GuildExpressions",
			"GuildIntegrations",
			"GuildWebhooks",
			"GuildInvites",
			"GuildVoiceStates",
			"GuildPresences",
			"GuildMessages",
			"MessageReactions",
			"GuildMessageTyping",
		],
	},
	{
		labelKey: "tools.discordIntents.groupMessages",
		names: ["MessageContent"],
	},
	{
		labelKey: "tools.discordIntents.groupDirectMessages",
		names: ["DirectMessages", "DirectMessageReactions", "DirectMessageTyping"],
	},
	{
		labelKey: "tools.discordIntents.groupScheduling",
		names: [
			"GuildScheduledEvents",
			"AutoModerationExecution",
			"GuildMessagePolls",
		],
	},
];

const parseBitfieldInput = (raw: string): bigint | null => {
	const value = raw.trim();
	if (value === "") return 0n;
	const hexMatch = /^0[xX]([0-9a-fA-F]+)$/.exec(value);
	if (hexMatch) {
		try {
			return BigInt(`0x${hexMatch[1]}`);
		} catch {
			return null;
		}
	}
	if (/^\d+$/.test(value)) {
		try {
			return BigInt(value);
		} catch {
			return null;
		}
	}
	return null;
};

const IntentsCalculatorPage = () => {
	const { t } = useI18n();
	const [selectedNames, setSelectedNames] = useState<string[]>([]);
	const [bitfieldText, setBitfieldText] = useState("0");
	const [snippetTab, setSnippetTab] = useState("discordjs");

	const bitfield = toIntentsBitfield(selectedNames);
	const decDisplay = bitfield.toLocaleString("en-US");
	const hexDisplay = `0x${bitfield.toString(16).toUpperCase()}`;
	const jsSnippet = discordJsSnippet(selectedNames);
	const pySnippet = discordPySnippet(selectedNames);

	const toggleIntent = (name: string) => {
		setSelectedNames((prev) => {
			const next = prev.includes(name)
				? prev.filter((n) => n !== name)
				: [...prev, name];
			setBitfieldText(toIntentsBitfield(next).toString());
			return next;
		});
	};

	const handleBitfieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setBitfieldText(value);
		const parsed = parseBitfieldInput(value);
		if (parsed === null) return; // invalid input leaves selection as-is
		setSelectedNames(listIntents(parsed).map((i) => i.name));
	};

	const copyToClipboard = (text: string, what: string) => {
		navigator.clipboard
			.writeText(text)
			.then(() => {
				toast.success(t("common.copiedType", { what }));
			})
			.catch(() => {
				toast.error(t("common.copyFailed"));
			});
	};

	return (
		<ToolPageLayout
			header={
				<ToolHeader
					icon={<RadioIcon aria-hidden className="h-5 w-5" />}
					title={t("tools.discordIntents.title")}
				/>
			}
		>
			<div className="grid w-full gap-6 lg:grid-cols-2">
				{/* Left panel — grouped intent checkboxes */}
				<div className="space-y-4">
					{GROUPS.map((group) => (
						<div key={group.labelKey}>
							<p className="mb-2 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
								{t(group.labelKey)}
							</p>
							<div className="space-y-1.5 border border-ink bg-muted/40 p-3">
								{group.names.map((name) => {
									const intent = INTENT_BY_NAME[name];
									if (!intent) return null;
									return (
										<label
											key={name}
											className="flex cursor-pointer items-center gap-2.5 py-0.5"
										>
											<Checkbox
												checked={selectedNames.includes(name)}
												onCheckedChange={() => toggleIntent(name)}
												aria-label={name}
											/>
											<span className="font-mono text-sm">{name}</span>
											{intent.privileged && (
												<Badge
													variant="outline"
													className="border-hazard bg-card text-hazard-text"
												>
													{t("tools.discordIntents.privilegedBadge")}
												</Badge>
											)}
										</label>
									);
								})}
							</div>
						</div>
					))}
				</div>

				{/* Right panel — bitfield I/O + snippets */}
				<div className="space-y-4">
					<div className="grid w-full items-center gap-2">
						<label
							htmlFor="intents-bitfield"
							className="font-mono text-[11px] uppercase tracking-[0.08em]"
						>
							BITFIELD
						</label>
						<Input
							id="intents-bitfield"
							className="font-mono"
							placeholder={t("tools.discordIntents.bitfieldPlaceholder")}
							value={bitfieldText}
							onChange={handleBitfieldChange}
						/>
					</div>

					<div className="space-y-3 border-t border-ink pt-4">
						<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
							{t("tools.discordIntents.outputLabel")}
						</p>
						<div>
							<p className="mb-1 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
								{t("tools.discordIntents.decimalLabel")}
							</p>
							<div className="flex items-center justify-between gap-2 border border-ink bg-muted/40 px-3 py-3">
								<span className="break-all font-mono text-lg md:text-xl">
									{decDisplay}
								</span>
								<Button
									variant="outline"
									size="icon"
									onClick={() =>
										copyToClipboard(
											bitfield.toString(),
											t("tools.discordIntents.copiedBitfield"),
										)
									}
									aria-label={t("tools.discordIntents.copyAria", {
										value: t("tools.discordIntents.decimalLabel"),
									})}
								>
									<CopyIcon className="h-4 w-4" aria-hidden />
								</Button>
							</div>
						</div>
						<div>
							<p className="mb-1 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
								{t("tools.discordIntents.hexLabel")}
							</p>
							<div className="flex items-center justify-between gap-2 border border-ink bg-muted/40 px-3 py-3">
								<span className="break-all font-mono text-lg md:text-xl">
									{hexDisplay}
								</span>
								<Button
									variant="outline"
									size="icon"
									onClick={() =>
										copyToClipboard(
											hexDisplay,
											t("tools.discordIntents.copiedBitfield"),
										)
									}
									aria-label={t("tools.discordIntents.copyAria", {
										value: t("tools.discordIntents.hexLabel"),
									})}
								>
									<CopyIcon className="h-4 w-4" aria-hidden />
								</Button>
							</div>
						</div>
					</div>

					<Tabs value={snippetTab} onValueChange={setSnippetTab}>
						<TabsList>
							<TabsTrigger value="discordjs">
								{t("tools.discordIntents.discordJsTab")}
							</TabsTrigger>
							<TabsTrigger value="discordpy">
								{t("tools.discordIntents.discordPyTab")}
							</TabsTrigger>
						</TabsList>
						<TabsContent value="discordjs">
							<div className="relative border border-ink bg-muted/40">
								<Button
									variant="outline"
									size="icon"
									className="absolute right-2 top-2"
									onClick={() =>
										copyToClipboard(
											jsSnippet,
											t("tools.discordIntents.copiedSnippet"),
										)
									}
									aria-label={t("tools.discordIntents.copyAria", {
										value: t("tools.discordIntents.discordJsTab"),
									})}
								>
									<CopyIcon className="h-4 w-4" aria-hidden />
								</Button>
								<pre className="overflow-x-auto p-3 pr-12 font-mono text-xs leading-relaxed">
									{jsSnippet}
								</pre>
							</div>
						</TabsContent>
						<TabsContent value="discordpy">
							<div className="relative border border-ink bg-muted/40">
								<Button
									variant="outline"
									size="icon"
									className="absolute right-2 top-2"
									onClick={() =>
										copyToClipboard(
											pySnippet,
											t("tools.discordIntents.copiedSnippet"),
										)
									}
									aria-label={t("tools.discordIntents.copyAria", {
										value: t("tools.discordIntents.discordPyTab"),
									})}
								>
									<CopyIcon className="h-4 w-4" aria-hidden />
								</Button>
								<pre className="overflow-x-auto p-3 pr-12 font-mono text-xs leading-relaxed">
									{pySnippet}
								</pre>
							</div>
						</TabsContent>
					</Tabs>

					<div className="border-t border-ink pt-4">
						<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-hazard-text">
							DISCORD INTENTS CALCULATOR
						</p>
					</div>
				</div>
			</div>
		</ToolPageLayout>
	);
};

export default IntentsCalculatorPage;
