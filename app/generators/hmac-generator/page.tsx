"use client";

import { useState, useMemo } from "react";
import { usePersistentState } from "@/hooks/use-persistent-state";
import CryptoJS from "crypto-js";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { ToolHeader } from "@/components/ToolHeader";
import { KeyRound } from "lucide-react";

type AlgKey = "SHA1" | "SHA256" | "SHA384" | "SHA512" | "MD5" | "SHA3";

const ALG_MAP: Record<string, AlgKey> = {
	SHA1: "SHA1",
	SHA256: "SHA256",
	SHA384: "SHA384",
	SHA512: "SHA512",
	MD5: "MD5",
	"SHA3-256": "SHA3",
};

function hmac(
	message: string,
	secret: string,
	alg: AlgKey,
): CryptoJS.lib.WordArray {
	switch (alg) {
		case "SHA1":
			return CryptoJS.HmacSHA1(message, secret);
		case "SHA256":
			return CryptoJS.HmacSHA256(message, secret);
		case "SHA384":
			return CryptoJS.HmacSHA384(message, secret);
		case "SHA512":
			return CryptoJS.HmacSHA512(message, secret);
		case "MD5":
			return CryptoJS.HmacMD5(message, secret);
		case "SHA3": {
			// SHA3 defaults to 512-bit; subclass with 256-bit output.
			const C = CryptoJS as unknown as Record<string, unknown>;
			const SHA3Cls = C.algo as Record<string, unknown>;
			const BaseSHA3 = SHA3Cls.SHA3 as {
				extend: (cfg: Record<string, unknown>) => unknown;
				cfg: { extend: (cfg: Record<string, unknown>) => unknown };
			};
			const SHA3_256 = BaseSHA3.extend({
				cfg: BaseSHA3.cfg.extend({ outputLength: 256 }),
			});
			const HMACCls = SHA3Cls.HMAC as {
				init: (
					hasher: unknown,
					key: string,
				) => { finalize: (msg: string) => CryptoJS.lib.WordArray };
			};
			return HMACCls.init(SHA3_256, secret).finalize(message);
		}
	}
}

export default function HmacGeneratorPage() {
	const [message, setMessage] = useState("");
	const [secret, setSecret] = useState("");
	const [algorithm, setAlgorithm] = usePersistentState(
		"hmac-generator:algorithm",
		"SHA256",
	);
	const [showSecret, setShowSecret] = useState(false);

	const result = useMemo(() => {
		if (!message || !secret) return null;
		const algKey = ALG_MAP[algorithm];
		if (!algKey) return null;
		const hash = hmac(message, secret, algKey);
		return {
			hex: hash.toString(CryptoJS.enc.Hex),
			base64: hash.toString(CryptoJS.enc.Base64),
		};
	}, [message, secret, algorithm]);

	const handleCopyHex = () => {
		if (result) {
			navigator.clipboard.writeText(result.hex);
			toast.success("COPIED");
		}
	};

	const handleCopyBase64 = () => {
		if (result) {
			navigator.clipboard.writeText(result.base64);
			toast.success("COPIED");
		}
	};

	return (
		<ToolPageLayout
			header={
				<ToolHeader icon={<KeyRound aria-hidden />} title="HMAC Generator" />
			}
		>
			<div className="space-y-4">
				<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
					[ MESSAGE ]
				</p>
				<Textarea
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					placeholder="Enter message to sign..."
					className="font-mono text-sm min-h-[80px]"
				/>

				<div className="flex items-center justify-between border border-ink bg-muted/40 px-3 py-2">
					<Label className="font-mono text-[11px] uppercase tracking-[0.08em]">
						SECRET
					</Label>
					<div className="flex items-center gap-2">
						<Label className="font-mono text-[11px] uppercase tracking-[0.08em]">
							SHOW
						</Label>
						<Switch checked={showSecret} onCheckedChange={setShowSecret} />
					</div>
				</div>
				<Input
					type={showSecret ? "text" : "password"}
					value={secret}
					onChange={(e) => setSecret(e.target.value)}
					placeholder="Enter secret key..."
					className="font-mono text-sm"
				/>

				<div className="flex items-center justify-between border border-ink bg-muted/40 px-3 py-2">
					<Label className="font-mono text-[11px] uppercase tracking-[0.08em]">
						ALGORITHM
					</Label>
					<Select value={algorithm} onValueChange={setAlgorithm}>
						<SelectTrigger className="w-[140px]">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="SHA1">SHA1</SelectItem>
							<SelectItem value="SHA256">SHA256</SelectItem>
							<SelectItem value="SHA384">SHA384</SelectItem>
							<SelectItem value="SHA512">SHA512</SelectItem>
							<SelectItem value="MD5">MD5</SelectItem>
							<SelectItem value="SHA3-256">SHA3-256</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
					[ Output ]
				</p>

				{!result ? (
					<div className="border border-ink bg-muted/40 px-3 py-3 font-mono text-sm text-muted-foreground">
						[ AWAITING INPUT ]
					</div>
				) : (
					<div className="space-y-4">
						<div className="space-y-2">
							<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
								[ HEX ]
							</p>
							<div className="border border-ink bg-muted/40 px-3 py-3 font-mono text-lg break-all">
								{result.hex}
							</div>
							<Button variant="outline" onClick={handleCopyHex}>
								COPY HEX
							</Button>
						</div>

						<div className="space-y-2">
							<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
								[ BASE64 ]
							</p>
							<div className="border border-ink bg-muted/40 px-3 py-3 font-mono text-lg break-all">
								{result.base64}
							</div>
							<Button variant="outline" onClick={handleCopyBase64}>
								COPY BASE64
							</Button>
						</div>
					</div>
				)}
			</div>
		</ToolPageLayout>
	);
}
