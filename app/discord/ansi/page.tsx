"use client";

import React, { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette as PaletteIcon, X as XIcon } from "lucide-react";
import { toast } from "sonner";
import ToolPageLayout from "@/components/ToolPageLayout";
import ToolHeader from "@/components/ToolHeader";
import { useI18n } from "@/lib/i18n";
import {
	buildAnsiBlock,
	parseAnsiBlock,
	type AnsiSegment,
} from "@/lib/discord/ansi";

const MAX_SEGMENTS = 24;

/** ANSI name (lib keys) → display hex for the PREVIEW panel. Display data only. */
const ANSI_PALETTE: Record<string, string> = {
	black: "#4F5458",
	red: "#DC322F",
	green: "#859900",
	yellow: "#B58900",
	blue: "#268BD2",
	magenta: "#D33682",
	cyan: "#2AA198",
	white: "#EEE8D5",
	gray: "#93A1A1",
	redBright: "#CB4B16",
	greenBright: "#586E75",
	yellowBright: "#657B83",
	blueBright: "#839496",
	magentaBright: "#6C71C4",
	cyanBright: "#93A1A1",
	whiteBright: "#FDF6E3",
};

/** Select option order: None, Black … White, Gray, Bright Red … Bright White. */
const COLOR_OPTIONS: { value: string; label: string }[] = [
	{ value: "black", label: "Black" },
	{ value: "red", label: "Red" },
	{ value: "green", label: "Green" },
	{ value: "yellow", label: "Yellow" },
	{ value: "blue", label: "Blue" },
	{ value: "magenta", label: "Magenta" },
	{ value: "cyan", label: "Cyan" },
	{ value: "white", label: "White" },
	{ value: "gray", label: "Gray" },
	{ value: "redBright", label: "Bright Red" },
	{ value: "greenBright", label: "Bright Green" },
	{ value: "yellowBright", label: "Bright Yellow" },
	{ value: "blueBright", label: "Bright Blue" },
	{ value: "magentaBright", label: "Bright Magenta" },
	{ value: "cyanBright", label: "Bright Cyan" },
	{ value: "whiteBright", label: "Bright White" },
];

const EMPTY_SEGMENT: AnsiSegment = { text: "" };

type TabValue = "build" | "parse";

const AnsiColorsPage = () => {
	const { t } = useI18n();
	const [tab, setTab] = useState<TabValue>("build");
	const [segments, setSegments] = useState<AnsiSegment[]>([{ ...EMPTY_SEGMENT }]);
	const [parseInput, setParseInput] = useState("");
	const [parseError, setParseError] = useState(false);

	const updateSegment = (index: number, patch: Partial<AnsiSegment>) => {
		setSegments((prev) =>
			prev.map((seg, i) => (i === index ? { ...seg, ...patch } : seg)),
		);
	};

	const addSegment = () => {
		setSegments((prev) =>
			prev.length >= MAX_SEGMENTS ? prev : [...prev, { ...EMPTY_SEGMENT }],
		);
	};

	const removeSegment = (index: number) => {
		setSegments((prev) => {
			if (prev.length <= 1) return [{ ...EMPTY_SEGMENT }];
			return prev.filter((_, i) => i !== index);
		});
	};

	const output = useMemo(() => buildAnsiBlock(segments), [segments]);
	const displayOutput = useMemo(
		() => output.replace(/\u001b/g, "␛"),
		[output],
	);

	const previewSegments = useMemo(
		() => segments.filter((seg) => seg.text !== ""),
		[segments],
	);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(output);
			toast(t("common.copied"));
		} catch {
			toast(t("common.copyFailed"));
		}
	};

	const handleParse = () => {
		const parsed = parseAnsiBlock(parseInput);
		if (parsed.length === 0) {
			setParseError(true);
			return;
		}
		setSegments(parsed);
		setParseError(false);
		setTab("build");
	};

	return (
		<ToolPageLayout
			header={
				<ToolHeader
					icon={<PaletteIcon aria-hidden className="h-5 w-5" />}
					title={t("tools.discordAnsi.title")}
				/>
			}
			footer={
				<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
					{"DISCORD RENDERS ANSI INSIDE ```ansi CODE BLOCKS"}
				</p>
			}
		>
			<Tabs
				value={tab}
				onValueChange={(value) => setTab(value as TabValue)}
				className="w-full"
			>
				<TabsList>
					<TabsTrigger value="build">{t("tools.discordAnsi.tabBuild")}</TabsTrigger>
					<TabsTrigger value="parse">{t("tools.discordAnsi.tabParse")}</TabsTrigger>
				</TabsList>

				<TabsContent value="build" className="space-y-4 pt-2">
					<div className="space-y-2">
						{segments.map((seg, index) => (
							<div
								key={index}
								className="flex flex-wrap items-center gap-2 border border-ink p-2"
							>
								<Input
									className="min-w-[10rem] flex-1 font-mono text-sm"
									placeholder={t("tools.discordAnsi.segmentTextPlaceholder")}
									value={seg.text}
									onChange={(e) => updateSegment(index, { text: e.target.value })}
								/>
								<div className="flex items-center gap-1">
									<span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
										{t("tools.discordAnsi.fgLabel")}
									</span>
									<Select
										value={seg.fg ?? "none"}
										onValueChange={(value) =>
											updateSegment(index, {
												fg: value === "none" ? undefined : value,
											})
										}
									>
										<SelectTrigger size="sm" className="w-[130px]">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												<SelectItem value="none">None</SelectItem>
												{COLOR_OPTIONS.map((opt) => (
													<SelectItem key={opt.value} value={opt.value}>
														<span
															aria-hidden
															className="mr-1 inline-block size-2.5 border border-ink align-middle"
															style={{ backgroundColor: ANSI_PALETTE[opt.value] }}
														/>
														{opt.label}
													</SelectItem>
												))}
											</SelectGroup>
										</SelectContent>
									</Select>
								</div>
								<div className="flex items-center gap-1">
									<span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
										{t("tools.discordAnsi.bgLabel")}
									</span>
									<Select
										value={seg.bg ?? "none"}
										onValueChange={(value) =>
											updateSegment(index, {
												bg: value === "none" ? undefined : value,
											})
										}
									>
										<SelectTrigger size="sm" className="w-[130px]">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												<SelectItem value="none">None</SelectItem>
												{COLOR_OPTIONS.map((opt) => (
													<SelectItem key={opt.value} value={opt.value}>
														<span
															aria-hidden
															className="mr-1 inline-block size-2.5 border border-ink align-middle"
															style={{ backgroundColor: ANSI_PALETTE[opt.value] }}
														/>
														{opt.label}
													</SelectItem>
												))}
											</SelectGroup>
										</SelectContent>
									</Select>
								</div>
								<label className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.08em]">
									<Switch
										checked={!!seg.bold}
										onCheckedChange={(checked) => updateSegment(index, { bold: checked })}
										aria-label={t("tools.discordAnsi.boldLabel")}
									/>
									{t("tools.discordAnsi.boldLabel")}
								</label>
								<label className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.08em]">
									<Switch
										checked={!!seg.underline}
										onCheckedChange={(checked) =>
											updateSegment(index, { underline: checked })
										}
										aria-label={t("tools.discordAnsi.underlineLabel")}
									/>
									{t("tools.discordAnsi.underlineLabel")}
								</label>
								<Button
									variant="ghost"
									size="icon"
									className="text-hazard-text hover:text-hazard-text"
									onClick={() => removeSegment(index)}
									aria-label={t("tools.discordAnsi.removeSegmentAria")}
								>
									<XIcon aria-hidden className="h-4 w-4" />
								</Button>
							</div>
						))}
						<Button
							variant="outline"
							size="sm"
							onClick={addSegment}
							disabled={segments.length >= MAX_SEGMENTS}
							className="font-mono text-[11px] uppercase tracking-[0.08em]"
						>
							{t("tools.discordAnsi.addSegmentButton")}
						</Button>
					</div>

					<div>
						<p className="mb-1 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
							{t("tools.discordAnsi.previewLabel")}
						</p>
						<div className="min-h-[3rem] break-all border border-ink bg-ink px-3 py-3 font-mono text-sm">
							{previewSegments.length > 0 ? (
								<span className="text-paper">
									{previewSegments.map((seg, index) => (
										<span
											key={index}
											style={{
												color: seg.fg ? ANSI_PALETTE[seg.fg] : undefined,
												backgroundColor: seg.bg ? ANSI_PALETTE[seg.bg] : undefined,
												fontWeight: seg.bold ? 700 : undefined,
												textDecoration: seg.underline ? "underline" : undefined,
											}}
										>
											{seg.text}
										</span>
									))}
								</span>
							) : (
								<span className="text-paper/50">—</span>
							)}
						</div>
					</div>

					<div>
						<div className="mb-1 flex items-center justify-between gap-2">
							<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
								{t("tools.discordAnsi.outputLabel")}
							</p>
							<Button
								variant="outline"
								size="sm"
								onClick={handleCopy}
								aria-label={t("tools.discordAnsi.copyOutputAria")}
								className="font-mono text-[11px] uppercase tracking-[0.08em]"
							>
								{t("common.copy")}
							</Button>
						</div>
						<pre className="whitespace-pre-wrap break-all border border-ink bg-muted/40 px-3 py-3 font-mono text-xs">
							{displayOutput}
						</pre>
					</div>
				</TabsContent>

				<TabsContent value="parse" className="space-y-3 pt-2">
					<Textarea
						className="min-h-[12rem] font-mono text-xs"
						placeholder={t("tools.discordAnsi.parsePlaceholder")}
						value={parseInput}
						onChange={(e) => {
							setParseInput(e.target.value);
							if (parseError) setParseError(false);
						}}
					/>
					{parseError && (
						<p className="font-mono text-sm text-hazard-text">
							{t("tools.discordAnsi.parseError")}
						</p>
					)}
					<Button
						variant="outline"
						size="sm"
						onClick={handleParse}
						className="font-mono text-[11px] uppercase tracking-[0.08em]"
					>
						{t("tools.discordAnsi.parseButton")}
					</Button>
				</TabsContent>
			</Tabs>
		</ToolPageLayout>
	);
};

export default AnsiColorsPage;
