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

// matches the { g, i, m } state shape
const isFlags = (v: unknown): v is { g: boolean; i: boolean; m: boolean } =>
	typeof v === "object" &&
	v !== null &&
	["g", "i", "m"].every(
		(k) => typeof (v as Record<string, unknown>)[k] === "boolean",
	);
export default function RegexTesterPage() {
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
			setError(e instanceof Error ? e.message : "An unknown error occurred");
			setMatches([]);
		}
	};

	return (
		<ToolPageLayout
			header={
				<ToolHeader icon={<SettingsIcon aria-hidden />} title="Regex Tester" />
			}
		>
			<div className="space-y-4">
				<div className="space-y-2">
					<Input
						type="text"
						value={regexPattern}
						onChange={handleRegexChange}
						placeholder="Enter regex pattern"
						className="font-mono"
						aria-label="Regex pattern"
					/>

					<p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
						FLAGS
					</p>
					<div className="flex flex-wrap gap-2">
						<Badge
							variant={flags.g ? "default" : "outline"}
							onClick={() => handleFlagChange("g")}
							className="cursor-pointer"
						>
							g (global)
						</Badge>
						<Badge
							variant={flags.i ? "default" : "outline"}
							onClick={() => handleFlagChange("i")}
							className="cursor-pointer"
						>
							i (case-insensitive)
						</Badge>
						<Badge
							variant={flags.m ? "default" : "outline"}
							onClick={() => handleFlagChange("m")}
							className="cursor-pointer"
						>
							m (multiline)
						</Badge>
					</div>

					<Textarea
						value={testString}
						onChange={handleTestStringChange}
						placeholder="Enter string to test against"
						rows={10}
						className="font-mono"
						aria-label="Test string"
					/>
				</div>

				{error ? (
					<div className="border border-hazard bg-muted/40 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.08em] text-hazard-text">
						ERROR: {error}
					</div>
				) : matches.length === 0 && regexPattern && testString ? (
					<div className="border border-hazard px-3 py-2 font-mono text-[11px] uppercase tracking-[0.08em] text-hazard-text">
						[ NO MATCH ]
					</div>
				) : (
					<div className="border border-ink px-3 py-2 font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
						[ {matches.length} MATCHES ]
					</div>
				)}

				<div className="space-y-4">
					<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
						[ HIGHLIGHTED MATCHES ]
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
						[ MATCH DETAILS ]
					</p>
					{matches.length === 0 ? (
						<div className="border border-ink bg-muted/40 p-3 font-mono text-sm text-muted-foreground">
							No matches found.
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Match</TableHead>
									<TableHead>Index</TableHead>
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
