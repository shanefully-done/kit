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
				`Error: ${error instanceof Error ? error.message : String(error)}`
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
				`Error: ${error instanceof Error ? error.message : String(error)}`
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
		[isUrlSafe]
	);

	const handleDragOver = useCallback(
		(event: React.DragEvent<HTMLDivElement>) => {
			event.preventDefault();
			event.stopPropagation();
			event.dataTransfer.dropEffect = "copy";
		},
		[]
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
		[isUrlSafe]
	);

	const copyToClipboard = useCallback(
		(text: string, type: string) => {
			navigator.clipboard.writeText(text);
			toast({
				title: `${type} copied to clipboard!`,
				description: text.substring(0, 50) + (text.length > 50 ? "..." : ""),
			});
		},
		[toast]
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
				{/* InputArea */}
				<div className="sr-only">Inputs and outputs organized in tabs below</div>

				{/* ActionButtons */}
				<div className="flex flex-wrap gap-2"></div>

				{/* AdditionalSettings */}
				<div className="flex items-center gap-2">
					<Switch
						id="url-safe"
						checked={isUrlSafe}
						onCheckedChange={setIsUrlSafe}
						aria-label="Toggle URL-safe encoding"
					/>
					<Label htmlFor="url-safe" className="text-sm">
						URL-safe encoding
					</Label>
				</div>

				{/* ResultDisplay */}
				<Tabs defaultValue="encode" className="w-full">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="encode">Encode</TabsTrigger>
						<TabsTrigger value="decode">Decode</TabsTrigger>
					</TabsList>

					<TabsContent value="encode" className="p-0">
						<div className="grid w-full gap-4">
							<Textarea
								placeholder="Enter text to encode..."
								value={encodeInput}
								onChange={(e) => setEncodeInput(e.target.value)}
								className="min-h-[150px]"
							/>
							<div
								className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-gray-400 transition-colors"
								onDragOver={handleDragOver}
								onDrop={handleDrop}
								onClick={() => document.getElementById("file-upload-input")?.click()}
								aria-label="Upload file to encode"
							>
								<UploadIcon className="w-8 h-8 text-gray-400 mb-2" />
								<p className="text-gray-500">
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
							<div className="relative">
								<Textarea
									placeholder="Encoded output will appear here..."
									value={encodeOutput}
									readOnly
									className="min-h-[150px] pr-10"
								/>
								<Button
									variant="ghost"
									size="sm"
									className="absolute top-2 right-2"
									onClick={() => copyToClipboard(encodeOutput, "Encoded text")}
									disabled={!encodeOutput}
									aria-label="Copy encoded output"
								>
									<CopyIcon className="w-4 h-4" />
								</Button>
							</div>
						</div>
					</TabsContent>

					<TabsContent value="decode" className="p-0">
						<div className="grid w-full gap-4">
							<Textarea
								placeholder="Enter Base64 string to decode..."
								value={decodeInput}
								onChange={(e) => setDecodeInput(e.target.value)}
								className="min-h-[150px]"
							/>
							<div className="flex flex-wrap gap-2">
								<Button onClick={handleDecode}>Decode</Button>
							</div>
							<div className="relative">
								<Textarea
									placeholder="Decoded output will appear here..."
									value={decodeOutput}
									readOnly
									className="min-h-[150px] pr-10"
								/>
								<Button
									variant="ghost"
									size="sm"
									className="absolute top-2 right-2"
									onClick={() => copyToClipboard(decodeOutput, "Decoded text")}
									disabled={!decodeOutput}
									aria-label="Copy decoded output"
								>
									<CopyIcon className="w-4 h-4" />
								</Button>
							</div>
							{decodeError && (
								<p className="text-red-500 text-sm mt-2">{decodeError}</p>
							)}
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</ToolPageLayout>
	);
}
