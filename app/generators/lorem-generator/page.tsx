"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { ToolHeader } from "@/components/ToolHeader";
import { Type, Copy } from "lucide-react";

// --- Hangul composition (standard jamo indices) ---
// 19 choseong (initial consonants)
// 21 jungseong (vowels)
// 14 jongseong (final consonants, index 0 = no final)
// Syllable code point: 0xAC00 + cho*588 + jung*28 + jong

const JONG_STRIDE = 28;
const CHO_STRIDE = 588;
const BASE = 0xac00;

function makeHangulSyllable(): string {
	const cho = Math.floor(Math.random() * 19);
	const jung = Math.floor(Math.random() * 21);
	// 14 final consonants (indices 1-14 in Unicode; index 0 = none)
	const jong = Math.random() < 0.5 ? 1 + Math.floor(Math.random() * 14) : 0;
	return String.fromCodePoint(
		BASE + cho * CHO_STRIDE + jung * JONG_STRIDE + jong,
	);
}

function makeLatinWord(): string {
	const len = 3 + Math.floor(Math.random() * 6);
	return Array.from({ length: len }, () =>
		String.fromCharCode(97 + Math.floor(Math.random() * 26)),
	).join("");
}

function makeDigitWord(): string {
	const len = 2 + Math.floor(Math.random() * 3);
	return Array.from({ length: len }, () =>
		String(48 + Math.floor(Math.random() * 10)),
	).join("");
}

type CharSets = {
	alphabetical: boolean;
	korean: boolean;
	numerical: boolean;
};

function makeWord(sets: CharSets): string {
	const { alphabetical, korean, numerical } = sets;
	const hasLetter = alphabetical || korean;

	// NUMERICAL only → all digit words
	if (numerical && !hasLetter) return makeDigitWord();

	// Mixed: ~20% digit words when numerical is on
	if (numerical && Math.random() < 0.2) return makeDigitWord();

	// Pick letter source
	if (alphabetical && korean) {
		return Math.random() < 0.5 ? makeLatinWord() : makeHangulSyllable();
	}
	if (korean) return makeHangulSyllable();
	return makeLatinWord();
}

function makeSentence(wordCount: number, sets: CharSets): string {
	const words = Array.from({ length: wordCount }, () => makeWord(sets));
	// Capitalize first letter only when sentence contains latin
	if (sets.alphabetical && words[0]) {
		words[0] = words[0][0].toUpperCase() + words[0].slice(1);
	}
	return words.join(" ") + ".";
}

function makeParagraph(
	sentenceCount: number,
	wordsPerSentence: number,
	sets: CharSets,
): string {
	return Array.from({ length: sentenceCount }, () =>
		makeSentence(wordsPerSentence, sets),
	).join(" ");
}

function generate(
	sets: CharSets,
	wordsPerSentence: number,
	sentencesPerParagraph: number,
	paragraphCount: number,
): string {
	return Array.from({ length: paragraphCount }, () =>
		makeParagraph(sentencesPerParagraph, wordsPerSentence, sets),
	).join("\n\n");
}

function computeStats(text: string): {
	paragraphs: number;
	sentences: number;
	words: number;
} {
	if (!text) return { paragraphs: 0, sentences: 0, words: 0 };
	const paragraphs = text.split("\n\n").filter(Boolean).length;
	const sentences = text
		.split(/[.!?]+/)
		.filter((s) => s.trim().length > 0).length;
	const words = text.split(/\s+/).filter(Boolean).length;
	return { paragraphs, sentences, words };
}

function clampCount(v: string): number {
	return Math.max(1, Math.min(99, parseInt(v) || 1));
}

export default function LoremGeneratorPage() {
	const [alphabetical, setAlphabetical] = useState(true);
	const [korean, setKorean] = useState(false);
	const [numerical, setNumerical] = useState(false);
	const [wordsPerSentence, setWordsPerSentence] = useState(8);
	const [sentencesPerParagraph, setSentencesPerParagraph] = useState(4);
	const [paragraphCount, setParagraphCount] = useState(3);
	const [output, setOutput] = useState("");

	const sets: CharSets = useMemo(
		() => ({ alphabetical, korean, numerical }),
		[alphabetical, korean, numerical],
	);
	const anyTicked = alphabetical || korean || numerical;

	const doGenerate = useCallback(() => {
		setOutput(
			generate(sets, wordsPerSentence, sentencesPerParagraph, paragraphCount),
		);
	}, [sets, wordsPerSentence, sentencesPerParagraph, paragraphCount]);

	useEffect(() => {
		doGenerate();
	}, [doGenerate]);

	const handleCopy = () => {
		if (!output) return;
		navigator.clipboard.writeText(output);
		toast.success("COPIED");
	};

	const stats = computeStats(output);

	return (
		<ToolPageLayout
			header={
				<ToolHeader
					icon={<Type aria-hidden="true" className="h-5 w-5" />}
					title="Lorem Generator"
				/>
			}
		>
			<div className="space-y-4">
				{/* CHARACTER SETS */}
				<div className="space-y-2">
					<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
						[ CHARACTER SETS ]
					</p>
					<div className="border border-ink bg-muted/40 p-3 space-y-3">
						<div className="flex items-center gap-2">
							<Checkbox
								id="set-alpha"
								checked={alphabetical}
								onCheckedChange={(v) => setAlphabetical(v === true)}
							/>
							<Label
								htmlFor="set-alpha"
								className="font-mono text-[11px] uppercase tracking-[0.08em]"
							>
								ALPHABETICAL
							</Label>
						</div>
						<div className="flex items-center gap-2">
							<Checkbox
								id="set-korean"
								checked={korean}
								onCheckedChange={(v) => setKorean(v === true)}
							/>
							<Label
								htmlFor="set-korean"
								className="font-mono text-[11px] uppercase tracking-[0.08em]"
							>
								KOREAN
							</Label>
						</div>
						<div className="flex items-center gap-2">
							<Checkbox
								id="set-num"
								checked={numerical}
								onCheckedChange={(v) => setNumerical(v === true)}
							/>
							<Label
								htmlFor="set-num"
								className="font-mono text-[11px] uppercase tracking-[0.08em]"
							>
								NUMERICAL
							</Label>
						</div>
					</div>
					{!anyTicked && (
						<div className="border-hazard text-hazard font-mono text-[11px] uppercase tracking-[0.08em] px-3 py-2 border">
							[ SELECT AT LEAST ONE SET ]
						</div>
					)}
				</div>

				{/* STRUCTURE */}
				<div className="space-y-2">
					<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
						[ STRUCTURE ]
					</p>
					<div className="grid grid-cols-3 gap-3">
						<div className="space-y-1">
							<Label className="font-mono text-[11px] uppercase tracking-[0.08em]">
								WORDS / SENTENCE
							</Label>
							<Input
								type="number"
								min={1}
								max={99}
								value={wordsPerSentence}
								onChange={(e) => setWordsPerSentence(clampCount(e.target.value))}
								className="font-mono"
							/>
						</div>
						<div className="space-y-1">
							<Label className="font-mono text-[11px] uppercase tracking-[0.08em]">
								SENTENCES / PARAGRAPH
							</Label>
							<Input
								type="number"
								min={1}
								max={99}
								value={sentencesPerParagraph}
								onChange={(e) => setSentencesPerParagraph(clampCount(e.target.value))}
								className="font-mono"
							/>
						</div>
						<div className="space-y-1">
							<Label className="font-mono text-[11px] uppercase tracking-[0.08em]">
								PARAGRAPHS
							</Label>
							<Input
								type="number"
								min={1}
								max={99}
								value={paragraphCount}
								onChange={(e) => setParagraphCount(clampCount(e.target.value))}
								className="font-mono"
							/>
						</div>
					</div>
				</div>

				{/* GENERATE */}
				<Button
					onClick={doGenerate}
					disabled={!anyTicked}
					className="w-full font-mono"
				>
					GENERATE
				</Button>

				{/* OUTPUT */}
				<div className="space-y-2">
					<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
						[ OUTPUT ]
					</p>
					<div className="border border-ink bg-muted/40 p-3 font-mono text-sm whitespace-pre-wrap break-all">
						{output}
					</div>

					{/* Stats strip */}
					<div className="flex items-center justify-between border border-ink bg-muted/40 px-3 py-2">
						<span className="font-mono text-sm">
							[ {stats.paragraphs} P / {stats.sentences} S / {stats.words} W ]
						</span>
					</div>

					{/* Actions */}
					<div className="flex gap-3">
						<Button
							onClick={doGenerate}
							disabled={!anyTicked}
							variant="outline"
							className="flex-1 font-mono"
						>
							REGENERATE
						</Button>
						<Button
							onClick={handleCopy}
							variant="outline"
							className="flex-1 font-mono"
						>
							<Copy aria-hidden="true" className="h-4 w-4 mr-2" />
							COPY
						</Button>
					</div>
				</div>
			</div>
		</ToolPageLayout>
	);
}
