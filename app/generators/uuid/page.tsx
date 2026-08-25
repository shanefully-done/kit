"use client";

import { useState, useEffect, useCallback } from "react";
import { usePersistentState } from "@/hooks/use-persistent-state";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { ToolHeader } from "@/components/ToolHeader";
import { Fingerprint as FingerprintIcon } from "lucide-react";

export default function UUIDGeneratorPage() {
	const [numUUIDs, setNumUUIDs] = usePersistentState("uuid:numUUIDs", 1);
	const [generatedUUIDs, setGeneratedUUIDs] = useState("");
	const [copyStatus, setCopyStatus] = useState("Copy");

	const generateUUIDs = useCallback(() => {
		const uuids: string[] = [];
		for (let i = 0; i < numUUIDs; i++) {
			uuids.push(uuidv4());
		}
		setGeneratedUUIDs(uuids.join("\n"));
		setCopyStatus("Copy");
	}, [numUUIDs]);

	useEffect(() => {
		generateUUIDs();
	}, [generateUUIDs]);

	const copyToClipboard = () => {
		navigator.clipboard.writeText(generatedUUIDs).then(
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
				<ToolHeader icon={<FingerprintIcon aria-hidden />} title="UUID Generator" />
			}
		>
			<div className="space-y-4">
				<div className="flex items-center justify-between border border-ink bg-muted/40 px-3 py-2">
					<Label
						htmlFor="num-uuids"
						className="font-mono text-[11px] uppercase tracking-[0.08em]"
					>
						Count
					</Label>
					<Input
						id="num-uuids"
						type="number"
						min={1}
						max={100}
						value={numUUIDs}
						onChange={(e) => setNumUUIDs(parseInt(e.target.value))}
						className="w-20"
					/>
				</div>

				<div className="flex flex-wrap gap-2">
					<Button onClick={generateUUIDs}>Generate</Button>
					<Button
						variant="outline"
						onClick={copyToClipboard}
						aria-label="Copy generated UUIDs"
					>
						{copyStatus}
					</Button>
				</div>

				<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
					[ Output ]
				</p>
				<div className="border border-ink bg-muted/40 p-3 font-mono text-sm break-all space-y-1">
					{generatedUUIDs
						? generatedUUIDs.split("\n").map((uuid, i) => <div key={i}>{uuid}</div>)
						: null}
				</div>
			</div>
		</ToolPageLayout>
	);
}
