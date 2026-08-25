"use client";

import { useState, useEffect, useCallback } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Calculator as CalculatorIcon } from "lucide-react";
import { toast } from "sonner";
import ToolPageLayout from "@/components/ToolPageLayout";
import ToolHeader from "@/components/ToolHeader";

export default function NumberBaseConverter() {
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
					if (!/^-?\d*$/.test(value)) throw new Error("Invalid decimal input");
					decValue = parseInt(value, 10);
				} else if (fromBase === "hexadecimal") {
					if (!/^-?[0-9a-fA-F]*$/.test(value))
						throw new Error("Invalid hexadecimal input");
					decValue = parseInt(value, 16);
				} else if (fromBase === "octal") {
					if (!/^-?[0-7]*$/.test(value)) throw new Error("Invalid octal input");
					decValue = parseInt(value, 8);
				} else if (fromBase === "binary") {
					if (!/^-?[01]*$/.test(value)) throw new Error("Invalid binary input");
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
					toast.error("An unknown error occurred.");
				}
				setDecimal("");
				setHexadecimal("");
				setOctal("");
				setBinary("");
			}
		},
		[activeInput],
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
			navigator.clipboard.writeText(text);
			toast.success("Copied to clipboard!");
		} else {
			toast.error("Nothing to copy!");
		}
	};

	return (
		<ToolPageLayout
			header={
				<ToolHeader
					icon={<CalculatorIcon aria-hidden className="h-5 w-5" />}
					title="Number Base Converter"
				/>
			}
		>
			<div className="space-y-3">
				<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
					[ INPUT ]
				</p>
				<div className="space-y-2">
					<div className="grid grid-cols-[4.5rem_1fr] items-center gap-2">
						<label
							htmlFor="decimal"
							className="font-mono text-[11px] uppercase tracking-[0.08em]"
						>
							DEC
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
								placeholder="Enter decimal number"
							/>
							<Button
								variant="outline"
								size="icon"
								aria-label="Copy decimal"
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
							HEX
						</label>
						<div className="flex gap-2">
							<Input
								id="hexadecimal"
								type="text"
								value={hexadecimal}
								onChange={(e) => setHexadecimal(e.target.value)}
								placeholder="Enter hexadecimal number"
							/>
							<Button
								variant="outline"
								size="icon"
								aria-label="Copy hexadecimal"
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
							OCT
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
								placeholder="Enter octal number"
							/>
							<Button
								variant="outline"
								size="icon"
								aria-label="Copy octal"
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
							BIN
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
								placeholder="Enter binary number"
							/>
							<Button
								variant="outline"
								size="icon"
								aria-label="Copy binary"
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
