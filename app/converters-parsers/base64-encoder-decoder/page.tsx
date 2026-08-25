"use client";

import React, { useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CopyIcon, UploadIcon } from "@radix-ui/react-icons";
import { Base64 } from "js-base64";
import { useToast } from "@/components/ui/use-toast";
import ToolPageLayout from "@/components/ToolPageLayout";
import ToolHeader from "@/components/ToolHeader";
import { SettingsIcon } from "lucide-react";

export default function Base64EncoderDecoderPage() {
	const [encodeInput, setEncodeInput] = useState("");
	const [decodeInput, setDecodeInput] = useState("");
	const [encodeOutput, setEncodeOutput] = useState("");
	const [decodeOutput, setDecodeOutput] = useState("");
	const [isUrlSafe, setIsUrlSafe] = useState(false);
	const [decodeError, setDecodeError] = useState("");

	const { toast } = useToast();

	const handleEncode = useCallback(() => {
		try {
			const encoded = isUrlSafe
				? Base64.encodeURI(encodeInput)
				: Base64.encode(encodeInput);
			setEncodeOutput(encoded);
		} catch (error: unknown) {
			setEncodeOutput(
				`Error: ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	}, [encodeInput, isUrlSafe]);

	const handleDecode = useCallback(() => {
		setDecodeError("");
		try {
			const decoded = isUrlSafe
				? Base64.decode(decodeInput)
				: Base64.decode(decodeInput);
			setDecodeOutput(decoded);
		} catch (error: unknown) {
			setDecodeError(
				`Error: ${error instanceof Error ? error.message : String(error)}`,
			);
			setDecodeOutput("");
		}
	}, [decodeInput, isUrlSafe]);

	const handleFileUpload = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const file = event.target.files?.[0];
			if (file) {
				const reader = new FileReader();
				reader.onload = (e) => {
					const arrayBuffer = e.target?.result as ArrayBuffer;
					const bytes = new Uint8Array(arrayBuffer);
					const binaryString = String.fromCharCode.apply(null, Array.from(bytes));
					const encoded = isUrlSafe
						? Base64.encodeURI(binaryString)
						: Base64.encode(binaryString);
					setEncodeInput(binaryString); // Show original content in input
					setEncodeOutput(encoded);
				};
				reader.readAsArrayBuffer(file);
			}
		},
		[isUrlSafe],
	);

	const handleDragOver = useCallback(
		(event: React.DragEvent<HTMLDivElement>) => {
			event.preventDefault();
			event.stopPropagation();
			event.dataTransfer.dropEffect = "copy";
		},
		[],
	);

	const handleDrop = useCallback(
		(event: React.DragEvent<HTMLDivElement>) => {
			event.preventDefault();
			event.stopPropagation();
			const file = event.dataTransfer.files?.[0];
			if (file) {
				const reader = new FileReader();
				reader.onload = (e) => {
					const arrayBuffer = e.target?.result as ArrayBuffer;
					const bytes = new Uint8Array(arrayBuffer);
					const binaryString = String.fromCharCode.apply(null, Array.from(bytes));
					const encoded = isUrlSafe
						? Base64.encodeURI(binaryString)
						: Base64.encode(binaryString);
					setEncodeInput(binaryString); // Show original content in input
					setEncodeOutput(encoded);
				};
				reader.readAsArrayBuffer(file);
			}
		},
		[isUrlSafe],
	);

	const copyToClipboard = useCallback(
		(text: string, type: string) => {
			navigator.clipboard.writeText(text);
			toast({
				title: `${type} copied to clipboard!`,
				description: text.substring(0, 50) + (text.length > 50 ? "..." : ""),
			});
		},
		[toast],
	);

	return (
		<ToolPageLayout
			header={
				<ToolHeader
					icon={<SettingsIcon aria-hidden />}
					title="Base64 Encoder/Decoder"
				/>
			}
		>
			<div className="space-y-4">
				<div className="sr-only">Inputs and outputs organized in tabs below</div>

				<div className="flex items-center justify-between border border-ink bg-muted/40 px-3 py-2">
					<Label
						htmlFor="url-safe"
						className="font-mono text-[11px] uppercase tracking-[0.08em]"
					>
						URL-SAFE MODE
					</Label>
					<div className="flex items-center gap-2">
						<span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
							{isUrlSafe ? "ON" : "OFF"}
						</span>
						<Switch
							id="url-safe"
							checked={isUrlSafe}
							onCheckedChange={setIsUrlSafe}
							aria-label="Toggle URL-safe encoding"
						/>
					</div>
				</div>

				<Tabs defaultValue="encode" className="w-full">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="encode">Encode</TabsTrigger>
						<TabsTrigger value="decode">Decode</TabsTrigger>
					</TabsList>

					<TabsContent value="encode" className="p-0">
						<div className="grid w-full gap-4">
							<Label className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
								[ INPUT ]
							</Label>
							<Textarea
								placeholder="Enter text to encode..."
								value={encodeInput}
								onChange={(e) => setEncodeInput(e.target.value)}
								className="min-h-[150px]"
							/>
							<div
								className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-ink cursor-pointer hover:border-muted-foreground transition-colors"
								onDragOver={handleDragOver}
								onDrop={handleDrop}
								onClick={() => document.getElementById("file-upload-input")?.click()}
								aria-label="Upload file to encode"
							>
								<UploadIcon className="w-8 h-8 text-muted-foreground mb-2" />
								<p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
									Drag & drop a file here, or click to select
								</p>
								<input
									id="file-upload-input"
									type="file"
									className="hidden"
									onChange={handleFileUpload}
								/>
							</div>
							<div className="flex flex-wrap gap-2">
								<Button onClick={handleEncode}>Encode</Button>
							</div>
							<Label className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
								[ OUTPUT ]
							</Label>
							<div className="border border-ink bg-muted/40 p-3 font-mono text-sm break-all min-h-[150px] whitespace-pre-wrap">
								{encodeOutput || "Encoded output will appear here..."}
							</div>
							<div className="flex justify-end">
								<Button
									variant="outline"
									size="sm"
									onClick={() => copyToClipboard(encodeOutput, "Encoded text")}
									disabled={!encodeOutput}
									aria-label="Copy encoded output"
								>
									<CopyIcon className="w-4 h-4 mr-2" />
									Copy
								</Button>
							</div>
						</div>
					</TabsContent>

					<TabsContent value="decode" className="p-0">
						<div className="grid w-full gap-4">
							<Label className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
								[ INPUT ]
							</Label>
							<Textarea
								placeholder="Enter Base64 string to decode..."
								value={decodeInput}
								onChange={(e) => setDecodeInput(e.target.value)}
								className="min-h-[150px]"
							/>
							<div className="flex flex-wrap gap-2">
								<Button onClick={handleDecode}>Decode</Button>
							</div>
							{decodeError && (
								<p className="font-mono text-xs text-hazard break-all border border-hazard px-3 py-2">
									{decodeError}
								</p>
							)}
							<Label className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
								[ OUTPUT ]
							</Label>
							<div className="border border-ink bg-muted/40 p-3 font-mono text-sm break-all min-h-[150px] whitespace-pre-wrap">
								{decodeOutput || "Decoded output will appear here..."}
							</div>
							<div className="flex justify-end">
								<Button
									variant="outline"
									size="sm"
									onClick={() => copyToClipboard(decodeOutput, "Decoded text")}
									disabled={!decodeOutput}
									aria-label="Copy decoded output"
								>
									<CopyIcon className="w-4 h-4 mr-2" />
									Copy
								</Button>
							</div>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</ToolPageLayout>
	);
}
