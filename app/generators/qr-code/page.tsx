"use client";

import React, { useState, useRef } from "react";
import QRCode from "qrcode";
import jsQR from "jsqr";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { ToolHeader } from "@/components/ToolHeader";
import { QrCodeIcon, Download, Copy } from "lucide-react";

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
				{/* Encode Section */}
				<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
					[ ENCODE ]
				</p>
				<div className="space-y-2">
					<label
						htmlFor="qr-text"
						className="font-mono text-[11px] uppercase tracking-[0.08em]"
					>
						Content
					</label>
					<Input
						id="qr-text"
						type="text"
						placeholder="Enter text or URL"
						value={text}
						onChange={(e) => setText(e.target.value)}
						className="font-mono"
					/>
				</div>

				<div className="flex flex-wrap gap-2">
					<Button onClick={generateQrCode}>Generate</Button>
					{qrCodeSvg && (
						<>
							<Button variant="outline" onClick={() => downloadQrCode("png")}>
								<Download className="h-4 w-4 mr-2" aria-hidden="true" />
								PNG
							</Button>
							<Button variant="outline" onClick={() => downloadQrCode("svg")}>
								<Download className="h-4 w-4 mr-2" aria-hidden="true" />
								SVG
							</Button>
							<Button variant="outline" onClick={copyToClipboard}>
								<Copy className="h-4 w-4 mr-2" aria-hidden="true" />
								Copy Text
							</Button>
						</>
					)}
				</div>

				{/* QR Output */}
				<div className="space-y-2">
					<p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
						[ OUTPUT ]
					</p>
					<div className="border border-ink bg-card p-4 grid place-items-center">
						{qrCodeSvg ? (
							<div ref={qrCodeRef} dangerouslySetInnerHTML={{ __html: qrCodeSvg }} />
						) : (
							<p className="font-mono text-sm text-muted-foreground">
								No QR yet. Generate one.
							</p>
						)}
					</div>
				</div>

				{/* Decode Section */}
				<div className="border-t border-ink pt-4">
					<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
						[ DECODE ]
					</p>
					<div className="mt-3 space-y-2">
						<label
							htmlFor="qr-image-upload"
							className="font-mono text-[11px] uppercase tracking-[0.08em]"
						>
							Upload Image
						</label>
						<div className="border border-ink border-dashed p-8 grid place-items-center">
							<Input
								type="file"
								accept="image/*"
								className="hidden"
								id="qr-image-upload"
								onChange={handleImageUpload}
							/>
							<label
								htmlFor="qr-image-upload"
								className="cursor-pointer font-mono text-sm text-muted-foreground"
							>
								Click to upload QR image
							</label>
						</div>
					</div>

					{decodedText && (
						<div className="mt-3 space-y-2">
							<p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
								[ DECODED ]
							</p>
							{decodedText === "No QR code found." ? (
								<p className="font-mono text-sm text-hazard-text">No QR code found.</p>
							) : (
								<>
									<div className="border border-ink bg-muted/40 p-3 font-mono text-sm break-all">
										{decodedText}
									</div>
									<Button
										size="sm"
										variant="outline"
										onClick={copyDecodedTextToClipboard}
									>
										<Copy className="h-4 w-4 mr-2" aria-hidden="true" />
										Copy Decoded
									</Button>
								</>
							)}
						</div>
					)}
				</div>
			</div>
		</ToolPageLayout>
	);
}
