"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
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
				<div className="flex gap-2">
					<Input
						type="text"
						placeholder="Enter URL to parse"
						value={urlInput}
						onChange={(e) => setUrlInput(e.target.value)}
						className="flex-grow font-mono"
						aria-label="URL to parse"
					/>
					<Button onClick={handleParseUrl}>Parse URL</Button>
				</div>

				<div>
					{error && (
						<div className="border border-hazard bg-muted/40 p-3 font-mono text-sm text-hazard-text">
							<p>{error}</p>
						</div>
					)}
				</div>

				{parsedUrl && (
					<>
						<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
							[ PARSED COMPONENTS ]
						</p>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="flex items-center justify-between">
								<span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
									Protocol
								</span>
								<div className="flex items-center gap-2">
									<span className="font-mono break-all">{parsedUrl.protocol}</span>
									<Button
										variant="outline"
										size="icon"
										aria-label="Copy protocol"
										onClick={() => copyToClipboard(parsedUrl.protocol)}
									>
										<Copy className="h-4 w-4" />
									</Button>
								</div>
							</div>

							<div className="flex items-center justify-between">
								<span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
									Hostname
								</span>
								<div className="flex items-center gap-2">
									<span className="font-mono break-all">{parsedUrl.hostname}</span>
									<Button
										variant="outline"
										size="icon"
										aria-label="Copy hostname"
										onClick={() => copyToClipboard(parsedUrl.hostname)}
									>
										<Copy className="h-4 w-4" />
									</Button>
								</div>
							</div>

							<div className="flex items-center justify-between">
								<span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
									Port
								</span>
								<div className="flex items-center gap-2">
									<span className="font-mono">{parsedUrl.port || "N/A"}</span>
									<Button
										variant="outline"
										size="icon"
										aria-label="Copy port"
										onClick={() => copyToClipboard(parsedUrl.port)}
									>
										<Copy className="h-4 w-4" />
									</Button>
								</div>
							</div>

							<div className="flex items-center justify-between">
								<span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
									Path
								</span>
								<div className="flex items-center gap-2">
									<span className="font-mono break-all">{parsedUrl.pathname}</span>
									<Button
										variant="outline"
										size="icon"
										aria-label="Copy path"
										onClick={() => copyToClipboard(parsedUrl.pathname)}
									>
										<Copy className="h-4 w-4" />
									</Button>
								</div>
							</div>

							<div className="flex items-center justify-between">
								<span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
									Fragment
								</span>
								<div className="flex items-center gap-2">
									<span className="font-mono break-all">{parsedUrl.hash || "N/A"}</span>
									<Button
										variant="outline"
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
							<>
								<div className="border-t border-ink pt-4 mt-4" />
								<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
									[ QUERY PARAMETERS ]
								</p>
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
												<TableCell className="font-mono">{key}</TableCell>
												<TableCell className="font-mono break-all">{value}</TableCell>
												<TableCell>
													<Button
														variant="outline"
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
							</>
						)}
					</>
				)}
			</div>
		</ToolPageLayout>
	);
}
