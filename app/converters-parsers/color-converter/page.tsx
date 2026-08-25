"use client";

import { useMemo } from "react";
import { usePersistentState } from "@/hooks/use-persistent-state";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Copy, Palette as PaletteIcon } from "lucide-react";
import { toast } from "sonner";
import ToolPageLayout from "@/components/ToolPageLayout";
import ToolHeader from "@/components/ToolHeader";

type Rgb = { r: number; g: number; b: number };

function clampByte(n: number): number {
	return Math.max(0, Math.min(255, Math.round(n)));
}

function normalizeHex(raw: string): string | null {
	let v = raw.trim().replace(/^#/, "");
	if (/^[0-9a-fA-F]{3}$/.test(v)) {
		v = v
			.split("")
			.map((c) => c + c)
			.join("");
	}
	if (!/^[0-9a-fA-F]{6}$/.test(v)) return null;
	return "#" + v.toUpperCase();
}

function hexToRgb(hex: string): Rgb {
	const v = hex.replace(/^#/, "");
	return {
		r: parseInt(v.slice(0, 2), 16),
		g: parseInt(v.slice(2, 4), 16),
		b: parseInt(v.slice(4, 6), 16),
	};
}

function rgbToHex({ r, g, b }: Rgb): string {
	const h = (n: number) => clampByte(n).toString(16).padStart(2, "0");
	return ("#" + h(r) + h(g) + h(b)).toUpperCase();
}

function rgbToHsl({ r, g, b }: Rgb): string {
	const rn = r / 255;
	const gn = g / 255;
	const bn = b / 255;
	const max = Math.max(rn, gn, bn);
	const min = Math.min(rn, gn, bn);
	const l = (max + min) / 2;
	let h = 0;
	let s = 0;
	if (max !== min) {
		const d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch (max) {
			case rn:
				h = (gn - bn) / d + (gn < bn ? 6 : 0);
				break;
			case gn:
				h = (bn - rn) / d + 2;
				break;
			default:
				h = (rn - gn) / d + 4;
		}
		h *= 60;
	}
	const hs = Math.round(h).toString();
	const ss = Math.round(s * 100).toString() + "%";
	const ls = Math.round(l * 100).toString() + "%";
	return `hsl(${hs}, ${ss}, ${ls})`;
}

function srgbChannelToLinear(c: number): number {
	const cn = c / 255;
	return cn <= 0.04045 ? cn / 12.92 : Math.pow((cn + 0.055) / 1.055, 2.4);
}

function rgbToOklch({ r, g, b }: Rgb): string {
	const lr = srgbChannelToLinear(r);
	const lg = srgbChannelToLinear(g);
	const lb = srgbChannelToLinear(b);

	// linear sRGB -> LMS (cone response)
	const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
	const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
	const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;

	const l_ = Math.cbrt(l);
	const m_ = Math.cbrt(m);
	const s_ = Math.cbrt(s);

	// LMS' -> OKLab
	const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
	const A = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
	const B = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;

	const C = Math.sqrt(A * A + B * B);
	let H = (Math.atan2(B, A) * 180) / Math.PI;
	if (H < 0) H += 360;

	return `oklch(${(Math.round(L * 1000) / 1000).toFixed(3)} ${(
		Math.round(C * 1000) / 1000
	).toFixed(3)} ${(Math.round(H * 10) / 10).toFixed(1)})`;
}

function relativeLuminance({ r, g, b }: Rgb): number {
	return (
		0.2126 * srgbChannelToLinear(r) +
		0.7152 * srgbChannelToLinear(g) +
		0.0722 * srgbChannelToLinear(b)
	);
}

function contrastRatio(a: Rgb, b: Rgb): number {
	const la = relativeLuminance(a);
	const lb = relativeLuminance(b);
	const lighter = Math.max(la, lb);
	const darker = Math.min(la, lb);
	return (lighter + 0.05) / (darker + 0.05);
}

type FormatRow = { label: string; value: string };

function copyText(value: string) {
	navigator.clipboard.writeText(value).then(
		() => toast.success("COPIED"),
		() => toast.error("COPY FAILED"),
	);
}

const isHex = (v: unknown): v is string =>
	typeof v === "string" && /^#[0-9a-fA-F]{3,8}$/.test(v);
export default function ColorConverterPage() {
	const [hexInput, setHexInput] = usePersistentState(
		"color-converter:hexInput",
		"#0A0A0A",
		isHex,
	);
	const [fgHex, setFgHex] = usePersistentState(
		"color-converter:fgHex",
		"#0A0A0A",
		isHex,
	);
	const [bgHex, setBgHex] = usePersistentState(
		"color-converter:bgHex",
		"#F4F4F0",
		isHex,
	);

	const normalized = normalizeHex(hexInput);

	const formats: FormatRow[] = useMemo(() => {
		if (!normalized) return [];
		const rgb = hexToRgb(normalized);
		return [
			{ label: "HEX", value: rgbToHex(rgb) },
			{ label: "RGB", value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
			{ label: "HSL", value: rgbToHsl(rgb) },
			{ label: "OKLCH", value: rgbToOklch(rgb) },
		];
	}, [normalized]);

	const fgRgb = useMemo(() => hexToRgb(fgHex), [fgHex]);
	const bgRgb = useMemo(() => hexToRgb(bgHex), [bgHex]);
	const ratio = useMemo(() => contrastRatio(fgRgb, bgRgb), [fgRgb, bgRgb]);

	const checks = [
		{ label: "AA NORMAL", threshold: 4.5 },
		{ label: "AA LARGE", threshold: 3 },
		{ label: "AAA NORMAL", threshold: 7 },
		{ label: "AAA LARGE", threshold: 4.5 },
	];

	return (
		<ToolPageLayout
			header={
				<ToolHeader
					icon={<PaletteIcon aria-hidden className="h-5 w-5" />}
					title="Color Converter"
				/>
			}
		>
			<div className="space-y-6">
				{/* CONVERSION */}
				<section className="space-y-3">
					<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
						[ CONVERSION ]
					</p>
					<div className="flex items-center gap-3 border border-ink bg-muted/40 px-3 py-2">
						<input
							type="color"
							value={normalized ?? "#000000"}
							onChange={(e) => setHexInput(e.target.value.toUpperCase())}
							aria-label="Pick color"
							className="h-8 w-12 cursor-pointer border border-ink bg-card p-0.5"
						/>
						<Input
							value={hexInput}
							onChange={(e) => setHexInput(e.target.value)}
							placeholder="#0A0A0A"
							className="w-32 font-mono"
						/>
						{!normalized && (
							<span className="font-mono text-[11px] uppercase tracking-[0.08em] text-hazard-text">
								[ INVALID HEX ]
							</span>
						)}
					</div>
					{formats.map((row) => (
						<div
							key={row.label}
							className="flex items-center justify-between gap-3 border border-ink bg-muted/40 px-3 py-3"
						>
							<div className="min-w-0">
								<p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
									{row.label}
								</p>
								<p className="truncate font-mono">{row.value}</p>
							</div>
							<Button variant="outline" size="sm" onClick={() => copyText(row.value)}>
								<Copy aria-hidden className="h-3.5 w-3.5" />
								COPY
							</Button>
						</div>
					))}
				</section>

				{/* CONTRAST CHECK */}
				<section className="space-y-3">
					<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
						[ CONTRAST CHECK ]
					</p>

					<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
						<div className="flex items-center justify-between border border-ink bg-muted/40 px-3 py-2">
							<span className="font-mono text-[11px] uppercase tracking-[0.08em]">
								FOREGROUND
							</span>
							<div className="flex items-center gap-2">
								<Input
									value={fgHex}
									onChange={(e) => setFgHex(e.target.value)}
									className="h-8 w-24 font-mono"
								/>
								<input
									type="color"
									value={normalizeHex(fgHex) ?? "#000000"}
									onChange={(e) => setFgHex(e.target.value.toUpperCase())}
									aria-label="Foreground color"
									className="h-8 w-12 cursor-pointer border border-ink bg-card p-0.5"
								/>
							</div>
						</div>
						<div className="flex items-center justify-between border border-ink bg-muted/40 px-3 py-2">
							<span className="font-mono text-[11px] uppercase tracking-[0.08em]">
								BACKGROUND
							</span>
							<div className="flex items-center gap-2">
								<Input
									value={bgHex}
									onChange={(e) => setBgHex(e.target.value)}
									className="h-8 w-24 font-mono"
								/>
								<input
									type="color"
									value={normalizeHex(bgHex) ?? "#FFFFFF"}
									onChange={(e) => setBgHex(e.target.value.toUpperCase())}
									aria-label="Background color"
									className="h-8 w-12 cursor-pointer border border-ink bg-card p-0.5"
								/>
							</div>
						</div>
					</div>

					<div className="border border-ink bg-muted/40 px-3 py-3">
						<p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
							CONTRAST RATIO
						</p>
						<p className="font-mono text-2xl">{ratio.toFixed(2)} : 1</p>
					</div>

					<div
						className="border border-ink px-3 py-6"
						style={{ backgroundColor: normalizeHex(bgHex) ?? "#FFFFFF" }}
					>
						<p
							className="font-mono text-lg"
							style={{ color: normalizeHex(fgHex) ?? "#000000" }}
						>
							Aa KIT 123
						</p>
					</div>

					<div className="grid grid-cols-2">
						{checks.map((check) => {
							const pass = ratio >= check.threshold;
							return (
								<div
									key={check.label}
									className="flex flex-col gap-2 border border-ink px-3 py-3"
								>
									<span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
										{check.label} (≥{check.threshold})
									</span>
									<Badge
										variant={pass ? "secondary" : "destructive"}
										className="w-fit font-mono"
									>
										{pass ? "PASS" : "FAIL"}
									</Badge>
								</div>
							);
						})}
					</div>
				</section>
			</div>
		</ToolPageLayout>
	);
}
