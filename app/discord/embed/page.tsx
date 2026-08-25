"use client";

import React, { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import Link from "next/link";
import {
	ArrowDown as ArrowDownIcon,
	ArrowUp as ArrowUpIcon,
	Copy as CopyIcon,
	LayoutTemplate as LayoutTemplateIcon,
	X as XIcon,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import ToolPageLayout from "@/components/ToolPageLayout";
import ToolHeader from "@/components/ToolHeader";
import { useI18n } from "@/lib/i18n";

// ── Limits ──────────────────────────────────────────────────────────────────

const TITLE_MAX = 256;
const DESCRIPTION_MAX = 4096;
const AUTHOR_NAME_MAX = 256;
const FIELD_NAME_MAX = 256;
const FIELD_VALUE_MAX = 1024;
const FOOTER_TEXT_MAX = 2048;
const MAX_FIELDS = 25;
const TOTAL_BUDGET_MAX = 6000;

// ── Types ───────────────────────────────────────────────────────────────────

type EmbedField = { name: string; value: string; inline: boolean };

type TabKey = "preview" | "json" | "import";

type FormState = {
	title: string;
	description: string;
	url: string;
	colorHex: string;
	colorDec: string;
	authorName: string;
	authorUrl: string;
	authorIconUrl: string;
	fields: EmbedField[];
	imageUrl: string;
	thumbnailUrl: string;
	footerText: string;
	footerIconUrl: string;
	timestamp: string; // frozen ISO string; "" when off
};

const INITIAL_FORM: FormState = {
	title: "",
	description: "",
	url: "",
	colorHex: "",
	colorDec: "",
	authorName: "",
	authorUrl: "",
	authorIconUrl: "",
	fields: [],
	imageUrl: "",
	thumbnailUrl: "",
	footerText: "",
	footerIconUrl: "",
	timestamp: "",
};

const EMPTY_FIELD: EmbedField = { name: "", value: "", inline: false };

// ── Color helpers ───────────────────────────────────────────────────────────

const HEX_RE = /^#([0-9a-fA-F]{6})$/;

const hexToInt = (hex: string): number | null =>
	HEX_RE.test(hex) ? parseInt(hex.slice(1), 16) : null;

const intToHex = (n: number): string =>
	`#${n.toString(16).padStart(6, "0").toUpperCase()}`;

const decimalToInt = (text: string): number | null => {
	const trimmed = text.trim();
	if (!/^\d+$/.test(trimmed)) return null;
	const n = Number(trimmed);
	return Number.isFinite(n) && n >= 0 && n <= 0xffffff ? n : null;
};

const FALLBACK_COLOR = "#5865F2";

// ── Embed object building / validation ─────────────────────────────────────

const cleanString = (v: unknown): string | undefined =>
	typeof v === "string" && v.length > 0 ? v : undefined;

function buildEmbed(form: FormState): Record<string, unknown> {
	const embed: Record<string, unknown> = {};

	const title = cleanString(form.title);
	if (title !== undefined) embed.title = title;
	const description = cleanString(form.description);
	if (description !== undefined) embed.description = description;
	const url = cleanString(form.url);
	if (url !== undefined) embed.url = url;

	const colorInt = hexToInt(form.colorHex) ?? decimalToInt(form.colorDec);
	if (colorInt !== null) embed.color = colorInt;

	const author: Record<string, string> = {};
	if (form.authorName.length > 0) author.name = form.authorName;
	if (form.authorUrl.length > 0) author.url = form.authorUrl;
	if (form.authorIconUrl.length > 0) author.icon_url = form.authorIconUrl;
	if (Object.keys(author).length > 0) embed.author = author;

	const keptFields = form.fields.filter(
		(f) => f.name.length > 0 || f.value.length > 0,
	);
	if (keptFields.length > 0) {
		embed.fields = keptFields.map((f) => ({
			name: f.name,
			value: f.value,
			...(f.inline ? { inline: true } : {}),
		}));
	}

	if (form.imageUrl.length > 0) embed.image = { url: form.imageUrl };
	if (form.thumbnailUrl.length > 0)
		embed.thumbnail = { url: form.thumbnailUrl };

	const footer: Record<string, string> = {};
	if (form.footerText.length > 0) footer.text = form.footerText;
	if (form.footerIconUrl.length > 0) footer.icon_url = form.footerIconUrl;
	if (Object.keys(footer).length > 0) embed.footer = footer;

	if (form.timestamp !== "") embed.timestamp = form.timestamp;

	return embed;
}

function computeTotalChars(embed: Record<string, unknown>): number {
	const len = (v: unknown) => (typeof v === "string" ? v.length : 0);
	let total = len(embed.title) + len(embed.description);
	const author = embed.author as Record<string, unknown> | undefined;
	total += author ? len(author.name) : 0;
	const footer = embed.footer as Record<string, unknown> | undefined;
	total += footer ? len(footer.text) : 0;
	const fields = Array.isArray(embed.fields)
		? (embed.fields as Record<string, unknown>[])
		: [];
	for (const f of fields) total += len(f.name) + len(f.value);
	return total;
}

const isHttpUrl = (url: string): boolean =>
	url.startsWith("http://") || url.startsWith("https://");

// ── Small presentational helpers ────────────────────────────────────────────

function CharCount({ current, max }: { current: number; max: number }) {
	return (
		<span
			className={`font-mono text-[10px] tracking-[0.08em] ${
				current > max ? "text-hazard-text" : "text-muted-foreground"
			}`}
		>
			{current}/{max}
		</span>
	);
}


function LabeledRow({
	htmlFor,
	label,
	children,
}: {
	htmlFor?: string;
	label: string;
	children: React.ReactNode;
}) {
	return (
		<div className="flex items-center justify-between gap-2">
			<Label
				htmlFor={htmlFor}
				className="font-mono text-[11px] uppercase tracking-[0.08em]"
			>
				{label}
			</Label>
			{children}
		</div>
	);
}
// ── Page ────────────────────────────────────────────────────────────────────

const EmbedBuilderPage = () => {
	const { t } = useI18n();
	const ns = "tools.discordEmbed";

	const [tab, setTab] = useState<TabKey>("preview");
	const [form, setForm] = useState<FormState>(INITIAL_FORM);
	const [minified, setMinified] = useState(false);
	const [importText, setImportText] = useState("");

	const patch = (p: Partial<FormState>) => setForm((f) => ({ ...f, ...p }));

	// ── Color sync handlers ──

	const handlePickerChange = (value: string) => {
		const n = hexToInt(value);
		if (n === null) return;
		patch({ colorHex: intToHex(n), colorDec: String(n) });
	};

	const handleHexChange = (value: string) => {
		const n = hexToInt(value);
		patch(
			n !== null
				? { colorHex: value, colorDec: String(n) }
				: { colorHex: value },
		);
	};

	const handleDecChange = (value: string) => {
		const n = decimalToInt(value);
		patch(
			n !== null
				? { colorHex: intToHex(n), colorDec: value }
				: { colorDec: value },
		);
	};

	// ── Field ops ──

	const addField = () => {
		if (form.fields.length >= MAX_FIELDS) return;
		patch({ fields: [...form.fields, { ...EMPTY_FIELD }] });
	};

	const removeField = (index: number) => {
		patch({ fields: form.fields.filter((_, i) => i !== index) });
	};

	const moveField = (index: number, delta: -1 | 1) => {
		const target = index + delta;
		if (target < 0 || target >= form.fields.length) return;
		const next = [...form.fields];
		const [moved] = next.splice(index, 1);
		next.splice(target, 0, moved);
		patch({ fields: next });
	};

	const patchField = (index: number, p: Partial<EmbedField>) => {
		setForm((f) => ({
			...f,
			fields: f.fields.map((field, i) =>
				i === index ? { ...field, ...p } : field,
			),
		}));
	};

	// ── Derived: embed, json, validation ──

	const embed = useMemo(() => buildEmbed(form), [form]);

	const jsonText = minified ? JSON.stringify(embed) : JSON.stringify(embed, null, 2);

	const violations = useMemo(() => {
		const list: string[] = [];
		const over = (label: string, current: number, max: number) => {
			if (current > max) {
				list.push(t(`${ns}.overBudget`, { field: label, current, max }));
			}
		};
		over("Title", form.title.length, TITLE_MAX);
		over("Description", form.description.length, DESCRIPTION_MAX);
		over("Author name", form.authorName.length, AUTHOR_NAME_MAX);
		over("Footer text", form.footerText.length, FOOTER_TEXT_MAX);
		form.fields.forEach((f, i) => {
			over(`Field ${i + 1} name`, f.name.length, FIELD_NAME_MAX);
			over(`Field ${i + 1} value`, f.value.length, FIELD_VALUE_MAX);
		});
		if (form.fields.length > MAX_FIELDS) {
			list.push(t(`${ns}.tooManyFields`, { count: form.fields.length }));
		}
		const total = computeTotalChars(embed);
		if (total > TOTAL_BUDGET_MAX) {
			list.push(t(`${ns}.totalBudget`, { current: total, max: TOTAL_BUDGET_MAX }));
		}
		return { list, total };
	}, [embed, form, t]);

	const totalOverBudget = violations.total > TOTAL_BUDGET_MAX;

	// ── Clipboard ──

	const copyJson = async () => {
		try {
			await navigator.clipboard.writeText(jsonText);
			toast(t("common.copiedType", { what: t(`${ns}.jsonOutput`) }));
		} catch {
			toast(t("common.copyFailed"));
		}
	};

	// ── Import ──

	const handleImport = () => {
		let parsed: unknown;
		try {
			parsed = JSON.parse(importText);
		} catch {
			toast(t("common.copyFailed"));
			return;
		}
		if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
			toast(t("common.copyFailed"));
			return;
		}
		const obj = parsed as Record<string, unknown>;
		const str = (v: unknown): string => (typeof v === "string" ? v : "");
		const sub = (v: unknown): Record<string, unknown> =>
			typeof v === "object" && v !== null && !Array.isArray(v)
				? (v as Record<string, unknown>)
				: {};

		let colorHex = "";
		let colorDec = "";
		if (typeof obj.color === "number" && Number.isFinite(obj.color)) {
			const n = Math.max(0, Math.min(0xffffff, Math.trunc(obj.color)));
			colorHex = intToHex(n);
			colorDec = String(n);
		} else if (typeof obj.color === "string" && HEX_RE.test(obj.color)) {
			const n = parseInt(obj.color.slice(1), 16);
			colorHex = intToHex(n);
			colorDec = String(n);

		}

		const rawFields = Array.isArray(obj.fields) ? obj.fields : [];

		setForm({
			title: str(obj.title),
			description: str(obj.description),
			url: str(obj.url),
			colorHex,
			colorDec,
			authorName: str(sub(obj.author).name),
			authorUrl: str(sub(obj.author).url),
			authorIconUrl: str(sub(obj.author).icon_url),
			fields: rawFields.map((f) => {
				const fo = sub(f);
				return {
					name: str(fo.name),
					value: str(fo.value),
					inline: fo.inline === true,
				};
			}),
			imageUrl: str(sub(obj.image).url),
			thumbnailUrl: str(sub(obj.thumbnail).url),
			footerText: str(sub(obj.footer).text),
			footerIconUrl: str(sub(obj.footer).icon_url),
			timestamp: str(obj.timestamp),
		});
		setTab("preview");
	};

	// ── Preview state ──

	const hasAnyContent =
		form.title.length > 0 ||
		form.description.length > 0 ||
		form.url.length > 0 ||
		form.authorName.length > 0 ||
		form.authorIconUrl.length > 0 ||
		form.fields.some((f) => f.name.length > 0 || f.value.length > 0) ||
		form.imageUrl.length > 0 ||
		form.thumbnailUrl.length > 0 ||
		form.footerText.length > 0 ||
		form.footerIconUrl.length > 0 ||
		form.timestamp !== "";

	const timestampDisplay =
		form.timestamp !== "" && !Number.isNaN(new Date(form.timestamp).getTime())
			? format(new Date(form.timestamp), "yyyy-MM-dd HH:mm:ss")
			: "";

	const resolvedColorInt =
		hexToInt(form.colorHex) ?? decimalToInt(form.colorDec);

	return (
		<ToolPageLayout
			header={
				<ToolHeader
					icon={<LayoutTemplateIcon aria-hidden className="h-5 w-5" />}
					title={t(`${ns}.title`)}
				/>
			}
		>
			<div className="space-y-4">
				<Tabs value={tab} onValueChange={(v) => setTab(v as TabKey)}>
					<div className="flex items-center gap-3">
						<span className="sr-only">{t(`${ns}.srTabsDescription`)}</span>
						<TabsList>
							<TabsTrigger value="preview">{t(`${ns}.previewTab`)}</TabsTrigger>
							<TabsTrigger value="json">{t(`${ns}.jsonTab`)}</TabsTrigger>
							<TabsTrigger value="import">{t(`${ns}.importTab`)}</TabsTrigger>
						</TabsList>
					</div>

					<div className="grid gap-6 lg:grid-cols-2">
						{/* ── Form column ── */}
						<div className="space-y-4">
							{/* Title */}
							<div className="space-y-1">
								<LabeledRow htmlFor="embed-title" label={t(`${ns}.titleLabel`)}>
									<CharCount current={form.title.length} max={TITLE_MAX} />
								</LabeledRow>
								<Input
									id="embed-title"
									value={form.title}
									onChange={(e) => patch({ title: e.target.value })}
								/>
							</div>

							{/* Description */}
							<div className="space-y-1">
								<LabeledRow
									htmlFor="embed-description"
									label={t(`${ns}.descriptionLabel`)}
								>
									<CharCount
										current={form.description.length}
										max={DESCRIPTION_MAX}
									/>
								</LabeledRow>
								<Textarea
									id="embed-description"
									rows={4}
									value={form.description}
									onChange={(e) => patch({ description: e.target.value })}
								/>
							</div>

							{/* URL */}
							<div className="space-y-1">
								<Label
									htmlFor="embed-url"
									className="font-mono text-[11px] uppercase tracking-[0.08em]"
								>
									{t(`${ns}.urlLabel`)}
								</Label>
								<Input
									id="embed-url"
									value={form.url}
									onChange={(e) => patch({ url: e.target.value })}
								/>
							</div>

							{/* Color */}
							<div className="space-y-1">
								<p className="font-mono text-[11px] uppercase tracking-[0.08em]">
									{t(`${ns}.colorLabel`)}
								</p>
								<div className="grid grid-cols-[auto_1fr_1fr] gap-2">
									<Input
										type="color"
										aria-label={t(`${ns}.colorLabel`)}
										value={
											hexToInt(form.colorHex) !== null
												? form.colorHex.toLowerCase()
												: FALLBACK_COLOR
										}
										onChange={(e) => handlePickerChange(e.target.value)}
										className="h-9 w-14 cursor-pointer border border-ink bg-paper p-1"
									/>
									<Input
										aria-label={`${t(`${ns}.colorLabel`)} hex`}
										placeholder="#5865F2"
										value={form.colorHex}
										onChange={(e) => handleHexChange(e.target.value)}
										className="font-mono"
									/>
									<Input
										aria-label={`${t(`${ns}.colorLabel`)} int`}
										placeholder="5814783"
										inputMode="numeric"
										value={form.colorDec}
										onChange={(e) => handleDecChange(e.target.value)}
										className="font-mono"
									/>
								</div>
							</div>

							{/* Author */}
							<div className="space-y-2 border-t border-ink pt-3">
								<p className="font-mono text-[11px] uppercase tracking-[0.08em]">
									{t(`${ns}.authorLabel`)}
								</p>
								<div className="space-y-1">
									<LabeledRow
										htmlFor="embed-author-name"
										label={t(`${ns}.authorNameLabel`)}
									>
										<CharCount
											current={form.authorName.length}
											max={AUTHOR_NAME_MAX}
										/>
									</LabeledRow>
									<Input
										id="embed-author-name"
										value={form.authorName}
										onChange={(e) => patch({ authorName: e.target.value })}
									/>
								</div>
								<div className="space-y-1">
									<Label
										htmlFor="embed-author-url"
										className="font-mono text-[11px] uppercase tracking-[0.08em]"
									>
										{t(`${ns}.authorUrlLabel`)}
									</Label>
									<Input
										id="embed-author-url"
										value={form.authorUrl}
										onChange={(e) => patch({ authorUrl: e.target.value })}
									/>
								</div>
								<div className="space-y-1">
									<Label
										htmlFor="embed-author-icon"
										className="font-mono text-[11px] uppercase tracking-[0.08em]"
									>
										{t(`${ns}.authorIconLabel`)}
									</Label>
									<Input
										id="embed-author-icon"
										value={form.authorIconUrl}
										onChange={(e) => patch({ authorIconUrl: e.target.value })}
									/>
								</div>
							</div>

							{/* Fields */}
							<div className="space-y-2 border-t border-ink pt-3">
								<div className="flex items-center justify-between gap-2">
									<p className="font-mono text-[11px] uppercase tracking-[0.08em]">
										{t(`${ns}.fieldsLabel`)}
									</p>
									<span
										className={`font-mono text-[10px] tracking-[0.08em] ${
											form.fields.length > MAX_FIELDS
												? "text-hazard-text"
												: "text-muted-foreground"
										}`}
									>
										{form.fields.length}/{MAX_FIELDS}
									</span>
								</div>

								{form.fields.map((field, index) => (
									<div
										key={index}
										className="space-y-2 border border-ink bg-muted/40 p-2"
									>
										<div className="flex items-start justify-between gap-2">
											<div className="min-w-0 flex-1 space-y-1">
												<LabeledRow
													htmlFor={`embed-field-${index}-name`}
													label={`${t(`${ns}.fieldNameLabel`)} #${index + 1}`}
												>
													<CharCount
														current={field.name.length}
														max={FIELD_NAME_MAX}
													/>
												</LabeledRow>
												<Input
													id={`embed-field-${index}-name`}
													value={field.name}
													onChange={(e) =>
														patchField(index, { name: e.target.value })
													}
												/>
											</div>
											<div className="flex shrink-0 items-center gap-1 pt-5">
												<Button
													variant="outline"
													size="icon"
													disabled={index === 0}
													onClick={() => moveField(index, -1)}
													aria-label={t(`${ns}.moveFieldUpAria`)}
												>
													<ArrowUpIcon className="h-4 w-4" aria-hidden />
												</Button>
												<Button
													variant="outline"
													size="icon"
													disabled={index === form.fields.length - 1}
													onClick={() => moveField(index, 1)}
													aria-label={t(`${ns}.moveFieldDownAria`)}
												>
													<ArrowDownIcon className="h-4 w-4" aria-hidden />
												</Button>
												<Button
													variant="outline"
													size="icon"
													onClick={() => removeField(index)}
													aria-label={t(`${ns}.removeFieldAria`)}
												>
													<XIcon className="h-4 w-4" aria-hidden />
												</Button>
											</div>
										</div>
										<div className="space-y-1">
											<LabeledRow
												htmlFor={`embed-field-${index}-value`}
												label={t(`${ns}.fieldValueLabel`)}
											>
												<CharCount
													current={field.value.length}
													max={FIELD_VALUE_MAX}
												/>
											</LabeledRow>
											<Textarea
												id={`embed-field-${index}-value`}
												rows={2}
												value={field.value}
												onChange={(e) =>
													patchField(index, { value: e.target.value })
												}
											/>
										</div>
										<label className="flex cursor-pointer items-center gap-2">
											<Switch
												checked={field.inline}
												onCheckedChange={(checked) =>
													patchField(index, { inline: checked })
												}
												aria-label={t(`${ns}.fieldInlineLabel`)}
											/>
											<span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
												{t(`${ns}.fieldInlineLabel`)}
											</span>
										</label>
									</div>
								))}

								<Button
									variant="outline"
									className="w-full font-mono text-xs uppercase tracking-[0.08em]"
									disabled={form.fields.length >= MAX_FIELDS}
									onClick={addField}
								>
									{t(`${ns}.addFieldButton`)}
								</Button>
							</div>

							{/* Image */}
							<div className="space-y-1 border-t border-ink pt-3">
								<Label
									htmlFor="embed-image"
									className="font-mono text-[11px] uppercase tracking-[0.08em]"
								>
									{t(`${ns}.imageLabel`)}
								</Label>
								<Input
									id="embed-image"
									value={form.imageUrl}
									onChange={(e) => patch({ imageUrl: e.target.value })}
								/>
							</div>

							{/* Thumbnail */}
							<div className="space-y-1">
								<Label
									htmlFor="embed-thumbnail"
									className="font-mono text-[11px] uppercase tracking-[0.08em]"
								>
									{t(`${ns}.thumbnailLabel`)}
								</Label>
								<Input
									id="embed-thumbnail"
									value={form.thumbnailUrl}
									onChange={(e) => patch({ thumbnailUrl: e.target.value })}
								/>
							</div>

							{/* Footer */}
							<div className="space-y-2 border-t border-ink pt-3">
								<p className="font-mono text-[11px] uppercase tracking-[0.08em]">
									{t(`${ns}.footerLabel`)}
								</p>
								<div className="space-y-1">
									<LabeledRow
										htmlFor="embed-footer-text"
										label={t(`${ns}.footerTextLabel`)}
									>
										<CharCount
											current={form.footerText.length}
											max={FOOTER_TEXT_MAX}
										/>
									</LabeledRow>
									<Input
										id="embed-footer-text"
										value={form.footerText}
										onChange={(e) => patch({ footerText: e.target.value })}
									/>
								</div>
								<div className="space-y-1">
									<Label
										htmlFor="embed-footer-icon"
										className="font-mono text-[11px] uppercase tracking-[0.08em]"
									>
										{t(`${ns}.footerIconLabel`)}
									</Label>
									<Input
										id="embed-footer-icon"
										value={form.footerIconUrl}
										onChange={(e) => patch({ footerIconUrl: e.target.value })}
									/>
								</div>
							</div>

							{/* Timestamp */}
							<div className="flex items-center justify-between gap-2 border-t border-ink pt-3">
								<Label
									htmlFor="embed-timestamp"
									className="font-mono text-[11px] uppercase tracking-[0.08em]"
								>
									{t(`${ns}.timestampLabel`)}
								</Label>
								<Switch
									id="embed-timestamp"
									checked={form.timestamp !== ""}
									onCheckedChange={(checked) =>
										patch({
											timestamp: checked ? new Date().toISOString() : "",
										})
									}
								/>
							</div>
						</div>

						{/* ── Right column: tab content ── */}
						<div className="min-w-0">
							{/* PREVIEW */}
							<TabsContent value="preview" className="mt-0">
								<Card
									className="bg-paper"
									style={{
										borderLeft: resolvedColorInt
											? `4px solid ${intToHex(resolvedColorInt)}`
											: "4px solid transparent",
									}}
								>
									<CardContent className="space-y-3 px-4 py-4">
										{!hasAnyContent ? (
											<p className="font-mono text-sm text-muted-foreground">
												{t(`${ns}.emptyPreview`)}
											</p>
										) : (
											<>
												{(form.authorName.length > 0 ||
													isHttpUrl(form.authorIconUrl)) && (
													<div className="flex items-center gap-2">
														{isHttpUrl(form.authorIconUrl) && (
															<Image
																src={form.authorIconUrl}
																alt=""
																width={20}
																height={20}
																unoptimized
																className="rounded-full object-cover"
															/>
														)}
														{form.authorName.length > 0 &&
															(isHttpUrl(form.authorUrl) ? (
																<a
																	href={form.authorUrl}
																	target="_blank"
																	rel="noreferrer"
																	className="text-sm underline underline-offset-2"
																>
																	{form.authorName}
																</a>
															) : (
																<span className="text-sm font-medium">
																	{form.authorName}
																</span>
															))}
													</div>
												)}

												{form.title.length > 0 &&
													(isHttpUrl(form.url) ? (
														<a
															href={form.url}
															target="_blank"
															rel="noreferrer"
															className="break-words text-base font-bold underline underline-offset-2"
														>
															{form.title}
														</a>
													) : (
														<p className="break-words text-base font-bold">
															{form.title}
														</p>
													))}

												{form.description.length > 0 && (
													<div className="flex items-start gap-3">
														<p className="min-w-0 flex-1 break-words whitespace-pre-wrap text-sm">
															{form.description}
														</p>
														{isHttpUrl(form.thumbnailUrl) && (
															<Image
																src={form.thumbnailUrl}
																alt=""
																width={80}
																height={80}
																unoptimized
																className="shrink-0 border border-ink object-cover"
															/>
														)}
													</div>
												)}

												{form.description.length === 0 &&
													isHttpUrl(form.thumbnailUrl) && (
														<Image
															src={form.thumbnailUrl}
															alt=""
															width={80}
															height={80}
															unoptimized
															className="border border-ink object-cover"
														/>
													)}

												{form.fields.some(
													(f) => f.name.length > 0 || f.value.length > 0,
												) && (
													<div className="grid grid-cols-2 gap-x-4 gap-y-3">
														{form.fields
															.filter(
																(f) =>
																	f.name.length > 0 || f.value.length > 0,
															)
															.map((field, index) => (
																<div
																	key={index}
																	className={
																		field.inline ? "" : "col-span-2"
																	}
																>
																	{field.name.length > 0 && (
																		<p className="break-words text-sm font-bold">
																			{field.name}
																		</p>
																	)}
																	{field.value.length > 0 && (
																		<p className="break-words whitespace-pre-wrap text-sm text-muted-foreground">
																			{field.value}
																		</p>
																	)}
																</div>
															))}
													</div>
												)}

												{isHttpUrl(form.imageUrl) && (
													<Image
														src={form.imageUrl}
														alt=""
														width={320}
														height={180}
														unoptimized
														className="max-w-full border border-ink object-contain"
													/>
												)}

												{(form.footerText.length > 0 ||
													isHttpUrl(form.footerIconUrl) ||
													timestampDisplay) && (
													<div className="flex flex-wrap items-center gap-2 border-t border-ink pt-2">
														{isHttpUrl(form.footerIconUrl) && (
															<Image
																src={form.footerIconUrl}
																alt=""
																width={16}
																height={16}
																unoptimized
																className="rounded-full object-cover"
															/>
														)}
														{form.footerText.length > 0 && (
															<span className="break-words text-xs text-muted-foreground">
																{form.footerText}
															</span>
														)}
														{timestampDisplay && (
															<span className="font-mono text-xs text-muted-foreground">
																· {timestampDisplay}
															</span>
														)}
													</div>
												)}
											</>
										)}
									</CardContent>
								</Card>
							</TabsContent>

							{/* JSON */}
							<TabsContent value="json" className="mt-0 space-y-4">
								<div className="flex flex-wrap gap-2">
									<Button
										variant="outline"
										onClick={copyJson}
										className="font-mono text-xs uppercase tracking-[0.08em]"
									>
										<CopyIcon className="mr-1 h-4 w-4" aria-hidden />
										{t(`${ns}.copyJsonButton`)}
									</Button>
									<Button
										variant={minified ? "default" : "outline"}
										onClick={() => setMinified((m) => !m)}
										className="font-mono text-xs uppercase tracking-[0.08em]"
									>
										{t(`${ns}.minifiedButton`)}
									</Button>
								</div>

								<Card className="bg-paper">
									<CardContent className="px-4 py-4">
										<pre className="overflow-x-auto whitespace-pre-wrap break-all font-mono text-xs">
											{jsonText}
										</pre>
									</CardContent>
								</Card>

								<Card className="bg-paper">
									<CardContent className="space-y-1 px-4 py-4">
										<p className="font-mono text-[11px] uppercase tracking-[0.08em]">
											{t(`${ns}.validationLabel`)}
										</p>
										{violations.list.length === 0 ? (
											<p className="font-mono text-xs text-muted-foreground">
												—
											</p>
										) : (
											violations.list.map((message, index) => (
												<p
													key={index}
													className={`font-mono text-xs ${
														index === violations.list.length - 1 &&
														totalOverBudget
															? "text-hazard-text"
															: ""
													}`}
												>
													{message}
												</p>
											))
										)}
									</CardContent>
								</Card>
							</TabsContent>

							{/* IMPORT */}
							<TabsContent value="import" className="mt-0 space-y-4">
								<Textarea
									rows={12}
									placeholder={t(`${ns}.importPlaceholder`)}
									value={importText}
									onChange={(e) => setImportText(e.target.value)}
									className="font-mono text-xs"
								/>
								<Button
									variant="outline"
									onClick={handleImport}
									className="w-full font-mono text-xs uppercase tracking-[0.08em]"
								>
									{t(`${ns}.importButton`)}
								</Button>
							</TabsContent>
						</div>
					</div>
				</Tabs>

				<div className="border-t border-ink pt-4">
					<Link
						href="/discord/webhook"
						className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground hover:text-foreground"
					>
						{t(`${ns}.footerSendIt`)}
					</Link>
				</div>
			</div>
		</ToolPageLayout>
	);
};

export default EmbedBuilderPage;
