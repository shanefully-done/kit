"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useI18n, type Path } from "@/lib/i18n";

type Tool = { nameKey: Path; href: string };
type Category = { titleKey: Path; tools: Tool[] };

const categories: Category[] = [
	{
		titleKey: "nav.categories.converters",
		tools: [
			{
				nameKey: "tools.base64EncoderDecoder.title",
				href: "/converters-parsers/base64-encoder-decoder",
			},
			{
				nameKey: "tools.base64ImageConverter.title",
				href: "/converters-parsers/base64-image-converter",
			},
			{ nameKey: "tools.chmodCalculator.title", href: "/converters-parsers/chmod-calculator" },
			{ nameKey: "tools.colorConverter.title", href: "/converters-parsers/color-converter" },
			{ nameKey: "tools.cronParser.title", href: "/converters-parsers/cron-parser" },
			{ nameKey: "tools.curlConverter.title", href: "/converters-parsers/curl-converter" },
			{ nameKey: "tools.dataConverter.title", href: "/converters-parsers/data-converter" },
			{ nameKey: "tools.jsonParser.title", href: "/converters-parsers/json-parser" },
			{ nameKey: "tools.jwtDecoder.title", href: "/converters-parsers/jwt-decoder" },
			{
				nameKey: "tools.numberBaseConverter.title",
				href: "/converters-parsers/number-base-converter",
			},
			{ nameKey: "tools.regexTester.title", href: "/converters-parsers/regex-tester" },
			{ nameKey: "tools.textCase.title", href: "/converters-parsers/text-case" },
			{
				nameKey: "tools.timestampConverter.title",
				href: "/converters-parsers/timestamp-converter",
			},
			{
				nameKey: "tools.timezoneConverter.title",
				href: "/converters-parsers/timezone-converter",
			},
			{ nameKey: "tools.unitConverter.title", href: "/converters-parsers/unit-converter" },
			{
				nameKey: "tools.urlEncoderDecoder.title",
				href: "/converters-parsers/url-encoder-decoder",
			},
			{ nameKey: "tools.urlParser.title", href: "/converters-parsers/url-parser" },
		],
	},
	{
		titleKey: "nav.categories.generators",
		tools: [
			{ nameKey: "tools.barcodeGenerator.title", href: "/generators/barcode-generator" },
			{ nameKey: "tools.emojiResizer.title", href: "/generators/emoji-resizer" },
			{ nameKey: "tools.fancyText.title", href: "/generators/fancy-text" },
			{ nameKey: "tools.gradient.title", href: "/generators/gradient" },
			{ nameKey: "tools.hash.title", href: "/generators/hash" },
			{ nameKey: "tools.hmacGenerator.title", href: "/generators/hmac-generator" },
			{ nameKey: "tools.idGenerator.title", href: "/generators/id-generator" },
			{ nameKey: "tools.invisibleText.title", href: "/generators/invisible-text" },
			{ nameKey: "tools.loremGenerator.title", href: "/generators/lorem-generator" },
			{ nameKey: "tools.password.title", href: "/generators/password" },
			{ nameKey: "tools.port.title", href: "/generators/port" },
			{ nameKey: "tools.qrCode.title", href: "/generators/qr-code" },
			{
				nameKey: "tools.svgPlaceholderGenerator.title",
				href: "/generators/svg-placeholder-generator",
			},
			{ nameKey: "tools.totpGenerator.title", href: "/generators/totp-generator" },
			{ nameKey: "tools.uuid.title", href: "/generators/uuid" },
		],
	},
	{
		titleKey: "nav.categories.viewers",
		tools: [
			{ nameKey: "tools.apiDirectory.title", href: "/viewers-miscellaneous/api-directory" },
			{ nameKey: "tools.diffViewer.title", href: "/viewers-miscellaneous/diff-viewer" },
			{ nameKey: "tools.discordLimits.title", href: "/viewers-miscellaneous/discord-limits" },
			{
				nameKey: "tools.httpStatusCodes.title",
				href: "/viewers-miscellaneous/http-status-codes",
			},
			{
				nameKey: "tools.imageMetadataViewer.title",
				href: "/viewers-miscellaneous/image-metadata-viewer",
			},
			{ nameKey: "tools.tokenCounter.title", href: "/viewers-miscellaneous/token-counter" },
			{
				nameKey: "tools.unicodeInspector.title",
				href: "/viewers-miscellaneous/unicode-inspector",
			},
		],
	},
	{
		titleKey: "nav.categories.discordMessages",
		tools: [
			{ nameKey: "tools.discordTimestamp.title", href: "/discord/timestamp" },
			{ nameKey: "tools.discordMarkdown.title", href: "/discord/markdown" },
			{ nameKey: "tools.discordAnsi.title", href: "/discord/ansi" },
			{ nameKey: "tools.discordSplitter.title", href: "/discord/splitter" },
			{ nameKey: "tools.discordCharCounter.title", href: "/discord/char-counter" },
		],
	},
	{
		titleKey: "nav.categories.discordDevelopers",
		tools: [
			{ nameKey: "tools.discordSnowflake.title", href: "/discord/snowflake" },
			{ nameKey: "tools.discordPermissions.title", href: "/discord/permissions" },
			{ nameKey: "tools.discordIntents.title", href: "/discord/intents" },
			{ nameKey: "tools.discordEmbed.title", href: "/discord/embed" },
			{ nameKey: "tools.discordInvite.title", href: "/discord/invite" },
			{ nameKey: "tools.discordWebhook.title", href: "/discord/webhook" },
			{ nameKey: "tools.discordMentions.title", href: "/discord/mentions" },
			{ nameKey: "tools.discordCdn.title", href: "/discord/cdn" },
			{ nameKey: "tools.discordMessageLink.title", href: "/discord/message-link" },
		],
	},
];
const totalUnits = categories.reduce((n, c) => n + c.tools.length, 0);

export default function HomePage() {
	const { t } = useI18n();

	return (
		<main className="min-h-screen bg-paper text-foreground">
			{/* Top strip */}
			<div className="flex items-center justify-between border-b-2 border-ink px-4 py-3 md:px-8">
				<span className="font-mono text-[11px] uppercase tracking-[0.08em]">
					{t("home.topStrip")}
				</span>
				<Button asChild variant="outline" size="sm">
					<Link
						href="https://github.com/shanefully-done/kit"
						target="_blank"
						rel="noopener noreferrer"
					>
						{t("home.sourceButton")}
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
				<h1 className="font-sans font-black tracking-[-0.05em] leading-[0.85] text-[clamp(5rem,16vw,13rem)]">
					Kit<span className="text-hazard-text">.</span>
				</h1>
				<div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
					<span>
						{t("home.statsUnits", {
							units: String(totalUnits).padStart(2, "0"),
							sections: String(categories.length).padStart(2, "0"),
						})}
					</span>
					<span>{t("home.allLocal")}</span>
					<span>{t("home.noTelemetry")}</span>
				</div>
			</div>

			{/* Index sections */}
			{categories.map((category) => (
				<section key={category.titleKey}>
					<div className="flex items-baseline justify-between gap-4 border-b-2 border-ink px-4 py-6 md:px-8">
						<h2 className="font-sans font-black uppercase tracking-[-0.04em] leading-[0.9] text-3xl md:text-5xl">
							{t(category.titleKey)}
						</h2>
						<span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
							{t("home.unitsCount", {
								count: String(category.tools.length).padStart(2, "0"),
							})}
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
								{t(tool.nameKey)}
							</span>
							<span
								aria-hidden="true"
								className="font-mono text-xs tracking-[0.08em] text-muted-foreground group-hover:text-hazard-text"
							>
								&gt;&gt;&gt;
							</span>
						</Link>
					))}
				</section>
			))}

			{/* Footer strip */}
			<div className="flex flex-wrap justify-between gap-2 px-4 py-6 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground md:px-8">
				<a
					href="https://www.ixtj.dev/"
					target="_blank"
					rel="noopener noreferrer"
					className="transition-colors hover:text-hazard-text"
				>
					© 2026 IXTJ
				</a>
				<span>{t("home.setIn")}</span>
			</div>
		</main>
	);
}
