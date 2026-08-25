"use client";

import React, { useState, useEffect, useCallback } from "react";
import { usePersistentState } from "@/hooks/use-persistent-state";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, PaletteIcon, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { ToolHeader } from "@/components/ToolHeader";
import { useI18n } from "@/lib/i18n";

interface ColorStop {
	id: string;
	color: string;
	position: number; // 0-100
}

type GradientType = "linear" | "radial";

const isRadialPosition = (v: unknown): v is { x: number; y: number } =>
	typeof v === "object" &&
	v !== null &&
	typeof (v as { x?: unknown }).x === "number" &&
	typeof (v as { y?: unknown }).y === "number";

const isColorStops = (v: unknown): v is ColorStop[] =>
	Array.isArray(v) &&
	v.length > 0 &&
	v.every(
		(s) =>
			typeof s === "object" &&
			s !== null &&
			typeof (s as ColorStop).id === "string" &&
			typeof (s as ColorStop).color === "string" &&
			typeof (s as ColorStop).position === "number",
	);

export default function GradientGeneratorPage() {
	const { t } = useI18n();
	const [gradientType, setGradientType] = usePersistentState<GradientType>(
		"gradient:gradientType",
		"linear",
	);
	const [angle, setAngle] = usePersistentState("gradient:angle", 90);
	const [radialPosition, setRadialPosition] = usePersistentState(
		"gradient:radialPosition",
		{ x: 50, y: 50 },
		isRadialPosition,
	);
	const [colorStops, setColorStops] = usePersistentState<ColorStop[]>(
		"gradient:colorStops",
		[
			{ id: "1", color: "#FF0000", position: 0 },
			{ id: "2", color: "#0000FF", position: 100 },
		],
		isColorStops,
	);
	const [cssOutput, setCssOutput] = useState("");

	const updateCssOutput = useCallback(() => {
		const sortedColorStops = [...colorStops].sort(
			(a, b) => a.position - b.position,
		);
		const stops = sortedColorStops
			.map((stop) => `${stop.color} ${stop.position}%`)
			.join(", ");

		let css = "";
		if (gradientType === "linear") {
			css = `linear-gradient(${angle}deg, ${stops})`;
		} else {
			css = `radial-gradient(at ${radialPosition.x}% ${radialPosition.y}%, ${stops})`;
		}
		setCssOutput(css);
	}, [colorStops, gradientType, angle, radialPosition.x, radialPosition.y]);

	useEffect(() => {
		updateCssOutput();
	}, [updateCssOutput]);

	const addColorStop = () => {
		const newId = String(colorStops.length + 1);
		setColorStops([...colorStops, { id: newId, color: "#FFFFFF", position: 50 }]);
	};

	const removeColorStop = (id: string) => {
		setColorStops(colorStops.filter((stop) => stop.id !== id));
	};

	const handleColorChange = (id: string, newColor: string) => {
		setColorStops(
			colorStops.map((stop) =>
				stop.id === id ? { ...stop, color: newColor } : stop,
			),
		);
	};

	const handlePositionChange = (id: string, newPosition: number[]) => {
		setColorStops(
			colorStops.map((stop) =>
				stop.id === id ? { ...stop, position: newPosition[0] } : stop,
			),
		);
	};

	const handleCopyCss = () => {
		navigator.clipboard.writeText(cssOutput).then(() => {
			toast.success(t("tools.gradient.copied"));
		}).catch(() => {
			toast.error(t("common.copyFailed"));
		});
	};

	return (
		<ToolPageLayout
			header={
				<ToolHeader
					title={t("tools.gradient.title")}
					icon={<PaletteIcon aria-hidden="true" className="h-5 w-5" />}
				/>
			}
		>
			<div className="space-y-4">
				{/* Type Toggle */}
				<div className="space-y-2">
					<Label>{t("tools.gradient.typeLabel")}</Label>
					<Tabs
						value={gradientType}
						onValueChange={(val) => setGradientType(val as GradientType)}
					>
						<TabsList>
							<TabsTrigger value="linear">{t("tools.gradient.linear")}</TabsTrigger>
							<TabsTrigger value="radial">{t("tools.gradient.radial")}</TabsTrigger>
						</TabsList>
					</Tabs>
				</div>

				{/* Angle / Radial Position */}
				{gradientType === "linear" && (
					<div className="space-y-2">
						<Label
							htmlFor="angle"
							className="font-mono text-[11px] uppercase tracking-[0.08em]"
						>
							{t("tools.gradient.angleLabel", { angle })}
						</Label>
						<Slider
							id="angle"
							min={0}
							max={360}
							step={1}
							value={[angle]}
							onValueChange={(val) => setAngle(val[0])}
							className="w-full"
						/>
					</div>
				)}

				{gradientType === "radial" && (
					<div className="space-y-2">
						<Label className="font-mono text-[11px] uppercase tracking-[0.08em]">
							{t("tools.gradient.positionLabel", { x: radialPosition.x, y: radialPosition.y })}
						</Label>
						<div className="flex gap-4">
							<div className="flex-1 space-y-1">
								<Label
									htmlFor="radial-x"
									className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground"
								>
									X
								</Label>
								<Slider
									id="radial-x"
									min={0}
									max={100}
									step={1}
									value={[radialPosition.x]}
									onValueChange={(val) =>
										setRadialPosition({ ...radialPosition, x: val[0] })
									}
									className="w-full"
								/>
							</div>
							<div className="flex-1 space-y-1">
								<Label
									htmlFor="radial-y"
									className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground"
								>
									Y
								</Label>
								<Slider
									id="radial-y"
									min={0}
									max={100}
									step={1}
									value={[radialPosition.y]}
									onValueChange={(val) =>
										setRadialPosition({ ...radialPosition, y: val[0] })
								}
									className="w-full"
								/>
							</div>
						</div>
					</div>
				)}

				{/* Color Stops */}
				<div className="space-y-2">
					<p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
						[ {t("tools.gradient.colorStops")} ]
					</p>
					<div>
						{colorStops.map((stop) => (
							<div
								key={stop.id}
								className="grid grid-cols-[auto_1fr_auto] items-center gap-2 border-b border-ink py-2"
							>
								<Input
									type="color"
									value={stop.color}
									onChange={(e) => handleColorChange(stop.id, e.target.value)}
									className="h-8 w-10 border border-ink bg-card p-0.5 cursor-pointer"
								/>
								<Slider
									min={0}
									max={100}
									step={1}
									value={[stop.position]}
									onValueChange={(val) => handlePositionChange(stop.id, val)}
								/>
								<span className="font-mono text-sm w-12 text-right">
									{stop.position}%
								</span>
								<Button
									variant="outline"
									size="sm"
									onClick={() => removeColorStop(stop.id)}
									aria-label={t("tools.gradient.removeStopAria", { id: stop.id })}
								>
									<X className="h-4 w-4" aria-hidden="true" />
								</Button>
							</div>
						))}
					</div>
					<Button variant="outline" onClick={addColorStop}>
						<Plus className="h-4 w-4 mr-2" aria-hidden="true" />
						{t("tools.gradient.addStop")}
					</Button>
				</div>

				{/* Preview — functional gradient surface */}
				<div className="space-y-2">
					<p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
						[ {t("tools.gradient.preview")} ]
					</p>
					<div
						style={{ background: cssOutput }}
						className="w-full h-64 border-2 border-ink"
					/>
				</div>

				{/* CSS Output */}
				<div className="space-y-2">
					<p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
						[ {t("tools.gradient.cssOutput")} ]
					</p>
					<div className="relative">
						<div className="border border-ink bg-muted/40 p-3 font-mono text-sm break-all pr-10">
							{cssOutput}
						</div>
						<Button
							variant="outline"
							size="sm"
							className="absolute right-1 top-1"
							onClick={handleCopyCss}
							aria-label={t("tools.gradient.copyCssAria")}
						>
							<Copy className="h-4 w-4" aria-hidden="true" />
						</Button>
					</div>
				</div>
			</div>
		</ToolPageLayout>
	);
}
