"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy, Braces as BracesIcon } from "lucide-react";
import { toast } from "sonner";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { ToolHeader } from "@/components/ToolHeader";
import { useI18n } from "@/lib/i18n";

const ReactJson = dynamic(() => import("react-json-view"), { ssr: false });

class ErrorBoundary extends React.Component<
	{ children: React.ReactNode; renderErrorLabel: string; errorDetailsLabel: string },
	{ hasError: boolean; error: Error | null; errorInfo: React.ErrorInfo | null }
> {
	constructor(props: {
		children: React.ReactNode;
		renderErrorLabel: string;
		errorDetailsLabel: string;
	}) {
		super(props);
		this.state = { hasError: false, error: null, errorInfo: null };
	}
	static getDerivedStateFromError(error: Error) {
		return { hasError: true, error };
	}
	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		this.setState({ errorInfo });
		console.error("ReactJson Error:", error, errorInfo);
	}
	render() {
		if (this.state.hasError) {
			return (
				<div className="text-hazard-text p-3 border border-hazard font-mono text-xs">
					<h4 className="font-mono text-[11px] uppercase tracking-[0.08em] mb-2">
						{this.props.renderErrorLabel}
					</h4>
					<p className="break-all">{this.state.error?.message}</p>
					<details className="mt-2">
						<summary className="font-mono text-[11px] uppercase tracking-[0.08em] cursor-pointer">
							{this.props.errorDetailsLabel}
						</summary>
						<pre className="whitespace-pre-wrap text-xs mt-1">
							{this.state.errorInfo?.componentStack}
						</pre>
					</details>
				</div>
			);
		}
		return this.props.children;
	}
}

export default function JsonParserPage() {
	const { t } = useI18n();
	const [jsonInput, setJsonInput] = useState("");
	const [isValidJson, setIsValidJson] = useState(true);
	const [errorMessage, setErrorMessage] = useState("");

	const handleJsonInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const value = e.target.value;
		setJsonInput(value);
		try {
			JSON.parse(value);
			setIsValidJson(true);
			setErrorMessage("");
		} catch (error: unknown) {
			setIsValidJson(false);
			setErrorMessage((error as Error).message);
		}
	};

	const handleCopyToClipboard = () => {
		try {
			const parsedJson = JSON.parse(jsonInput);
			navigator.clipboard.writeText(JSON.stringify(parsedJson, null, 2));
			toast.success(t("tools.jsonParser.formattedCopied"));
		} catch {
			toast.error(t("tools.jsonParser.copyFailed"));
		}
	};

	return (
		<ToolPageLayout
			header={<ToolHeader icon={<BracesIcon aria-hidden />} title={t("tools.jsonParser.title")} />}
		>
			<div className="space-y-4">
				<p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
					{t("tools.jsonParser.inputLabel")}
				</p>
				<Textarea
					className={`w-full h-64 font-mono ${!isValidJson ? "border-hazard" : ""}`}
					value={jsonInput}
					onChange={handleJsonInputChange}
					placeholder={t("tools.jsonParser.placeholder")}
				/>

				<div
					className={`flex items-center gap-2 border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.08em] ${
						isValidJson
							? "border-ink text-muted-foreground"
							: "border-hazard text-hazard-text"
					}`}
				>
					{isValidJson
						? <span>{t("tools.jsonParser.validJson")}</span>
						: <span>{t("tools.jsonParser.parseError")}</span>}
				</div>

				{!isValidJson && errorMessage && (
					<p className="font-mono text-xs text-hazard-text break-all">{errorMessage}</p>
				)}

				<p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
					{t("tools.jsonParser.formattedOutputLabel")}
				</p>
				<div className="border border-ink bg-card p-2 overflow-auto max-h-96">
					{isValidJson && jsonInput ? (
						<ErrorBoundary
							renderErrorLabel={t("tools.jsonParser.renderError")}
							errorDetailsLabel={t("tools.jsonParser.errorDetails")}
						>
							<ReactJson
								src={JSON.parse(jsonInput)}
								name={false}
								collapsed={2}
								enableClipboard={false}
								displayObjectSize={false}
								displayDataTypes={false}
							/>
						</ErrorBoundary>
					) : (
						<pre className="font-mono text-sm text-muted-foreground">
							{isValidJson ? "" : t("tools.jsonParser.invalidJson")}
						</pre>
					)}
				</div>

				<div className="flex flex-wrap justify-end gap-2">
					<Button
						variant="outline"
						onClick={handleCopyToClipboard}
						disabled={!isValidJson || !jsonInput}
						aria-label={t("tools.jsonParser.copyFormattedAria")}
					>
						<Copy className="mr-2 h-4 w-4" /> {t("tools.jsonParser.copyFormatted")}
					</Button>
				</div>
			</div>
		</ToolPageLayout>
	);
}
