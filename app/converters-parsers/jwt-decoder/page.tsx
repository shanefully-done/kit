"use client";

import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CopyIcon, SettingsIcon } from "lucide-react";
import ToolPageLayout from "@/components/ToolPageLayout";
import ToolHeader from "@/components/ToolHeader";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";

const base64UrlDecode = (str: string) => {
	try {
		let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
		while (base64.length % 4) {
			base64 += "=";
		}
		return decodeURIComponent(
			atob(base64)
				.split("")
				.map(function (c) {
					return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
				})
				.join(""),
		);
	} catch {
		return "";
	}
};

const formatJson = (jsonString: string) => {
	try {
		return JSON.stringify(JSON.parse(jsonString), null, 2);
	} catch {
		return jsonString; // Return original if not valid JSON
	}
};

const JwtDecoderPage = () => {
	const { t } = useI18n();
	const [jwtToken, setJwtToken] = useState("");
	const [header, setHeader] = useState("");
	const [payload, setPayload] = useState("");
	const [signature, setSignature] = useState("");
	const [isValid, setIsValid] = useState(true);

	useEffect(() => {
		if (!jwtToken) {
			setHeader("");
			setPayload("");
			setSignature("");
			setIsValid(true);
			return;
		}

		const parts = jwtToken.split(".");
		if (parts.length !== 3) {
			setIsValid(false);
			setHeader(t("tools.jwtDecoder.invalidJwtFormat"));
			setPayload(t("tools.jwtDecoder.invalidJwtFormat"));
			setSignature(t("tools.jwtDecoder.invalidJwtFormat"));
			return;
		}

		setIsValid(true);
		const decodedHeader = base64UrlDecode(parts[0]);
		const decodedPayload = base64UrlDecode(parts[1]);
		const decodedSignature = parts[2];

		setHeader(decodedHeader ? formatJson(decodedHeader) : t("tools.jwtDecoder.invalidHeader"));
		setPayload(decodedPayload ? formatJson(decodedPayload) : t("tools.jwtDecoder.invalidPayload"));
		setSignature(decodedSignature || t("tools.jwtDecoder.invalidSignature"));
	}, [jwtToken, t]);

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text).then(() => {
			toast.success(t("common.copied"));
		}).catch(() => {
			toast.error(t("common.copyFailed"));
		});
	};

	return (
		<ToolPageLayout
			header={
				<ToolHeader icon={<SettingsIcon aria-hidden />} title={t("tools.jwtDecoder.title")} />
			}
		>
			<div className="space-y-4">
				<div>
					<label
						htmlFor="jwt-input"
						className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground"
					>
						{t("tools.jwtDecoder.encodedTokenLabel")}
					</label>
					<Textarea
						id="jwt-input"
						placeholder={t("tools.jwtDecoder.placeholder")}
						value={jwtToken}
						onChange={(e) => setJwtToken(e.target.value)}
						rows={10}
						className="font-mono mt-2"
					/>
				</div>

				{!isValid && (
					<div className="flex items-center gap-2 border border-hazard px-3 py-2 font-mono text-[11px] uppercase tracking-[0.08em] text-hazard-text">
						{t("tools.jwtDecoder.malformedToken")}
					</div>
				)}

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="space-y-4">
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle>{t("tools.jwtDecoder.header")}</CardTitle>
								<Button
									variant="outline"
									size="sm"
									aria-label={t("tools.jwtDecoder.copyHeaderAria")}
									onClick={() => copyToClipboard(header)}
								>
									<CopyIcon className="h-4 w-4" />
								</Button>
							</CardHeader>
							<CardContent className="font-mono text-xs break-all">
								<pre className="whitespace-pre-wrap bg-muted/40 p-3 border-t">
									{header}
								</pre>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle>{t("tools.jwtDecoder.signature")}</CardTitle>
								<Button
									variant="outline"
									size="sm"
									aria-label={t("tools.jwtDecoder.copySignatureAria")}
									onClick={() => copyToClipboard(signature)}
								>
									<CopyIcon className="h-4 w-4" />
								</Button>
							</CardHeader>
							<CardContent className="font-mono text-xs break-all">
								<pre className="whitespace-pre-wrap bg-muted/40 p-3 border-t">
									{signature}
								</pre>
							</CardContent>
						</Card>
					</div>

					<div className="space-y-4">
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle>{t("tools.jwtDecoder.payload")}</CardTitle>
								<Button
									variant="outline"
									size="sm"
									aria-label={t("tools.jwtDecoder.copyPayloadAria")}
									onClick={() => copyToClipboard(payload)}
								>
									<CopyIcon className="h-4 w-4" />
								</Button>
							</CardHeader>
							<CardContent className="font-mono text-xs break-all">
								<pre className="whitespace-pre-wrap bg-muted/40 p-3 border-t">
									{payload}
								</pre>
							</CardContent>
						</Card>

						<p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
							{t("tools.jwtDecoder.verificationNote")}
						</p>
					</div>
				</div>
			</div>
		</ToolPageLayout>
	);
};

export default JwtDecoderPage;
