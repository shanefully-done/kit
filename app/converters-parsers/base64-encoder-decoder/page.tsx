"use client";

import React, { useCallback, useState } from "react";
import { usePersistentState } from "@/hooks/use-persistent-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CopyIcon, UploadIcon } from "@radix-ui/react-icons";
import { Base64 } from "js-base64";
import { useToast } from "@/components/ui/use-toast";
import { useI18n } from "@/lib/i18n";
import ToolPageLayout from "@/components/ToolPageLayout";
import ToolHeader from "@/components/ToolHeader";
import { SettingsIcon } from "lucide-react";

export default function Base64EncoderDecoderPage() {
	const { t } = useI18n();
	const [encodeInput, setEncodeInput] = useState("");
	const [decodeInput, setDecodeInput] = useState("");
	const [encodeOutput, setEncodeOutput] = useState("");
	const [decodeOutput, setDecodeOutput] = useState("");
	const [isUrlSafe, setIsUrlSafe] = usePersistentState(
		"base64-encoder-decoder:isUrlSafe",
		false,
	);
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
				t("tools.base64EncoderDecoder.errorPrefix", {
					message: error instanceof Error ? error.message : String(error),
				}),
			);
		}
	}, [encodeInput, isUrlSafe, t]);

	const handleDecode = useCallback(() => {
		setDecodeError("");
		try {
			const decoded = isUrlSafe
				? Base64.decode(decodeInput)
				: Base64.decode(decodeInput);
			setDecodeOutput(decoded);
		} catch (error: unknown) {
			setDecodeError(
				t("tools.base64EncoderDecoder.errorPrefix", {
					message: error instanceof Error ? error.message : String(error),
				}),
			);
			setDecodeOutput("");
		}
	}, [decodeInput, isUrlSafe, t]);

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
			navigator.clipboard.writeText(text).then(() => {
				toast({
					title: t("common.copiedType", { what: type }),
					description: text.substring(0, 50) + (text.length > 50 ? "..." : ""),
				});
			}).catch(() => {
				toast({ variant: "destructive", title: t("common.copyFailed") });
			});
		},
		[toast, t],
	);

	return (
		<ToolPageLayout
			header={
				<ToolHeader
					icon={<SettingsIcon aria-hidden />}
				title={t("tools.base64EncoderDecoder.title")}
				/>
			}
		>
			<div className="space-y-4">
				<div className="sr-only">
					{t("tools.base64EncoderDecoder.srTabsDescription")}
				</div>

				<div className="flex items-center justify-between border border-ink bg-muted/40 px-3 py-2">
					<Label
						htmlFor="url-safe"
						className="font-mono text-[11px] uppercase tracking-[0.08em]"
					>
					{t("tools.base64EncoderDecoder.urlSafeModeLabel")}
					</Label>
					<div className="flex items-center gap-2">
						<span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
						{isUrlSafe
							? t("tools.base64EncoderDecoder.on")
							: t("tools.base64EncoderDecoder.off")}
						</span>
						<Switch
							id="url-safe"
							checked={isUrlSafe}
							onCheckedChange={setIsUrlSafe}
						aria-label={t("tools.base64EncoderDecoder.urlSafeToggleAria")}
						/>
					</div>
				</div>

				<Tabs defaultValue="encode" className="w-full">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="encode">
							{t("tools.base64EncoderDecoder.encodeTab")}
						</TabsTrigger>
						<TabsTrigger value="decode">
							{t("tools.base64EncoderDecoder.decodeTab")}
						</TabsTrigger>
					</TabsList>

					<TabsContent value="encode" className="p-0">
						<div className="grid w-full gap-4">
							<Label className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
								{t("tools.base64EncoderDecoder.inputLabel")}
							</Label>
							<Textarea
							placeholder={t("tools.base64EncoderDecoder.encodePlaceholder")}
								value={encodeInput}
								onChange={(e) => setEncodeInput(e.target.value)}
								className="min-h-[150px]"
							/>
							<div
								className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-ink cursor-pointer hover:border-muted-foreground transition-colors"
								onDragOver={handleDragOver}
								onDrop={handleDrop}
								onClick={() => document.getElementById("file-upload-input")?.click()}
							aria-label={t("tools.base64EncoderDecoder.uploadFileAria")}
							>
								<UploadIcon className="w-8 h-8 text-muted-foreground mb-2" />
								<p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
								{t("tools.base64EncoderDecoder.dropzoneLabel")}
								</p>
								<input
									id="file-upload-input"
									type="file"
									className="hidden"
									onChange={handleFileUpload}
								/>
							</div>
							<div className="flex flex-wrap gap-2">
								<Button onClick={handleEncode}>
									{t("tools.base64EncoderDecoder.encodeButton")}
								</Button>
							</div>
							<Label className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
								{t("tools.base64EncoderDecoder.outputLabel")}
							</Label>
							<div className="border border-ink bg-muted/40 p-3 font-mono text-sm break-all min-h-[150px] whitespace-pre-wrap">
								{encodeOutput ||
									t("tools.base64EncoderDecoder.encodedEmptyHint")}
							</div>
							<div className="flex justify-end">
								<Button
									variant="outline"
									size="sm"
								onClick={() =>
									copyToClipboard(
										encodeOutput,
										t("tools.base64EncoderDecoder.encodedText"),
									)
								}
									disabled={!encodeOutput}
								aria-label={t("tools.base64EncoderDecoder.copyEncodedAria")}
								>
									<CopyIcon className="w-4 h-4 mr-2" />
								{t("common.copy")}
								</Button>
							</div>
						</div>
					</TabsContent>

					<TabsContent value="decode" className="p-0">
						<div className="grid w-full gap-4">
							<Label className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
								{t("tools.base64EncoderDecoder.inputLabel")}
							</Label>
							<Textarea
							placeholder={t("tools.base64EncoderDecoder.decodePlaceholder")}
								value={decodeInput}
								onChange={(e) => setDecodeInput(e.target.value)}
								className="min-h-[150px]"
							/>
							<div className="flex flex-wrap gap-2">
								<Button onClick={handleDecode}>
									{t("tools.base64EncoderDecoder.decodeButton")}
								</Button>
							</div>
							{decodeError && (
								<p className="font-mono text-xs text-hazard-text break-all border border-hazard px-3 py-2">
									{decodeError}
								</p>
							)}
							<Label className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
								{t("tools.base64EncoderDecoder.outputLabel")}
							</Label>
							<div className="border border-ink bg-muted/40 p-3 font-mono text-sm break-all min-h-[150px] whitespace-pre-wrap">
								{decodeOutput ||
									t("tools.base64EncoderDecoder.decodedEmptyHint")}
							</div>
							<div className="flex justify-end">
								<Button
									variant="outline"
									size="sm"
								onClick={() =>
									copyToClipboard(
										decodeOutput,
										t("tools.base64EncoderDecoder.decodedText"),
									)
								}
									disabled={!decodeOutput}
								aria-label={t("tools.base64EncoderDecoder.copyDecodedAria")}
								>
									<CopyIcon className="w-4 h-4 mr-2" />
								{t("common.copy")}
								</Button>
							</div>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</ToolPageLayout>
	);
}
