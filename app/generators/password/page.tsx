"use client";

import React, { useState, useCallback } from "react";
import { usePersistentState } from "@/hooks/use-persistent-state";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { ToolHeader } from "@/components/ToolHeader";
import { useI18n } from "@/lib/i18n";
import { Lock as LockIcon } from "lucide-react";

const PasswordGeneratorPage = () => {
	const { t } = useI18n();
	const [password, setPassword] = useState("");
	const [length, setLength] = usePersistentState("password:length", 30);
	const [includeUppercase, setIncludeUppercase] = usePersistentState(
		"password:includeUppercase",
		true,
	);
	const [includeLowercase, setIncludeLowercase] = usePersistentState(
		"password:includeLowercase",
		true,
	);
	const [includeNumbers, setIncludeNumbers] = usePersistentState(
		"password:includeNumbers",
		true,
	);
	const [includeSymbols, setIncludeSymbols] = usePersistentState(
		"password:includeSymbols",
		true,
	);
	const [strength, setStrength] = useState(0);

	const calculateStrength = useCallback(
		(pwd: string) => {
			let newStrength = 0;
			if (pwd.length > 0) {
				newStrength += pwd.length * 4;
				if (includeUppercase) newStrength += 10;
				if (includeLowercase) newStrength += 10;
				if (includeNumbers) newStrength += 10;
				if (includeSymbols) newStrength += 10;

				// Deductions for common patterns (simplified)
				if (/(.)\1\1/.test(pwd)) newStrength -= 20;
				if (/(abc|123)/i.test(pwd)) newStrength -= 15;

				// Ensure strength is within 0-100 range
				newStrength = Math.max(0, Math.min(100, newStrength));
			}
			setStrength(newStrength);
		},
		[includeUppercase, includeLowercase, includeNumbers, includeSymbols],
	);

	const generatePassword = useCallback(() => {
		let characters = "";
		if (includeUppercase) characters += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		if (includeLowercase) characters += "abcdefghijklmnopqrstuvwxyz";
		if (includeNumbers) characters += "0123456789";
		if (includeSymbols) characters += "!@#$%^&*()_+[]{}|;:,.<>?";

		if (characters.length === 0) {
			setPassword(t("tools.password.noCharSetError"));
			setStrength(0);
			return;
		}

		let newPassword = "";
		for (let i = 0; i < length; i++) {
			const randomIndex = Math.floor(Math.random() * characters.length);
			newPassword += characters[randomIndex];
		}
		setPassword(newPassword);
		calculateStrength(newPassword);
	}, [
		length,
		includeUppercase,
		includeLowercase,
		includeNumbers,
		includeSymbols,
		calculateStrength,
		t,
	]);

	const copyToClipboard = useCallback(() => {
		navigator.clipboard.writeText(password);
		toast.success(t("tools.password.copiedToast"));
	}, [password, t]);

	// Generate password on initial load and whenever options change
	React.useEffect(() => {
		generatePassword();
	}, [generatePassword]);

	return (
		<ToolPageLayout
			header={
				<ToolHeader
					icon={<LockIcon aria-hidden />}
					title={t("tools.password.title")}
				/>
			}
		>
			<div className="space-y-4">
				<div>
					<Label
						htmlFor="password-length"
						className="font-mono text-[11px] uppercase tracking-[0.08em] mb-2 block"
					>
						{t("tools.password.lengthLabel", { length })}
					</Label>
					<Slider
						id="password-length"
						min={4}
						max={64}
						step={1}
						value={[length]}
						onValueChange={(val) => setLength(val[0])}
						className="w-full"
					/>
				</div>

				<div>
					<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground mb-2">
						{t("tools.password.characterSetsLabel")}
					</p>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div className="flex items-center space-x-2">
							<Checkbox
								id="uppercase"
								checked={includeUppercase}
								onCheckedChange={(checked) => setIncludeUppercase(Boolean(checked))}
							/>
							<Label htmlFor="uppercase">{t("tools.password.uppercaseLabel")}</Label>
						</div>
						<div className="flex items-center space-x-2">
							<Checkbox
								id="lowercase"
								checked={includeLowercase}
								onCheckedChange={(checked) => setIncludeLowercase(Boolean(checked))}
							/>
							<Label htmlFor="lowercase">{t("tools.password.lowercaseLabel")}</Label>
						</div>
						<div className="flex items-center space-x-2">
							<Checkbox
								id="numbers"
								checked={includeNumbers}
								onCheckedChange={(checked) => setIncludeNumbers(Boolean(checked))}
							/>
							<Label htmlFor="numbers">{t("tools.password.numbersLabel")}</Label>
						</div>
						<div className="flex items-center space-x-2">
							<Checkbox
								id="symbols"
								checked={includeSymbols}
								onCheckedChange={(checked) => setIncludeSymbols(Boolean(checked))}
							/>
							<Label htmlFor="symbols">{t("tools.password.symbolsLabel")}</Label>
						</div>
					</div>
				</div>

				<div className="border-t border-ink pt-4">
					<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground mb-2">
						{t("tools.password.generatedPasswordLabel")}
					</p>
					<div className="border-2 border-ink px-4 py-4 font-mono text-lg md:text-xl break-all select-all">
						{password}
					</div>
				</div>

				<div>
					<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground mb-2">
						{t("tools.password.strengthLabel")}
					</p>
					<Progress value={strength} className="w-full" />
					<div className="font-mono text-sm text-muted-foreground mt-1">
						{strength < 30
							? t("tools.password.veryWeak")
							: strength < 60
								? t("tools.password.weak")
								: strength < 80
									? t("tools.password.good")
									: t("tools.password.strong")}
					</div>
				</div>

				<div className="flex flex-wrap gap-2">
					<Button onClick={generatePassword}>{t("tools.password.generateButton")}</Button>
					<Button
						variant="outline"
						onClick={copyToClipboard}
						disabled={!password}
						aria-label={t("tools.password.copyAriaLabel")}
					>
						{t("common.copy")}
					</Button>
					<Button variant="outline" onClick={() => setLength(12)}>
						{t("tools.password.sampleButton")}
					</Button>
					<Button
						variant="outline"
						onClick={() => {
							setPassword("");
						}}
						aria-label={t("tools.password.clearAriaLabel")}
					>
						{t("common.clear")}
					</Button>
				</div>
			</div>
		</ToolPageLayout>
	);
};

export default PasswordGeneratorPage;
