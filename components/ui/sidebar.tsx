"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useI18n, type Path } from "@/lib/i18n";

const groups: {
	labelKey: Path;
	tools: { nameKey: Path; href: string }[];
}[] = [
	{
		labelKey: "nav.categories.converters",
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
			{ nameKey: "tools.jsonParser.title", href: "/converters-parsers/json-parser" },
			{ nameKey: "tools.jwtDecoder.title", href: "/converters-parsers/jwt-decoder" },
			{
				nameKey: "tools.numberBaseConverter.title",
				href: "/converters-parsers/number-base-converter",
			},
			{ nameKey: "tools.curlConverter.title", href: "/converters-parsers/curl-converter" },
			{ nameKey: "tools.dataConverter.title", href: "/converters-parsers/data-converter" },
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
		labelKey: "nav.categories.generators",
		tools: [
			{ nameKey: "tools.barcodeGenerator.title", href: "/generators/barcode-generator" },
			{ nameKey: "tools.gradient.title", href: "/generators/gradient" },
			{ nameKey: "tools.hash.title", href: "/generators/hash" },
			{ nameKey: "tools.hmacGenerator.title", href: "/generators/hmac-generator" },
			{ nameKey: "tools.idGenerator.title", href: "/generators/id-generator" },
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
		labelKey: "nav.categories.viewers",
		tools: [
			{ nameKey: "tools.apiDirectory.title", href: "/viewers-miscellaneous/api-directory" },
			{ nameKey: "tools.diffViewer.title", href: "/viewers-miscellaneous/diff-viewer" },
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
];

const Sidebar = () => {
	const [query, setQuery] = useState("");
	const pathname = usePathname();
	const { theme, setTheme } = useTheme();
	const { locale, setLocale, t } = useI18n();
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);

	const lowerQuery = query.toLowerCase();

	const filteredGroups = groups
		.map((group) => ({
			...group,
			tools: group.tools.filter((tool) =>
				t(tool.nameKey).toLowerCase().includes(lowerQuery),
			),
		}))
		.filter((group) => group.tools.length > 0);

	const hasResults = filteredGroups.length > 0;

	return (
		<div className="flex flex-col h-full bg-paper text-foreground">
			<div className="border-b-2 border-ink px-4 py-4">
				<Link
					href="/"
					className="font-sans font-black tracking-[-0.04em] leading-[0.9] text-3xl"
				>
					Kit<span className="text-hazard-text">.</span>
				</Link>
				<p className="mt-1 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
					REV 2.6 / SWISS SERIES ®
				</p>
			</div>

			<div className="border-b border-ink p-3">
				<Input
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder={t("nav.filterPlaceholder")}
					className="h-9 font-mono text-xs uppercase tracking-[0.08em]"
					aria-label={t("nav.filterAria")}
				/>
			</div>

			<div className="border-b border-ink p-3">
				<div className="border border-ink divide-y divide-ink">
					<div
						role="radiogroup"
						aria-label={t("nav.themeAria")}
						className="grid grid-cols-3 divide-x divide-ink"
					>
						{(["system", "light", "dark"] as const).map((mode) => {
							const active = mounted && theme === mode;
							return (
								<button
									key={mode}
									type="button"
									role="radio"
									aria-checked={active}
									onClick={() => setTheme(mode)}
									className={cn(
										"py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] transition-colors",
										active
											? "bg-ink text-paper"
											: "text-muted-foreground hover:bg-muted hover:text-foreground",
									)}
								>
									{mode}
								</button>
							);
						})}
					</div>
					<div
						role="radiogroup"
						aria-label={t("nav.languageAria")}
						className="grid grid-cols-2 divide-x divide-ink"
					>
						{(["en", "ko"] as const).map((l) => {
							const active = mounted && locale === l;
							return (
								<button
									key={l}
									type="button"
									role="radio"
									aria-checked={active}
									onClick={() => setLocale(l)}
									className={cn(
										"py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] transition-colors",
										active
											? "bg-ink text-paper"
											: "text-muted-foreground hover:bg-muted hover:text-foreground",
									)}
								>
									{l === "en" ? "EN" : "한국어"}
								</button>
							);
						})}
					</div>
				</div>
			</div>

			<nav className="sidebar-scroll flex-1 min-h-0 overflow-y-auto">
				{hasResults ? (
					filteredGroups.map((group) => (
						<React.Fragment key={group.labelKey}>
							<div className="sticky top-0 bg-muted border-y border-ink px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-foreground">
								{`/// ${t(group.labelKey)}`}
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
											{t(tool.nameKey)}
										</span>
										{active && <span aria-hidden="true">®</span>}
									</Link>
								);
							})}
						</React.Fragment>
					))
				) : (
					<p className="px-3 py-4 font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
						{t("nav.noMatch")}
					</p>
				)}
			</nav>

			<div className="border-t-2 border-ink px-4 py-3">
				<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
					{t("nav.footerLine1")}
				</p>
				<p className="mt-1 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
					{t("nav.footerLine2")}
				</p>
			</div>
		</div>
	);
};

export default Sidebar;
