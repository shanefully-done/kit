"use client";

import React, { useState, useCallback, useEffect } from "react";

import { usePersistentState } from "@/hooks/use-persistent-state";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { ToolHeader } from "@/components/ToolHeader";
import { ImagePlus, Copy, Download } from "lucide-react";

type BgColor = "ink" | "muted" | "paper" | "hazard";

const BG_COLORS: Record<BgColor, { bg: string; fg: string; label: string }> = {
	ink: { bg: "#0A0A0A", fg: "#F4F4F0", label: "INK" },
	muted: { bg: "#E9E8E2", fg: "#0A0A0A", label: "MUTED" },
	paper: { bg: "#FCFCFA", fg: "#0A0A0A", label: "PAPER" },
	hazard: { bg: "#E61919", fg: "#F4F4F0", label: "HAZARD" },
};

export default function SvgPlaceholderGeneratorPage() {
	const [width, setWidth] = usePersistentState(
		"svg-placeholder-generator:width",
		400,
	);
	const [height, setHeight] = usePersistentState(
		"svg-placeholder-generator:height",
		300,
	);
	const [bgColor, setBgColor] = usePersistentState<BgColor>(
		"svg-placeholder-generator:bgColor",
		"muted",
	);
	const [showDimensions, setShowDimensions] = usePersistentState(
		"svg-placeholder-generator:showDimensions",
		true,
	);
	const [outputTab, setOutputTab] = usePersistentState(
		"svg-placeholder-generator:outputTab",
		"preview",
	);
	const [svgCode, setSvgCode] = useState("");

	const generateSvg = useCallback(() => {
		const { bg, fg } = BG_COLORS[bgColor];
		const dimText = showDimensions ? `${width} x ${height}` : "";
		const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${bg}"/>${
			dimText
				? `
  <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-family="monospace" font-size="${Math.max(12, Math.min(width, height) / 8)}" fill="${fg}">${dimText}</text>`
				: ""
		}
</svg>`;
		setSvgCode(svg);
	}, [width, height, bgColor, showDimensions]);

	useEffect(() => {
		generateSvg();
	}, [generateSvg]);

	const handleCopySvg = () => {
		navigator.clipboard.writeText(svgCode);
		toast.success("COPIED");
	};

	const handleCopyDataUri = () => {
		const encoded = btoa(unescape(encodeURIComponent(svgCode)));
		navigator.clipboard.writeText(`data:image/svg+xml;base64,${encoded}`);
		toast.success("COPIED");
	};

	const handleDownload = () => {
		const blob = new Blob([svgCode], { type: "image/svg+xml" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `placeholder-${width}x${height}.svg`;
		link.click();
		URL.revokeObjectURL(url);
	};

	return (
		<ToolPageLayout
			header={
				<ToolHeader
					icon={<ImagePlus aria-hidden="true" className="h-5 w-5" />}
					title="SVG Placeholder Generator"
				/>
			}
		>
			<div className="space-y-4">
				{/* Width */}
				<div className="space-y-2">
					<Label className="font-mono text-[11px] uppercase tracking-[0.08em]">
						WIDTH — {width}px
					</Label>
					<Slider
						min={16}
						max={1920}
						step={1}
						value={[width]}
						onValueChange={(v) => setWidth(v[0])}
						className="w-full"
					/>
				</div>

				{/* Height */}
				<div className="space-y-2">
					<Label className="font-mono text-[11px] uppercase tracking-[0.08em]">
						HEIGHT — {height}px
					</Label>
					<Slider
						min={16}
						max={1080}
						step={1}
						value={[height]}
						onValueChange={(v) => setHeight(v[0])}
						className="w-full"
					/>
				</div>

				{/* Color */}
				<div className="space-y-2">
					<Label>BG COLOR</Label>
					<Select value={bgColor} onValueChange={(v) => setBgColor(v as BgColor)}>
						<SelectTrigger className="w-full font-mono">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{(Object.keys(BG_COLORS) as BgColor[]).map((key) => (
								<SelectItem key={key} value={key} className="font-mono">
									{BG_COLORS[key].label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Show Dimensions */}
				<div className="flex items-center justify-between border border-ink bg-muted/40 px-3 py-2">
					<Label
						htmlFor="show-dims"
						className="font-mono text-[11px] uppercase tracking-[0.08em]"
					>
						SHOW DIMENSIONS
					</Label>
					<Switch
						id="show-dims"
						checked={showDimensions}
						onCheckedChange={setShowDimensions}
					/>
				</div>

				{/* Output */}
				<Tabs value={outputTab} onValueChange={setOutputTab}>
					<TabsList>
						<TabsTrigger value="preview">PREVIEW</TabsTrigger>
						<TabsTrigger value="code">SVG CODE</TabsTrigger>
					</TabsList>
					<TabsContent value="preview">
						<div className="border border-ink bg-card p-4 grid place-items-center min-h-[120px]">
							<div
								dangerouslySetInnerHTML={{ __html: svgCode }}
								className="max-w-full overflow-auto"
								style={{ maxWidth: "100%" }}
							/>
						</div>
					</TabsContent>
					<TabsContent value="code">
						<div className="border border-ink bg-card p-3">
							<pre className="font-mono text-xs whitespace-pre-wrap break-all text-foreground">
								{svgCode}
							</pre>
						</div>
					</TabsContent>
				</Tabs>

				{/* Actions */}
				<div className="flex gap-2">
					<Button
						onClick={handleCopySvg}
						variant="outline"
						className="flex-1 font-mono"
					>
						<Copy aria-hidden="true" className="h-4 w-4 mr-2" />
						COPY SVG
					</Button>
					<Button
						onClick={handleCopyDataUri}
						variant="outline"
						className="flex-1 font-mono"
					>
						<Copy aria-hidden="true" className="h-4 w-4 mr-2" />
						COPY DATA URI
					</Button>
					<Button onClick={handleDownload} className="flex-1 font-mono">
						<Download aria-hidden="true" className="h-4 w-4 mr-2" />
						DOWNLOAD
					</Button>
				</div>
			</div>
		</ToolPageLayout>
	);
}
