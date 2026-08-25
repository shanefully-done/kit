"use client";

import React, { useState, useRef } from "react";
import QRCode from "qrcode";
import jsQR from "jsqr";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { ToolHeader } from "@/components/ToolHeader";
import { useI18n } from "@/lib/i18n";
import { QrCodeIcon, Download, Copy } from "lucide-react";

export default function QRCodePage() {
	const { t } = useI18n();
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
			toast(t("tools.qrCode.errorGenerate"), {
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
		toast(t("tools.qrCode.downloaded", { format: format.toUpperCase() }));
	};

	const copyToClipboard = () => {
		if (!text) return;
		navigator.clipboard
			.writeText(text)
			.then(() => {
				toast(t("tools.qrCode.textCopied"));
			})
			.catch((err) => {
				console.error("Failed to copy text: ", err);
				toast(t("tools.qrCode.copyFailed"), {
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
					toast(t("tools.qrCode.decodeSuccess"), {
						description: code.data,
					});
				} else {
					setDecodedText(t("tools.qrCode.noQrCodeFound"));
					toast(t("tools.qrCode.notFoundToast"), {
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
				toast(t("tools.qrCode.decodedCopied"));
			})
			.catch((err) => {
				console.error("Failed to copy decoded text: ", err);
				toast(t("tools.qrCode.decodedCopyFailed"), {
					description: err instanceof Error ? err.message : String(err),
					duration: 5000,
				});
			});
	};

	return (
		<ToolPageLayout
			header={
				<ToolHeader
					title={t("tools.qrCode.title")}
					icon={<QrCodeIcon aria-hidden="true" className="h-5 w-5" />}
				/>
			}
		>
			<div className="space-y-4">
				{/* Encode Section */}
				<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
					{t("tools.qrCode.encodeLabel")}
				</p>
				<div className="space-y-2">
					<label
						htmlFor="qr-text"
						className="font-mono text-[11px] uppercase tracking-[0.08em]"
					>
						{t("tools.qrCode.contentLabel")}
					</label>
					<Input
						id="qr-text"
						type="text"
						placeholder={t("tools.qrCode.contentPlaceholder")}
						value={text}
						onChange={(e) => setText(e.target.value)}
						className="font-mono"
					/>
				</div>

				<div className="flex flex-wrap gap-2">
					<Button onClick={generateQrCode}>{t("tools.qrCode.generate")}</Button>
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
								{t("tools.qrCode.copyText")}
							</Button>
						</>
					)}
				</div>

				{/* QR Output */}
				<div className="space-y-2">
					<p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
						{t("tools.qrCode.outputLabel")}
					</p>
					<div className="border border-ink bg-card p-4 grid place-items-center">
						{qrCodeSvg ? (
							<div ref={qrCodeRef} dangerouslySetInnerHTML={{ __html: qrCodeSvg }} />
						) : (
							<p className="font-mono text-sm text-muted-foreground">
								{t("tools.qrCode.emptyOutput")}
							</p>
						)}
					</div>
				</div>

				{/* Decode Section */}
				<div className="border-t border-ink pt-4">
					<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
						{t("tools.qrCode.decodeLabel")}
					</p>
					<div className="mt-3 space-y-2">
						<label
							htmlFor="qr-image-upload"
							className="font-mono text-[11px] uppercase tracking-[0.08em]"
						>
							{t("tools.qrCode.uploadLabel")}
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
								{t("tools.qrCode.uploadHint")}
							</label>
						</div>
					</div>

					{decodedText && (
						<div className="mt-3 space-y-2">
							<p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
								{t("tools.qrCode.decodedLabel")}
							</p>
							{decodedText === t("tools.qrCode.noQrCodeFound") ? (
								<p className="font-mono text-sm text-hazard-text">
									{t("tools.qrCode.noQrCodeFound")}
								</p>
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
										{t("tools.qrCode.copyDecoded")}
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
