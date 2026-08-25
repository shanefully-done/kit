"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy, Braces as BracesIcon } from "lucide-react";
import { toast } from "sonner";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { ToolHeader } from "@/components/ToolHeader";

const ReactJson = dynamic(() => import("react-json-view"), { ssr: false });

class ErrorBoundary extends React.Component<
	{ children: React.ReactNode },
	{ hasError: boolean; error: Error | null; errorInfo: React.ErrorInfo | null }
> {
	constructor(props: { children: React.ReactNode }) {
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
						[ RENDER ERROR ]
					</h4>
					<p className="break-all">{this.state.error?.message}</p>
					<details className="mt-2">
						<summary className="font-mono text-[11px] uppercase tracking-[0.08em] cursor-pointer">
							Error Details
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
			toast.success("Formatted JSON copied to clipboard!");
		} catch {
			toast.error("Failed to copy JSON. Please ensure it's valid.");
		}
	};

	return (
		<ToolPageLayout
			header={<ToolHeader icon={<BracesIcon aria-hidden />} title="JSON Parser" />}
		>
			<div className="space-y-4">
				<p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
					[ INPUT ]
				</p>
				<Textarea
					className={`w-full h-64 font-mono ${!isValidJson ? "border-hazard" : ""}`}
					value={jsonInput}
					onChange={handleJsonInputChange}
					placeholder='Enter JSON here, e.g., {"name": "Kilo Code", "age": 30}'
				/>

				<div
					className={`flex items-center gap-2 border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.08em] ${
						isValidJson
							? "border-ink text-muted-foreground"
							: "border-hazard text-hazard-text"
					}`}
				>
					{isValidJson ? <span>[ VALID JSON ]</span> : <span>[ PARSE ERROR ]</span>}
				</div>

				{!isValidJson && errorMessage && (
					<p className="font-mono text-xs text-hazard-text break-all">{errorMessage}</p>
				)}

				<p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
					[ FORMATTED OUTPUT ]
				</p>
				<div className="border border-ink bg-card p-2 overflow-auto max-h-96">
					{isValidJson && jsonInput ? (
						<ErrorBoundary>
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
							{isValidJson ? "" : "Invalid JSON"}
						</pre>
					)}
				</div>

				<div className="flex flex-wrap justify-end gap-2">
					<Button
						variant="outline"
						onClick={handleCopyToClipboard}
						disabled={!isValidJson || !jsonInput}
						aria-label="Copy formatted JSON to clipboard"
					>
						<Copy className="mr-2 h-4 w-4" /> Copy Formatted JSON
					</Button>
				</div>
			</div>
		</ToolPageLayout>
	);
}
