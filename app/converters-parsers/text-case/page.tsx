"use client";

import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import toCamelCase from "@stdlib/string/camelcase";
import toSnakeCase from "@stdlib/string/snakecase";
import toKebabCase from "@stdlib/string/kebabcase";
import toStartCase from "@stdlib/string/startcase";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { ToolHeader } from "@/components/ToolHeader";
import { Braces as SettingsIcon } from "lucide-react";

const TextCaseConverterPage = () => {
	const [inputText, setInputText] = useState("");
	const [outputText, setOutputText] = useState("");

	const handleConvert = (conversionType: string) => {
		let convertedText = "";
		switch (conversionType) {
			case "UPPERCASE":
				convertedText = inputText.toUpperCase();
				break;
			case "lowercase":
				convertedText = inputText.toLowerCase();
				break;
			case "Title Case":
				convertedText = toStartCase(inputText);
				break;
			case "camelCase":
				convertedText = toCamelCase(inputText);
				break;
			case "snake_case":
				convertedText = toSnakeCase(inputText);
				break;
			case "kebab-case":
				convertedText = toKebabCase(inputText);
				break;
			default:
				convertedText = inputText;
		}
		setOutputText(convertedText);
	};

	const handleCopy = () => {
		navigator.clipboard.writeText(outputText);
	};

	return (
		<ToolPageLayout
			header={
				<ToolHeader
					icon={<SettingsIcon aria-hidden />}
					title="Text Case Converter"
				/>
			}
		>
			<div className="space-y-4">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label className="text-sm font-medium mb-2 block">Input</label>
						<Textarea
							placeholder="Enter your text here..."
							value={inputText}
							onChange={(e) => setInputText(e.target.value)}
							className="min-h-[160px] resize-y"
						/>
					</div>
					<div>
						<label className="text-sm font-medium mb-2 block">Output</label>
						<Textarea
							placeholder="Converted text will appear here..."
							value={outputText}
							readOnly
							className="min-h-[160px] resize-y"
						/>
					</div>
				</div>

				<div className="flex flex-wrap gap-2">
					<Button onClick={() => handleConvert("UPPERCASE")}>UPPERCASE</Button>
					<Button onClick={() => handleConvert("lowercase")}>lowercase</Button>
					<Button onClick={() => handleConvert("Title Case")}>Title Case</Button>
					<Button onClick={() => handleConvert("camelCase")}>camelCase</Button>
					<Button onClick={() => handleConvert("snake_case")}>snake_case</Button>
					<Button onClick={() => handleConvert("kebab-case")}>kebab-case</Button>
					<Button variant="ghost" onClick={handleCopy} aria-label="Copy output text">
						Copy
					</Button>
				</div>
			</div>
		</ToolPageLayout>
	);
};

export default TextCaseConverterPage;
