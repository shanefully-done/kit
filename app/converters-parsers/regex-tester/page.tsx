"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import HighlightWords from "react-highlight-words";
import ToolPageLayout from "@/components/ToolPageLayout";
import ToolHeader from "@/components/ToolHeader";
import { SettingsIcon } from "lucide-react";

export default function RegexTesterPage() {
	const [regexPattern, setRegexPattern] = useState("");
	const [testString, setTestString] = useState("");
	const [flags, setFlags] = useState({
		g: false,
		i: false,
		m: false,
	});
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
		currentFlags: typeof flags
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
				{/* InputArea */}
				<div className="space-y-2">
					<label htmlFor="regex-pattern" className="text-sm">
						Regex Pattern
					</label>
					<Input
						id="regex-pattern"
						type="text"
						value={regexPattern}
						onChange={handleRegexChange}
						placeholder="Enter regex pattern"
					/>

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

					<label htmlFor="test-string" className="text-sm">
						Test String
					</label>
					<Textarea
						id="test-string"
						value={testString}
						onChange={handleTestStringChange}
						placeholder="Enter string to test against"
						rows={10}
						className="font-mono"
					/>
				</div>

				{/* ActionButtons */}
				<div className="flex flex-wrap gap-2"></div>

				{/* AdditionalSettings */}
				<div className="sr-only">No additional settings</div>

				{/* ResultDisplay */}
				<div className="space-y-4">
					<div className="bg-gray-100 p-4 rounded-md">
						<h3 className="text-lg font-medium mb-2">
							Highlighted Matches ({matches.length})
						</h3>
						<div className="whitespace-pre-wrap font-mono">
							{testString && regexPattern ? (
								<HighlightWords
									highlightClassName="bg-yellow-300"
									searchWords={matches}
									autoEscape={true}
									textToHighlight={testString}
								/>
							) : (
								testString
							)}
						</div>
					</div>

					<div className="bg-gray-100 p-4 rounded-md">
						<h3 className="text-lg font-medium mb-2">Match Details</h3>
						{matches.length === 0 ? (
							<p>No matches found.</p>
						) : (
							<table className="min-w-full divide-y divide-gray-200">
								<thead className="bg-gray-50">
									<tr>
										<th
											scope="col"
											className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
										>
											Match
										</th>
										<th
											scope="col"
											className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
										>
											Index
										</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{matches.map((match, index) => (
										<tr key={index}>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
												{match}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
												{testString.indexOf(match)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						)}
					</div>

					{error && <p className="text-red-500">Error: {error}</p>}
				</div>
			</div>
		</ToolPageLayout>
	);
}
