"use client";

import React, { useState, useCallback } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { ToolHeader } from "@/components/ToolHeader";
import { Lock as LockIcon } from "lucide-react";

const PasswordGeneratorPage = () => {
	const [password, setPassword] = useState("");
	const [length, setLength] = useState(12);
	const [includeUppercase, setIncludeUppercase] = useState(true);
	const [includeLowercase, setIncludeLowercase] = useState(true);
	const [includeNumbers, setIncludeNumbers] = useState(true);
	const [includeSymbols, setIncludeSymbols] = useState(true);
	const [strength, setStrength] = useState(0);

	const generatePassword = useCallback(() => {
		let characters = "";
		if (includeUppercase) characters += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		if (includeLowercase) characters += "abcdefghijklmnopqrstuvwxyz";
		if (includeNumbers) characters += "0123456789";
		if (includeSymbols) characters += "!@#$%^&*()_+[]{}|;:,.<>?";

		if (characters.length === 0) {
			setPassword("Select at least one character type.");
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
	]);

	const calculateStrength = useCallback(
		(pwd: string) => {
			let newStrength = 0;
			if (pwd.length > 0) {
				newStrength += pwd.length * 4; // Length contributes
				if (includeUppercase) newStrength += 10;
				if (includeLowercase) newStrength += 10;
				if (includeNumbers) newStrength += 10;
				if (includeSymbols) newStrength += 10;

				// Deductions for common patterns (simplified)
				if (/(.)\1\1/.test(pwd)) newStrength -= 20; // Three consecutive identical characters
				if (/(abc|123)/i.test(pwd)) newStrength -= 15; // Simple sequences

				// Ensure strength is within 0-100 range
				newStrength = Math.max(0, Math.min(100, newStrength));
			}
			setStrength(newStrength);
		},
		[includeUppercase, includeLowercase, includeNumbers, includeSymbols]
	);

	const copyToClipboard = useCallback(() => {
		navigator.clipboard.writeText(password);
		toast.success("Password copied to clipboard!");
	}, [password]);

	// Generate password on initial load and whenever options change
	React.useEffect(() => {
		generatePassword();
	}, [generatePassword]);

	return (
		<ToolPageLayout
			header={
				<ToolHeader icon={<LockIcon aria-hidden />} title="Password Generator" />
			}
		>
			<div className="space-y-4">
				<div>
					<Label htmlFor="password-length" className="mb-2 block text-sm">
						Password Length: {length}
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

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div className="flex items-center space-x-2">
						<Checkbox
							id="uppercase"
							checked={includeUppercase}
							onCheckedChange={(checked) => setIncludeUppercase(Boolean(checked))}
						/>
						<Label htmlFor="uppercase">Uppercase (A-Z)</Label>
					</div>
					<div className="flex items-center space-x-2">
						<Checkbox
							id="lowercase"
							checked={includeLowercase}
							onCheckedChange={(checked) => setIncludeLowercase(Boolean(checked))}
						/>
						<Label htmlFor="lowercase">Lowercase (a-z)</Label>
					</div>
					<div className="flex items-center space-x-2">
						<Checkbox
							id="numbers"
							checked={includeNumbers}
							onCheckedChange={(checked) => setIncludeNumbers(Boolean(checked))}
						/>
						<Label htmlFor="numbers">Numbers (0-9)</Label>
					</div>
					<div className="flex items-center space-x-2">
						<Checkbox
							id="symbols"
							checked={includeSymbols}
							onCheckedChange={(checked) => setIncludeSymbols(Boolean(checked))}
						/>
						<Label htmlFor="symbols">Symbols (!@#$)</Label>
					</div>
				</div>

				<div>
					<Label htmlFor="password-output" className="mb-2 block text-sm">
						Generated Password
					</Label>
					<div className="flex flex-wrap gap-2">
						<Input
							id="password-output"
							type="text"
							readOnly
							value={password}
							className="flex-1 font-mono"
						/>
						<Button
							onClick={copyToClipboard}
							disabled={!password}
							aria-label="Copy password"
						>
							Copy
						</Button>
					</div>
				</div>

				<div>
					<Label className="mb-2 block text-sm">Password Strength</Label>
					<Progress value={strength} className="w-full" />
					<div className="text-sm text-muted-foreground mt-1">
						{strength < 30
							? "Very Weak"
							: strength < 60
							? "Weak"
							: strength < 80
							? "Good"
							: "Strong"}
					</div>
				</div>

				<div className="flex flex-wrap gap-2">
					<Button onClick={generatePassword}>Generate New Password</Button>
					<Button variant="secondary" onClick={() => setLength(12)}>
						Sample
					</Button>
					<Button
						variant="ghost"
						onClick={() => {
							setPassword("");
						}}
						aria-label="Clear password output"
					>
						Clear
					</Button>
				</div>
			</div>
		</ToolPageLayout>
	);
};

export default PasswordGeneratorPage;
