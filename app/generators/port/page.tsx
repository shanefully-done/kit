"use client";

import { useState, useEffect, useCallback } from "react";
import { usePersistentState } from "@/hooks/use-persistent-state";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { ToolHeader } from "@/components/ToolHeader";
import { EthernetPort as EthernetPortIcon } from "lucide-react";

const RESERVED_PORT_CEILING = 1024;

function getRandomPort(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function PortGeneratorPage() {
	const [numPorts, setNumPorts] = usePersistentState("port:numPorts", 1);
	const [minPort, setMinPort] = usePersistentState(
		"port:minPort",
		RESERVED_PORT_CEILING,
	);
	const [maxPort, setMaxPort] = usePersistentState("port:maxPort", 65535);
	const [avoidReserved, setAvoidReserved] = usePersistentState(
		"port:avoidReserved",
		true,
	);
	const [generatedPorts, setGeneratedPorts] = useState("");
	const [copyStatus, setCopyStatus] = useState("Copy");

	const effectiveMin = avoidReserved
		? Math.max(minPort, RESERVED_PORT_CEILING)
		: minPort;

	const generatePorts = useCallback(() => {
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
	}, [effectiveMin, maxPort, numPorts]);

	useEffect(() => {
		generatePorts();
	}, [generatePorts]);

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
			},
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
					<div className="flex items-center justify-between border border-ink bg-muted/40 px-3 py-2">
						<Label
							htmlFor="num-ports"
							className="font-mono text-[11px] uppercase tracking-[0.08em]"
						>
							Count
						</Label>
						<Input
							id="num-ports"
							type="number"
							min={1}
							max={100}
							value={numPorts}
							onChange={(e) => setNumPorts(parseInt(e.target.value) || 1)}
							className="w-20"
						/>
					</div>
					<div className="flex items-center justify-between border border-ink bg-muted/40 px-3 py-2">
						<Label
							htmlFor="min-port"
							className="font-mono text-[11px] uppercase tracking-[0.08em]"
						>
							Min Port
						</Label>
						<Input
							id="min-port"
							type="number"
							min={0}
							max={65535}
							value={minPort}
							onChange={(e) => setMinPort(parseInt(e.target.value) || 0)}
							className="w-20"
						/>
					</div>
					<div className="flex items-center justify-between border border-ink bg-muted/40 px-3 py-2">
						<Label
							htmlFor="max-port"
							className="font-mono text-[11px] uppercase tracking-[0.08em]"
						>
							Max Port
						</Label>
						<Input
							id="max-port"
							type="number"
							min={0}
							max={65535}
							value={maxPort}
							onChange={(e) => setMaxPort(parseInt(e.target.value) || 0)}
							className="w-20"
						/>
					</div>
				</div>

				<div className="flex items-center justify-between border border-ink bg-muted/40 px-3 py-2">
					<Label
						htmlFor="avoid-reserved"
						className="font-mono text-[11px] uppercase tracking-[0.08em]"
					>
						Avoid Reserved (0–1023)
					</Label>
					<Switch
						id="avoid-reserved"
						checked={avoidReserved}
						onCheckedChange={handleAvoidReservedChange}
					/>
				</div>

				<div className="flex flex-wrap gap-2">
					<Button onClick={generatePorts}>Generate</Button>
					<Button
						variant="outline"
						onClick={copyToClipboard}
						aria-label="Copy generated ports"
					>
						{copyStatus}
					</Button>
				</div>

				<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
					[ Generated Ports ]
				</p>
				<div className="border border-ink bg-muted/40 p-3 font-mono text-sm break-all space-y-1">
					{generatedPorts
						? generatedPorts.split("\n").map((port, i) => <div key={i}>{port}</div>)
						: null}
				</div>

				{avoidReserved && (
					<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-hazard-text">
						Reserved ports (0–1023) excluded from generation range.
					</p>
				)}
			</div>
		</ToolPageLayout>
	);
}
