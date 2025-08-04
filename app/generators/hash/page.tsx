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
				{/* InputArea */}
				<div className="space-y-2">
					<label className="text-sm font-medium">Input Text</label>
					<Textarea
						placeholder="Enter text here..."
						value={inputText}
						onChange={(e) => setInputText(e.target.value)}
						rows={8}
						className="w-full"
					/>
				</div>

				{/* AdditionalSettings */}
				<div className="space-y-2">
					<label className="text-sm font-medium">Algorithm</label>
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

				{/* ResultDisplay */}
				<div className="space-y-2">
					<label className="text-sm font-medium">Hashed Output</label>
					<Textarea
						value={hashedOutput}
						readOnly
						rows={8}
						className="w-full bg-gray-100 dark:bg-gray-800"
					/>
				</div>

				{/* ActionButtons */}
				<div className="flex flex-wrap gap-2">
					<Button onClick={handleCopyClick} className="mt-2">
						Copy to Clipboard
					</Button>
				</div>
			</div>
		</ToolPageLayout>
	);
};

export default HashGeneratorPage;
