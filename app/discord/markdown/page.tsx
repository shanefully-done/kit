"use client";

import React, { useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Bold as BoldIcon,
	Italic as ItalicIcon,
	Underline as UnderlineIcon,
	Strikethrough as StrikeIcon,
	EyeOff as EyeOffIcon,
	Code as CodeIcon,
	FileCode as FileCodeIcon,
	FileText as FileTextIcon,
	Quote as QuoteIcon,
	List as ListIcon,
	Link as LinkIcon,
	Copy as CopyIcon,
} from "lucide-react";
import { toast } from "sonner";
import ToolPageLayout from "@/components/ToolPageLayout";
import ToolHeader from "@/components/ToolHeader";
import { useI18n } from "@/lib/i18n";
import {
	parseDiscordMarkdown,
	escapeDiscordMarkdown,
	type Block,
	type Inline,
} from "@/lib/discord/markdown";

// --- preview renderers ---

function SpoilerSpan({ children }: { children: React.ReactNode }) {
	const [revealed, setRevealed] = useState(false);
	return (
		<span
			role="button"
			tabIndex={0}
			onClick={() => setRevealed((r) => !r)}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					setRevealed((r) => !r);
				}
			}}
			className={
				revealed
					? "cursor-pointer bg-transparent text-foreground"
					: "cursor-pointer select-none bg-ink px-1 text-transparent"
			}
		>
			{children}
		</span>
	);
}

function InlineNode({ node }: { node: Inline }) {
	switch (node.kind) {
		case "text":
			return <>{node.text}</>;
		case "bold":
			return (
				<span className="font-bold">
					{node.children.map((c, i) => (
						<InlineNode key={i} node={c} />
					))}
				</span>
			);
		case "italic":
			return (
				<span className="italic">
					{node.children.map((c, i) => (
						<InlineNode key={i} node={c} />
					))}
				</span>
			);
		case "underline":
			return (
				<span className="underline">
					{node.children.map((c, i) => (
						<InlineNode key={i} node={c} />
					))}
				</span>
			);
		case "strike":
			return (
				<span className="line-through">
					{node.children.map((c, i) => (
						<InlineNode key={i} node={c} />
					))}
				</span>
			);
		case "spoiler":
			return (
				<SpoilerSpan>
					{node.children.map((c, i) => (
						<InlineNode key={i} node={c} />
					))}
				</SpoilerSpan>
			);
		case "inlineCode":
			return (
				<code className="border border-ink px-1 font-mono">
					{node.children.map((c, i) => (
						<InlineNode key={i} node={c} />
					))}
				</code>
			);
		case "lineBreak":
			return <br />;
		case "link":
			return (
				<a
					href={node.url}
					target="_blank"
					rel="noreferrer"
					className="underline"
				>
					{node.text}
				</a>
			);
		case "mention":
			return <Badge>{node.mention.raw}</Badge>;
		case "timestamp":
			return (
				<Badge>
					{`<t:${node.unix}${node.style ? `:${node.style}` : ""}>`}
				</Badge>
			);
		case "emoji":
			return (
				<Badge>
					{`${node.animated ? "<a" : "<:"}:${node.name}:${node.id}>`}
				</Badge>
			);
	}
}

function Inlines({ inlines }: { inlines: Inline[] }) {
	return (
		<>
			{inlines.map((inline, i) => (
				<InlineNode key={i} node={inline} />
			))}
		</>
	);
}

const HEADING_CLASSES: Record<1 | 2 | 3, string> = {
	1: "text-2xl font-black uppercase",
	2: "text-xl font-black uppercase",
	3: "text-lg font-black uppercase",
};

function BlockNode({ block }: { block: Block }) {
	switch (block.kind) {
		case "paragraph":
			return (
				<p>
					<Inlines inlines={block.inlines} />
				</p>
			);
		case "heading": {
			const cls = HEADING_CLASSES[block.level];
			if (block.level === 1)
				return <h1 className={cls}>{block.text}</h1>;
			if (block.level === 2)
				return <h2 className={cls}>{block.text}</h2>;
			return <h3 className={cls}>{block.text}</h3>;
		}
		case "blockquote":
			return (
				<blockquote className="border-l-2 border-ink pl-3">
					{block.blocks.map((b, i) => (
						<BlockNode key={i} block={b} />
					))}
				</blockquote>
			);
		case "code":
			return (
				<div className="relative">
					{block.lang && (
						<Badge
							variant="secondary"
							className="absolute right-1 top-1 z-10"
						>
							{block.lang}
						</Badge>
					)}
					<pre className="border border-ink bg-ink p-3 font-mono text-paper">
						<code>{block.content}</code>
					</pre>
				</div>
			);
		case "list":
			return block.ordered ? (
				<ol className="list-decimal pl-5">
					{block.items.map((item, i) => (
						<li key={i}>
							<Inlines inlines={item} />
						</li>
					))}
				</ol>
			) : (
				<ul className="list-disc pl-5">
					{block.items.map((item, i) => (
						<li key={i}>
							<Inlines inlines={item} />
						</li>
					))}
				</ul>
			);
	}
}

// --- toolbar operations ---

type RunFn = (
	text: string,
	start: number,
	end: number,
) => { next: string; selStart: number; selEnd: number };

function wrapOp(prefix: string, suffix: string): RunFn {
	return (text, start, end) => {
		const sel = text.slice(start, end);
		const next =
			text.slice(0, start) + prefix + sel + suffix + text.slice(end);
		const innerStart = start + prefix.length;
		return { next, selStart: innerStart, selEnd: innerStart + sel.length };
	};
}

function linePrefixOp(prefix: string): RunFn {
	return (text, start, end) => {
		const lineStart = Math.max(text.lastIndexOf("\n", start - 1) + 1, 0);
		let lineEnd = text.indexOf("\n", end);
		if (lineEnd === -1) lineEnd = text.length;
		const segment = text.slice(lineStart, lineEnd);
		const prefixed = segment
			.split("\n")
			.map((line) => prefix + line)
			.join("\n");
		const next =
			text.slice(0, lineStart) + prefixed + text.slice(lineEnd);
		return {
			next,
			selStart: lineStart + prefix.length,
			selEnd: lineStart + prefixed.length,
		};
	};
}

function linkOp(): RunFn {
	return (text, start, end) => {
		const sel = text.slice(start, end);
		if (sel) {
			const insert = `[${sel}](https://)`;
			const next = text.slice(0, start) + insert + text.slice(end);
			const urlStart = start + sel.length + 3;
			return { next, selStart: urlStart, selEnd: urlStart + 8 };
		}
		const insert = "[text](https://)";
		const next = text.slice(0, start) + insert + text.slice(end);
		return { next, selStart: start + 1, selEnd: start + 5 };
	};
}

// --- page ---

type ToolbarOp = { icon: React.ReactNode; label: string; run: RunFn };

const DiscordMarkdownPage = () => {
	const { t } = useI18n();
	const [text, setText] = useState("");
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const blocks = useMemo(() => parseDiscordMarkdown(text), [text]);
	const escaped = useMemo(() => escapeDiscordMarkdown(text), [text]);

	const applyOp = (run: RunFn) => {
		const el = textareaRef.current;
		if (!el) return;
		const { next, selStart, selEnd } = run(
			text,
			el.selectionStart,
			el.selectionEnd,
		);
		setText(next);
		requestAnimationFrame(() => {
			el.focus();
			el.setSelectionRange(selStart, selEnd);
		});
	};

	const ops: ToolbarOp[] = [
		{
			icon: <BoldIcon className="h-4 w-4" />,
			label: t("tools.discordMarkdown.boldAria"),
			run: wrapOp("**", "**"),
		},
		{
			icon: <ItalicIcon className="h-4 w-4" />,
			label: t("tools.discordMarkdown.italicAria"),
			run: wrapOp("*", "*"),
		},
		{
			icon: <UnderlineIcon className="h-4 w-4" />,
			label: t("tools.discordMarkdown.underlineAria"),
			run: wrapOp("__", "__"),
		},
		{
			icon: <StrikeIcon className="h-4 w-4" />,
			label: t("tools.discordMarkdown.strikeAria"),
			run: wrapOp("~~", "~~"),
		},
		{
			icon: <EyeOffIcon className="h-4 w-4" />,
			label: t("tools.discordMarkdown.spoilerAria"),
			run: wrapOp("||", "||"),
		},
		{
			icon: <CodeIcon className="h-4 w-4" />,
			label: t("tools.discordMarkdown.inlineCodeAria"),
			run: wrapOp("`", "`"),
		},
		{
			icon: <FileCodeIcon className="h-4 w-4" />,
			label: t("tools.discordMarkdown.codeBlockAria"),
			run: wrapOp("```\n", "\n```"),
		},
		{
			icon: <QuoteIcon className="h-4 w-4" />,
			label: t("tools.discordMarkdown.quoteAria"),
			run: linePrefixOp("> "),
		},
		{
			icon: <ListIcon className="h-4 w-4" />,
			label: t("tools.discordMarkdown.listAria"),
			run: linePrefixOp("- "),
		},
		{
			icon: <LinkIcon className="h-4 w-4" />,
			label: t("tools.discordMarkdown.linkAria"),
			run: linkOp(),
		},
	];

	const copyEscaped = async () => {
		try {
			await navigator.clipboard.writeText(escaped);
			toast(t("common.copied"));
		} catch {
			toast(t("common.copyFailed"));
		}
	};

	return (
		<ToolPageLayout
			header={
				<ToolHeader
					icon={<FileTextIcon aria-hidden className="h-5 w-5" />}
					title={t("tools.discordMarkdown.title")}
				/>
			}
		>
			<div className="space-y-4">
				{/* Toolbar */}
				<div className="flex flex-wrap items-center gap-1">
					{ops.map((op) => (
						<Button
							key={op.label}
							type="button"
							variant="ghost"
							size="icon"
							aria-label={op.label}
							title={op.label}
							onMouseDown={(e) => e.preventDefault()}
							onClick={() => applyOp(op.run)}
						>
							{op.icon}
						</Button>
					))}
				</div>

				{/* Editor + preview */}
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div className="space-y-2">
						<Textarea
							ref={textareaRef}
							value={text}
							onChange={(e) => setText(e.target.value)}
							placeholder={t(
								"tools.discordMarkdown.editorPlaceholder",
							)}
							className="min-h-[420px] resize-y"
						/>
						<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
							{t("tools.discordMarkdown.syntaxHint")}
						</p>
					</div>

					<Tabs defaultValue="preview">
						<TabsList>
							<TabsTrigger value="preview">
								{t("tools.discordMarkdown.tabPreview")}
							</TabsTrigger>
							<TabsTrigger value="escaped">
								{t("tools.discordMarkdown.tabEscaped")}
							</TabsTrigger>
						</TabsList>
						<TabsContent value="preview">
							<div className="max-h-[420px] min-h-[420px] space-y-2 overflow-y-auto border border-ink p-3 [&_p]:my-0">
								{blocks.map((block, i) => (
									<BlockNode key={i} block={block} />
								))}
							</div>
						</TabsContent>
						<TabsContent value="escaped">
							<div className="relative">
								<pre className="min-h-[420px] max-h-[420px] overflow-auto whitespace-pre-wrap break-words border border-ink p-3 font-mono text-sm">
									{escaped}
								</pre>
								<Button
									type="button"
									variant="outline"
									size="sm"
									className="absolute right-2 top-2"
									aria-label={t(
										"tools.discordMarkdown.copyEscapedAria",
									)}
									onClick={copyEscaped}
								>
									<CopyIcon className="mr-1 h-3 w-3" />
									{t("common.copy")}
								</Button>
							</div>
						</TabsContent>
					</Tabs>
				</div>

				<footer className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
					BOLD · ITALIC · UNDERLINE · STRIKETHROUGH · SPOILER · CODE ·
					HEADINGS · LISTS · LINKS
				</footer>
			</div>
		</ToolPageLayout>
	);
};

export default DiscordMarkdownPage;
