"use client";

import { useState, useEffect } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Copy as CopyIcon, Ruler as RulerIcon } from "lucide-react";
import convert, { Measure, Unit } from "convert-units";
import ToolPageLayout from "@/components/ToolPageLayout";
import ToolHeader from "@/components/ToolHeader";

const UnitConverterPage = () => {
	const [unitType, setUnitType] = useState<Measure | "">("");
	const [fromUnit, setFromUnit] = useState<Unit | "">("");
	const [toUnit, setToUnit] = useState<Unit | "">("");
	const [inputValue, setInputValue] = useState("");
	const [convertedValue, setConvertedValue] = useState("");
	const [error, setError] = useState("");

	const unitTypes: Measure[] = convert().measures();

	const getUnitsForType = (type: Measure): Unit[] => {
		try {
			return convert().possibilities(type) as Unit[];
		} catch (e: unknown) {
			if (e instanceof Error) {
				console.error(e.message);
			}
			return [];
		}
	};

	const handleUnitTypeChange = (value: string) => {
		setUnitType(value as Measure);
	};

	const handleFromUnitChange = (value: string) => {
		setFromUnit(value as Unit);
	};

	const handleToUnitChange = (value: string) => {
		setToUnit(value as Unit);
	};

	useEffect(() => {
		if (unitType) {
			const units = getUnitsForType(unitType);
			if (units.length > 0) {
				setFromUnit(units[0]);
				setToUnit(units[0]);
			} else {
				setFromUnit("");
				setToUnit("");
			}
		} else {
			setFromUnit("");
			setToUnit("");
		}
		setInputValue("");
		setConvertedValue("");
		setError("");
	}, [unitType]);

	useEffect(() => {
		if (inputValue && fromUnit && toUnit && unitType) {
			try {
				const result = convert(parseFloat(inputValue)).from(fromUnit).to(toUnit);
				setConvertedValue(result.toString());
				setError("");
			} catch (e: unknown) {
				if (e instanceof Error) {
					setError(`Error: ${e.message}`);
				} else {
					setError("An unknown error occurred during conversion.");
				}
				setConvertedValue("");
			}
		} else {
			setConvertedValue("");
			setError("");
		}
	}, [inputValue, fromUnit, toUnit, unitType]);

	const handleCopy = () => {
		if (convertedValue) {
			navigator.clipboard.writeText(convertedValue);
		}
	};

	return (
		<ToolPageLayout
			header={
				<ToolHeader
					icon={<RulerIcon aria-hidden className="h-5 w-5" />}
					title="Unit Converter"
				/>
			}
		>
			<div className="space-y-4">
				<div className="grid w-full items-center gap-2">
					<label
						htmlFor="unit-type"
						className="font-mono text-[11px] uppercase tracking-[0.08em]"
					>
						CATEGORY
					</label>
					<Select onValueChange={handleUnitTypeChange} value={unitType}>
						<SelectTrigger id="unit-type">
							<SelectValue placeholder="Select a unit type" />
						</SelectTrigger>
						<SelectContent>
							{unitTypes.map((type) => (
								<SelectItem key={type} value={type}>
									{type.charAt(0).toUpperCase() + type.slice(1)}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{unitType && (
					<>
						<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
							[ CONVERSION RIG ]
						</p>
						<div className="grid md:grid-cols-[1fr_auto_1fr] gap-3 items-end">
							<div className="grid w-full items-center gap-2">
								<label
									htmlFor="from-unit"
									className="font-mono text-[11px] uppercase tracking-[0.08em]"
								>
									FROM
								</label>
								<Select onValueChange={handleFromUnitChange} value={fromUnit}>
									<SelectTrigger id="from-unit">
										<SelectValue placeholder="Select unit" />
									</SelectTrigger>
									<SelectContent>
										{getUnitsForType(unitType).map((unit) => (
											<SelectItem key={unit} value={unit}>
												{unit}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="flex items-end justify-center pb-2">
								<span className="font-mono text-lg text-muted-foreground">
									&gt;&gt;&gt;
								</span>
							</div>

							<div className="grid w-full items-center gap-2">
								<label
									htmlFor="to-unit"
									className="font-mono text-[11px] uppercase tracking-[0.08em]"
								>
									TO
								</label>
								<Select onValueChange={handleToUnitChange} value={toUnit}>
									<SelectTrigger id="to-unit">
										<SelectValue placeholder="Select unit" />
									</SelectTrigger>
									<SelectContent>
										{getUnitsForType(unitType).map((unit) => (
											<SelectItem key={unit} value={unit}>
												{unit}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className="grid w-full items-center gap-2">
							<label
								htmlFor="input-value"
								className="font-mono text-[11px] uppercase tracking-[0.08em]"
							>
								VALUE
							</label>
							<Input
								id="input-value"
								type="number"
								value={inputValue}
								onChange={(e) => setInputValue(e.target.value)}
								placeholder="Enter value"
							/>
						</div>

						{error && <p className="font-mono text-sm text-hazard">{error}</p>}

						{convertedValue && (
							<>
								<div className="border-t border-ink pt-4" />
								<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground mb-1">
									[ RESULT ]
								</p>
								<div className="border border-ink bg-muted/40 px-3 py-3 flex items-center justify-between gap-2">
									<span className="font-mono text-xl break-all">{convertedValue}</span>
									<Button
										variant="outline"
										size="icon"
										onClick={handleCopy}
										aria-label="Copy converted value"
									>
										<CopyIcon className="h-4 w-4" aria-hidden />
									</Button>
								</div>
							</>
						)}
					</>
				)}
			</div>
		</ToolPageLayout>
	);
};

export default UnitConverterPage;
