"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const groups = [
	{
		label: "CONVERTERS & PARSERS",
		tools: [
			{
				name: "Base64 Encoder/Decoder",
				href: "/converters-parsers/base64-encoder-decoder",
			},
			{
				name: "Base64 Image Converter",
				href: "/converters-parsers/base64-image-converter",
			},
			{ name: "CRON Parser", href: "/converters-parsers/cron-parser" },
			{ name: "JSON Parser", href: "/converters-parsers/json-parser" },
			{ name: "JWT Decoder", href: "/converters-parsers/jwt-decoder" },
			{
				name: "Number Base Converter",
				href: "/converters-parsers/number-base-converter",
			},
			{ name: "Regex Tester", href: "/converters-parsers/regex-tester" },
			{ name: "Text Case Converter", href: "/converters-parsers/text-case" },
			{
				name: "Timestamp Converter",
				href: "/converters-parsers/timestamp-converter",
			},
			{
				name: "Timezone Converter",
				href: "/converters-parsers/timezone-converter",
			},
			{ name: "Unit Converter", href: "/converters-parsers/unit-converter" },
			{
				name: "URL Encoder/Decoder",
				href: "/converters-parsers/url-encoder-decoder",
			},
			{ name: "URL Parser", href: "/converters-parsers/url-parser" },
		],
	},
	{
		label: "GENERATORS",
		tools: [
			{ name: "Gradient Generator", href: "/generators/gradient" },
			{ name: "Hash Generator", href: "/generators/hash" },
			{ name: "Password Generator", href: "/generators/password" },
			{ name: "Port Number Generator", href: "/generators/port" },
			{ name: "QR Code Generator & Reader", href: "/generators/qr-code" },
			{ name: "UUID Generator", href: "/generators/uuid" },
		],
	},
	{
		label: "VIEWERS & MISC",
		tools: [
			{ name: "API Directory", href: "/viewers-miscellaneous/api-directory" },
			{
				name: "Image Metadata Viewer",
				href: "/viewers-miscellaneous/image-metadata-viewer",
			},
		],
	},
];

const Sidebar = () => {
	const [query, setQuery] = useState("");
	const pathname = usePathname();

	const lowerQuery = query.toLowerCase();

	const filteredGroups = groups
		.map((group) => ({
			...group,
			tools: group.tools.filter((tool) =>
				tool.name.toLowerCase().includes(lowerQuery),
			),
		}))
		.filter((group) => group.tools.length > 0);

	const hasResults = filteredGroups.length > 0;

	return (
		<div className="flex flex-col h-full bg-paper text-foreground">
			<div className="border-b-2 border-ink px-4 py-4">
				<Link
					href="/"
					className="font-sans font-black uppercase tracking-[-0.04em] leading-[0.9] text-3xl"
				>
					KIT<span className="text-hazard">.</span>
				</Link>
				<p className="mt-1 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
					REV 2.6 / SWISS SERIES ®
				</p>
			</div>

			<div className="border-b border-ink p-3">
				<Input
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="FILTER UNITS"
					className="h-9 font-mono text-xs uppercase tracking-[0.08em]"
					aria-label="Filter tools"
				/>
			</div>

			<nav className="flex-1 overflow-y-auto">
				{hasResults ? (
					filteredGroups.map((group) => (
						<React.Fragment key={group.label}>
							<div className="sticky top-0 bg-muted border-y border-ink px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-foreground">
								{`/// ${group.label}`}
							</div>
							{group.tools.map((tool) => {
								const active = pathname === tool.href;
								return (
									<Link
										key={tool.href}
										href={tool.href}
										className={cn(
											"flex items-center justify-between gap-2 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground hover:bg-ink hover:text-paper transition-colors",
											active && "bg-ink text-paper",
										)}
									>
										<span>
											{active && <span aria-hidden="true">&gt;&gt;&gt;&nbsp;</span>}
											{tool.name}
										</span>
										{active && <span aria-hidden="true">®</span>}
									</Link>
								);
							})}
						</React.Fragment>
					))
				) : (
					<p className="px-3 py-4 font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
						[ NO MATCH ]
					</p>
				)}
			</nav>

			<div className="border-t-2 border-ink px-4 py-3">
				<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
					© IXTJ / ALL PROCESSING LOCAL
				</p>
				<p className="mt-1 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
					NO ACCOUNTS · NO TELEMETRY · UNIT D-01
				</p>
			</div>
		</div>
	);
};

export default Sidebar;
