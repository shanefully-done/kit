"use client";

import React, {
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Download as DownloadIcon, ImageDown } from "lucide-react";
import { toast } from "sonner";
import NextImage from "next/image";
import ToolPageLayout from "@/components/ToolPageLayout";
import ToolHeader from "@/components/ToolHeader";
import { useI18n } from "@/lib/i18n";

type Mode = "emoji" | "sticker";
type Fit = "contain" | "cover";
type Fmt = "png" | "webp" | "jpeg";

const TARGETS: Record<Mode, { size: number; budget: number }> = {
	emoji: { size: 128, budget: 256 * 1024 },
	sticker: { size: 320, budget: 512 * 1024 },
};

const MIME: Record<Fmt, string> = {
	png: "image/png",
	webp: "image/webp",
	jpeg: "image/jpeg",
};

const EXT: Record<Fmt, string> = {
	png: "png",
	webp: "webp",
	jpeg: "jpg",
};

/** Ladder rungs tried when the primary encode misses the budget (doc §4). */
const RUNGS: Array<{ fmt: Fmt; q: number }> = [
	{ fmt: "webp", q: 0.9 },
	{ fmt: "webp", q: 0.7 },
	{ fmt: "webp", q: 0.5 },
	{ fmt: "jpeg", q: 0.85 },
];

const HUGE_SOURCE = 4096;

const formatKb = (bytes: number) =>
	(bytes / 1024).toLocaleString("en-US", { maximumFractionDigits: 1 });
const EmojiResizerPage = () => {
	const { t } = useI18n();
	const [fileVersion, setFileVersion] = useState(0);
	const [mode, setMode] = useState<Mode>("emoji");
	const [fit, setFit] = useState<Fit>("contain");
	const [format, setFormat] = useState<Fmt>("png");
	const [quality, setQuality] = useState(90);
	const [isDragging, setIsDragging] = useState(false);
	const [fileInfo, setFileInfo] = useState<{
		name: string;
		bytes: number;
		width: number;
		height: number;
	} | null>(null);
	const [result, setResult] = useState<{
		url: string;
		bytes: number;
		fmt: Fmt;
	} | null>(null);

	const bitmapRef = useRef<ImageBitmap | null>(null);
	const jobRef = useRef(0);
	const resultUrlRef = useRef<string | null>(null);
	const inputRef = useRef<HTMLInputElement | null>(null);

	// ObjectURL discipline (index rules 9/11): revoke live URL + close bitmap on unmount.
	useEffect(() => {
		return () => {
			if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
			bitmapRef.current?.close();
		};
	}, []);

	const toBlob = useCallback(
		(canvas: HTMLCanvasElement, type: string, quality?: number) =>
			new Promise<Blob | null>((resolve) =>
				canvas.toBlob(resolve, type, quality),
			),
		[],
	);

	/**
	 * Square-canvas pipeline (doc §3–5): draw → PNG baseline → optional
	 * lossy ladder → verdict. Runs off the retained ImageBitmap.
	 */
	const process = useCallback(async () => {
		const bm = bitmapRef.current;
		if (!bm) return;

		const token = ++jobRef.current;
		const T = TARGETS[mode].size;
		const budget = TARGETS[mode].budget;

		// CONTAIN letterboxes centered preserving aspect; COVER center-crops
		// via scale = max(T/w, T/h). Canvas clips negative offsets.
		const scale =
			fit === "contain"
				? Math.min(T / bm.width, T / bm.height)
				: Math.max(T / bm.width, T / bm.height);
		const dw = Math.round(bm.width * scale);
		const dh = Math.round(bm.height * scale);
		const dx = Math.round((T - dw) / 2);
		const dy = Math.round((T - dh) / 2);

		const drawOn = (fillWhite: boolean) => {
			const canvas = document.createElement("canvas");
			canvas.width = T;
			canvas.height = T;
			const ctx = canvas.getContext("2d");
			if (!ctx) return null;
			// JPEG has no alpha: matte white BEFORE drawing so transparency
			// does not turn black.
			if (fillWhite) {
				ctx.fillStyle = "#fff";
				ctx.fillRect(0, 0, T, T);
			}
			ctx.drawImage(bm, dx, dy, dw, dh);
			return canvas;
		};

		const commit = (blob: Blob, fmt: Fmt) => {
			if (jobRef.current !== token) return;
			const url = URL.createObjectURL(blob);
			// Revoke previous URL before adopting the new one.
			if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
			resultUrlRef.current = url;
			setResult({ url, bytes: blob.size, fmt });
		};

		// Baseline: always try lossless PNG first.
		const pngCanvas = drawOn(false);
		if (!pngCanvas) return;
		const pngBlob = await toBlob(pngCanvas, MIME.png);
		if (!pngBlob) return;
		if (mode === "sticker" || format === "png") {
			commit(pngBlob, "png");
			return;
		}

		// EMOJI + lossy format selected: try the user's pick at slider quality
		// first; if it misses the budget, walk the remaining lower rungs and
		// keep the smallest blob when nothing fits.
		const primaryQ = quality / 100;
		const candidates: Array<{ fmt: Fmt; q: number }> = [
			{ fmt: format, q: primaryQ },
			...RUNGS.filter((r) => !(r.fmt === format && r.q === primaryQ)),
		];

		let smallest: { blob: Blob; fmt: Fmt } | null = null;
		for (const { fmt, q } of candidates) {
			const canvas = drawOn(fmt === "jpeg");
			if (!canvas) return;
			const blob = await toBlob(canvas, MIME[fmt], q);
			if (!blob) continue;
			if (blob.size <= budget) {
				commit(blob, fmt);
				return;
			}
			if (!smallest || blob.size < smallest.blob.size) {
				smallest = { blob, fmt };
			}
		}

		// None fit under budget: fall back to the best lossy attempt unless
		// the untouched PNG baseline was smaller.
		const fallback =
			smallest && smallest.blob.size <= pngBlob.size ? smallest : { blob: pngBlob, fmt: "png" as Fmt };
		commit(fallback.blob, fallback.fmt);
	}, [fit, format, mode, quality, toBlob]);

	const loadFile = useCallback(
		async (file: File | undefined | null) => {
			if (!file) return;
			if (!file.type.startsWith("image/")) {
				toast.error(t("tools.emojiResizer.invalidFile"));
				return;
			}
			let bm: ImageBitmap;
			try {
				bm = await createImageBitmap(file);
			} catch {
				toast.error(t("tools.emojiResizer.invalidFile"));
				return;
			}
			// Pre-shrink huge sources: drawing an 8000px bitmap onto a small
			// canvas is wasteful and some browsers cap canvas size.
			if (Math.max(bm.width, bm.height) > HUGE_SOURCE) {
				try {
					const opts: ImageBitmapOptions =
						bm.width >= bm.height
							? { resizeWidth: HUGE_SOURCE, resizeQuality: "high" }
							: { resizeHeight: HUGE_SOURCE, resizeQuality: "high" };
					const shrunk = await createImageBitmap(file, opts);
					bm.close();
					bm = shrunk;
				} catch {
					// Keep the original decode if the browser refuses to resize.
				}
			}
			bitmapRef.current?.close();
			bitmapRef.current = bm;
			setFileInfo({
				name: file.name,
				bytes: file.size,
				width: bm.width,
				height: bm.height,
			});
			setFileVersion((version) => version + 1);
		},
		[t],
	);

	// Re-encode immediately whenever options or the source change (doc §8).
	useEffect(() => {
		void process();
	}, [process, fileVersion]);

	const handleDragOver = useCallback(
		(event: React.DragEvent<HTMLDivElement>) => {
			event.preventDefault();
			event.stopPropagation();
			event.dataTransfer.dropEffect = "copy";
			setIsDragging(true);
		},
		[],
	);

	const handleDragLeave = useCallback(
		(event: React.DragEvent<HTMLDivElement>) => {
			event.preventDefault();
			event.stopPropagation();
			setIsDragging(false);
		},
		[],
	);

	const handleDrop = useCallback(
		(event: React.DragEvent<HTMLDivElement>) => {
			event.preventDefault();
			event.stopPropagation();
			setIsDragging(false);
			void loadFile(event.dataTransfer.files?.[0]);
		},
		[loadFile],
	);

	const handleDownload = useCallback(() => {
		if (!result) return;
		const filename = `${mode}-${TARGETS[mode].size}.${EXT[result.fmt]}`;
		const anchor = document.createElement("a");
		anchor.href = result.url;
		anchor.download = filename;
		document.body.appendChild(anchor);
		anchor.click();
		anchor.remove();
	}, [mode, result]);

	const target = TARGETS[mode];
	const overBudget = result !== null && result.bytes > target.budget;
	const downloadName = result
		? `${mode}-${target.size}.${EXT[result.fmt]}`
		: "";

	return (
		<ToolPageLayout
			header={
				<ToolHeader
					icon={<ImageDown aria-hidden className="h-5 w-5" />}
					title={t("tools.emojiResizer.title")}
				/>
			}
		>
			<div className="space-y-6">
				{/* UPLOAD */}
				<div className="space-y-2">
					<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
						{t("tools.emojiResizer.uploadLabel")}
					</p>
					<div
						role="button"
						tabIndex={0}
						aria-label={t("tools.emojiResizer.uploadFileAria")}
						onDragOver={handleDragOver}
						onDragLeave={handleDragLeave}
						onDrop={handleDrop}
						onClick={() => inputRef.current?.click()}
						onKeyDown={(event) => {
							if (event.key === "Enter" || event.key === " ") {
								event.preventDefault();
								inputRef.current?.click();
							}
						}}
						className={`flex h-32 w-full cursor-pointer flex-col items-center justify-center gap-1 border-2 border-dashed border-ink px-4 text-center transition-colors ${
							isDragging
								? "border-hazard bg-hazard/5"
								: "hover:border-muted-foreground"
						}`}
					>
						<p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
							{isDragging
								? t("tools.emojiResizer.dropHere")
								: t("tools.emojiResizer.dropOrClick")}
						</p>
						{fileInfo && (
							<p className="font-mono text-[10px] uppercase tracking-[0.08em] break-all">
								{fileInfo.name} · {fileInfo.width}×{fileInfo.height}px ·{" "}
								{formatKb(fileInfo.bytes)} KB
							</p>
						)}
					</div>
					<input
						ref={inputRef}
						type="file"
						accept="image/*"
						className="hidden"
						onChange={(event) => {
							void loadFile(event.target.files?.[0]);
							event.target.value = "";
						}}
					/>
				</div>

				{/* OPTIONS */}
				<div className="space-y-3">
					<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
						{t("tools.emojiResizer.optionsLabel")}
					</p>

					<div className="flex flex-wrap items-center gap-2">
						<span className="font-mono text-[11px] uppercase tracking-[0.08em]">
							{t("tools.emojiResizer.modeLabel")}
						</span>
						<Tabs
							value={mode}
							onValueChange={(value) => setMode(value as Mode)}
						>
							<TabsList>
								<TabsTrigger value="emoji">
									{t("tools.emojiResizer.modeEmoji")}
									<span className="ml-2 font-mono text-[9px] uppercase tracking-[0.08em] text-muted-foreground">
										128×128 · 256 KB
									</span>
								</TabsTrigger>
								<TabsTrigger value="sticker">
									{t("tools.emojiResizer.modeSticker")}
									<span className="ml-2 font-mono text-[9px] uppercase tracking-[0.08em] text-muted-foreground">
										320×320 · 512 KB
									</span>
								</TabsTrigger>
							</TabsList>
						</Tabs>
					</div>

					<div className="flex flex-wrap items-center gap-2">
						<span className="font-mono text-[11px] uppercase tracking-[0.08em]">
							{t("tools.emojiResizer.fitLabel")}
						</span>
						<Select
							value={fit}
							onValueChange={(value) => setFit(value as Fit)}
						>
							<SelectTrigger
								className="w-40"
								aria-label={t("tools.emojiResizer.fitAria")}
							>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="contain">
									{t("tools.emojiResizer.fitContain")}
								</SelectItem>
								<SelectItem value="cover">
									{t("tools.emojiResizer.fitCover")}
								</SelectItem>
							</SelectContent>
						</Select>

						<span className="font-mono text-[11px] uppercase tracking-[0.08em]">
							{t("tools.emojiResizer.formatLabel")}
						</span>
						<Select
							value={format}
							onValueChange={(value) => setFormat(value as Fmt)}
						>
							<SelectTrigger
								className="w-32"
								aria-label={t("tools.emojiResizer.formatAria")}
							>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="png">PNG</SelectItem>
								<SelectItem value="webp">WEBP</SelectItem>
								<SelectItem value="jpeg">JPEG</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{(format === "webp" || format === "jpeg") && (
						<div className="flex items-center gap-3">
							<span className="font-mono text-[11px] uppercase tracking-[0.08em]">
								{t("tools.emojiResizer.qualityLabel")}
							</span>
							<Slider
								className="max-w-xs flex-1"
								min={50}
								max={100}
								step={1}
								value={[quality]}
								onValueChange={(value) => setQuality(value[0])}
								aria-label={t("tools.emojiResizer.qualityAria")}
							/>
							<span className="font-mono text-[11px] tabular-nums">
								{quality}
							</span>
						</div>
					)}
				</div>

				{/* PREVIEW */}
				<div className="space-y-2">
					<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
						{t("tools.emojiResizer.previewLabel")}
					</p>
					{result ? (
						<div className="space-y-2">
							<div className="flex flex-wrap items-center gap-4 border border-ink bg-muted/40 p-4">
								<NextImage
									src={result.url}
									alt={t("tools.emojiResizer.title")}
									width={TARGETS[mode].size}
									height={TARGETS[mode].size}
									unoptimized
									className="h-40 w-40 object-contain"
								/>
								<div className="space-y-2">
									<span
										className={`inline-block border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.08em] ${
											overBudget
												? "border-hazard text-hazard-text"
												: "border-ink bg-ink text-paper"
										}`}
									>
										{overBudget
											? t("tools.emojiResizer.overBudget")
											: t("tools.emojiResizer.withinLimit")}
									</span>
									<p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
										{TARGETS[mode].size}×{TARGETS[mode].size}px ·{" "}
										{formatKb(result.bytes)} /{" "}
										{formatKb(target.budget)} KB ·{" "}
										{EXT[result.fmt].toUpperCase()}
									</p>
									<Button
										onClick={handleDownload}
										aria-label={t("tools.emojiResizer.downloadAria", {
											filename: downloadName,
										})}
									>
										<DownloadIcon aria-hidden className="mr-2 h-4 w-4" />
										{t("tools.emojiResizer.downloadButton")}
									</Button>
									{result.fmt === "jpeg" && (
										<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
											{t("tools.emojiResizer.jpegNote")}
										</p>
									)}
								</div>
							</div>
						</div>
					) : (
						<div className="flex h-24 items-center justify-center border border-ink bg-muted/40 font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
							—
						</div>
					)}
				</div>

				<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
					STATIC BASE ONLY · ANIMATED STICKERS NEED APNG
				</p>
			</div>
		</ToolPageLayout>
	);
};

export default EmojiResizerPage;
