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
import { useI18n } from "@/lib/i18n";

export default function UrlParserPage() {
	const { t } = useI18n();
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
				setError(t("tools.urlParser.unknownError"));
			}
		}
	};

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text).then(() => {
			toast({
				title: t("common.copied"),
				description: text,
			});
		}).catch(() => {
			toast({ variant: "destructive", title: t("common.copyFailed") });
		});
	};

	return (
		<ToolPageLayout
			header={
				<ToolHeader icon={<SettingsIcon aria-hidden />} title={t("tools.urlParser.title")} />
			}
		>
			<div className="space-y-4">
				<div className="flex gap-2">
					<Input
						type="text"
						placeholder={t("tools.urlParser.placeholder")}
						value={urlInput}
						onChange={(e) => setUrlInput(e.target.value)}
						className="flex-grow font-mono"
						aria-label={t("tools.urlParser.inputAria")}
					/>
					<Button onClick={handleParseUrl}>{t("tools.urlParser.parseButton")}</Button>
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
							[ {t("tools.urlParser.parsedComponents")} ]
						</p>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="flex items-center justify-between">
								<span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
									{t("tools.urlParser.protocol")}
								</span>
								<div className="flex items-center gap-2">
									<span className="font-mono break-all">{parsedUrl.protocol}</span>
									<Button
										variant="outline"
										size="icon"
										aria-label={t("tools.urlParser.copyProtocol")}
										onClick={() => copyToClipboard(parsedUrl.protocol)}
									>
										<Copy className="h-4 w-4" />
									</Button>
								</div>
							</div>

							<div className="flex items-center justify-between">
								<span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
									{t("tools.urlParser.hostname")}
								</span>
								<div className="flex items-center gap-2">
									<span className="font-mono break-all">{parsedUrl.hostname}</span>
									<Button
										variant="outline"
										size="icon"
										aria-label={t("tools.urlParser.copyHostname")}
										onClick={() => copyToClipboard(parsedUrl.hostname)}
									>
										<Copy className="h-4 w-4" />
									</Button>
								</div>
							</div>

							<div className="flex items-center justify-between">
								<span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
									{t("tools.urlParser.port")}
								</span>
								<div className="flex items-center gap-2">
									<span className="font-mono">{parsedUrl.port || "N/A"}</span>
									<Button
										variant="outline"
										size="icon"
										aria-label={t("tools.urlParser.copyPort")}
										onClick={() => copyToClipboard(parsedUrl.port)}
									>
										<Copy className="h-4 w-4" />
									</Button>
								</div>
							</div>

							<div className="flex items-center justify-between">
								<span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
									{t("tools.urlParser.path")}
								</span>
								<div className="flex items-center gap-2">
									<span className="font-mono break-all">{parsedUrl.pathname}</span>
									<Button
										variant="outline"
										size="icon"
										aria-label={t("tools.urlParser.copyPath")}
										onClick={() => copyToClipboard(parsedUrl.pathname)}
									>
										<Copy className="h-4 w-4" />
									</Button>
								</div>
							</div>

							<div className="flex items-center justify-between">
								<span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
									{t("tools.urlParser.fragment")}
								</span>
								<div className="flex items-center gap-2">
									<span className="font-mono break-all">{parsedUrl.hash || "N/A"}</span>
									<Button
										variant="outline"
										size="icon"
										aria-label={t("tools.urlParser.copyFragment")}
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
									[ {t("tools.urlParser.queryParameters")} ]
								</p>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>{t("tools.urlParser.tableKey")}</TableHead>
											<TableHead>{t("tools.urlParser.tableValue")}</TableHead>
											<TableHead className="w-[50px]">{t("common.copy")}</TableHead>
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
														aria-label={t("tools.urlParser.copyValueFor", { key })}
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