"use client";

import { useState } from "react";
import { usePersistentState } from "@/hooks/use-persistent-state";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import HighlightWords from "react-highlight-words";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import ToolPageLayout from "@/components/ToolPageLayout";
import ToolHeader from "@/components/ToolHeader";
import { SettingsIcon } from "lucide-react";
import { useI18n } from "@/lib/i18n";

// matches the { g, i, m } state shape
const isFlags = (v: unknown): v is { g: boolean; i: boolean; m: boolean } =>
	typeof v === "object" &&
	v !== null &&
	["g", "i", "m"].every(
		(k) => typeof (v as Record<string, unknown>)[k] === "boolean",
	);
export default function RegexTesterPage() {
	const { t } = useI18n();
	const [regexPattern, setRegexPattern] = useState("");
	const [testString, setTestString] = useState("");
	const [flags, setFlags] = usePersistentState(
		"regex-tester:flags",
		{ g: false, i: false, m: false },
		isFlags,
	);
	const [matches, setMatches] = useState<string[]>([]);
	const [error, setError] = useState<string>("");

	const handleRegexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setRegexPattern(e.target.value);
		updateMatches(e.target.value, testString, flags);
	};

	const handleTestStringChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setTestString(e.target.value);
		updateMatches(regexPattern, e.target.value, flags);
	};

	const handleFlagChange = (flag: "g" | "i" | "m") => {
		const newFlags = { ...flags, [flag]: !flags[flag] };
		setFlags(newFlags);
		updateMatches(regexPattern, testString, newFlags);
	};

	const updateMatches = (
		pattern: string,
		text: string,
		currentFlags: typeof flags,
	) => {
		if (!pattern) {
			setMatches([]);
			setError("");
			return;
		}

		try {
			const flagString = Object.entries(currentFlags)
				.filter(([, value]) => value)
				.map(([key]) => key)
				.join("");
			const regex = new RegExp(pattern, flagString);
			const newMatches: string[] = [];
			let match;
			while ((match = regex.exec(text)) !== null) {
				newMatches.push(match[0]);
				if (!currentFlags.g) {
					break;
				}
			}
			setMatches(newMatches);
			setError("");
		} catch (e: unknown) {
			setError(e instanceof Error ? e.message : t("tools.regexTester.unknownError"));
			setMatches([]);
		}
	};

	return (
		<ToolPageLayout
			header={
				<ToolHeader icon={<SettingsIcon aria-hidden />} title={t("tools.regexTester.title")} />
			}
		>
			<div className="space-y-4">
				<div className="space-y-2">
					<Input
						type="text"
						value={regexPattern}
						onChange={handleRegexChange}
						placeholder={t("tools.regexTester.patternPlaceholder")}
						className="font-mono"
						aria-label={t("tools.regexTester.patternAria")}
					/>

					<p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
						{t("tools.regexTester.flagsLabel")}
					</p>
					<div className="flex flex-wrap gap-2">
						<Badge
							variant={flags.g ? "default" : "outline"}
							onClick={() => handleFlagChange("g")}
							className="cursor-pointer"
						>
							{t("tools.regexTester.flagGlobal")}
						</Badge>
						<Badge
							variant={flags.i ? "default" : "outline"}
							onClick={() => handleFlagChange("i")}
							className="cursor-pointer"
						>
							{t("tools.regexTester.flagCaseInsensitive")}
						</Badge>
						<Badge
							variant={flags.m ? "default" : "outline"}
							onClick={() => handleFlagChange("m")}
							className="cursor-pointer"
						>
							{t("tools.regexTester.flagMultiline")}
						</Badge>
					</div>

					<Textarea
						value={testString}
						onChange={handleTestStringChange}
						placeholder={t("tools.regexTester.testPlaceholder")}
						rows={10}
						className="font-mono"
						aria-label={t("tools.regexTester.testAria")}
					/>
				</div>

				{error ? (
					<div className="border border-hazard bg-muted/40 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.08em] text-hazard-text">
						ERROR: {error}
					</div>
				) : matches.length === 0 && regexPattern && testString ? (
					<div className="border border-hazard px-3 py-2 font-mono text-[11px] uppercase tracking-[0.08em] text-hazard-text">
						{t("tools.regexTester.noMatch")}
					</div>
				) : (
					<div className="border border-ink px-3 py-2 font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
						{t("tools.regexTester.matchesCount", { count: matches.length })}
					</div>
				)}

				<div className="space-y-4">
					<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
						{t("tools.regexTester.highlightedMatches")}
					</p>
					<div className="border border-ink bg-muted/40 p-3 font-mono text-sm whitespace-pre-wrap">
						{testString && regexPattern ? (
							<HighlightWords
								highlightStyle={{ backgroundColor: "#E61919", color: "#F4F4F0" }}
								searchWords={matches}
								autoEscape={true}
								textToHighlight={testString}
							/>
						) : (
							testString
						)}
					</div>

					<div className="border-t border-ink pt-4" />
					<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
						{t("tools.regexTester.matchDetails")}
					</p>
					{matches.length === 0 ? (
						<div className="border border-ink bg-muted/40 p-3 font-mono text-sm text-muted-foreground">
							{t("tools.regexTester.noMatchesFound")}
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>{t("tools.regexTester.matchHeader")}</TableHead>
									<TableHead>{t("tools.regexTester.indexHeader")}</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{matches.map((match, index) => (
									<TableRow key={index}>
										<TableCell className="font-mono">{match}</TableCell>
										<TableCell className="font-mono">
											{testString.indexOf(match)}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</div>
			</div>
		</ToolPageLayout>
	);
}
