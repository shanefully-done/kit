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
		} catch (error: any) {
			setEncodedOutput("Error encoding: " + error.message);
		}
	}, [encodeInput]);

	useEffect(() => {
		try {
			setDecodedOutput(decodeURIComponent(decodeInput));
			setDecodeError("");
		} catch (error: any) {
			setDecodedOutput("");
			setDecodeError("Error decoding: " + error.message);
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
				{/* InputArea */}
				<div className="sr-only">Inputs are inside tabs below</div>

				{/* ActionButtons */}
				<div className="flex flex-wrap gap-2"></div>

				{/* AdditionalSettings */}
				<div className="sr-only">No additional settings</div>

				{/* ResultDisplay */}
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
							className="min-h-[150px]"
						/>
						<div className="relative">
							<Textarea
								placeholder="Encoded output"
								value={encodedOutput}
								readOnly
								className="min-h-[150px]"
							/>
							<Button
								variant="ghost"
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
							className={`min-h-[150px] ${decodeError ? "border-red-500" : ""}`}
						/>
						<div className="relative">
							<Textarea
								placeholder="Decoded output"
								value={decodedOutput}
								readOnly
								className="min-h-[150px]"
							/>
							<Button
								variant="ghost"
								size="sm"
								className="absolute top-2 right-2"
								onClick={() => handleCopy(decodedOutput)}
								aria-label="Copy decoded output"
							>
								<CopyIcon className="h-4 w-4" />
							</Button>
						</div>
						{decodeError && (
							<p className="text-red-500 text-sm text-left">{decodeError}</p>
						)}
					</TabsContent>
				</Tabs>
			</div>
		</ToolPageLayout>
	);
}
