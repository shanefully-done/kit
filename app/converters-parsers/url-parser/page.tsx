"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Copy, SettingsIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import ToolPageLayout from "@/components/ToolPageLayout";
import ToolHeader from "@/components/ToolHeader";

export default function UrlParserPage() {
	const [urlInput, setUrlInput] = useState("");
	const [parsedUrl, setParsedUrl] = useState<URL | null>(null);
	const [error, setError] = useState<string | null>(null);

	const handleParseUrl = () => {
		setError(null);
		setParsedUrl(null);
		try {
			const url = new URL(urlInput);
			setParsedUrl(url);
		} catch (e: unknown) {
			if (e instanceof Error) {
				setError(e.message);
			} else {
				setError("An unknown error occurred.");
			}
		}
	};

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text);
		toast({
			title: "Copied to clipboard",
			description: text,
		});
	};

	return (
		<ToolPageLayout
			header={
				<ToolHeader icon={<SettingsIcon aria-hidden />} title="URL Parser" />
			}
		>
			<div className="space-y-4">
				{/* InputArea */}
				<div className="flex gap-2">
					<Input
						type="text"
						placeholder="Enter URL to parse"
						value={urlInput}
						onChange={(e) => setUrlInput(e.target.value)}
						className="flex-grow"
						aria-label="URL to parse"
					/>
					<Button onClick={handleParseUrl}>Parse URL</Button>
				</div>

				{/* ActionButtons */}
				<div className="flex flex-wrap gap-2"></div>

				{/* AdditionalSettings */}
				<div>
					{error && (
						<Card className="border-red-500">
							<CardHeader>
								<CardTitle className="text-red-500">Error</CardTitle>
							</CardHeader>
							<CardContent>
								<p>{error}</p>
							</CardContent>
						</Card>
					)}
				</div>

				{/* ResultDisplay */}
				{parsedUrl && (
					<Card>
						<CardHeader>
							<CardTitle>Parsed URL Components</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="flex items-center justify-between">
									<span className="font-semibold">Protocol:</span>
									<div className="flex items-center space-x-2">
										<span>{parsedUrl.protocol}</span>
										<Button
											variant="ghost"
											size="icon"
											aria-label="Copy protocol"
											onClick={() => copyToClipboard(parsedUrl.protocol)}
										>
											<Copy className="h-4 w-4" />
										</Button>
									</div>
								</div>

								<div className="flex items-center justify-between">
									<span className="font-semibold">Hostname:</span>
									<div className="flex items-center space-x-2">
										<span>{parsedUrl.hostname}</span>
										<Button
											variant="ghost"
											size="icon"
											aria-label="Copy hostname"
											onClick={() => copyToClipboard(parsedUrl.hostname)}
										>
											<Copy className="h-4 w-4" />
										</Button>
									</div>
								</div>

								<div className="flex items-center justify-between">
									<span className="font-semibold">Port:</span>
									<div className="flex items-center space-x-2">
										<span>{parsedUrl.port || "N/A"}</span>
										<Button
											variant="ghost"
											size="icon"
											aria-label="Copy port"
											onClick={() => copyToClipboard(parsedUrl.port)}
										>
											<Copy className="h-4 w-4" />
										</Button>
									</div>
								</div>

								<div className="flex items-center justify-between">
									<span className="font-semibold">Path:</span>
									<div className="flex items-center space-x-2">
										<span>{parsedUrl.pathname}</span>
										<Button
											variant="ghost"
											size="icon"
											aria-label="Copy path"
											onClick={() => copyToClipboard(parsedUrl.pathname)}
										>
											<Copy className="h-4 w-4" />
										</Button>
									</div>
								</div>

								<div className="flex items-center justify-between">
									<span className="font-semibold">Fragment:</span>
									<div className="flex items-center space-x-2">
										<span>{parsedUrl.hash || "N/A"}</span>
										<Button
											variant="ghost"
											size="icon"
											aria-label="Copy fragment"
											onClick={() => copyToClipboard(parsedUrl.hash)}
										>
											<Copy className="h-4 w-4" />
										</Button>
									</div>
								</div>
							</div>

							{parsedUrl.searchParams.toString() && (
								<div className="mt-6">
									<h3 className="text-lg font-semibold mb-2">Query Parameters</h3>
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Key</TableHead>
												<TableHead>Value</TableHead>
												<TableHead className="w-[50px]">Copy</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{Array.from(parsedUrl.searchParams.entries()).map(([key, value]) => (
												<TableRow key={key}>
													<TableCell>{key}</TableCell>
													<TableCell>{value}</TableCell>
													<TableCell>
														<Button
															variant="ghost"
															size="icon"
															aria-label={`Copy value for ${key}`}
															onClick={() => copyToClipboard(value)}
														>
															<Copy className="h-4 w-4" />
														</Button>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</div>
							)}
						</CardContent>
					</Card>
				)}
			</div>
		</ToolPageLayout>
	);
}
