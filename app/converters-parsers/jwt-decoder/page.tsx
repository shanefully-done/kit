"use client";

import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
				.join("")
		);
	} catch (error) {
		console.error("Base64 URL decode error:", error);
		return null;
	}
};

const formatJson = (jsonString: string) => {
	try {
		return JSON.stringify(JSON.parse(jsonString), null, 2);
	} catch (error) {
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
				{/* InputArea */}
				<div>
					<label htmlFor="jwt-input" className="text-sm">
						Encoded
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

				{/* ActionButtons */}
				<div className="flex flex-wrap gap-2">
					{/* No primary actions in original; keeping structure for consistency */}
				</div>

				{/* AdditionalSettings */}
				<div>
					{!isValid && (
						<Badge variant="destructive" className="mb-2">
							Warning: Malformed JWT Token
						</Badge>
					)}
				</div>

				{/* ResultDisplay */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="space-y-4">
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Header</CardTitle>
								<Button
									variant="ghost"
									size="sm"
									aria-label="Copy header"
									onClick={() => copyToClipboard(header)}
								>
									<CopyIcon className="h-4 w-4" />
								</Button>
							</CardHeader>
							<CardContent>
								<pre className="whitespace-pre-wrap break-all text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded font-mono">
									{header}
								</pre>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Signature</CardTitle>
								<Button
									variant="ghost"
									size="sm"
									aria-label="Copy signature"
									onClick={() => copyToClipboard(signature)}
								>
									<CopyIcon className="h-4 w-4" />
								</Button>
							</CardHeader>
							<CardContent>
								<pre className="whitespace-pre-wrap break-all text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded font-mono">
									{signature}
								</pre>
							</CardContent>
						</Card>
					</div>

					<div className="space-y-4">
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Payload</CardTitle>
								<Button
									variant="ghost"
									size="sm"
									aria-label="Copy payload"
									onClick={() => copyToClipboard(payload)}
								>
									<CopyIcon className="h-4 w-4" />
								</Button>
							</CardHeader>
							<CardContent>
								<pre className="whitespace-pre-wrap break-all text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded font-mono">
									{payload}
								</pre>
							</CardContent>
						</Card>

						<p className="text-sm text-muted-foreground">
							Note: Signature verification status is not checked by this decoder.
						</p>
					</div>
				</div>
			</div>
		</ToolPageLayout>
	);
};

export default JwtDecoderPage;
