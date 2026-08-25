"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CopyIcon, SettingsIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ToolPageLayout from "@/components/ToolPageLayout";
import ToolHeader from "@/components/ToolHeader";

export default function URLEncoderDecoderPage() {
	const [encodeInput, setEncodeInput] = useState("");
	const [decodeInput, setDecodeInput] = useState("");
	const [encodedOutput, setEncodedOutput] = useState("");
	const [decodedOutput, setDecodedOutput] = useState("");
	const [decodeError, setDecodeError] = useState("");

	const { toast } = useToast();

	useEffect(() => {
		try {
			setEncodedOutput(encodeURIComponent(encodeInput));
		} catch (error) {
			const message = error instanceof Error ? error.message : "Unknown error";
			setEncodedOutput("Error encoding: " + message);
		}
	}, [encodeInput]);

	useEffect(() => {
		try {
			setDecodedOutput(decodeURIComponent(decodeInput));
			setDecodeError("");
		} catch (error) {
			setDecodedOutput("");
			const message = error instanceof Error ? error.message : "Unknown error";
			setDecodeError("Error decoding: " + message);
		}
	}, [decodeInput]);

	const handleCopy = (text: string) => {
		navigator.clipboard.writeText(text);
		toast({
			title: "Copied!",
			description: "Content copied to clipboard.",
		});
	};

	return (
		<ToolPageLayout
			header={
				<ToolHeader
					icon={<SettingsIcon aria-hidden />}
					title="URL Encoder/Decoder"
				/>
			}
		>
			<div className="space-y-4">
				<Tabs defaultValue="encode" className="w-full">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="encode">Encode URL</TabsTrigger>
						<TabsTrigger value="decode">Decode URL</TabsTrigger>
					</TabsList>

					<TabsContent value="encode" className="p-0 space-y-4">
						<Textarea
							placeholder="Enter text to encode..."
							value={encodeInput}
							onChange={(e) => setEncodeInput(e.target.value)}
							className="min-h-[150px] font-mono"
						/>
						<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
							[ ENCODED OUTPUT ]
						</p>
						<div className="border border-ink bg-muted/40 p-3 font-mono text-sm break-all min-h-[150px] relative">
							{encodedOutput || (
								<span className="text-muted-foreground">Encoded output</span>
							)}
							<Button
								variant="outline"
								size="sm"
								className="absolute top-2 right-2"
								onClick={() => handleCopy(encodedOutput)}
								aria-label="Copy encoded output"
							>
								<CopyIcon className="h-4 w-4" />
							</Button>
						</div>
					</TabsContent>

					<TabsContent value="decode" className="p-0 space-y-4">
						<Textarea
							placeholder="Enter text to decode..."
							value={decodeInput}
							onChange={(e) => setDecodeInput(e.target.value)}
							className={`min-h-[150px] font-mono ${decodeError ? "border-hazard" : ""}`}
						/>
						{decodeError && (
							<p className="text-hazard font-mono text-sm">{decodeError}</p>
						)}
						<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
							[ DECODED OUTPUT ]
						</p>
						<div className="border border-ink bg-muted/40 p-3 font-mono text-sm break-all min-h-[150px] relative">
							{decodedOutput || (
								<span className="text-muted-foreground">Decoded output</span>
							)}
							<Button
								variant="outline"
								size="sm"
								className="absolute top-2 right-2"
								onClick={() => handleCopy(decodedOutput)}
								aria-label="Copy decoded output"
							>
								<CopyIcon className="h-4 w-4" />
							</Button>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</ToolPageLayout>
	);
}
