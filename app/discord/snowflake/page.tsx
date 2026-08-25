"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { formatDistanceToNowStrict } from "date-fns";
import {
	Copy as CopyIcon,
	Dices as DicesIcon,
	Snowflake as SnowflakeIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import ToolPageLayout from "@/components/ToolPageLayout";
import ToolHeader from "@/components/ToolHeader";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
	type SnowflakeData,
	decodeSnowflake,
	encodeSnowflake,
	isValidSnowflake,
	randomSnowflake,
} from "@/lib/discord/snowflake";

const pad2 = (n: number) => String(n).padStart(2, "0");

function toLocalInputValue(date: Date): string {
	return (
		`${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}` +
		`T${pad2(date.getHours())}:${pad2(date.getMinutes())}:${pad2(date.getSeconds())}`
	);
}

// Bit index → segment class (timestamp 63–22, worker 21–17, process 16–12, increment 11–0)
const SEGMENT_CLASSES = [
	"bg-ink text-paper", // timestamp
	"bg-muted-foreground text-paper", // worker
	"bg-secondary text-secondary-foreground", // process
	"bg-accent text-accent-foreground", // increment
] as const;

function segmentForBit(bitIndex: number): number {
	if (bitIndex >= 22) return 0;
	if (bitIndex >= 17) return 1;
	if (bitIndex >= 12) return 2;
	return 3;
}

/** Reads ?id= once on mount; must live under a <Suspense> boundary for static export. */
function DeepLinkPrefill({ onPrefill }: { onPrefill: (id: string) => void }) {
	const searchParams = useSearchParams();

	useEffect(() => {
		const id = searchParams.get("id");
		if (id && isValidSnowflake(id)) onPrefill(id);
	}, [searchParams, onPrefill]);

	return null;
}

function SnowflakePage() {
	const { t } = useI18n();
	const [tab, setTab] = useState("decode");
	const [idInput, setIdInput] = useState("");
	const [mounted, setMounted] = useState(false);
	const [now, setNow] = useState(() => Date.now());

	useEffect(() => {
		setMounted(true);
	}, []);

	const trimmed = idInput.trim();
	const decoded = useMemo(
		() => (isValidSnowflake(trimmed) ? decodeSnowflake(trimmed) : null),
		[trimmed],
	);
	const invalid = trimmed !== "" && decoded === null;

	// Relative age ticks every second while a snowflake is decoded.
	useEffect(() => {
		if (!decoded) return;
		setNow(Date.now());
		const iv = setInterval(() => setNow(Date.now()), 1000);
		return () => clearInterval(iv);
	}, [decoded]);

	const age = useMemo(() => {
		if (!decoded || !mounted) return "";
		// `now` is a deliberate dependency: it re-renders the relative age each second.
		void now;
		return formatDistanceToNowStrict(decoded.createdAt, { addSuffix: true });
	}, [decoded, mounted, now]);

	const copyValue = (text: string, what?: string) => {
		navigator.clipboard
			.writeText(text)
			.then(() =>
				toast.success(
					what ? t("common.copiedType", { what }) : t("common.copied"),
				),
			)
			.catch(() => toast.error(t("common.copyFailed")));
	};

	const rows: { field: string; value: string }[] =
		mounted && decoded
			? [
					{ field: t("tools.discordSnowflake.colId"), value: decoded.id },
					{
						field: t("tools.discordSnowflake.colCreatedLocal"),
						value: decoded.createdAt.toLocaleString(),
					},
					{
						field: t("tools.discordSnowflake.colCreatedUtc"),
						value: decoded.createdAt.toISOString(),
					},
					{ field: t("tools.discordSnowflake.colAge"), value: age },
					{
						field: t("tools.discordSnowflake.colWorker"),
						value: String(decoded.worker),
					},
					{
						field: t("tools.discordSnowflake.colProcess"),
						value: String(decoded.process),
					},
					{
						field: t("tools.discordSnowflake.colIncrement"),
						value: String(decoded.increment),
					},
				]
			: [];

	return (
		<ToolPageLayout
			header={
				<ToolHeader
					icon={<SnowflakeIcon aria-hidden className="h-5 w-5" />}
					title={t("tools.discordSnowflake.title")}
				/>
			}
			footer={
				<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
					DISCORD SNOWFLAKE ID DECODER
				</p>
			}
		>
			<Suspense fallback={null}>
				<DeepLinkPrefill onPrefill={setIdInput} />
			</Suspense>

			<Tabs value={tab} onValueChange={setTab}>
				<TabsList>
					<TabsTrigger value="decode">
						{t("tools.discordSnowflake.decodeTab")}
					</TabsTrigger>
					<TabsTrigger value="build">
						{t("tools.discordSnowflake.buildTab")}
					</TabsTrigger>
					<TabsTrigger value="bulk">
						{t("tools.discordSnowflake.bulkTab")}
					</TabsTrigger>
				</TabsList>

				{/* ── DECODE ─────────────────────────────────────────────── */}
				<TabsContent value="decode" className="space-y-4 pt-2">
					<div className="grid w-full items-center gap-2">
						<label
							htmlFor="snowflake-input"
							className="font-mono text-[11px] uppercase tracking-[0.08em]"
						>
							{t("tools.discordSnowflake.colId")}
						</label>
						<Input
							id="snowflake-input"
							type="text"
							inputMode="numeric"
							className="font-mono"
							placeholder={t("tools.discordSnowflake.decodePlaceholder")}
							value={idInput}
							onChange={(e) => setIdInput(e.target.value)}
						/>
						{invalid ? (
							<p className="font-mono text-xs font-bold uppercase tracking-[0.08em] text-hazard-text">
								{t("tools.discordSnowflake.invalidSnowflake")}
							</p>
						) : null}
					</div>

					{mounted && decoded ? (
						<Table>
							<TableBody>
								{rows.map((row) => (
									<TableRow key={row.field}>
										<TableCell className="w-44 align-middle font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
											{row.field}
										</TableCell>
										<TableCell className="font-mono text-sm">
											<span className="flex min-w-0 items-center justify-between gap-2">
												<span className="truncate">{row.value}</span>
												<Button
													variant="outline"
													size="sm"
													aria-label={t("tools.discordSnowflake.copyRowAria", {
														field: row.field,
													})}
													onClick={() => copyValue(row.value)}
												>
													<CopyIcon aria-hidden className="h-3 w-3" />
												</Button>
											</span>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					) : null}

					{mounted && decoded ? (
						<>
							<div
								className="grid w-full max-w-md grid-cols-8 gap-[2px]"
								role="img"
								aria-label={decoded.binary}
							>
								{decoded.binary.split("").map((bit, i) => {
									const bitIndex = 63 - i;
									return (
										<div
											key={bitIndex}
											title={t("tools.discordSnowflake.bitTooltip", {
												index: bitIndex,
											})}
											className={cn(
												"flex h-7 items-center justify-center font-mono text-[10px]",
												SEGMENT_CLASSES[segmentForBit(bitIndex)],
											)}
										>
											{bit}
										</div>
									);
								})}
							</div>
							<div className="flex flex-wrap items-center gap-x-4 gap-y-1">
							{(
								[
									{
										label: t("tools.discordSnowflake.legendTimestamp"),
										seg: 0,
										range: "63–22",
									},
									{
										label: t("tools.discordSnowflake.legendWorker"),
										seg: 1,
										range: "21–17",
									},
									{
										label: t("tools.discordSnowflake.legendProcess"),
										seg: 2,
										range: "16–12",
									},
									{
										label: t("tools.discordSnowflake.legendIncrement"),
										seg: 3,
										range: "11–0",
									},
								] as const
							).map(({ label, seg, range }) => (
								<span
									key={label}
									className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground"
								>
									<span
										aria-hidden
										className={cn("inline-block h-3 w-3", SEGMENT_CLASSES[seg])}
									/>
									{label} <span className="normal-case">{range}</span>
								</span>
							))}
							</div>
						</>
					) : null}
				</TabsContent>

				{/* ── BUILD ──────────────────────────────────────────────── */}
				<TabsContent value="build" className="pt-2">
					<BuildTab />
				</TabsContent>

				{/* ── BULK ───────────────────────────────────────────────── */}
				<TabsContent value="bulk" className="pt-2">
					<BulkTab />
				</TabsContent>
			</Tabs>
		</ToolPageLayout>
	);
}

function BuildTab() {
	const { t } = useI18n();
	const [dateTime, setDateTime] = useState("");
	const [worker, setWorker] = useState("0");
	const [process, setProcess] = useState("0");
	const [increment, setIncrement] = useState("0");

	const parsedDate = useMemo(() => {
		if (!dateTime) return null;
		const d = new Date(dateTime);
		return Number.isNaN(d.getTime()) ? null : d;
	}, [dateTime]);

	const builtId = useMemo(() => {
		if (!parsedDate) return "";
		const num = (s: string) => {
			const n = Number(s);
			return Number.isFinite(n) ? n : 0;
		};
		return encodeSnowflake(parsedDate, num(worker), num(process), num(increment));
	}, [parsedDate, worker, process, increment]);

	const handleRandom = () => {
		const id = randomSnowflake(new Date());
		const d = decodeSnowflake(id);
		if (!d) return;
		setDateTime(toLocalInputValue(d.createdAt));
		setWorker(String(d.worker));
		setProcess(String(d.process));
		setIncrement(String(d.increment));
	};

	const copyId = () => {
		if (!builtId) return;
		navigator.clipboard
			.writeText(builtId)
			.then(() =>
				toast.success(
					t("common.copiedType", {
						what: t("tools.discordSnowflake.copiedId"),
					}),
				),
			)
			.catch(() => toast.error(t("common.copyFailed")));
	};

	return (
		<div className="space-y-4">
			<div className="grid w-full items-center gap-2">
				<label
					htmlFor="snowflake-datetime"
					className="font-mono text-[11px] uppercase tracking-[0.08em]"
				>
					{t("tools.discordSnowflake.colCreatedLocal")}
				</label>
				<Input
					id="snowflake-datetime"
					type="datetime-local"
					step={1}
					className="font-mono"
					value={dateTime}
					onChange={(e) => setDateTime(e.target.value)}
				/>
			</div>

			<div className="flex flex-wrap gap-3">
				<div className="grid w-24 items-center gap-1">
					<label
						htmlFor="snowflake-worker"
						className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground"
					>
						{t("tools.discordSnowflake.workerLabel")}
					</label>
					<Input
						id="snowflake-worker"
						type="number"
						min={0}
						max={31}
						className="font-mono"
						value={worker}
						onChange={(e) => setWorker(e.target.value)}
					/>
				</div>
				<div className="grid w-24 items-center gap-1">
					<label
						htmlFor="snowflake-process"
						className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground"
					>
						{t("tools.discordSnowflake.processLabel")}
					</label>
					<Input
						id="snowflake-process"
						type="number"
						min={0}
						max={31}
						className="font-mono"
						value={process}
						onChange={(e) => setProcess(e.target.value)}
					/>
				</div>
				<div className="grid w-28 items-center gap-1">
					<label
						htmlFor="snowflake-increment"
						className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground"
					>
						{t("tools.discordSnowflake.incrementLabel")}
					</label>
					<Input
						id="snowflake-increment"
						type="number"
						min={0}
						max={4095}
						className="font-mono"
						value={increment}
						onChange={(e) => setIncrement(e.target.value)}
					/>
				</div>
			</div>

			<div className="border border-ink">
				<div className="border-b border-ink px-3 py-2 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
					{t("tools.discordSnowflake.computedIdLabel")}
				</div>
				<div className="flex flex-wrap items-center justify-between gap-3 px-3 py-2">
					<span className="truncate font-mono text-sm">
						{builtId || "\u00a0"}
					</span>
					<span className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							disabled={!builtId}
							onClick={copyId}
						>
							<CopyIcon aria-hidden className="mr-1 h-3 w-3" />
							{t("tools.discordSnowflake.copyId")}
						</Button>
						<Button variant="outline" size="sm" onClick={handleRandom}>
							<DicesIcon aria-hidden className="mr-1 h-3 w-3" />
							{t("tools.discordSnowflake.randomButton")}
						</Button>
					</span>
				</div>
			</div>
		</div>
	);
}

function BulkTab() {
	const { t } = useI18n();
	const [bulkText, setBulkText] = useState("");

	const entries = useMemo(() => {
		const tokens = bulkText
			.split(/[\n,]/)
			.map((tok) => tok.trim())
			.filter((tok) => tok !== "");
		return tokens.map((token) => ({
			token,
			data: isValidSnowflake(token) ? decodeSnowflake(token) : null,
		}));
	}, [bulkText]);

	const validCount = entries.filter((e) => e.data !== null).length;

	const copyAsJson = () => {
		const payload = entries
			.filter((e): e is typeof e & { data: SnowflakeData } => e.data !== null)
			.map((e) => ({
				id: e.data.id,
				created: e.data.createdAt.toISOString(),
				age: formatDistanceToNowStrict(e.data.createdAt, { addSuffix: true }),
			}));
		navigator.clipboard
			.writeText(JSON.stringify(payload, null, 2))
			.then(() =>
				toast.success(
					t("common.copiedType", {
						what: t("tools.discordSnowflake.copiedJson"),
					}),
				),
			)
			.catch(() => toast.error(t("common.copyFailed")));
	};

	return (
		<div className="space-y-4">
			<Textarea
				rows={6}
				className="font-mono"
				placeholder={t("tools.discordSnowflake.bulkPlaceholder")}
				value={bulkText}
				onChange={(e) => setBulkText(e.target.value)}
			/>

			{entries.length > 0 ? (
				<>
					<div>
						<Button variant="outline" size="sm" disabled={validCount === 0} onClick={copyAsJson}>
							<CopyIcon aria-hidden className="mr-1 h-3 w-3" />
							{t("tools.discordSnowflake.copyAsJson")}
						</Button>
					</div>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>{t("tools.discordSnowflake.colId")}</TableHead>
								<TableHead>
									{t("tools.discordSnowflake.colCreatedLocal")}
								</TableHead>
								<TableHead>{t("tools.discordSnowflake.colAge")}</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{entries.map(({ token, data }) =>
								data ? (
									<TableRow key={token}>
										<TableCell className="font-mono text-xs">
											<span className="flex items-center gap-2">
												{data.id}
												<button
													type="button"
													aria-label={t("tools.discordSnowflake.copyRowAria", {
														field: t("tools.discordSnowflake.colId"),
													})}
													className="text-muted-foreground transition-colors hover:text-foreground"
													onClick={() =>
														navigator.clipboard
															.writeText(data.id)
															.then(() =>
																toast.success(
																	t("common.copiedType", {
																		what: t("tools.discordSnowflake.copiedId"),
																	}),
																),
															)
															.catch(() => toast.error(t("common.copyFailed")))
													}
												>
													<CopyIcon aria-hidden className="h-3 w-3" />
												</button>
											</span>
										</TableCell>
										<TableCell className="whitespace-nowrap font-mono text-xs">
											{data.createdAt.toLocaleString()}
										</TableCell>
										<TableCell className="whitespace-nowrap font-mono text-xs">
											{formatDistanceToNowStrict(data.createdAt, {
												addSuffix: true,
											})}
										</TableCell>
									</TableRow>
								) : (
									<TableRow key={token}>
										<TableCell className="font-mono text-xs">
											{token}
										</TableCell>
										<TableCell
											colSpan={2}
											className="font-mono text-xs font-bold uppercase tracking-[0.08em] text-hazard-text"
										>
											{t("tools.discordSnowflake.invalidRow")}
										</TableCell>
									</TableRow>
								),
							)}
						</TableBody>
					</Table>
				</>
			) : null}
		</div>
	);
}

export default SnowflakePage;
