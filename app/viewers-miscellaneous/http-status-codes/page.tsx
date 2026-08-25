"use client";

import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { ToolHeader } from "@/components/ToolHeader";
import { ListTree as ListTreeIcon } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface StatusCode {
	code: number;
	name: string;
	description: string;
}

const STATUS_CODES: StatusCode[] = [
	{
		code: 100,
		name: "Continue",
		description:
			"The server has received the request headers and the client should proceed to send the request body.",
	},
	{
		code: 101,
		name: "Switching Protocols",
		description:
			"The server is switching protocols as requested by the client via the Upgrade header.",
	},
	{
		code: 102,
		name: "Processing",
		description:
			"The server has received and is processing the request, but no response is available yet.",
	},
	{
		code: 103,
		name: "Early Hints",
		description:
			"Used to return some response headers before final HTTP message.",
	},
	{ code: 200, name: "OK", description: "The request has succeeded." },
	{
		code: 201,
		name: "Created",
		description:
			"The request has been fulfilled and a new resource has been created.",
	},
	{
		code: 202,
		name: "Accepted",
		description:
			"The request has been accepted for processing, but the processing has not been completed.",
	},
	{
		code: 203,
		name: "Non-Authoritative Information",
		description:
			"The returned metainformation is from a local or third-party copy, not the origin server.",
	},
	{
		code: 204,
		name: "No Content",
		description:
			"The server has fulfilled the request but does not need to return an entity-body.",
	},
	{
		code: 205,
		name: "Reset Content",
		description:
			"The server has fulfilled the request and the user agent should reset the document view.",
	},
	{
		code: 206,
		name: "Partial Content",
		description:
			"The server has fulfilled the partial GET request for the resource.",
	},
	{
		code: 300,
		name: "Multiple Choices",
		description:
			"The target resource has more than one representation, each with its own URI.",
	},
	{
		code: 301,
		name: "Moved Permanently",
		description: "The target resource has been assigned a new permanent URI.",
	},
	{
		code: 302,
		name: "Found",
		description: "The target resource resides temporarily under a different URI.",
	},
	{
		code: 303,
		name: "See Other",
		description:
			"The server is redirecting the user agent to a different resource via a GET request.",
	},
	{
		code: 304,
		name: "Not Modified",
		description: "The resource has not been modified since the last request.",
	},
	{
		code: 307,
		name: "Temporary Redirect",
		description:
			"The target resource resides temporarily under a different URI while preserving the method.",
	},
	{
		code: 308,
		name: "Permanent Redirect",
		description:
			"The target resource has been assigned a new permanent URI while preserving the method.",
	},
	{
		code: 400,
		name: "Bad Request",
		description:
			"The server cannot process the request due to something perceived to be a client error.",
	},
	{
		code: 401,
		name: "Unauthorized",
		description: "The request requires user authentication.",
	},
	{
		code: 402,
		name: "Payment Required",
		description: "Reserved for future use.",
	},
	{
		code: 403,
		name: "Forbidden",
		description: "The server understood the request but refuses to authorize it.",
	},
	{
		code: 404,
		name: "Not Found",
		description:
			"The origin server did not find a current representation for the target resource.",
	},
	{
		code: 405,
		name: "Method Not Allowed",
		description:
			"The method received in the request-line is not supported by the target resource.",
	},
	{
		code: 406,
		name: "Not Acceptable",
		description:
			"The target resource does not have a representation acceptable per the Accept headers.",
	},
	{
		code: 407,
		name: "Proxy Authentication Required",
		description: "The client must first authenticate itself with the proxy.",
	},
	{
		code: 408,
		name: "Request Timeout",
		description:
			"The server did not receive a complete request message within the time it was prepared to wait.",
	},
	{
		code: 409,
		name: "Conflict",
		description:
			"The request could not be completed due to a conflict with the current state of the target resource.",
	},
	{
		code: 410,
		name: "Gone",
		description:
			"The target resource is no longer available and no forwarding address is known.",
	},
	{
		code: 411,
		name: "Length Required",
		description:
			"The server refuses to accept the request without a defined Content-Length.",
	},
	{
		code: 412,
		name: "Precondition Failed",
		description:
			"One or more conditions given in the request header fields evaluated to false.",
	},
	{
		code: 413,
		name: "Payload Too Large",
		description:
			"The request payload is larger than the server is willing or able to process.",
	},
	{
		code: 414,
		name: "URI Too Long",
		description:
			"The request-target is longer than the server is willing to interpret.",
	},
	{
		code: 415,
		name: "Unsupported Media Type",
		description:
			"The origin server refuses the request because the payload is in an unsupported format.",
	},
	{
		code: 416,
		name: "Range Not Satisfiable",
		description:
			"None of the ranges in the Range header field overlap the current extent of the selected resource.",
	},
	{
		code: 417,
		name: "Expectation Failed",
		description:
			"The expectation given in the Expect header field could not be met by the server.",
	},
	{
		code: 418,
		name: "I'm a teapot",
		description:
			"The server refuses to brew coffee because it is, permanently, a teapot.",
	},
	{
		code: 422,
		name: "Unprocessable Content",
		description:
			"The server understands the content type and syntax of the request entity but was unable to process the contained instructions.",
	},
	{
		code: 425,
		name: "Too Early",
		description:
			"The server is unwilling to risk processing a request that might be replayed.",
	},
	{
		code: 426,
		name: "Upgrade Required",
		description:
			"The server refuses to perform the request using the current protocol.",
	},
	{
		code: 428,
		name: "Precondition Required",
		description: "The origin server requires the request to be conditional.",
	},
	{
		code: 429,
		name: "Too Many Requests",
		description: "The user has sent too many requests in a given amount of time.",
	},
	{
		code: 431,
		name: "Request Header Fields Too Large",
		description:
			"The server is unwilling to process the request because its header fields are too large.",
	},
	{
		code: 451,
		name: "Unavailable For Legal Reasons",
		description:
			"The server is denying access to the resource as a consequence of a legal demand.",
	},
	{
		code: 500,
		name: "Internal Server Error",
		description:
			"The server encountered an unexpected condition that prevented it from fulfilling the request.",
	},
	{
		code: 501,
		name: "Not Implemented",
		description:
			"The server does not support the functionality required to fulfill the request.",
	},
	{
		code: 502,
		name: "Bad Gateway",
		description:
			"The server, while acting as a gateway or proxy, received an invalid response from an inbound server.",
	},
	{
		code: 503,
		name: "Service Unavailable",
		description:
			"The server is currently unable to handle the request due to temporary overloading or maintenance.",
	},
	{
		code: 504,
		name: "Gateway Timeout",
		description:
			"The server, while acting as a gateway or proxy, did not receive a timely response from an upstream server.",
	},
	{
		code: 505,
		name: "HTTP Version Not Supported",
		description:
			"The server does not support the major version of HTTP that was used in the request.",
	},
	{
		code: 507,
		name: "Insufficient Storage",
		description:
			"The method could not be performed on the resource because the server is unable to store the representation needed to complete the request.",
	},
	{
		code: 508,
		name: "Loop Detected",
		description:
			"The server detected an infinite loop while processing the request.",
	},
	{
		code: 511,
		name: "Network Authentication Required",
		description: "The client needs to authenticate to gain network access.",
	},
];

const CLASSES = [
	{ labelKey: "tools.httpStatusCodes.class1xx" as const, prefix: "1" },
	{ labelKey: "tools.httpStatusCodes.class2xx" as const, prefix: "2" },
	{ labelKey: "tools.httpStatusCodes.class3xx" as const, prefix: "3" },
	{ labelKey: "tools.httpStatusCodes.class4xx" as const, prefix: "4", error: true },
	{ labelKey: "tools.httpStatusCodes.class5xx" as const, prefix: "5", error: true },
];

export default function HttpStatusCodesPage() {
	const { t } = useI18n();
	const [searchTerm, setSearchTerm] = useState("");

	const filtered = useMemo(() => {
		if (!searchTerm) return STATUS_CODES;
		const q = searchTerm.toLowerCase();
		return STATUS_CODES.filter(
			(s) =>
				String(s.code).includes(q) ||
				s.name.toLowerCase().includes(q) ||
				s.description.toLowerCase().includes(q),
		);
	}, [searchTerm]);

	const grouped = useMemo(() => {
		const rec: Record<string, StatusCode[]> = {};
		for (const cls of CLASSES) {
			rec[cls.prefix] = filtered.filter((s) =>
				String(s.code).startsWith(cls.prefix),
			);
		}
		return rec;
	}, [filtered]);

	const hasAny = filtered.length > 0;

	return (
		<ToolPageLayout
			header={
				<ToolHeader icon={<ListTreeIcon aria-hidden />} title={t("tools.httpStatusCodes.title")} />
			}
		>
			<div className="space-y-0">
				<div className="pb-3">
					<Input
						type="text"
						placeholder={t("tools.httpStatusCodes.filterPlaceholder")}
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="font-mono"
					/>
				</div>

				{hasAny ? (
					CLASSES.map((cls) => {
						const items = grouped[cls.prefix] ?? [];
						if (items.length === 0) return null;
						return (
							<div key={cls.prefix}>
								<div
									className={`border-y border-ink bg-muted px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] ${cls.error ? "border-l-4 border-l-hazard" : ""}`}
								>
									<span className={cls.error ? "text-hazard-text" : ""}>{t(cls.labelKey)}</span>{" "}
									<span className="text-muted-foreground">({items.length})</span>
								</div>
								<div className="border border-t-0 border-ink">
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead className="w-[100px] font-mono text-[11px] uppercase tracking-[0.08em]">
													{t("tools.httpStatusCodes.headerCode")}
												</TableHead>
												<TableHead className="font-mono text-[11px] uppercase tracking-[0.08em]">
													{t("tools.httpStatusCodes.headerName")}
												</TableHead>
												<TableHead className="font-mono text-[11px] uppercase tracking-[0.08em]">
													{t("tools.httpStatusCodes.headerDescription")}
												</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{items.map((s) => (
												<TableRow key={s.code}>
													<TableCell className="font-mono text-sm font-bold">
														{s.code}
													</TableCell>
													<TableCell className="font-mono">{s.name}</TableCell>
													<TableCell className="text-muted-foreground">
														{s.description}
													</TableCell>
												</TableRow>
										))}
										</TableBody>
									</Table>
								</div>
							</div>
						);
					})
				) : (
					<div className="border-y border-ink bg-muted/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
						{t("tools.httpStatusCodes.noMatch")}
					</div>
				)}
			</div>
		</ToolPageLayout>
	);
}
