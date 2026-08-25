"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
	ChevronDown as ChevronDownIcon,
	Copy as CopyIcon,
	ShieldCheck as ShieldCheckIcon,
} from "lucide-react";

import ToolPageLayout from "@/components/ToolPageLayout";
import ToolHeader from "@/components/ToolHeader";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	ADMINISTRATOR_BIT,
	PERMISSIONS,
	type PermissionDef,
	listPermissions,
	toBitfield,
} from "@/lib/discord/permissions";

type PermGroup = PermissionDef["group"];

const GROUP_ORDER: PermGroup[] = [
	"general",
	"membership",
	"text",
	"voice",
	"advanced",
];

type GroupLabelKey =
	| "tools.discordPermissions.groupGeneral"
	| "tools.discordPermissions.groupMembership"
	| "tools.discordPermissions.groupText"
	| "tools.discordPermissions.groupVoice"
	| "tools.discordPermissions.groupAdvanced";

const GROUP_LABEL_KEYS: Record<PermGroup, GroupLabelKey> = {
	general: "tools.discordPermissions.groupGeneral",
	membership: "tools.discordPermissions.groupMembership",
	text: "tools.discordPermissions.groupText",
	voice: "tools.discordPermissions.groupVoice",
	advanced: "tools.discordPermissions.groupAdvanced",
};

const BASIC_MEMBER_NAMES = [
	"VIEW_CHANNEL",
	"READ_MESSAGE_HISTORY",
	"SEND_MESSAGES",
	"EMBED_LINKS",
	"ATTACH_FILES",
	"ADD_REACTIONS",
	"USE_EXTERNAL_EMOJIS",
	"USE_EXTERNAL_STICKERS",
	"CONNECT",
	"SPEAK",
	"STREAM",
	"USE_VAD",
	"CHANGE_NICKNAME",
	"VIEW_GUILD_INSIGHTS",
	"SEND_MESSAGES_IN_THREADS",
	"CREATE_PUBLIC_THREADS",
	"CREATE_PRIVATE_THREADS",
	"USE_EMBEDDED_ACTIVITIES",
	"SEND_VOICE_MESSAGES",
	"SEND_POLLS",
	"USE_APPLICATION_COMMANDS",
];

const PRESET_MODERATOR_EXTRA = [
	"KICK_MEMBERS",
	"BAN_MEMBERS",
	"MANAGE_MESSAGES",
	"MANAGE_NICKNAMES",
	"MANAGE_THREADS",
	"MODERATE_MEMBERS",
	"MANAGE_EVENTS",
	"MENTION_EVERYONE",
	"CREATE_EVENTS",
	"SEND_TTS_MESSAGES",
	"REQUEST_TO_SPEAK",
];

type PresetLabelKey =
	| "tools.discordPermissions.presetAdministrator"
	| "tools.discordPermissions.presetBasicMember"
	| "tools.discordPermissions.presetModerator"
	| "tools.discordPermissions.presetReadOnly";

const PRESETS: {
	value: string;
	labelKey: PresetLabelKey;
	names: string[];
}[] = [
	{
		value: "administrator",
		labelKey: "tools.discordPermissions.presetAdministrator",
		names: ["ADMINISTRATOR"],
	},
	{
		value: "basic-member",
		labelKey: "tools.discordPermissions.presetBasicMember",
		names: BASIC_MEMBER_NAMES,
	},
	{
		value: "moderator",
		labelKey: "tools.discordPermissions.presetModerator",
		names: [...BASIC_MEMBER_NAMES, ...PRESET_MODERATOR_EXTRA],
	},
	{
		value: "read-only",
		labelKey: "tools.discordPermissions.presetReadOnly",
		names: ["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"],
	},
];

const ALL_NAMES = PERMISSIONS.map((p) => p.name);
const ALL_CHECKED = new Set(ALL_NAMES);

/** OR of every defined permission bit — anything outside this is unknown. */
const KNOWN_MASK = PERMISSIONS.reduce((acc, p) => acc | p.bit, 0n);

const GROUPS: { id: PermGroup; perms: PermissionDef[] }[] = GROUP_ORDER.map(
	(id) => ({ id, perms: PERMISSIONS.filter((p) => p.group === id) }),
);

function parseBitfieldInput(text: string): bigint | null {
	const trimmed = text.trim();
	if (!trimmed || trimmed.startsWith("-")) return null;
	try {
		return BigInt(trimmed);
	} catch {
		return null;
	}
}

function formatDec(value: bigint): string {
	return value.toLocaleString("en-US");
}

function formatHex(value: bigint): string {
	return "0x" + value.toString(16).toUpperCase();
}

const PermissionsCalculatorPage = () => {
	const { t } = useI18n();
	const [inputValue, setInputValue] = useState("");
	const [checkedNames, setCheckedNames] = useState<Set<string>>(new Set());
	const [presetValue, setPresetValue] = useState("");
	const [search, setSearch] = useState("");
	const [openGroups, setOpenGroups] = useState<Record<PermGroup, boolean>>({
		general: true,
		membership: true,
		text: true,
		voice: true,
		advanced: true,
	});

	const parsedBitfield = parseBitfieldInput(inputValue);
	const isAdmin =
		parsedBitfield !== null &&
		(parsedBitfield & ADMINISTRATOR_BIT) === ADMINISTRATOR_BIT;
	const unknownBits =
		parsedBitfield !== null ? parsedBitfield & ~KNOWN_MASK : 0n;

	// Administrator implies every permission: force-check the whole tree.
	const effectiveChecked = isAdmin ? ALL_CHECKED : checkedNames;

	const decText = parsedBitfield !== null ? formatDec(parsedBitfield) : "";
	const hexText = parsedBitfield !== null ? formatHex(parsedBitfield) : "";

	const syncFromBitfield = (value: bigint, text: string) => {
		setInputValue(text);
		setCheckedNames(
			new Set(listPermissions(value).map((p) => p.name)),
		);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const raw = e.target.value;
		setPresetValue("");
		const value = parseBitfieldInput(raw);
		if (value === null) {
			// Not valid yet — keep checkbox state until it parses.
			setInputValue(raw);
			return;
		}
		syncFromBitfield(value, raw);
	};

	const handlePresetChange = (value: string) => {
		const preset = PRESETS.find((p) => p.value === value);
		if (!preset) return;
		setPresetValue(value);
		const bitfield = toBitfield(preset.names);
		syncFromBitfield(bitfield, formatHex(bitfield));
	};

	const handleToggle = (name: string, checked: boolean) => {
		if (isAdmin) return;
		const next = new Set(checkedNames);
		if (name === "ADMINISTRATOR" && checked) {
			// Administrator implies all permissions.
			for (const n of ALL_NAMES) next.add(n);
		} else if (checked) {
			next.add(name);
		} else {
			next.delete(name);
		}
		setCheckedNames(next);
		setPresetValue("");
		setInputValue(toBitfield([...next]).toString());
	};

	const copyValue = (value: string) => {
		navigator.clipboard.writeText(value).then(
			() =>
				toast.success(
					t("common.copiedType", {
						what: t("tools.discordPermissions.copiedBitfield"),
					}),
				),
			() => toast.error(t("common.copyFailed")),
		);
	};

	const query = search.trim().toLowerCase();

	const renderCopyButton = (value: string) => (
		<Button
			variant="outline"
			size="icon"
			disabled={!value}
			onClick={() => copyValue(value)}
			aria-label={t("tools.discordPermissions.copyAria", {
				value: value || "—",
			})}
		>
			<CopyIcon className="h-4 w-4" aria-hidden />
		</Button>
	);

	return (
		<ToolPageLayout
			header={
				<ToolHeader
					icon={<ShieldCheckIcon aria-hidden className="h-5 w-5" />}
					title={t("tools.discordPermissions.title")}
				/>
			}
		>
			<div className="grid w-full gap-6 lg:grid-cols-2">
				<section className="space-y-4">
					<div className="grid w-full items-center gap-2">
						<Input
							id="permission-bitfield"
							className="font-mono"
							placeholder={t(
								"tools.discordPermissions.bitfieldPlaceholder",
							)}
							value={inputValue}
							onChange={handleInputChange}
							spellCheck={false}
						/>

						<div className="space-y-1 pt-1">
							<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
								{t("tools.discordPermissions.presetsLabel")}
							</p>
							<Select value={presetValue} onValueChange={handlePresetChange}>
								<SelectTrigger className="w-full">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{PRESETS.map((preset) => (
										<SelectItem key={preset.value} value={preset.value}>
											{t(preset.labelKey)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-1 pt-1">
							<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
								{t("tools.discordPermissions.outputLabel")}
							</p>
							<div className="border border-ink bg-muted/40 px-3 py-3 flex items-center justify-between gap-2">
								<span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
									{t("tools.discordPermissions.decimalLabel")}
								</span>
								<span className="min-w-0 flex-1 break-all text-right font-mono text-sm">
									{decText || "—"}
								</span>
								{renderCopyButton(decText)}
							</div>
							<div className="border border-ink bg-muted/40 px-3 py-3 flex items-center justify-between gap-2">
								<span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
									{t("tools.discordPermissions.hexLabel")}
								</span>
								<span className="min-w-0 flex-1 break-all text-right font-mono text-sm">
									{hexText || "—"}
								</span>
								{renderCopyButton(hexText)}
							</div>
						</div>

						{isAdmin && (
							<div
								role="status"
								className="border border-hazard bg-hazard/10 px-3 py-2 font-mono text-xs font-bold uppercase tracking-[0.08em] text-hazard-text"
							>
								{t("tools.discordPermissions.adminBanner")}
							</div>
						)}

						{unknownBits !== 0n && (
							<div className="border border-hazard bg-hazard/10 px-3 py-2 font-mono text-xs text-hazard-text">
								{t("tools.discordPermissions.unknownBits", {
									hex: formatHex(unknownBits),
								})}
							</div>
						)}
					</div>
				</section>

				<section className="space-y-3">
					<Input
						id="permission-search"
						className="font-mono"
						placeholder={t("tools.discordPermissions.searchPlaceholder")}
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						spellCheck={false}
					/>

					{GROUPS.map(({ id, perms }) => {
						const visiblePerms = query
							? perms.filter((p) =>
									p.name.toLowerCase().includes(query),
								)
							: perms;
						if (visiblePerms.length === 0) return null;

						const selectedCount = perms.filter((p) =>
							effectiveChecked.has(p.name),
						).length;
						const open = query ? true : openGroups[id];

						return (
							<Collapsible
								key={id}
								open={open}
								onOpenChange={(o) =>
									setOpenGroups((prev) => ({ ...prev, [id]: o }))
								}
							>
								<div className="border border-ink">
									<CollapsibleTrigger asChild>
										<button
											type="button"
											className="flex w-full items-center justify-between gap-2 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.08em] hover:bg-muted/40"
										>
											<span>
												{t(GROUP_LABEL_KEYS[id])}
												<span className="ml-2 text-muted-foreground">
													{selectedCount}/{perms.length}
												</span>
											</span>
											<ChevronDownIcon
												aria-hidden
												className={cn(
													"h-4 w-4 shrink-0 transition-transform",
													open && "rotate-180",
												)}
											/>
										</button>
									</CollapsibleTrigger>
									<CollapsibleContent>
										<ul className="divide-y divide-ink border-t border-ink">
											{visiblePerms.map((perm) => {
												const checked = effectiveChecked.has(perm.name);
												return (
													<li key={perm.name}>
														<label
															htmlFor={`perm-${perm.name}`}
															className="flex cursor-pointer items-start gap-3 px-3 py-2 hover:bg-muted/40"
														>
															<Checkbox
																id={`perm-${perm.name}`}
																className="mt-0.5"
																checked={isAdmin || checked}
																disabled={isAdmin}
																onCheckedChange={(v) =>
																	handleToggle(perm.name, v === true)
																}
															/>
															<span className="min-w-0">
																<span className="block break-all font-mono text-sm">
																	{perm.name}
																</span>
																{perm.note && (
																	<span className="block text-xs text-muted-foreground">
																		{perm.note}
																	</span>
																)}
															</span>
														</label>
													</li>
												);
											})}
										</ul>
									</CollapsibleContent>
								</div>
							</Collapsible>
						);
					})}
				</section>
			</div>

			<p className="pt-4 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
				<Link
					href="/discord/invite"
					className="underline underline-offset-2 hover:text-hazard-text"
				>
					{t("tools.discordPermissions.footerHint")}
				</Link>
			</p>
			<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
				DISCORD PERMISSIONS CALCULATOR
			</p>
		</ToolPageLayout>
	);
};

export default PermissionsCalculatorPage;
