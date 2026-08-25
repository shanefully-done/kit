"use client";

import { useMemo } from "react";
import { usePersistentState } from "@/hooks/use-persistent-state";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Copy, FileKey as FileKeyIcon } from "lucide-react";
import { toast } from "sonner";
import ToolPageLayout from "@/components/ToolPageLayout";
import ToolHeader from "@/components/ToolHeader";
import { useI18n } from "@/lib/i18n";

type Perm = { read: boolean; write: boolean; execute: boolean };

function permToDigit({ read, write, execute }: Perm): number {
	return (read ? 4 : 0) + (write ? 2 : 0) + (execute ? 1 : 0);
}

function digitToPerm(digit: number): Perm {
	return {
		read: (digit & 4) !== 0,
		write: (digit & 2) !== 0,
		execute: (digit & 1) !== 0,
	};
}

// rwx triple for one class; setuid/setgid render 's'/'S' over owner-exec,
// sticky bit renders 't'/'T' over other-exec.
function permToSymbolic(perm: Perm, special: "s" | "t" | null): string {
	const bits =
		(perm.read ? "r" : "-") +
		(perm.write ? "w" : "-") +
		(perm.execute || special !== null
			? special !== null
				? perm.execute
					? special.toLowerCase()
					: special.toUpperCase()
				: "x"
			: "-");
	return bits;
}

function classSymbolic(
	perm: Perm,
	specialOn: boolean,
	kind: "owner" | "group" | "other",
): string {
	if (!specialOn) return permToSymbolic(perm, null);
	if (kind === "owner") return permToSymbolic(perm, "s");
	if (kind === "other") return permToSymbolic(perm, "t");
	return permToSymbolic(perm, null);
}

function copyText(value: string) {
	navigator.clipboard.writeText(value).then(
		() => toast.success("COPIED"),
		() => toast.error("COPY FAILED"),
	);
}

const isPerm = (v: unknown): v is Perm =>
	typeof v === "object" &&
	v !== null &&
	["read", "write", "execute"].every(
		(k) => typeof (v as Record<string, unknown>)[k] === "boolean",
	);

const isOctal = (v: unknown): v is string =>
	typeof v === "string" && /^[0-7]{3,4}$/.test(v);
export default function ChmodCalculatorPage() {
	const { t } = useI18n();
	const [owner, setOwner] = usePersistentState<Perm>(
		"chmod-calculator:owner",
		{ read: true, write: true, execute: true },
		isPerm,
	);
	const [group, setGroup] = usePersistentState<Perm>(
		"chmod-calculator:group",
		{ read: true, write: false, execute: true },
		isPerm,
	);
	const [other, setOther] = usePersistentState<Perm>(
		"chmod-calculator:other",
		{ read: true, write: false, execute: true },
		isPerm,
	);
	const [setuid, setSetuid] = usePersistentState(
		"chmod-calculator:setuid",
		false,
	);
	const [setgid, setSetgid] = usePersistentState(
		"chmod-calculator:setgid",
		false,
	);
	const [sticky, setSticky] = usePersistentState(
		"chmod-calculator:sticky",
		false,
	);
	const [octalInput, setOctalInput] = usePersistentState(
		"chmod-calculator:octalInput",
		"0755",
		isOctal,
	);

	const classes: Array<{
		key: "owner" | "group" | "other";
		label: string;
		perm: Perm;
		setPerm: (p: Perm) => void;
	}> = [
		{ key: "owner", label: t("tools.chmodCalculator.owner"), perm: owner, setPerm: setOwner },
		{ key: "group", label: t("tools.chmodCalculator.group"), perm: group, setPerm: setGroup },
		{ key: "other", label: t("tools.chmodCalculator.other"), perm: other, setPerm: setOther },
	];

	const perms: Array<{ key: keyof Perm; label: string }> = [
		{ key: "read", label: t("tools.chmodCalculator.read") },
		{ key: "write", label: t("tools.chmodCalculator.write") },
		{ key: "execute", label: t("tools.chmodCalculator.execute") },
	];

	const octalFull = useMemo(() => {
		const specialDigit = (setuid ? 4 : 0) + (setgid ? 2 : 0) + (sticky ? 1 : 0);
		return (
			String(specialDigit) +
			permToDigit(owner) +
			String(permToDigit(group)) +
			String(permToDigit(other))
		).slice(0, 4);
	}, [owner, group, other, setuid, setgid, sticky]);

	const symbolic = useMemo(() => {
		return (
			"-" +
			classSymbolic(owner, setuid, "owner") +
			classSymbolic(group, setgid, "group") +
			classSymbolic(other, sticky, "other")
		);
	}, [owner, group, other, setuid, setgid, sticky]);

	const command = `chmod ${octalFull} file`;

	const parsedInputOk = useMemo(
		() => /^[0-7]{3,4}$/.test(octalInput),
		[octalInput],
	);

	function toggle(
		key: "owner" | "group" | "other",
		bit: keyof Perm,
		checked: boolean,
	) {
		const setters = {
			owner: setOwner,
			group: setGroup,
			other: setOther,
		} as const;
		const current = key === "owner" ? owner : key === "group" ? group : other;
		const next = { ...current, [bit]: checked };
		setters[key](next);
		setOctalInput(nextOctalString(next, key));
	}

	function nextOctalString(
		next: Perm,
		key: "owner" | "group" | "other",
	): string {
		const digits = {
			owner: key === "owner" ? next : owner,
			group: key === "group" ? next : group,
			other: key === "other" ? next : other,
		};
		const specialDigit = (setuid ? 4 : 0) + (setgid ? 2 : 0) + (sticky ? 1 : 0);
		return (
			String(specialDigit) +
			permToDigit(digits.owner) +
			String(permToDigit(digits.group)) +
			String(permToDigit(digits.other))
		).slice(0, 4);
	}

	function applySpecial(
		which: "setuid" | "setgid" | "sticky",
		checked: boolean,
	) {
		if (which === "setuid") setSetuid(checked);
		else if (which === "setgid") setSetgid(checked);
		else setSticky(checked);
		const specialDigit =
			(which === "setuid" ? (checked ? 4 : 0) : setuid ? 4 : 0) +
			(which === "setgid" ? (checked ? 2 : 0) : setgid ? 2 : 0) +
			(which === "sticky" ? (checked ? 1 : 0) : sticky ? 1 : 0);
		setOctalInput(
			(
				String(specialDigit) +
				permToDigit(owner) +
				String(permToDigit(group)) +
				String(permToDigit(other))
			).slice(0, 4),
		);
	}

	function handleOctalChange(value: string) {
		setOctalInput(value);
		if (!/^[0-7]{3,4}$/.test(value)) return;
		let body = value;
		let specialDigit = 0;
		if (value.length === 4) {
			specialDigit = parseInt(value[0], 8);
			body = value.slice(1);
		}
		setSetuid((specialDigit & 4) !== 0);
		setSetgid((specialDigit & 2) !== 0);
		setSticky((specialDigit & 1) !== 0);
		setOwner(digitToPerm(parseInt(body[0], 8)));
		setGroup(digitToPerm(parseInt(body[1], 8)));
		setOther(digitToPerm(parseInt(body[2], 8)));
	}

	return (
		<ToolPageLayout
			header={
				<ToolHeader
					icon={<FileKeyIcon aria-hidden className="h-5 w-5" />}
				title={t("tools.chmodCalculator.title")}
				/>
			}
		>
			<div className="space-y-6">
				<section className="space-y-3">
					<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
					{t("tools.chmodCalculator.permissionMatrixLabel")}
					</p>
					<div className="border border-ink">
						<div className="grid grid-cols-4 border-b border-ink bg-ink px-3 py-2 text-paper">
							<span />
							{perms.map((perm) => (
								<span
									key={perm.key}
									className="font-mono text-[11px] uppercase tracking-[0.08em]"
								>
									{perm.label}
								</span>
							))}
						</div>
						{classes.map((cls) => (
							<div
								key={cls.key}
								className="grid grid-cols-4 items-center border-b border-ink px-3 py-2 last:border-b-0"
							>
								<span className="font-mono text-[11px] uppercase tracking-[0.08em]">
									{cls.label}
								</span>
								{perms.map((perm) => (
									<div key={perm.key} className="flex items-center gap-2">
										<Checkbox
											id={`${cls.key}-${perm.key}`}
											checked={cls.perm[perm.key]}
											onCheckedChange={(checked) =>
												toggle(cls.key, perm.key, checked === true)
											}
										/>
										<Label
											htmlFor={`${cls.key}-${perm.key}`}
											className="font-mono text-[11px] uppercase tracking-[0.08em]"
										>
											{permToDigit(cls.perm).toString()}
										</Label>
									</div>
								))}
							</div>
						))}
					</div>

					<div className="flex flex-wrap items-center gap-6 border border-ink bg-muted/40 px-3 py-2">
						<div className="flex items-center gap-2">
							<Switch
								id="switch-setuid"
								checked={setuid}
								onCheckedChange={(checked) => applySpecial("setuid", checked)}
							/>
							<Label
								htmlFor="switch-setuid"
								className="font-mono text-[11px] uppercase tracking-[0.08em]"
							>
								SETUID
							</Label>
						</div>
						<div className="flex items-center gap-2">
							<Switch
								id="switch-setgid"
								checked={setgid}
								onCheckedChange={(checked) => applySpecial("setgid", checked)}
							/>
							<Label
								htmlFor="switch-setgid"
								className="font-mono text-[11px] uppercase tracking-[0.08em]"
							>
								SETGID
							</Label>
						</div>
						<div className="flex items-center gap-2">
							<Switch
								id="switch-sticky"
								checked={sticky}
								onCheckedChange={(checked) => applySpecial("sticky", checked)}
							/>
							<Label
								htmlFor="switch-sticky"
								className="font-mono text-[11px] uppercase tracking-[0.08em]"
							>
								STICKY
							</Label>
						</div>
					</div>
				</section>

				<section className="space-y-3">
					<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
					{t("tools.chmodCalculator.resultLabel")}
					</p>
					<div className="border border-ink bg-muted/40 px-3 py-3">
						<p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
						{t("tools.chmodCalculator.octalLabel")}
						</p>
						<p className="font-mono text-2xl">{octalFull}</p>
					</div>
					<div className="flex items-center justify-between gap-3 border border-ink bg-muted/40 px-3 py-3">
						<div className="min-w-0">
							<p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
							{t("tools.chmodCalculator.symbolicLabel")}
							</p>
							<p className="truncate font-mono">{symbolic}</p>
						</div>
						<Button variant="outline" size="sm" onClick={() => copyText(symbolic)}>
							<Copy aria-hidden className="h-3.5 w-3.5" />
						{t("common.copy")}
						</Button>
					</div>
					<div className="flex items-center justify-between gap-3 border border-ink bg-muted/40 px-3 py-3">
						<div className="min-w-0">
							<p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
							{t("tools.chmodCalculator.commandLabel")}
							</p>
							<p className="truncate font-mono">{command}</p>
						</div>
						<Button variant="outline" size="sm" onClick={() => copyText(command)}>
							<Copy aria-hidden className="h-3.5 w-3.5" />
						{t("common.copy")}
						</Button>
					</div>
				</section>

				<section className="space-y-3">
					<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
					{t("tools.chmodCalculator.octalInputLabel")}
					</p>
					<Input
						value={octalInput}
						onChange={(e) => handleOctalChange(e.target.value)}
						pattern="[0-7]{3,4}"
						placeholder="0755"
						className="w-32 font-mono"
					/>
					{!parsedInputOk && (
						<p className="border border-hazard bg-muted/40 px-3 py-2 font-mono text-sm text-hazard-text">
						{t("tools.chmodCalculator.invalidOctalError")}
						</p>
					)}
				</section>
			</div>
		</ToolPageLayout>
	);
}
