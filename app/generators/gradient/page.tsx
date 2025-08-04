"use client";

import React, { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, PaletteIcon } from "lucide-react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { ToolHeader } from "@/components/ToolHeader";
import { Card } from "@/components/ui/card";

interface ColorStop {
	id: string;
	color: string;
	position: number; // 0-100
}

type GradientType = "linear" | "radial";

export default function GradientGeneratorPage() {
	const [gradientType, setGradientType] = useState<GradientType>("linear");
	const [angle, setAngle] = useState<number>(90); // For linear gradient
	const [radialPosition, setRadialPosition] = useState<{ x: number; y: number }>(
		{ x: 50, y: 50 }
	); // For radial gradient
	const [colorStops, setColorStops] = useState<ColorStop[]>([
		{ id: "1", color: "#FF0000", position: 0 },
		{ id: "2", color: "#0000FF", position: 100 },
	]);
	const [cssOutput, setCssOutput] = useState("");

	useEffect(() => {
		updateCssOutput();
	}, [gradientType, angle, radialPosition, colorStops]);

	const updateCssOutput = () => {
		const sortedColorStops = [...colorStops].sort(
			(a, b) => a.position - b.position
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
	};

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
				stop.id === id ? { ...stop, color: newColor } : stop
			)
		);
	};

	const handlePositionChange = (id: string, newPosition: number[]) => {
		setColorStops(
			colorStops.map((stop) =>
				stop.id === id ? { ...stop, position: newPosition[0] } : stop
			)
		);
	};

	const handleCopyCss = () => {
		navigator.clipboard.writeText(cssOutput);
	};

	return (
		<ToolPageLayout
			header={
				<ToolHeader
					title="Gradient Generator"
					icon={<PaletteIcon aria-hidden="true" className="h-5 w-5" />}
				/>
			}
		>
			<div className="space-y-4">
				{/* InputArea / Controls */}
				<div className="space-y-4">
					<div className="space-y-2">
						<label className="text-sm font-medium" htmlFor="gradient-type">
							Gradient Type
						</label>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" className="w-full justify-between">
									{gradientType === "linear" ? "Linear" : "Radial"}
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuItem onClick={() => setGradientType("linear")}>
									Linear
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => setGradientType("radial")}>
									Radial
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					{gradientType === "linear" && (
						<div className="space-y-2">
							<Label htmlFor="angle">Angle ({angle}deg)</Label>
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
							<Label>
								Radial Position (X: {radialPosition.x}%, Y: {radialPosition.y}%)
							</Label>
							<div className="flex gap-4">
								<div className="flex-1 space-y-1">
									<Label htmlFor="radial-x">X</Label>
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
									<Label htmlFor="radial-y">Y</Label>
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

					<div className="space-y-2">
						<span className="text-sm font-medium">Color Stops</span>
						{colorStops.map((stop) => (
							<div key={stop.id} className="flex items-center gap-4">
								<Input
									type="color"
									value={stop.color}
									onChange={(e) => handleColorChange(stop.id, e.target.value)}
									className="w-16 h-10 p-1"
								/>
								<Slider
									min={0}
									max={100}
									step={1}
									value={[stop.position]}
									onValueChange={(val) => handlePositionChange(stop.id, val)}
									className="flex-1"
								/>
								<span className="w-12 text-right text-sm">{stop.position}%</span>
								<Button
									variant="destructive"
									size="sm"
									onClick={() => removeColorStop(stop.id)}
								>
									Remove
								</Button>
							</div>
						))}
						<div className="flex flex-wrap gap-2">
							<Button onClick={addColorStop}>Add Color Stop</Button>
						</div>
					</div>
				</div>

				{/* ResultDisplay */}
				<div className="space-y-2">
					<span className="text-sm font-medium">Preview</span>
					<div
						style={{ background: cssOutput }}
						className="w-full h-64 rounded-md border"
					/>
				</div>

				{/* ActionButtons */}
				<div className="space-y-2">
					<label className="text-sm font-medium">CSS Output</label>
					<div className="relative">
						<Input type="text" value={cssOutput} readOnly className="pr-10" />
						<Button
							variant="ghost"
							size="sm"
							className="absolute right-0 top-0 h-full px-3 py-1"
							onClick={handleCopyCss}
							aria-label="Copy CSS"
						>
							<Copy className="h-4 w-4" aria-hidden="true" />
						</Button>
					</div>
				</div>
			</div>
		</ToolPageLayout>
	);
}
