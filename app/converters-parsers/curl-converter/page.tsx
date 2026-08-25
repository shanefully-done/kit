"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Terminal as TerminalIcon } from "lucide-react";
import { toast } from "sonner";
import ToolPageLayout from "@/components/ToolPageLayout";
import ToolHeader from "@/components/ToolHeader";

type Token = string;

// Split a shell-ish command line into tokens, honoring single quotes,
// double quotes, and backslash escapes. Line continuations are already gone.
function tokenize(input: string): Token[] {
	const tokens: Token[] = [];
	let current = "";
	let hasToken = false;
	let i = 0;

	function push() {
		if (hasToken) {
			tokens.push(current);
			current = "";
			hasToken = false;
		}
	}

	while (i < input.length) {
		const ch = input[i];
		if (ch === "'") {
			hasToken = true;
			const end = input.indexOf("'", i + 1);
			if (end === -1) {
				current += input.slice(i + 1);
				i = input.length;
			} else {
				current += input.slice(i + 1, end);
				i = end + 1;
			}
		} else if (ch === '"') {
			hasToken = true;
			i++;
			while (i < input.length && input[i] !== '"') {
				if (input[i] === "\\" && i + 1 < input.length) {
					const next = input[i + 1];
					// keep shell escapes meaningful inside double quotes
					current += '$`"\\'.includes(next) ? next : "\\" + next;
					i += 2;
				} else {
					current += input[i];
					i++;
				}
			}
			i++; // closing quote
		} else if (ch === "\\") {
			hasToken = true;
			if (i + 1 < input.length) {
				current += input[i + 1];
				i += 2;
			} else {
				i++;
			}
		} else if (/\s/.test(ch)) {
			push();
			i++;
		} else {
			hasToken = true;
			current += ch;
			i++;
		}
	}
	push();
	return tokens;
}

type CurlRequest = {
	method: string;
	url: string | null;
	headers: Array<{ name: string; value: string }>;
	bodyParts: string[];
	getFlag: boolean;
	ignoredFlags: string[];
	unparsed: string[];
};

// Flags that consume the next token as their value.
const TAKES_VALUE: Record<string, true> = {
	"-X": true,
	"--request": true,
	"-H": true,
	"--header": true,
	"-d": true,
	"--data": true,
	"--data-raw": true,
	"--data-binary": true,
	"--data-urlencode": true,
	"--json": true,
	"-u": true,
	"--user": true,
	"-b": true,
	"--cookie": true,
	"-A": true,
	"--user-agent": true,
	"-e": true,
	"--referer": true,
	"-F": true,
	"--form": true,
};

function parseCurl(raw: string): CurlRequest | null {
	// join `\`-continued lines into one logical line
	const joined = raw.replace(/\\\r?\n/g, " ").trim();
	if (!joined) return null;
	const tokens = tokenize(joined);

	// drop leading program tokens ("curl", optional "sudo", versioned "curl/8.1")
	let idx = 0;
	while (idx < tokens.length && /^(sudo|curl(\/[\w.-]+)?)$/.test(tokens[idx]))
		idx++;

	const req: CurlRequest = {
		method: "",
		url: null,
		headers: [],
		bodyParts: [],
		getFlag: false,
		ignoredFlags: [],
		unparsed: [],
	};

	while (idx < tokens.length) {
		const tok = tokens[idx];
		if (tok.startsWith("-") && tok !== "-") {
			if (tok === "-X" || tok === "--request") {
				req.method = tokens[idx + 1] ?? "";
				idx += 2;
			} else if (tok === "-H" || tok === "--header") {
				const hv = tokens[idx + 1] ?? "";
				const sep = hv.indexOf(":");
				if (sep > 0) {
					req.headers.push({
						name: hv.slice(0, sep).trim(),
						value: hv.slice(sep + 1).trim(),
					});
				}
				idx += 2;
			} else if (
				tok === "-d" ||
				tok === "--data" ||
				tok === "--data-raw" ||
				tok === "--data-binary" ||
				tok === "--data-urlencode" ||
				tok === "--json"
			) {
				req.bodyParts.push(tokens[idx + 1] ?? "");
				if (
					tok === "--json" &&
					!req.headers.some((h) => h.name.toLowerCase() === "content-type")
				) {
					req.headers.push({ name: "Content-Type", value: "application/json" });
					req.headers.push({ name: "Accept", value: "application/json" });
				}
				idx += 2;
			} else if (tok === "-u" || tok === "--user") {
				const creds = tokens[idx + 1] ?? "";
				const encoded = btoa(
					String.fromCharCode(...new TextEncoder().encode(creds)),
				);
				req.headers.push({ name: "Authorization", value: `Basic ${encoded}` });
				idx += 2;
			} else if (tok === "-b" || tok === "--cookie") {
				req.headers.push({ name: "Cookie", value: tokens[idx + 1] ?? "" });
				idx += 2;
			} else if (tok === "-A" || tok === "--user-agent") {
				req.headers.push({ name: "User-Agent", value: tokens[idx + 1] ?? "" });
				idx += 2;
			} else if (tok === "-e" || tok === "--referer") {
				req.headers.push({ name: "Referer", value: tokens[idx + 1] ?? "" });
				idx += 2;
			} else if (tok === "-F" || tok === "--form") {
				req.ignoredFlags.push(`${tok} ${tokens[idx + 1] ?? ""}`.trim());
				idx += 2;
			} else if (tok === "-G" || tok === "--get") {
				req.getFlag = true;
				idx += 1;
			} else if (
				tok === "-k" ||
				tok === "--insecure" ||
				tok === "-L" ||
				tok === "--location" ||
				tok === "--compressed" ||
				tok === "-i" ||
				tok === "--include" ||
				tok === "-s" ||
				tok === "--silent"
			) {
				req.ignoredFlags.push(tok);
				idx += 1;
			} else if (TAKES_VALUE[tok]) {
				// known value flag not handled above — skip its argument
				idx += 2;
			} else {
				// unknown flag: assume boolean unless it looks like -o style; skip conservatively
				req.unparsed.push(tok);
				idx += 1;
			}
		} else {
			if (req.url === null) req.url = tok;
			else req.unparsed.push(tok);
			idx += 1;
		}
	}

	return req;
}

function buildFetchSnippet(req: CurlRequest): string {
	const body = req.bodyParts.join("&");
	let method = req.method.toUpperCase();
	if (!method) {
		if (req.bodyParts.length > 0 && !req.getFlag) method = "POST";
		else method = "GET";
	}

	let url = req.url ?? "";
	if (req.getFlag && body) {
		const sep = url.includes("?") ? "&" : "?";
		url = url + sep + body;
	}

	const lines: string[] = [];
	lines.push(`const response = await fetch(${JSON.stringify(url)}, {`);
	lines.push(`\tmethod: ${JSON.stringify(method)},`);
	if (req.headers.length > 0) {
		lines.push("\theaders: {");
		for (const h of req.headers) {
			lines.push(`\t\t${JSON.stringify(h.name)}: ${JSON.stringify(h.value)},`);
		}
		lines.push("\t},");
	}
	if (body && !req.getFlag) {
		lines.push(`\tbody: ${JSON.stringify(body)},`);
	}
	lines.push("});");

	const comments: string[] = [];
	const booleanIgnored = req.ignoredFlags.filter(
		(f) => f.startsWith("-") && !f.includes(" "),
	);
	const formFlags = req.ignoredFlags.filter((f) => !booleanIgnored.includes(f));
	if (req.getFlag && body)
		comments.push("// -G/--get: data moved to query string");
	for (const flag of formFlags) comments.push(`// unsupported flag: ${flag}`);
	if (booleanIgnored.length > 0) {
		comments.push(`// ignored curl-only flags: ${booleanIgnored.join(", ")}`);
	}

	return [...comments, ...lines].join("\n");
}

export default function CurlConverterPage() {
	const [curlInput, setCurlInput] = useState("");

	const parsed = useMemo(() => parseCurl(curlInput), [curlInput]);
	const snippet = useMemo(() => {
		if (!parsed || parsed.url === null) return null;
		return buildFetchSnippet(parsed);
	}, [parsed]);

	const hasBody = (parsed?.bodyParts.length ?? 0) > 0;

	return (
		<ToolPageLayout
			header={
				<ToolHeader
					icon={<TerminalIcon aria-hidden className="h-5 w-5" />}
					title="curl to fetch"
				/>
			}
		>
			<div className="space-y-6">
				<section className="space-y-3">
					<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
						[ CURL COMMAND ]
					</p>
					<Textarea
						value={curlInput}
						onChange={(e) => setCurlInput(e.target.value)}
						placeholder={
							"curl -X POST https://api.dev/users \\\n  -H 'Content-Type: application/json' \\\n  -d '{\"a\":1}'"
						}
						className="min-h-32 font-mono text-sm"
						spellCheck={false}
					/>
				</section>

				{!snippet ? (
					<p className="border border-ink bg-muted/40 px-3 py-2 font-mono text-sm text-muted-foreground">
						[ AWAITING INPUT ]
					</p>
				) : (
					<section className="space-y-3">
						<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
							[ FETCH SNIPPET ]
						</p>
						<div className="flex items-center justify-between border border-ink bg-muted/40 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.08em]">
							<span>
								[{" "}
								{(parsed?.method || (hasBody && !parsed?.getFlag ? "POST" : "GET")) +
									" / " +
									(parsed?.headers.length ?? 0) +
									" HEADERS / BODY: " +
									(hasBody ? "YES" : "NO")}
							</span>
							<Button
								variant="outline"
								size="sm"
								onClick={() =>
									navigator.clipboard.writeText(snippet).then(
										() => toast.success("COPIED"),
										() => toast.error("COPY FAILED"),
									)
								}
							>
								<Copy aria-hidden className="h-3.5 w-3.5" />
								COPY
							</Button>
						</div>
						<div className="border border-ink bg-muted/40 p-3 font-mono text-sm whitespace-pre-wrap break-all">
							{snippet}
						</div>
					</section>
				)}
			</div>
		</ToolPageLayout>
	);
}
