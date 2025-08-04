"use client";

import React, { useState, useEffect } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
				{/* InputArea */}
				<div className="grid gap-4">
					<div className="grid gap-2">
						<Label htmlFor="unit-type" className="text-sm">
							Unit Type
						</Label>
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
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div className="grid gap-2">
									<Label htmlFor="from-unit" className="text-sm">
										From Unit
									</Label>
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

								<div className="grid gap-2">
									<Label htmlFor="to-unit" className="text-sm">
										To Unit
									</Label>
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

								<div className="grid gap-2">
									<Label htmlFor="input-value" className="text-sm">
										Value
									</Label>
									<Input
										id="input-value"
										type="number"
										value={inputValue}
										onChange={(e) => setInputValue(e.target.value)}
										placeholder="Enter value"
									/>
								</div>
							</div>

							{/* ActionButtons */}
							<div className="flex flex-wrap gap-2" aria-hidden />

							{/* ResultDisplay */}
							<div className="grid gap-2">
								<Label htmlFor="converted-value" className="text-sm">
									Converted Value
								</Label>
								<div className="flex items-center gap-2">
									<Input
										id="converted-value"
										type="text"
										value={convertedValue}
										readOnly
										placeholder="Result"
									/>
									<Button
										onClick={handleCopy}
										disabled={!convertedValue}
										variant="ghost"
										size="icon"
										aria-label="Copy converted value"
									>
										<CopyIcon className="h-4 w-4" aria-hidden />
									</Button>
								</div>
							</div>

							{error && <p className="text-red-500 text-sm">{error}</p>}
						</>
					)}
				</div>
			</div>
		</ToolPageLayout>
	);
};

export default UnitConverterPage;
