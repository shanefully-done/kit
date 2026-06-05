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
				`Invalid Base64 string: ${error instanceof Error ? error.message : String(error)}`
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
		[]
	);

	const handleDragOver = useCallback(
		(event: React.DragEvent<HTMLDivElement>) => {
			event.preventDefault();
			event.stopPropagation();
			event.dataTransfer.dropEffect = "copy";
			setIsDragging(true);
		},
		[]
	);

	const handleDragLeave = useCallback(
		(event: React.DragEvent<HTMLDivElement>) => {
			event.preventDefault();
			event.stopPropagation();
			setIsDragging(false);
		},
		[]
	);

	const handleDrop = useCallback(
		(event: React.DragEvent<HTMLDivElement>) => {
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
		},
		[]
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

				<div className="flex items-center gap-2">
					<Switch
						id="data-uri-prefix"
						checked={includeDataUriPrefix}
						onCheckedChange={setIncludeDataUriPrefix}
						aria-label="Toggle data URI prefix"
					/>
					<Label htmlFor="data-uri-prefix" className="text-sm">
						Include data URI prefix
					</Label>
				</div>

				<Tabs defaultValue="image-to-base64" className="w-full">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="image-to-base64">Image → Base64</TabsTrigger>
						<TabsTrigger value="base64-to-image">Base64 → Image</TabsTrigger>
					</TabsList>

					<TabsContent value="image-to-base64" className="p-0">
						<div className="grid w-full gap-4">
							<div
								className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-md cursor-pointer transition-colors ${
									isDragging
										? "border-blue-500 bg-blue-50 dark:bg-blue-950"
										: "border-gray-300 hover:border-gray-400"
								}`}
								onDragOver={handleDragOver}
								onDragLeave={handleDragLeave}
								onDrop={handleDrop}
								onClick={() => document.getElementById("image-upload-input")?.click()}
								aria-label="Upload image to convert"
							>
								<UploadIcon className="w-12 h-12 text-gray-400 mb-4" />
								<p className="text-gray-500 text-center mb-2">
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
								<div className="bg-gray-50 p-4 rounded-md">
									<h3 className="font-medium text-sm mb-2">File Info:</h3>
									<div className="grid grid-cols-2 gap-2 text-sm">
										<div>
											<span className="text-gray-500">Name:</span>{" "}
											<span className="font-medium">{uploadedFile.name}</span>
										</div>
										<div>
											<span className="text-gray-500">Size:</span>{" "}
											<span className="font-medium">
												{(uploadedFile.size / 1024).toFixed(2)} KB
											</span>
										</div>
										<div>
											<span className="text-gray-500">Type:</span>{" "}
											<span className="font-medium">{uploadedFile.type}</span>
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
								<div className="flex justify-center">
									<div className="max-w-md">
										<NextImage
											src={uploadPreview}
											alt="Uploaded image preview"
											width={300}
											height={200}
											unoptimized
											className="rounded-md shadow-md"
										/>
									</div>
								</div>
							)}

							{encodedBase64 && (
								<div className="relative">
									<Textarea
										placeholder="Base64 output will appear here..."
										value={encodedBase64}
										readOnly
										className="min-h-[200px] pr-10"
									/>
									<Button
										variant="ghost"
										size="sm"
										className="absolute top-2 right-2"
										onClick={() => copyToClipboard(encodedBase64, "Base64 string")}
										aria-label="Copy Base64 output"
									>
										<CopyIcon className="w-4 h-4" />
									</Button>
								</div>
							)}

							{uploadError && (
								<p className="text-red-500 text-sm">{uploadError}</p>
							)}
						</div>
					</TabsContent>

					<TabsContent value="base64-to-image" className="p-0">
						<div className="grid w-full gap-4">
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
								<div className="flex flex-col items-center">
									<NextImage
										src={decodedImage}
										alt="Decoded image preview"
										width={400}
										height={300}
										unoptimized
										className="rounded-md shadow-md mb-4"
									/>
									<Button
										onClick={downloadImage}
										aria-label="Download decoded image"
									>
										<DownloadIcon className="w-4 h-4 mr-2" />
										Download Image
									</Button>
								</div>
							)}

							{decodeError && (
								<p className="text-red-500 text-sm">{decodeError}</p>
							)}
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</ToolPageLayout>
	);
}