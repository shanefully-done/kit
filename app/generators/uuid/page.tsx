"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
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
import { Fingerprint as FingerprintIcon } from "lucide-react";

export default function UUIDGeneratorPage() {
	const [numUUIDs, setNumUUIDs] = useState(1);
	const [generatedUUIDs, setGeneratedUUIDs] = useState("");
	const [copyStatus, setCopyStatus] = useState("Copy");

	useEffect(() => {
		generateUUIDs();
	}, []); // Generate UUIDs on initial load

	const generateUUIDs = () => {
		const uuids: string[] = [];
		for (let i = 0; i < numUUIDs; i++) {
			uuids.push(uuidv4());
		}
		setGeneratedUUIDs(uuids.join("\n"));
		setCopyStatus("Copy"); // Reset copy status when new UUIDs are generated
	};

	const copyToClipboard = () => {
		navigator.clipboard.writeText(generatedUUIDs).then(
			() => {
				setCopyStatus("Copied!");
				setTimeout(() => setCopyStatus("Copy"), 2000); // Reset after 2 seconds
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
				<ToolHeader icon={<FingerprintIcon aria-hidden />} title="UUID Generator" />
			}
		>
			<div className="space-y-4">
				<div className="grid gap-2">
					<Label htmlFor="num-uuids" className="text-sm">
						Number of UUIDs to generate
					</Label>
					<Input
						id="num-uuids"
						type="number"
						min={1}
						max={100}
						value={numUUIDs}
						onChange={(e) => setNumUUIDs(parseInt(e.target.value))}
						className="w-full"
					/>
				</div>

				<div className="flex flex-wrap gap-2">
					<Button onClick={generateUUIDs}>Generate UUID(s)</Button>
					<Button
						variant="ghost"
						onClick={copyToClipboard}
						aria-label="Copy generated UUIDs"
					>
						{copyStatus}
					</Button>
				</div>

				<Separator />

				<div className="grid gap-2">
					<Label htmlFor="generated-uuids" className="text-sm">
						Generated UUID(s)
					</Label>
					<Textarea
						id="generated-uuids"
						value={generatedUUIDs}
						readOnly
						rows={10}
						className="font-mono resize-y"
						placeholder="Generated UUIDs will appear here..."
					/>
				</div>
			</div>
		</ToolPageLayout>
	);
}
