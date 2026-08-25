"use client";

import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import CryptoJS from "crypto-js";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { ToolHeader } from "@/components/ToolHeader";
import { HashIcon } from "lucide-react";

const HashGeneratorPage = () => {
	const [inputText, setInputText] = useState("");
	const [selectedAlgorithm, setSelectedAlgorithm] = useState("MD5");
	const [hashedOutput, setHashedOutput] = useState("");

	useEffect(() => {
		if (inputText) {
			let hash;
			switch (selectedAlgorithm) {
				case "MD5":
					hash = CryptoJS.MD5(inputText).toString();
					break;
				case "SHA-1":
					hash = CryptoJS.SHA1(inputText).toString();
					break;
				case "SHA-256":
					hash = CryptoJS.SHA256(inputText).toString();
					break;
				case "SHA-512":
					hash = CryptoJS.SHA512(inputText).toString();
					break;
				default:
					hash = "";
			}
			setHashedOutput(hash);
		} else {
			setHashedOutput("");
		}
	}, [inputText, selectedAlgorithm]);

	const handleCopyClick = () => {
		navigator.clipboard.writeText(hashedOutput);
	};

	return (
		<ToolPageLayout
			header={
				<ToolHeader
					title="Hash Generator"
					icon={<HashIcon aria-hidden="true" className="h-5 w-5" />}
				/>
			}
		>
			<div className="space-y-4">
				<div>
					<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground mb-2">
						[ Input ]
					</p>
					<Textarea
						placeholder="Enter text here..."
						value={inputText}
						onChange={(e) => setInputText(e.target.value)}
						rows={8}
						className="w-full"
					/>
				</div>

				<div>
					<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground mb-2">
						[ Algorithm ]
					</p>
					<Select
						value={selectedAlgorithm}
						onValueChange={(value) => setSelectedAlgorithm(value)}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Select an algorithm" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="MD5">MD5</SelectItem>
							<SelectItem value="SHA-1">SHA-1</SelectItem>
							<SelectItem value="SHA-256">SHA-256</SelectItem>
							<SelectItem value="SHA-512">SHA-512</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{hashedOutput && (
					<>
						<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
							[ Digest ]
						</p>
						<div className="grid grid-cols-[5rem_1fr_auto] items-center gap-2 border-b border-ink py-2">
							<span className="font-mono text-xs uppercase">{selectedAlgorithm}</span>
							<span className="font-mono text-sm break-all">{hashedOutput}</span>
							<Button variant="outline" onClick={handleCopyClick}>
								Copy
							</Button>
						</div>
					</>
				)}
			</div>
		</ToolPageLayout>
	);
};

export default HashGeneratorPage;
