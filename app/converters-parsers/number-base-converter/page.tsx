"use client";

import { useState, useEffect, useCallback } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Calculator as CalculatorIcon } from "lucide-react";
import { toast } from "sonner";
import ToolPageLayout from "@/components/ToolPageLayout";
import ToolHeader from "@/components/ToolHeader";
import { useI18n } from "@/lib/i18n";

export default function NumberBaseConverter() {
	const { t } = useI18n();
	const [decimal, setDecimal] = useState("");
	const [hexadecimal, setHexadecimal] = useState("");
	const [octal, setOctal] = useState("");
	const [binary, setBinary] = useState("");
	const [activeInput, setActiveInput] = useState<
		"decimal" | "hexadecimal" | "octal" | "binary" | null
	>(null);

	const convert = useCallback(
		(value: string, fromBase: "decimal" | "hexadecimal" | "octal" | "binary") => {
			if (!value) {
				setDecimal("");
				setHexadecimal("");
				setOctal("");
				setBinary("");
				return;
			}

			let decValue: number | null = null;

			try {
				if (fromBase === "decimal") {
					if (!/^-?\d*$/.test(value)) throw new Error(t("tools.numberBaseConverter.invalidDecimal"));
					decValue = parseInt(value, 10);
				} else if (fromBase === "hexadecimal") {
					if (!/^-?[0-9a-fA-F]*$/.test(value))
						throw new Error(t("tools.numberBaseConverter.invalidHexadecimal"));
					decValue = parseInt(value, 16);
				} else if (fromBase === "octal") {
					if (!/^-?[0-7]*$/.test(value)) throw new Error(t("tools.numberBaseConverter.invalidOctal"));
					decValue = parseInt(value, 8);
				} else if (fromBase === "binary") {
					if (!/^-?[01]*$/.test(value)) throw new Error(t("tools.numberBaseConverter.invalidBinary"));
					decValue = parseInt(value, 2);
				}

				if (isNaN(decValue!)) {
					setDecimal("");
					setHexadecimal("");
					setOctal("");
					setBinary("");
					return;
				}

				if (activeInput !== "decimal") setDecimal(decValue!.toString(10));
				if (activeInput !== "hexadecimal")
					setHexadecimal(decValue!.toString(16).toUpperCase());
				if (activeInput !== "octal") setOctal(decValue!.toString(8));
				if (activeInput !== "binary") setBinary(decValue!.toString(2));
			} catch (error: unknown) {
				if (error instanceof Error) {
					toast.error(error.message);
				} else {
					toast.error(t("tools.numberBaseConverter.unknownError"));
				}
				setDecimal("");
				setHexadecimal("");
				setOctal("");
				setBinary("");
			}
		},
		[activeInput, t],
	);

	useEffect(() => {
		if (activeInput === "decimal") {
			convert(decimal, "decimal");
		}
	}, [decimal, activeInput, convert]);

	useEffect(() => {
		if (activeInput === "hexadecimal") {
			convert(hexadecimal, "hexadecimal");
		}
	}, [hexadecimal, activeInput, convert]);

	useEffect(() => {
		if (activeInput === "octal") {
			convert(octal, "octal");
		}
	}, [octal, activeInput, convert]);

	useEffect(() => {
		if (activeInput === "binary") {
			convert(binary, "binary");
		}
	}, [binary, activeInput, convert]);

	const handleCopy = (text: string) => {
		if (text) {
			navigator.clipboard.writeText(text).then(() => {
				toast.success(t("common.copied"));
			}).catch(() => {
				toast.error(t("common.copyFailed"));
			});
		} else {
			toast.error(t("tools.numberBaseConverter.nothingToCopy"));
		}
	};

	return (
		<ToolPageLayout
			header={
				<ToolHeader
					icon={<CalculatorIcon aria-hidden className="h-5 w-5" />}
					title={t("tools.numberBaseConverter.title")}
				/>
			}
		>
			<div className="space-y-3">
				<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
					{t("tools.numberBaseConverter.inputLabel")}
				</p>
				<div className="space-y-2">
					<div className="grid grid-cols-[4.5rem_1fr] items-center gap-2">
						<label
							htmlFor="decimal"
							className="font-mono text-[11px] uppercase tracking-[0.08em]"
						>
							{t("tools.numberBaseConverter.decLabel")}
						</label>
						<div className="flex gap-2">
							<Input
								id="decimal"
								type="text"
								value={decimal}
								onChange={(e) => {
									setDecimal(e.target.value);
									setActiveInput("decimal");
								}}
								placeholder={t("tools.numberBaseConverter.decPlaceholder")}
							/>
							<Button
								variant="outline"
								size="icon"
								aria-label={t("tools.numberBaseConverter.copyDecAria")}
								onClick={() => handleCopy(decimal)}
							>
								<Copy className="h-4 w-4" aria-hidden />
							</Button>
						</div>
					</div>

					<div className="grid grid-cols-[4.5rem_1fr] items-center gap-2">
						<label
							htmlFor="hexadecimal"
							className="font-mono text-[11px] uppercase tracking-[0.08em]"
						>
							{t("tools.numberBaseConverter.hexLabel")}
						</label>
						<div className="flex gap-2">
							<Input
								id="hexadecimal"
								type="text"
								value={hexadecimal}
								onChange={(e) => setHexadecimal(e.target.value)}
								placeholder={t("tools.numberBaseConverter.hexPlaceholder")}
							/>
							<Button
								variant="outline"
								size="icon"
								aria-label={t("tools.numberBaseConverter.copyHexAria")}
								onClick={() => handleCopy(hexadecimal)}
							>
								<Copy className="h-4 w-4" aria-hidden />
							</Button>
						</div>
					</div>

					<div className="grid grid-cols-[4.5rem_1fr] items-center gap-2">
						<label
							htmlFor="octal"
							className="font-mono text-[11px] uppercase tracking-[0.08em]"
						>
							{t("tools.numberBaseConverter.octLabel")}
						</label>
						<div className="flex gap-2">
							<Input
								id="octal"
								type="text"
								value={octal}
								onChange={(e) => {
									setOctal(e.target.value);
									setActiveInput("octal");
								}}
								placeholder={t("tools.numberBaseConverter.octPlaceholder")}
							/>
							<Button
								variant="outline"
								size="icon"
								aria-label={t("tools.numberBaseConverter.copyOctAria")}
								onClick={() => handleCopy(octal)}
							>
								<Copy className="h-4 w-4" aria-hidden />
							</Button>
						</div>
					</div>

					<div className="grid grid-cols-[4.5rem_1fr] items-center gap-2">
						<label
							htmlFor="binary"
							className="font-mono text-[11px] uppercase tracking-[0.08em]"
						>
							{t("tools.numberBaseConverter.binLabel")}
						</label>
						<div className="flex gap-2">
							<Input
								id="binary"
								type="text"
								value={binary}
								onChange={(e) => {
									setBinary(e.target.value);
									setActiveInput("binary");
								}}
								placeholder={t("tools.numberBaseConverter.binPlaceholder")}
							/>
							<Button
								variant="outline"
								size="icon"
								aria-label={t("tools.numberBaseConverter.copyBinAria")}
								onClick={() => handleCopy(binary)}
							>
								<Copy className="h-4 w-4" aria-hidden />
							</Button>
						</div>
					</div>
				</div>
			</div>
		</ToolPageLayout>
	);
}
