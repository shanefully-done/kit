"use client";

import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CopyIcon, SettingsIcon } from "lucide-react";
import ToolPageLayout from "@/components/ToolPageLayout";
import ToolHeader from "@/components/ToolHeader";

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
	} catch (error) {
		console.error("Base64 URL decode error:", error);
		return null;
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
			setHeader("Invalid JWT format");
			setPayload("Invalid JWT format");
			setSignature("Invalid JWT format");
			return;
		}

		setIsValid(true);
		const decodedHeader = base64UrlDecode(parts[0]);
		const decodedPayload = base64UrlDecode(parts[1]);
		const decodedSignature = parts[2];

		setHeader(decodedHeader ? formatJson(decodedHeader) : "Invalid Header");
		setPayload(decodedPayload ? formatJson(decodedPayload) : "Invalid Payload");
		setSignature(decodedSignature || "Invalid Signature");
	}, [jwtToken]);

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text);
	};

	return (
		<ToolPageLayout
			header={
				<ToolHeader icon={<SettingsIcon aria-hidden />} title="JWT Decoder" />
			}
		>
			<div className="space-y-4">
				<div>
					<label
						htmlFor="jwt-input"
						className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground"
					>
						[ ENCODED TOKEN ]
					</label>
					<Textarea
						id="jwt-input"
						placeholder="Enter JWT token here"
						value={jwtToken}
						onChange={(e) => setJwtToken(e.target.value)}
						rows={10}
						className="font-mono mt-2"
					/>
				</div>

				{!isValid && (
					<div className="flex items-center gap-2 border border-hazard px-3 py-2 font-mono text-[11px] uppercase tracking-[0.08em] text-hazard">
						[ MALFORMED JWT TOKEN ]
					</div>
				)}

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="space-y-4">
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle>Header</CardTitle>
								<Button
									variant="outline"
									size="sm"
									aria-label="Copy header"
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
								<CardTitle>Signature</CardTitle>
								<Button
									variant="outline"
									size="sm"
									aria-label="Copy signature"
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
								<CardTitle>Payload</CardTitle>
								<Button
									variant="outline"
									size="sm"
									aria-label="Copy payload"
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
							Note: Signature verification status is not checked by this decoder.
						</p>
					</div>
				</div>
			</div>
		</ToolPageLayout>
	);
};

export default JwtDecoderPage;
