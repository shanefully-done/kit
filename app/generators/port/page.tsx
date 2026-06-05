"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { ToolHeader } from "@/components/ToolHeader";
import { Switch } from "@/components/ui/switch";
import { EthernetPort as EthernetPortIcon } from "lucide-react";

const RESERVED_PORT_CEILING = 1024;

function getRandomPort(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function PortGeneratorPage() {
	const [numPorts, setNumPorts] = useState(1);
	const [minPort, setMinPort] = useState(RESERVED_PORT_CEILING);
	const [maxPort, setMaxPort] = useState(65535);
	const [avoidReserved, setAvoidReserved] = useState(true);
	const [generatedPorts, setGeneratedPorts] = useState("");
	const [copyStatus, setCopyStatus] = useState("Copy");

	useEffect(() => {
		generatePorts();
	}, []);

	const effectiveMin = avoidReserved
		? Math.max(minPort, RESERVED_PORT_CEILING)
		: minPort;

	const generatePorts = () => {
		const clampedMin = Math.max(0, Math.min(65535, effectiveMin));
		const clampedMax = Math.max(0, Math.min(65535, maxPort));
		const lo = Math.min(clampedMin, clampedMax);
		const hi = Math.max(clampedMin, clampedMax);

		const ports: number[] = [];
		for (let i = 0; i < numPorts; i++) {
			ports.push(getRandomPort(lo, hi));
		}
		setGeneratedPorts(ports.join("\n"));
		setCopyStatus("Copy");
	};

	const handleAvoidReservedChange = (checked: boolean) => {
		setAvoidReserved(checked);
		if (checked && minPort < RESERVED_PORT_CEILING) {
			setMinPort(RESERVED_PORT_CEILING);
		}
	};

	const copyToClipboard = () => {
		navigator.clipboard.writeText(generatedPorts).then(
			() => {
				setCopyStatus("Copied!");
				setTimeout(() => setCopyStatus("Copy"), 2000);
			},
			(err) => {
				setCopyStatus("Failed to copy!");
				console.error("Could not copy text: ", err);
			}
		);
	};

	return (
		<ToolPageLayout
			header={
				<ToolHeader
					icon={<EthernetPortIcon aria-hidden />}
					title="Port Number Generator"
				/>
			}
		>
			<div className="space-y-4">
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
					<div className="grid gap-2">
						<Label htmlFor="num-ports" className="text-sm">
							Number of ports
						</Label>
						<Input
							id="num-ports"
							type="number"
							min={1}
							max={100}
							value={numPorts}
							onChange={(e) => setNumPorts(parseInt(e.target.value) || 1)}
							className="w-full"
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="min-port" className="text-sm">
							Min port
						</Label>
						<Input
							id="min-port"
							type="number"
							min={0}
							max={65535}
							value={minPort}
							onChange={(e) => setMinPort(parseInt(e.target.value) || 0)}
							className="w-full"
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="max-port" className="text-sm">
							Max port
						</Label>
						<Input
							id="max-port"
							type="number"
							min={0}
							max={65535}
							value={maxPort}
							onChange={(e) => setMaxPort(parseInt(e.target.value) || 0)}
							className="w-full"
						/>
					</div>
				</div>

				<div className="flex items-center gap-2">
					<Switch
						id="avoid-reserved"
						checked={avoidReserved}
						onCheckedChange={handleAvoidReservedChange}
					/>
					<Label htmlFor="avoid-reserved" className="text-sm">
						Avoid reserved ports (0–1023)
					</Label>
				</div>

				<div className="flex flex-wrap gap-2">
					<Button onClick={generatePorts}>Generate Port(s)</Button>
					<Button
						variant="ghost"
						onClick={copyToClipboard}
						aria-label="Copy generated ports"
					>
						{copyStatus}
					</Button>
				</div>

				<Separator />

				<div className="grid gap-2">
					<Label htmlFor="generated-ports" className="text-sm">
						Generated Port(s)
					</Label>
					<Textarea
						id="generated-ports"
						value={generatedPorts}
						readOnly
						rows={10}
						className="font-mono resize-y"
						placeholder="Generated ports will appear here..."
					/>
				</div>
			</div>
		</ToolPageLayout>
	);
}
