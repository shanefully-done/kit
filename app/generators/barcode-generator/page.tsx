"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import JsBarcode from "jsbarcode";
import { Input } from "@/components/ui/input";
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

import { ToolPageLayout } from "@/components/ToolPageLayout";
import { ToolHeader } from "@/components/ToolHeader";
import { Barcode, Download } from "lucide-react";

type BarcodeFormat =
	| "CODE128"
	| "EAN13"
	| "EAN8"
	| "UPC"
	| "CODE39"
	| "ITF14"
	| "MSI"
	| "pharmacode";

const FORMAT_DEFAULTS: Record<BarcodeFormat, string> = {
	CODE128: "KIT-2.6",
	EAN13: "5901234123457",
	EAN8: "96385074",
	UPC: "012345678905",
	CODE39: "KIT-26",
	ITF14: "12345678901231",
	MSI: "1234567890",
	pharmacode: "6",
};

const FORMATS: BarcodeFormat[] = [
	"CODE128",
	"EAN13",
	"EAN8",
	"UPC",
	"CODE39",
	"ITF14",
	"MSI",
	"pharmacode",
];

export default function BarcodeGeneratorPage() {
	const [format, setFormat] = useState<BarcodeFormat>("CODE128");
	const [value, setValue] = useState(FORMAT_DEFAULTS.CODE128);
	const [barWidth, setBarWidth] = useState(2);
	const [barHeight, setBarHeight] = useState(60);
	const [showText, setShowText] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const svgRef = useRef<SVGSVGElement>(null);
	const objectUrlRef = useRef<string | null>(null);

	const renderBarcode = useCallback(() => {
		if (!svgRef.current) return;
		setError(null);

		try {
			JsBarcode(svgRef.current, value, {
				format,
				width: barWidth,
				height: barHeight,
				displayValue: showText,
				lineColor: "#0A0A0A",
				background: "#FCFCFA",
				margin: 10,
			});
		} catch {
			setError(`INVALID VALUE FOR ${format}`);
		}
	}, [value, format, barWidth, barHeight, showText]);

	useEffect(() => {
		renderBarcode();
	}, [renderBarcode]);

	useEffect(() => {
		return () => {
			if (objectUrlRef.current) {
				URL.revokeObjectURL(objectUrlRef.current);
			}
		};
	}, []);

	const handleFormatChange = (newFormat: BarcodeFormat) => {
		setFormat(newFormat);
		setValue(FORMAT_DEFAULTS[newFormat]);
	};

	const handleDownload = () => {
		const svg = svgRef.current;
		if (!svg || error) return;

		if (objectUrlRef.current) {
			URL.revokeObjectURL(objectUrlRef.current);
		}

		const xml = new XMLSerializer().serializeToString(svg);
		const blob = new Blob([xml], { type: "image/svg+xml" });
		const url = URL.createObjectURL(blob);
		objectUrlRef.current = url;

		const link = document.createElement("a");
		link.href = url;
		link.download = `barcode-${format.toLowerCase()}.svg`;
		link.click();
		URL.revokeObjectURL(url);
		objectUrlRef.current = null;
	};

	return (
		<ToolPageLayout
			header={
				<ToolHeader
					icon={<Barcode aria-hidden="true" className="h-5 w-5" />}
					title="Barcode Generator"
				/>
			}
		>
			<div className="space-y-4">
				{/* Type */}
				<div className="space-y-2">
					<Label>FORMAT</Label>
					<Select
						value={format}
						onValueChange={(v) => handleFormatChange(v as BarcodeFormat)}
					>
						<SelectTrigger className="w-full font-mono">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{FORMATS.map((f) => (
								<SelectItem key={f} value={f} className="font-mono">
									{f}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Value */}
				<div className="space-y-2">
					<Label htmlFor="barcode-value">VALUE</Label>
					<Input
						id="barcode-value"
						value={value}
						onChange={(e) => setValue(e.target.value)}
						className="font-mono"
					/>
				</div>

				{/* Width */}
				<div className="space-y-2">
					<Label className="font-mono text-[11px] uppercase tracking-[0.08em]">
						WIDTH — {barWidth}
					</Label>
					<Slider
						min={1}
						max={4}
						step={1}
						value={[barWidth]}
						onValueChange={(v) => setBarWidth(v[0])}
						className="w-full"
					/>
				</div>

				{/* Height */}
				<div className="space-y-2">
					<Label className="font-mono text-[11px] uppercase tracking-[0.08em]">
						HEIGHT — {barHeight}
					</Label>
					<Slider
						min={20}
						max={100}
						step={1}
						value={[barHeight]}
						onValueChange={(v) => setBarHeight(v[0])}
						className="w-full"
					/>
				</div>

				{/* Show Text */}
				<div className="flex items-center justify-between border border-ink bg-muted/40 px-3 py-2">
					<Label
						htmlFor="show-text"
						className="font-mono text-[11px] uppercase tracking-[0.08em]"
					>
						SHOW TEXT
					</Label>
					<Switch id="show-text" checked={showText} onCheckedChange={setShowText} />
				</div>

				{/* Preview */}
				<div className="border border-ink bg-card p-4 grid place-items-center min-h-[120px]">
					{error ? (
						<div className="border border-hazard text-hazard font-mono text-[11px] uppercase tracking-[0.08em] px-3 py-2">
							[ {error} ]
						</div>
					) : (
						<svg ref={svgRef} />
					)}
				</div>

				{/* Download */}
				<Button
					onClick={handleDownload}
					disabled={!!error}
					className="w-full font-mono"
				>
					<Download aria-hidden="true" className="h-4 w-4 mr-2" />
					DOWNLOAD SVG
				</Button>
			</div>
		</ToolPageLayout>
	);
}
