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
import { useI18n } from "@/lib/i18n";

const TextCaseConverterPage = () => {
	const { t } = useI18n();
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
					title={t("tools.textCase.title")}
				/>
			}
		>
			<div className="space-y-4">
				<Textarea
					placeholder={t("tools.textCase.inputPlaceholder")}
					value={inputText}
					onChange={(e) => setInputText(e.target.value)}
					className="min-h-[160px] resize-y font-mono"
				/>

				<div className="grid grid-cols-2 md:grid-cols-4 border border-ink divide-x divide-y divide-ink">
					<Button variant="outline" onClick={() => handleConvert("UPPERCASE")}>
						{t("tools.textCase.uppercaseBtn")}
					</Button>
					<Button variant="outline" onClick={() => handleConvert("lowercase")}>
						{t("tools.textCase.lowercaseBtn")}
					</Button>
					<Button variant="outline" onClick={() => handleConvert("Title Case")}>
						{t("tools.textCase.titleCaseBtn")}
					</Button>
					<Button variant="outline" onClick={() => handleConvert("camelCase")}>
						{t("tools.textCase.camelCaseBtn")}
					</Button>
					<Button variant="outline" onClick={() => handleConvert("snake_case")}>
						{t("tools.textCase.snakeCaseBtn")}
					</Button>
					<Button variant="outline" onClick={() => handleConvert("kebab-case")}>
						{t("tools.textCase.kebabCaseBtn")}
					</Button>
					<Button variant="outline" onClick={handleCopy}>
						{t("common.copy")}
					</Button>
				</div>

				<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
					{t("tools.textCase.outputLabel")}
				</p>
				<div className="border border-ink bg-muted/40 p-3 font-mono text-sm break-all min-h-[160px]">
					{outputText || (
						<span className="text-muted-foreground">
							{t("tools.textCase.outputEmpty")}
						</span>
					)}
				</div>
			</div>
		</ToolPageLayout>
	);
};

export default TextCaseConverterPage;
