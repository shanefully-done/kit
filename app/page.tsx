"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

type Tool = { name: string; href: string };
type Category = { title: string; tools: Tool[] };

const categories: Category[] = [
	{
		title: "Converters & Parsers",
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
		title: "Generators",
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
		title: "Viewers & Misc",
		tools: [
			{ name: "API Directory", href: "/viewers-miscellaneous/api-directory" },
			{
				name: "Image Metadata Viewer",
				href: "/viewers-miscellaneous/image-metadata-viewer",
			},
		],
	},
];

export default function HomePage() {
	return (
		<main className="min-h-screen bg-paper text-foreground">
			{/* Top strip */}
			<div className="flex items-center justify-between border-b-2 border-ink px-4 py-3 md:px-8">
				<span className="font-mono text-[11px] uppercase tracking-[0.08em]">
					KIT® DEV TOOLKIT / REV 2.6
				</span>
				<Button asChild variant="outline" size="sm">
					<Link
						href="https://github.com/shanefully-done/kit"
						target="_blank"
						rel="noopener noreferrer"
					>
						SOURCE / GIT HUB
					</Link>
				</Button>
			</div>

			{/* Hero block */}
			<div className="relative border-b-2 border-ink px-4 pt-10 pb-8 md:px-8 md:pt-16 md:pb-12">
				<span
					aria-hidden="true"
					className="absolute right-6 top-6 font-mono text-muted-foreground select-none"
				>
					+
				</span>
				<span
					aria-hidden="true"
					className="absolute bottom-4 left-6 font-mono text-muted-foreground select-none"
				>
					+
				</span>
				<h1 className="font-sans font-black uppercase tracking-[-0.05em] leading-[0.85] text-[clamp(5rem,16vw,13rem)]">
					KIT<span className="text-hazard">.</span>
				</h1>
				<div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
					<span>20 UNITS / 03 SECTIONS</span>
					<span>ALL PROCESSING LOCAL</span>
					<span>NO ACCOUNTS / NO TELEMETRY™</span>
				</div>
			</div>

			{/* Index sections */}
			{categories.map((category) => (
				<section key={category.title}>
					<div className="flex items-baseline justify-between gap-4 border-b-2 border-ink px-4 py-6 md:px-8">
						<h2 className="font-sans font-black uppercase tracking-[-0.04em] leading-[0.9] text-3xl md:text-5xl">
							{category.title}
						</h2>
						<span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
							{String(category.tools.length).padStart(2, "0")} UNITS
						</span>
					</div>
					{category.tools.map((tool, i) => (
						<Link
							key={tool.href}
							href={tool.href}
							className="group grid grid-cols-[3.5rem_1fr_auto] items-center border-b border-ink px-4 py-4 transition-colors hover:bg-ink hover:text-paper md:px-8"
						>
							<span className="font-mono text-xs tracking-[0.08em] text-muted-foreground group-hover:text-paper">
								{String(i + 1).padStart(2, "0")}
							</span>
							<span className="font-sans font-bold uppercase tracking-[-0.02em] text-lg md:text-xl">
								{tool.name}
							</span>
							<span
								aria-hidden="true"
								className="font-mono text-xs tracking-[0.08em] text-muted-foreground group-hover:text-hazard"
							>
								&gt;&gt;&gt;
							</span>
						</Link>
					))}
				</section>
			))}

			{/* Footer strip */}
			<div className="flex flex-wrap justify-between gap-2 px-4 py-6 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground md:px-8">
				<span>© KIT / SWISS SERIES</span>
				<span>SET IN INTER + IBM PLEX MONO ®</span>
			</div>
		</main>
	);
}
