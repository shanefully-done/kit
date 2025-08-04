"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
				<div className="text-red-500 p-4 border border-red-300 rounded-md">
					<h4 className="font-bold">Error rendering JSON tree:</h4>
					<p>{this.state.error?.message}</p>
					<details className="mt-2">
						<summary>Error Details</summary>
						<pre className="whitespace-pre-wrap text-xs">
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
		} catch (error) {
			toast.error("Failed to copy JSON. Please ensure it's valid.");
		}
	};

	return (
		<ToolPageLayout
			header={<ToolHeader icon={<BracesIcon aria-hidden />} title="JSON Parser" />}
		>
			<div className="space-y-4">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label className="text-sm font-medium mb-2 block">Input JSON</label>
						<Textarea
							className={`w-full h-64 font-mono ${
								!isValidJson ? "border-red-500" : ""
							}`}
							value={jsonInput}
							onChange={handleJsonInputChange}
							placeholder='Enter JSON here, e.g., {"name": "Kilo Code", "age": 30}'
						/>
						<div className="mt-2">
							{isValidJson ? (
								<Badge variant="outline" className="bg-green-500 text-white">
									Valid JSON
								</Badge>
							) : (
								<Badge variant="destructive">Invalid JSON: {errorMessage}</Badge>
							)}
						</div>
					</div>
					<div>
						<label className="text-sm font-medium mb-2 block">Formatted JSON</label>
						<div className="w-full h-64 overflow-auto rounded-md border">
							<div className="p-4">
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
									<pre className="font-mono text-sm">
										{isValidJson ? "" : "Invalid JSON"}
									</pre>
								)}
							</div>
						</div>
					</div>
				</div>

				<div className="flex flex-wrap justify-end gap-2">
					<Button
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
