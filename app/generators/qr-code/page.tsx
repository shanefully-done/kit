"use client";

import React, { useState, useRef } from "react";
import QRCode from "qrcode";
import jsQR from "jsqr";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { ToolHeader } from "@/components/ToolHeader";
import { QrCodeIcon } from "lucide-react";

export default function QRCodePage() {
	const [text, setText] = useState("");
	const [qrCodeSvg, setQrCodeSvg] = useState("");
	const qrCodeRef = useRef<HTMLDivElement>(null);

	const generateQrCode = async () => {
		if (!text) {
			setQrCodeSvg("");
			return;
		}
		try {
			const svg = await QRCode.toString(text, {
				type: "svg",
				errorCorrectionLevel: "H",
			});
			setQrCodeSvg(svg);
		} catch (err) {
			console.error(err);
			toast("Error generating QR code: Please try again.", {
				description: err instanceof Error ? err.message : String(err),
				duration: 5000,
			});
		}
	};

	const downloadQrCode = async (format: "png" | "svg") => {
		if (!qrCodeSvg) return;

		const link = document.createElement("a");
		link.download = `qrcode.${format}`;

		if (format === "svg") {
			const blob = new Blob([qrCodeSvg], { type: "image/svg+xml" });
			link.href = URL.createObjectURL(blob);
		} else {
			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d");
			if (!ctx) return;

			const svgBlob = new Blob([qrCodeSvg], { type: "image/svg+xml" });
			const url = URL.createObjectURL(svgBlob);
			const img = new Image();

			img.onload = () => {
				canvas.width = img.width;
				canvas.height = img.height;
				ctx.drawImage(img, 0, 0);
				canvas.toBlob((blob) => {
					if (blob) {
						link.href = URL.createObjectURL(blob);
						link.click();
						URL.revokeObjectURL(link.href);
					}
				}, "image/png");
				URL.revokeObjectURL(url);
			};
			img.src = url;
			return;
		}

		link.click();
		URL.revokeObjectURL(link.href);
		toast(`QR code downloaded as ${format.toUpperCase()}`);
	};

	const copyToClipboard = () => {
		if (!text) return;
		navigator.clipboard
			.writeText(text)
			.then(() => {
				toast("Text copied to clipboard");
			})
			.catch((err) => {
				console.error("Failed to copy text: ", err);
				toast("Failed to copy text: Please try again.", {
					description: err instanceof Error ? err.message : String(err),
					duration: 5000,
				});
			});
	};

	const [decodedText, setDecodedText] = useState("");
	const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (e) => {
			const img = new Image();
			img.onload = () => {
				const canvas = document.createElement("canvas");
				const ctx = canvas.getContext("2d");
				if (!ctx) return;

				canvas.width = img.width;
				canvas.height = img.height;
				ctx.drawImage(img, 0, 0, img.width, img.height);

				const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
				const code = jsQR(imageData.data, imageData.width, imageData.height, {
					inversionAttempts: "dontInvert",
				});

				if (code) {
					setDecodedText(code.data);
					toast("QR code decoded successfully", {
						description: code.data,
					});
				} else {
					setDecodedText("No QR code found.");
					toast("No QR code found: Please try another image.", {
						duration: 5000,
					});
				}
			};
			img.src = e.target?.result as string;
		};
		reader.readAsDataURL(file);
	};

	const copyDecodedTextToClipboard = () => {
		if (!decodedText) return;
		navigator.clipboard
			.writeText(decodedText)
			.then(() => {
				toast("Decoded text copied to clipboard");
			})
			.catch((err) => {
				console.error("Failed to copy decoded text: ", err);
				toast("Failed to copy decoded text: Please try again.", {
					description: err instanceof Error ? err.message : String(err),
					duration: 5000,
				});
			});
	};

	return (
		<ToolPageLayout
			header={
				<ToolHeader
					title="QR Code Generator"
					icon={<QrCodeIcon aria-hidden="true" className="h-5 w-5" />}
				/>
			}
		>
			<div className="space-y-4">
				{/* InputArea */}
				<div className="space-y-2">
					<label className="text-sm font-medium">Text or URL</label>
					<Input
						type="text"
						placeholder="Enter text or URL"
						value={text}
						onChange={(e) => setText(e.target.value)}
					/>
				</div>

				{/* ActionButtons */}
				<div className="flex flex-wrap gap-2">
					<Button onClick={generateQrCode}>Generate</Button>
					{qrCodeSvg && (
						<>
							<Button variant="secondary" onClick={() => downloadQrCode("png")}>
								Download PNG
							</Button>
							<Button variant="secondary" onClick={() => downloadQrCode("svg")}>
								Download SVG
							</Button>
							<Button variant="ghost" onClick={copyToClipboard}>
								Copy Text
							</Button>
						</>
					)}
				</div>

				{/* AdditionalSettings */}
				<div className="sr-only">
					<h2>Additional Settings</h2>
				</div>

				{/* ResultDisplay */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="space-y-4">
						<p className="text-sm font-medium">Generated QR</p>
						{qrCodeSvg ? (
							<div ref={qrCodeRef} dangerouslySetInnerHTML={{ __html: qrCodeSvg }} />
						) : (
							<p className="text-sm text-muted-foreground">No QR yet. Generate one.</p>
						)}
					</div>

					<div className="space-y-4">
						<p className="text-sm font-medium">Read QR from Image</p>
						<div className="border-2 border-dashed border-gray-300 rounded p-8 text-center">
							<Input
								type="file"
								accept="image/*"
								className="hidden"
								id="qr-image-upload"
								onChange={handleImageUpload}
							/>
							<label
								htmlFor="qr-image-upload"
								className="cursor-pointer text-blue-500"
							>
								Drag & drop an image or click to upload
							</label>
						</div>

						{decodedText && (
							<div className="space-y-2">
								<p className="text-sm font-medium">Decoded Text</p>
								<p className="break-words">{decodedText}</p>
								<div className="flex flex-wrap gap-2">
									<Button size="sm" variant="ghost" onClick={copyDecodedTextToClipboard}>
										Copy Decoded
									</Button>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</ToolPageLayout>
	);
}
