"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { AtSign as AtSignIcon, Copy as CopyIcon } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import ToolPageLayout from "@/components/ToolPageLayout";
import ToolHeader from "@/components/ToolHeader";
import { useI18n } from "@/lib/i18n";
import {
	buildMention,
	extractMentions,
	type Mention,
	type MentionType,
} from "@/lib/discord/parse";
import { decodeSnowflake } from "@/lib/discord/snowflake";

type BuildType = Exclude<MentionType, "timestamp">;

const NS = "tools.discordMentions";

const MentionBuilderPage = () => {
	const { t } = useI18n();

	const [tab, setTab] = useState("build");

	const [buildType, setBuildType] = useState<BuildType>("user");
	const [id, setId] = useState("");
	const [name, setName] = useState("");
	const [animated, setAnimated] = useState(false);

	const [extractText, setExtractText] = useState("");

	const needsName = buildType === "slash" || buildType === "emoji";
	const needsAnimated = buildType === "emoji";

	const built =
		id.trim() === ""
			? ""
			: buildMention(
					buildType,
					id,
					needsName ? name : undefined,
					needsAnimated ? animated : undefined,
				);

	const typeLabel = (type: MentionType): string => {
		switch (type) {
			case "user":
				return t(`${NS}.typeUser`);
			case "role":
				return t(`${NS}.typeRole`);
			case "channel":
				return t(`${NS}.typeChannel`);
			case "slash":
				return t(`${NS}.typeSlash`);
			case "emoji":
				return t(`${NS}.typeEmoji`);
			case "timestamp":
				return t(`${NS}.typeTimestamp`);
		}
	};

	const mentions = useMemo(() => extractMentions(extractText), [extractText]);

	const copyToClipboard = (text: string, what?: string) => {
		navigator.clipboard
			.writeText(text)
			.then(() => {
				toast.success(
					what
						? t("common.copiedType", { what })
						: t("common.copied"),
				);
			})
			.catch(() => {
				toast.error(t("common.copyFailed"));
			});
	};

	const createdLabel = (mention: Mention): string | null => {
		const decoded = decodeSnowflake(mention.id);
		return decoded ? format(decoded.createdAt, "yyyy-MM-dd HH:mm") : null;
	};

	return (
		<ToolPageLayout
			header={
				<ToolHeader
					icon={<AtSignIcon aria-hidden className="h-5 w-5" />}
					title={t(`${NS}.title`)}
				/>
			}
		>
			<div className="space-y-4">
				<p className="sr-only">{t(`${NS}.srTabsDescription`)}</p>
				<Tabs value={tab} onValueChange={setTab}>
					<TabsList>
						<TabsTrigger value="build">
							{t(`${NS}.buildTab`)}
						</TabsTrigger>
						<TabsTrigger value="extract">
							{t(`${NS}.extractTab`)}
						</TabsTrigger>
					</TabsList>

					<TabsContent value="build">
						<div className="space-y-4">
							<div className="grid w-full gap-2">
								<span className="font-mono text-[11px] uppercase tracking-[0.08em]">
									{t(`${NS}.typeLabel`)}
								</span>
								<RadioGroup
									value={buildType}
									onValueChange={(value) =>
										setBuildType(value as BuildType)
									}
									className="grid gap-2 sm:grid-cols-2"
								>
									{(
										[
											["user", `${NS}.typeUser`],
											["role", `${NS}.typeRole`],
											["channel", `${NS}.typeChannel`],
											["slash", `${NS}.typeSlash`],
											["emoji", `${NS}.typeEmoji`],
										] as const
									).map(([value, labelKey]) => (
										<div
											key={value}
											className="flex items-center gap-2"
										>
											<RadioGroupItem
												value={value}
												id={`mention-type-${value}`}
											/>
											<Label
												htmlFor={`mention-type-${value}`}
												className="font-mono text-sm"
											>
												{t(labelKey)}
											</Label>
										</div>
									))}
								</RadioGroup>
							</div>

							<div className="grid w-full gap-2">
								<Label
									htmlFor="mention-id"
									className="font-mono text-[11px] uppercase tracking-[0.08em]"
								>
									{t(`${NS}.idLabel`)}
								</Label>
								<Input
									id="mention-id"
									value={id}
									onChange={(e) => setId(e.target.value)}
									placeholder="123456789012345678"
									className="font-mono"
									inputMode="numeric"
								/>
							</div>

							{needsName && (
								<div className="grid w-full gap-2">
									<Label
										htmlFor="mention-name"
										className="font-mono text-[11px] uppercase tracking-[0.08em]"
									>
										{t(`${NS}.nameLabel`)}
									</Label>
									<Input
										id="mention-name"
										value={name}
										onChange={(e) =>
											setName(e.target.value)
										}
										placeholder={
											buildType === "emoji"
												? "emoji"
												: "cmd"
										}
										className="font-mono"
									/>
								</div>
							)}

							{needsAnimated && (
								<div className="flex items-center gap-2">
									<Switch
										id="mention-animated"
										checked={animated}
										onCheckedChange={setAnimated}
									/>
									<Label
										htmlFor="mention-animated"
										className="font-mono text-[11px] uppercase tracking-[0.08em]"
									>
										{t(`${NS}.animatedLabel`)}
									</Label>
								</div>
							)}

							<div className="border-t border-ink pt-4" />
							<div className="border border-ink bg-muted/40 px-3 py-3 flex items-center justify-between gap-2">
								<pre className="font-mono text-lg md:text-xl break-all whitespace-pre-wrap m-0">
									{built || "\u00A0"}
								</pre>
								<Button
									variant="outline"
									size="icon"
									onClick={() =>
										copyToClipboard(
											built,
											t(`${NS}.mentionString`),
										)
									}
									disabled={!built}
									aria-label={t(`${NS}.copyButton`)}
								>
									<CopyIcon className="h-4 w-4" aria-hidden />
								</Button>
							</div>
						</div>
					</TabsContent>

					<TabsContent value="extract">
						<div className="space-y-4">
							<Textarea
								value={extractText}
								onChange={(e) => setExtractText(e.target.value)}
								placeholder={t(`${NS}.extractPlaceholder`)}
								rows={6}
								className="font-mono"
							/>

							{mentions.length === 0 ? (
								<p className="text-center font-mono text-sm uppercase tracking-[0.08em] text-muted-foreground">
									{t(`${NS}.noMentionsFound`)}
								</p>
							) : (
								<div className="overflow-x-auto">
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead className="font-mono text-[10px] uppercase tracking-[0.08em]">
													{t(`${NS}.colType`)}
												</TableHead>
												<TableHead className="font-mono text-[10px] uppercase tracking-[0.08em]">
													{t(`${NS}.colRaw`)}
												</TableHead>
												<TableHead className="font-mono text-[10px] uppercase tracking-[0.08em]">
													{t(`${NS}.colId`)}
												</TableHead>
												<TableHead className="font-mono text-[10px] uppercase tracking-[0.08em]">
													{t(`${NS}.colName`)}
												</TableHead>
												<TableHead className="font-mono text-[10px] uppercase tracking-[0.08em]">
													{t(`${NS}.colCreated`)}
												</TableHead>
												<TableHead className="w-24" />
											</TableRow>
										</TableHeader>
										<TableBody>
											{mentions.map((mention) => {
												const created =
													createdLabel(mention);
												return (
													<TableRow key={mention.raw}>
														<TableCell className="font-mono text-xs">
															{typeLabel(
																mention.type,
															)}
														</TableCell>
														<TableCell className="max-w-[16rem] truncate font-mono text-xs">
															{mention.raw}
														</TableCell>
														<TableCell className="font-mono text-xs">
															{mention.id}
														</TableCell>
														<TableCell className="font-mono text-xs">
															{mention.name ?? ""}
														</TableCell>
														<TableCell className="font-mono text-xs text-muted-foreground">
															{created ?? "—"}
														</TableCell>
														<TableCell>
															<div className="flex items-center justify-end gap-2">
																<Button
																	variant="outline"
																	size="icon"
																	onClick={() =>
																		copyToClipboard(
																			mention.id,
																			t(
																				`${NS}.mentionId`,
																			),
																		)
																	}
																	aria-label={t(
																		`${NS}.copyIdAria`,
																	)}
																>
																	<CopyIcon
																		className="h-4 w-4"
																		aria-hidden
																	/>
																</Button>
																{created && (
																	<Link
																		href={`/discord/snowflake?id=${mention.id}`}
																		className="font-mono text-xs underline underline-offset-2 hover:text-hazard-text"
																	>
																		{t(
																			`${NS}.decodeLink`,
																		)}
																	</Link>
																)}
															</div>
														</TableCell>
													</TableRow>
												);
											})}
										</TableBody>
									</Table>
								</div>
							)}
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</ToolPageLayout>
	);
};

export default MentionBuilderPage;
