"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CopyIcon, UploadIcon } from "@radix-ui/react-icons";
import { DownloadIcon, ImageIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ToolPageLayout from "@/components/ToolPageLayout";
import ToolHeader from "@/components/ToolHeader";
import NextImage from "next/image";

export default function Base64ImageConverterPage() {
	const [uploadedFile, setUploadedFile] = useState<File | null>(null);
	const [encodedBase64, setEncodedBase64] = useState("");
	const [decodeInput, setDecodeInput] = useState("");
	const [decodedImage, setDecodedImage] = useState<string | null>(null);
	const [decodedMimeType, setDecodedMimeType] = useState("image/png");
	const [includeDataUriPrefix, setIncludeDataUriPrefix] = useState(true);
	const [uploadError, setUploadError] = useState("");
	const [decodeError, setDecodeError] = useState("");
	const [isDragging, setIsDragging] = useState(false);
	const [uploadPreview, setUploadPreview] = useState<string | null>(null);

	const { toast } = useToast();

	// Manage upload preview URL lifecycle
	useEffect(() => {
		if (uploadedFile) {
			const url = URL.createObjectURL(uploadedFile);
			setUploadPreview(url);
			return () => URL.revokeObjectURL(url);
		}
		setUploadPreview(null);
	}, [uploadedFile]);

	// Cleanup decoded image URL on unmount
	useEffect(() => {
		return () => {
			if (decodedImage) URL.revokeObjectURL(decodedImage);
		};
	}, [decodedImage]);

	const handleImageToBase64 = useCallback(() => {
		if (!uploadedFile) return;

		const reader = new FileReader();
		reader.onload = (e) => {
			const result = e.target?.result as string;
			if (includeDataUriPrefix) {
				setEncodedBase64(result);
			} else {
				const base64Content = result.split(",")[1] || result;
				setEncodedBase64(base64Content);
			}
			setUploadError("");
		};
		reader.onerror = () => {
			setUploadError("Failed to read file");
		};
		reader.readAsDataURL(uploadedFile);
	}, [uploadedFile, includeDataUriPrefix]);

	const handleBase64ToImage = useCallback(() => {
		setDecodeError("");
		if (!decodeInput.trim()) {
			setDecodeError("Please enter a Base64 string");
			return;
		}

		try {
			let base64Content = decodeInput.trim();
			let mimeType = "image/png";

			if (base64Content.startsWith("data:image/")) {
				const matches = base64Content.match(/^data:([^;]+);base64,(.+)$/);
				if (matches) {
					mimeType = matches[1];
					base64Content = matches[2];
				}
			}

			const byteString = atob(base64Content);
			const byteNumbers = new Array(byteString.length);
			for (let i = 0; i < byteString.length; i++) {
				byteNumbers[i] = byteString.charCodeAt(i);
			}
			const byteArray = new Uint8Array(byteNumbers);
			const blob = new Blob([byteArray], { type: mimeType });

			if (decodedImage) URL.revokeObjectURL(decodedImage);
			const imageUrl = URL.createObjectURL(blob);
			setDecodedImage(imageUrl);
			setDecodedMimeType(mimeType);
			setDecodeError("");
		} catch (error: unknown) {
			setDecodeError(
				`Invalid Base64 string: ${error instanceof Error ? error.message : String(error)}`,
			);
			setDecodedImage(null);
		}
	}, [decodeInput, decodedImage]);

	const handleFileUpload = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const file = event.target.files?.[0];
			if (file) {
				if (!file.type.startsWith("image/")) {
					setUploadError("Please upload an image file");
					return;
				}
				setUploadedFile(file);
				setEncodedBase64("");
				setUploadError("");
			}
		},
		[],
	);

	const handleDragOver = useCallback(
		(event: React.DragEvent<HTMLDivElement>) => {
			event.preventDefault();
			event.stopPropagation();
			event.dataTransfer.dropEffect = "copy";
			setIsDragging(true);
		},
		[],
	);

	const handleDragLeave = useCallback(
		(event: React.DragEvent<HTMLDivElement>) => {
			event.preventDefault();
			event.stopPropagation();
			setIsDragging(false);
		},
		[],
	);

	const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.stopPropagation();
		setIsDragging(false);

		const file = event.dataTransfer.files?.[0];
		if (file) {
			if (!file.type.startsWith("image/")) {
				setUploadError("Please upload an image file");
				return;
			}
			setUploadedFile(file);
			setEncodedBase64("");
			setUploadError("");
		}
	}, []);

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

	const downloadImage = useCallback(() => {
		if (!decodedImage) return;

		const extension = decodedMimeType.split("/")[1] || "png";
		const link = document.createElement("a");
		link.href = decodedImage;
		link.download = `decoded-image.${extension}`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}, [decodedImage, decodedMimeType]);

	return (
		<ToolPageLayout
			header={
				<ToolHeader
					icon={<ImageIcon aria-hidden />}
					title="Base64 Image Converter"
				/>
			}
		>
			<div className="space-y-4">
				<div className="sr-only">Inputs and outputs organized in tabs below</div>

				<div className="flex items-center justify-between border border-ink bg-muted/40 px-3 py-2">
					<Label
						htmlFor="data-uri-prefix"
						className="font-mono text-[11px] uppercase tracking-[0.08em]"
					>
						DATA URI PREFIX
					</Label>
					<div className="flex items-center gap-2">
						<span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
							{includeDataUriPrefix ? "ON" : "OFF"}
						</span>
						<Switch
							id="data-uri-prefix"
							checked={includeDataUriPrefix}
							onCheckedChange={setIncludeDataUriPrefix}
							aria-label="Toggle data URI prefix"
						/>
					</div>
				</div>

				<Tabs defaultValue="image-to-base64" className="w-full">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="image-to-base64">Image → Base64</TabsTrigger>
						<TabsTrigger value="base64-to-image">Base64 → Image</TabsTrigger>
					</TabsList>

					<TabsContent value="image-to-base64" className="p-0">
						<div className="grid w-full gap-4">
							<div
								className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-ink cursor-pointer transition-colors ${
									isDragging
										? "border-hazard bg-hazard/5"
										: "hover:border-muted-foreground"
								}`}
								onDragOver={handleDragOver}
								onDragLeave={handleDragLeave}
								onDrop={handleDrop}
								onClick={() => document.getElementById("image-upload-input")?.click()}
								aria-label="Upload image to convert"
							>
								<UploadIcon className="w-12 h-12 text-muted-foreground mb-4" />
								<p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground text-center">
									Drag & drop an image here, or click to select
								</p>
								<input
									id="image-upload-input"
									type="file"
									accept="image/*"
									className="hidden"
									onChange={handleFileUpload}
								/>
							</div>

							{uploadedFile && (
								<div className="border border-ink bg-muted/40 p-3">
									<p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground mb-2">
										[ FILE INFO ]
									</p>
									<div className="grid grid-cols-2 gap-2 font-mono text-sm">
										<div>
											<span className="text-muted-foreground">Name:</span>{" "}
											<span>{uploadedFile.name}</span>
										</div>
										<div>
											<span className="text-muted-foreground">Size:</span>{" "}
											<span>{(uploadedFile.size / 1024).toFixed(2)} KB</span>
										</div>
										<div>
											<span className="text-muted-foreground">Type:</span>{" "}
											<span>{uploadedFile.type}</span>
										</div>
									</div>
								</div>
							)}

							<div className="flex flex-wrap gap-2">
								<Button
									onClick={handleImageToBase64}
									disabled={!uploadedFile}
									aria-label="Convert image to Base64"
								>
									Convert to Base64
								</Button>
							</div>

							{uploadedFile && uploadPreview && (
								<div className="border border-ink bg-muted/40 p-3 grid place-items-center">
									<NextImage
										src={uploadPreview}
										alt="Uploaded image preview"
										width={300}
										height={200}
										unoptimized
									/>
								</div>
							)}

							{encodedBase64 && (
								<>
									<p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
										[ BASE64 OUTPUT ]
									</p>
									<div className="border border-ink bg-muted/40 p-3 font-mono text-sm break-all min-h-[200px] whitespace-pre-wrap">
										{encodedBase64}
									</div>
									<div className="flex justify-end">
										<Button
											variant="outline"
											size="sm"
											onClick={() => copyToClipboard(encodedBase64, "Base64 string")}
											aria-label="Copy Base64 output"
										>
											<CopyIcon className="w-4 h-4 mr-2" />
											Copy
										</Button>
									</div>
								</>
							)}

							{uploadError && (
								<p className="font-mono text-xs text-hazard-text break-all border border-hazard px-3 py-2">
									{uploadError}
								</p>
							)}
						</div>
					</TabsContent>

					<TabsContent value="base64-to-image" className="p-0">
						<div className="grid w-full gap-4">
							<Label className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
								[ BASE64 INPUT ]
							</Label>
							<Textarea
								placeholder="Paste Base64 string here..."
								value={decodeInput}
								onChange={(e) => setDecodeInput(e.target.value)}
								className="min-h-[150px]"
							/>

							<div className="flex flex-wrap gap-2">
								<Button
									onClick={handleBase64ToImage}
									aria-label="Decode Base64 to image"
								>
									Decode to Image
								</Button>
							</div>

							{decodedImage && (
								<div className="border border-ink bg-muted/40 p-3 grid place-items-center">
									<NextImage
										src={decodedImage}
										alt="Decoded image preview"
										width={400}
										height={300}
										unoptimized
									/>
									<div className="mt-3">
										<Button onClick={downloadImage} aria-label="Download decoded image">
											<DownloadIcon className="w-4 h-4 mr-2" />
											Download Image
										</Button>
									</div>
								</div>
							)}

							{decodeError && (
								<p className="font-mono text-xs text-hazard-text break-all border border-hazard px-3 py-2">
									{decodeError}
								</p>
							)}
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</ToolPageLayout>
	);
}
