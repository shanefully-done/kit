"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { TOTP, Secret, URI } from "otpauth";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { ToolHeader } from "@/components/ToolHeader";
import { ShieldCheck } from "lucide-react";

type ParsedUri = {
	issuer?: string;
	account?: string;
	algorithm?: string;
	digits?: number;
	period?: number;
};

export default function TotpGeneratorPage() {
	const [input, setInput] = useState("");
	const [digits, setDigits] = useState("6");
	const [period, setPeriod] = useState("30");
	const [error, setError] = useState("");
	const [totp, setTotp] = useState<TOTP | null>(null);
	const [meta, setMeta] = useState<ParsedUri | null>(null);
	const [currentCode, setCurrentCode] = useState("");
	const [nextCode, setNextCode] = useState("");
	const [remaining, setRemaining] = useState(30);

	const isUriMode = input.trimStart().startsWith("otpauth://");

	const buildTotp = useCallback(() => {
		const trimmed = input.trim();
		if (!trimmed) {
			setTotp(null);
			setMeta(null);
			setError("");
			return;
		}
		if (isUriMode) {
			try {
				const parsed = URI.parse(trimmed);
				if (!(parsed instanceof TOTP)) {
					setTotp(null);
					setMeta(null);
					setError("NOT A TOTP URI");
					return;
				}
				setTotp(parsed);
				setMeta({
					issuer: parsed.issuer || undefined,
					account: parsed.label || undefined,
					algorithm: parsed.algorithm,
					digits: parsed.digits,
					period: parsed.period,
				});
				setError("");
			} catch {
				setTotp(null);
				setMeta(null);
				setError("INVALID URI");
			}
			return;
		}

		// Raw base32 secret mode
		const cleaned = trimmed.replace(/\s+/g, "");
		try {
			const secret = Secret.fromBase32(cleaned);
			const d = parseInt(digits);
			const p = parseInt(period);
			const t = new TOTP({
				secret,
				digits: d,
				period: p,
			});
			setTotp(t);
			setMeta(null);
			setError("");
		} catch {
			setTotp(null);
			setMeta(null);
			setError("INVALID BASE32");
		}
	}, [input, isUriMode, digits, period]);

	useEffect(() => {
		buildTotp();
	}, [buildTotp]);

	useEffect(() => {
		if (!totp) {
			setCurrentCode("");
			setNextCode("");
			setRemaining(0);
			return;
		}

		const tick = () => {
			const now = Date.now();
			setCurrentCode(totp.generate({ timestamp: now }));
			const rem = totp.remaining({ timestamp: now });
			setRemaining(Math.ceil(rem / 1000));
			const nextTs = now + rem;
			setNextCode(totp.generate({ timestamp: nextTs }));
		};

		tick();
		const id = setInterval(tick, 250);
		return () => clearInterval(id);
	}, [totp]);

	const progressValue = useMemo(() => {
		if (!totp) return 0;
		return ((totp.period - remaining) / totp.period) * 100;
	}, [totp, remaining]);

	const handleCopy = () => {
		if (currentCode) {
			navigator.clipboard.writeText(currentCode);
			toast.success("COPIED");
		}
	};

	return (
		<ToolPageLayout
			header={
				<ToolHeader icon={<ShieldCheck aria-hidden />} title="TOTP Generator" />
			}
		>
			<div className="space-y-4">
				<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
					[ SECRET / otpauth URI ]
				</p>
				<Textarea
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder="JBSW Y3DP EHPK 3PXP"
					className="font-mono text-sm min-h-[60px]"
				/>

				{!isUriMode && (
					<div className="flex gap-4">
						<div className="flex items-center justify-between border border-ink bg-muted/40 px-3 py-2 flex-1">
							<Label className="font-mono text-[11px] uppercase tracking-[0.08em]">
								DIGITS
							</Label>
							<Select value={digits} onValueChange={setDigits}>
								<SelectTrigger className="w-[80px]">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="6">6</SelectItem>
									<SelectItem value="8">8</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="flex items-center justify-between border border-ink bg-muted/40 px-3 py-2 flex-1">
							<Label className="font-mono text-[11px] uppercase tracking-[0.08em]">
								PERIOD
							</Label>
							<Select value={period} onValueChange={setPeriod}>
								<SelectTrigger className="w-[80px]">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="15">15</SelectItem>
									<SelectItem value="30">30</SelectItem>
									<SelectItem value="60">60</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				)}

				{error && (
					<div className="border border-hazard text-hazard-text bg-muted/40 px-3 py-3 font-mono text-sm">
						[ {error} ]
					</div>
				)}

				{totp && !error && (
					<>
						<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
							[ CURRENT CODE ]
						</p>
						<div className="border border-ink bg-muted/40 px-3 py-4 flex items-center justify-between gap-3">
							<span className="font-mono text-4xl tracking-[0.3em]">
								{currentCode}
							</span>
							<Button variant="outline" onClick={handleCopy}>
								COPY
							</Button>
						</div>

						<div className="space-y-1">
							<Progress value={progressValue} />
							<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
								T-{remaining}s
							</p>
						</div>

						<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
							[ NEXT ]
						</p>
						<div className="border border-ink bg-muted/40 px-3 py-3 font-mono text-lg tracking-[0.3em] text-muted-foreground">
							{nextCode}
						</div>
					</>
				)}

				{meta && (
					<>
						<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
							[ URI METADATA ]
						</p>
						<dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 font-mono text-[11px]">
							{meta.issuer && (
								<>
									<dt className="uppercase tracking-[0.08em] text-muted-foreground">
										ISSUER
									</dt>
									<dd>{meta.issuer}</dd>
								</>
							)}
							{meta.account && (
								<>
									<dt className="uppercase tracking-[0.08em] text-muted-foreground">
										ACCOUNT
									</dt>
									<dd>{meta.account}</dd>
								</>
							)}
							{meta.algorithm && (
								<>
									<dt className="uppercase tracking-[0.08em] text-muted-foreground">
										ALGORITHM
									</dt>
									<dd>{meta.algorithm}</dd>
								</>
							)}
							{meta.digits != null && (
								<>
									<dt className="uppercase tracking-[0.08em] text-muted-foreground">
										DIGITS
									</dt>
									<dd>{meta.digits}</dd>
								</>
							)}
							{meta.period != null && (
								<>
									<dt className="uppercase tracking-[0.08em] text-muted-foreground">
										PERIOD
									</dt>
									<dd>{meta.period}s</dd>
								</>
							)}
						</dl>
					</>
				)}
			</div>
		</ToolPageLayout>
	);
}
