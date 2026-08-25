"use client";

import { useEffect, useRef, useState } from "react";
import { usePersistentState } from "@/hooks/use-persistent-state";
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
import { useI18n } from "@/lib/i18n";

const UnitConverterPage = () => {
	const { t } = useI18n();
	const [unitType, setUnitType] = usePersistentState<Measure | "">(
		"unit-converter:unitType",
		"",
	);
	const [fromUnit, setFromUnit] = usePersistentState<Unit | "">(
		"unit-converter:fromUnit",
		"",
	);
	const [toUnit, setToUnit] = usePersistentState<Unit | "">(
		"unit-converter:toUnit",
		"",
	);
	const [inputValue, setInputValue] = useState("");
	const [convertedValue, setConvertedValue] = useState("");
	const [error, setError] = useState("");

	const unitTypes: Measure[] = convert().measures();

	/** Display labels for unit categories (Measure values → user-facing names) */
	const measureLabels: Record<string, string> = {
		length: t("tools.unitConverter.catLength"),
		area: t("tools.unitConverter.catArea"),
		mass: t("tools.unitConverter.catMass"),
		volume: t("tools.unitConverter.catVolume"),
		each: t("tools.unitConverter.catEach"),
		temperature: t("tools.unitConverter.catTemperature"),
		time: t("tools.unitConverter.catTime"),
		digital: t("tools.unitConverter.catDigital"),
		partsPer: t("tools.unitConverter.catPartsPer"),
		speed: t("tools.unitConverter.catSpeed"),
		pace: t("tools.unitConverter.catPace"),
		pressure: t("tools.unitConverter.catPressure"),
		current: t("tools.unitConverter.catCurrent"),
		voltage: t("tools.unitConverter.catVoltage"),
		power: t("tools.unitConverter.catPower"),
		reactivePower: t("tools.unitConverter.catReactivePower"),
		apparentPower: t("tools.unitConverter.catApparentPower"),
		energy: t("tools.unitConverter.catEnergy"),
		reactiveEnergy: t("tools.unitConverter.catReactiveEnergy"),
		volumeFlowRate: t("tools.unitConverter.catVolumeFlowRate"),
		illuminance: t("tools.unitConverter.catIlluminance"),
		frequency: t("tools.unitConverter.catFrequency"),
		angle: t("tools.unitConverter.catAngle"),
	};

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

	const didMount = useRef(false);
	useEffect(() => {
		// Skip the mount run: persisted fromUnit/toUnit land right after and
		// must not be blanked by the category-reset below.
		if (!didMount.current) {
			didMount.current = true;
			return;
		}
		const units = unitType ? getUnitsForType(unitType) : [];
		const firstUnit = units[0] ?? "";
		const unitStrings: readonly string[] = units;
		setFromUnit((prev) => (unitStrings.includes(prev) ? prev : firstUnit));
		setToUnit((prev) => (unitStrings.includes(prev) ? prev : firstUnit));
		setInputValue("");
		setConvertedValue("");
		setError("");
	}, [unitType, setFromUnit, setToUnit]);

	useEffect(() => {
		if (inputValue && fromUnit && toUnit && unitType) {
			try {
				const result = convert(parseFloat(inputValue)).from(fromUnit).to(toUnit);
				setConvertedValue(result.toString());
				setError("");
			} catch (e: unknown) {
				if (e instanceof Error) {
					setError(`${t("tools.unitConverter.errorPrefix")} ${e.message}`);
				} else {
					setError(t("tools.unitConverter.unknownError"));
				}
				setConvertedValue("");
			}
		} else {
			setConvertedValue("");
			setError("");
		}
	}, [inputValue, fromUnit, toUnit, unitType, t]);

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
					title={t("tools.unitConverter.title")}
				/>
			}
		>
			<div className="space-y-4">
				<div className="grid w-full items-center gap-2">
					<label
						htmlFor="unit-type"
						className="font-mono text-[11px] uppercase tracking-[0.08em]"
					>
						{t("tools.unitConverter.categoryLabel")}
					</label>
					<Select onValueChange={handleUnitTypeChange} value={unitType}>
						<SelectTrigger id="unit-type">
							<SelectValue placeholder={t("tools.unitConverter.selectCategoryPlaceholder")} />
						</SelectTrigger>
						<SelectContent>
							{unitTypes.map((type) => (
								<SelectItem key={type} value={type}>
									{measureLabels[type] ?? type}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{unitType && (
					<>
						<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
							{t("tools.unitConverter.conversionRigLabel")}
						</p>
						<div className="grid md:grid-cols-[1fr_auto_1fr] gap-3 items-end">
							<div className="grid w-full items-center gap-2">
								<label
									htmlFor="from-unit"
									className="font-mono text-[11px] uppercase tracking-[0.08em]"
								>
									{t("tools.unitConverter.fromLabel")}
								</label>
								<Select onValueChange={handleFromUnitChange} value={fromUnit}>
									<SelectTrigger id="from-unit">
										<SelectValue placeholder={t("tools.unitConverter.selectUnitPlaceholder")} />
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
									{t("tools.unitConverter.toLabel")}
								</label>
								<Select onValueChange={handleToUnitChange} value={toUnit}>
									<SelectTrigger id="to-unit">
										<SelectValue placeholder={t("tools.unitConverter.selectUnitPlaceholder")} />
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
								{t("tools.unitConverter.valueLabel")}
							</label>
							<Input
								id="input-value"
								type="number"
								value={inputValue}
								onChange={(e) => setInputValue(e.target.value)}
								placeholder={t("tools.unitConverter.valuePlaceholder")}
							/>
						</div>

						{error && <p className="font-mono text-sm text-hazard-text">{error}</p>}

						{convertedValue && (
							<>
								<div className="border-t border-ink pt-4" />
								<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground mb-1">
									{t("tools.unitConverter.resultLabel")}
								</p>
								<div className="border border-ink bg-muted/40 px-3 py-3 flex items-center justify-between gap-2">
									<span className="font-mono text-xl break-all">{convertedValue}</span>
									<Button
										variant="outline"
										size="icon"
										onClick={handleCopy}
										aria-label={t("tools.unitConverter.copyResultAria")}
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
