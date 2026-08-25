"use client";

import { useState, useMemo } from "react";
import { diffLines } from "diff";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { ToolHeader } from "@/components/ToolHeader";
import { GitCompare } from "lucide-react";

type DiffRow = {
	type: "add" | "remove" | "context";
	text: string;
};

export default function DiffViewerPage() {
	const [source, setSource] = useState("");
	const [target, setTarget] = useState("");
	const [ignoreCase, setIgnoreCase] = useState(false);
	const [trimWhitespace, setTrimWhitespace] = useState(false);

	const { rows, adds, dels } = useMemo(() => {
		if (!source && !target) return { rows: [], adds: 0, dels: 0 };

		const opts: { ignoreCase?: boolean; ignoreWhitespace?: boolean } = {};
		if (ignoreCase) opts.ignoreCase = true;
		if (trimWhitespace) opts.ignoreWhitespace = true;

		const parts = diffLines(source, target, opts);
		const rows: DiffRow[] = [];
		let adds = 0;
		let dels = 0;

		for (const part of parts) {
			const lines = part.value.replace(/\n$/, "").split("\n");
			const type = part.added
				? ("add" as const)
				: part.removed
					? ("remove" as const)
					: ("context" as const);
			for (const line of lines) {
				rows.push({ type, text: line });
				if (type === "add") adds++;
				if (type === "remove") dels++;
			}
		}

		return { rows, adds, dels };
	}, [source, target, ignoreCase, trimWhitespace]);

	const identical = source === target;

	return (
		<ToolPageLayout
			header={<ToolHeader icon={<GitCompare aria-hidden />} title="Diff Viewer" />}
		>
			<div className="space-y-4">
				<div className="grid md:grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label className="font-mono text-[11px] uppercase tracking-[0.08em]">
							Source
						</Label>
						<Textarea
							value={source}
							onChange={(e) => setSource(e.target.value)}
							className="font-mono min-h-40"
							placeholder="Paste source text..."
						/>
					</div>
					<div className="space-y-2">
						<Label className="font-mono text-[11px] uppercase tracking-[0.08em]">
							Target
						</Label>
						<Textarea
							value={target}
							onChange={(e) => setTarget(e.target.value)}
							className="font-mono min-h-40"
							placeholder="Paste target text..."
						/>
					</div>
				</div>

				<div className="flex items-center justify-between border border-ink bg-muted/40 px-3 py-2">
					<span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
						Options
					</span>
					<div className="flex items-center gap-4">
						<label className="flex items-center gap-2 cursor-pointer">
							<Switch checked={ignoreCase} onCheckedChange={setIgnoreCase} />
							<span className="font-mono text-[11px] uppercase tracking-[0.08em]">
								Ignore Case
							</span>
						</label>
						<label className="flex items-center gap-2 cursor-pointer">
							<Switch checked={trimWhitespace} onCheckedChange={setTrimWhitespace} />
							<span className="font-mono text-[11px] uppercase tracking-[0.08em]">
								Trim Whitespace
							</span>
						</label>
					</div>
				</div>

				{identical ? (
					<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
						[ IDENTICAL ]
					</p>
				) : rows.length > 0 ? (
					<>
						<div className="flex items-center justify-between border border-ink bg-muted/40 px-3 py-2">
							<span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
								[ +{adds} / -{dels} ]
							</span>
						</div>
						<div className="border border-ink overflow-auto max-h-96 font-mono text-xs leading-6">
							{rows.map((row, i) => {
								const prefix =
									row.type === "add" ? "+" : row.type === "remove" ? "-" : " ";
								const cls =
									row.type === "add"
										? "bg-ink text-paper px-2"
										: row.type === "remove"
											? "bg-hazard text-white px-2"
											: "px-2";
								return (
									<div key={i} className={cls}>
										{prefix} {row.text}
									</div>
								);
							})}
						</div>
					</>
				) : null}
			</div>
		</ToolPageLayout>
	);
}
