"use client";

import { useState, useMemo } from "react";
import { usePersistentState } from "@/hooks/use-persistent-state";
import { getEncoding } from "js-tiktoken";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { ToolHeader } from "@/components/ToolHeader";
import { Calculator } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const MODEL_MAP = {
	"gpt-4o": { encoding: "o200k_base", label: "gpt-4o (o200k_base)" },
	"gpt-4": { encoding: "cl100k_base", label: "gpt-4 (cl100k_base)" },
	"gpt-3.5-turbo": {
		encoding: "cl100k_base",
		label: "gpt-3.5-turbo (cl100k_base)",
	},
} as const;

type ModelKey = keyof typeof MODEL_MAP;

export default function TokenCounterPage() {
	const { t } = useI18n();
	const [model, setModel] = usePersistentState<ModelKey>(
		"token-counter:model",
		"gpt-4o",
	);
	const [text, setText] = useState("");

	const { tokens, chars, words, charsPerToken } = useMemo(() => {
		const enc = getEncoding(MODEL_MAP[model].encoding);
		const tokens = enc.encode(text);
		const tokenCount = tokens.length;
		const charCount = text.length;
		const wordCount =
			text.length === 0 ? 0 : text.split(/\s+/).filter(Boolean).length;
		const cpt = tokenCount === 0 ? 0 : charCount / tokenCount;
		return {
			tokens: tokenCount,
			chars: charCount,
			words: wordCount,
			charsPerToken: cpt,
		};
	}, [text, model]);

	return (
		<ToolPageLayout
			header={
				<ToolHeader icon={<Calculator aria-hidden />} title={t("tools.tokenCounter.title")} />
			}
		>
			<div className="space-y-4">
				<div className="space-y-2">
					<Label className="font-mono text-[11px] uppercase tracking-[0.08em]">
						{t("tools.tokenCounter.modelLabel")}
					</Label>
					<Select value={model} onValueChange={(v) => setModel(v as ModelKey)}>
						<SelectTrigger className="w-full font-mono">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{(Object.keys(MODEL_MAP) as ModelKey[]).map((key) => (
								<SelectItem key={key} value={key}>
									{MODEL_MAP[key].label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-2">
					<Label className="font-mono text-[11px] uppercase tracking-[0.08em]">
						{t("tools.tokenCounter.inputLabel")}
					</Label>
					<Textarea
						value={text}
						onChange={(e) => setText(e.target.value)}
						className="font-mono min-h-40"
						placeholder={t("tools.tokenCounter.inputPlaceholder")}
					/>
				</div>

				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					<div className="border border-ink bg-muted/40 px-3 py-3">
						<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
							{t("tools.tokenCounter.tokensLabel")}
						</p>
						<p className="font-mono text-2xl mt-1">{tokens.toLocaleString()}</p>
					</div>
					<div className="border border-ink bg-muted/40 px-3 py-3">
						<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
							{t("tools.tokenCounter.charsLabel")}
						</p>
						<p className="font-mono text-lg md:text-xl mt-1">
								{chars.toLocaleString()}
							</p>
					</div>
					<div className="border border-ink bg-muted/40 px-3 py-3">
						<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
							{t("tools.tokenCounter.wordsLabel")}
						</p>
						<p className="font-mono text-lg md:text-xl mt-1">
							{words.toLocaleString()}
						</p>
					</div>
					<div className="border border-ink bg-muted/40 px-3 py-3">
						<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
							{t("tools.tokenCounter.charsPerTokenLabel")}
						</p>
						<p
							className={
								tokens === 0
									? "font-mono text-lg md:text-xl mt-1 text-muted-foreground"
									: "font-mono text-lg md:text-xl mt-1"
							}
						>
							{charsPerToken.toFixed(1)}
						</p>
					</div>
				</div>

				<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
					{t("tools.tokenCounter.estimateNote", { model, encoding: MODEL_MAP[model].encoding })}
				</p>
			</div>
		</ToolPageLayout>
	);
}
