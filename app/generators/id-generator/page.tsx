"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { usePersistentState } from "@/hooks/use-persistent-state";
import { v4 as uuidv4, v7 as uuidv7 } from "uuid";
import { ulid } from "ulid";
import { nanoid } from "nanoid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { ToolHeader } from "@/components/ToolHeader";
import { useI18n } from "@/lib/i18n";
import { ScanLine } from "lucide-react";

export default function IdGeneratorPage() {
	const { t } = useI18n();
	const [tab, setTab] = usePersistentState("id-generator:tab", "uuid-v4");
	const [count, setCount] = usePersistentState("id-generator:count", 5);
	const [uppercase, setUppercase] = usePersistentState(
		"id-generator:uppercase",
		false,
	);
	const [hyphens, setHyphens] = usePersistentState("id-generator:hyphens", true);
	const [ulidUppercase, setUlidUppercase] = usePersistentState(
		"id-generator:ulidUppercase",
		false,
	);
	const [nanoSize, setNanoSize] = usePersistentState(
		"id-generator:nanoSize",
		21,
	);
	const [ids, setIds] = useState<string[]>([]);

	const generate = useCallback(() => {
		const result: string[] = [];
		const clamped = Math.max(1, Math.min(100, count));
		for (let i = 0; i < clamped; i++) {
			let raw = "";
			switch (tab) {
				case "uuid-v4":
					raw = uuidv4();
					if (!hyphens) raw = raw.replace(/-/g, "");
					if (uppercase) raw = raw.toUpperCase();
					break;
				case "uuid-v7":
					raw = uuidv7();
					if (!hyphens) raw = raw.replace(/-/g, "");
					if (uppercase) raw = raw.toUpperCase();
					break;
				case "ulid":
					raw = ulid();
					if (ulidUppercase) raw = raw.toUpperCase();
					break;
				case "nanoid": {
					const sz = Math.max(8, Math.min(64, nanoSize));
					raw = nanoid(sz);
					break;
				}
			}
			result.push(raw);
		}
		setIds(result);
	}, [tab, count, uppercase, hyphens, ulidUppercase, nanoSize]);

	useEffect(() => {
		generate();
	}, [generate]);

	const allIds = useMemo(() => ids.join("\n"), [ids]);

	const handleCopy = useCallback(() => {
		navigator.clipboard.writeText(allIds).then(() => {
			toast.success(t("common.copied"));
		}).catch(() => {
			toast.error(t("common.copyFailed"));
		});
	}, [allIds, t]);

	return (
		<ToolPageLayout
			header={
				<ToolHeader
					icon={<ScanLine aria-hidden />}
					title={t("tools.idGenerator.title")}
				/>
			}
		>
			<div className="space-y-4">
				<Tabs value={tab} onValueChange={setTab}>
					<TabsList>
						<TabsTrigger value="uuid-v4">UUID V4</TabsTrigger>
						<TabsTrigger value="uuid-v7">UUID V7</TabsTrigger>
						<TabsTrigger value="ulid">ULID</TabsTrigger>
						<TabsTrigger value="nanoid">NANOID</TabsTrigger>
					</TabsList>

					<TabsContent value="uuid-v4" className="space-y-4">
						<div className="flex items-center justify-between border border-ink bg-muted/40 px-3 py-2">
							<Label className="font-mono text-[11px] uppercase tracking-[0.08em]">
								{t("tools.idGenerator.uppercaseLabel")}
							</Label>
							<Switch checked={uppercase} onCheckedChange={setUppercase} />
						</div>
						<div className="flex items-center justify-between border border-ink bg-muted/40 px-3 py-2">
							<Label className="font-mono text-[11px] uppercase tracking-[0.08em]">
								{t("tools.idGenerator.hyphensLabel")}
							</Label>
							<Switch checked={hyphens} onCheckedChange={setHyphens} />
						</div>
					</TabsContent>

					<TabsContent value="uuid-v7" className="space-y-4">
						<div className="flex items-center justify-between border border-ink bg-muted/40 px-3 py-2">
							<Label className="font-mono text-[11px] uppercase tracking-[0.08em]">
								{t("tools.idGenerator.uppercaseLabel")}
							</Label>
							<Switch checked={uppercase} onCheckedChange={setUppercase} />
						</div>
						<div className="flex items-center justify-between border border-ink bg-muted/40 px-3 py-2">
							<Label className="font-mono text-[11px] uppercase tracking-[0.08em]">
								{t("tools.idGenerator.hyphensLabel")}
							</Label>
							<Switch checked={hyphens} onCheckedChange={setHyphens} />
						</div>
					</TabsContent>

					<TabsContent value="ulid" className="space-y-4">
						<div className="flex items-center justify-between border border-ink bg-muted/40 px-3 py-2">
							<Label className="font-mono text-[11px] uppercase tracking-[0.08em]">
								{t("tools.idGenerator.uppercaseLabel")}
							</Label>
							<Switch checked={ulidUppercase} onCheckedChange={setUlidUppercase} />
						</div>
					</TabsContent>

					<TabsContent value="nanoid" className="space-y-4">
						<div className="flex items-center justify-between border border-ink bg-muted/40 px-3 py-2">
							<Label className="font-mono text-[11px] uppercase tracking-[0.08em]">
								{t("tools.idGenerator.sizeLabel")}
							</Label>
							<Input
								type="number"
								min={8}
								max={64}
								value={nanoSize}
								onChange={(e) => setNanoSize(parseInt(e.target.value) || 21)}
								className="w-20"
							/>
						</div>
					</TabsContent>
				</Tabs>

				<div className="flex items-center justify-between border border-ink bg-muted/40 px-3 py-2">
					<Label className="font-mono text-[11px] uppercase tracking-[0.08em]">
						{t("tools.idGenerator.countLabel")}
					</Label>
					<Input
						type="number"
						min={1}
						max={100}
						value={count}
						onChange={(e) => setCount(parseInt(e.target.value) || 1)}
						className="w-20"
					/>
				</div>

				<div className="flex flex-wrap gap-2">
					<Button onClick={generate}>
						{t("tools.idGenerator.generateButton")}
					</Button>
					<Button variant="outline" onClick={handleCopy}>
						{t("tools.idGenerator.copyAll")}
					</Button>
				</div>

				<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
					{t("tools.idGenerator.outputLabel")}
				</p>
				<div className="border border-ink bg-muted/40 p-3 font-mono text-sm break-all space-y-1">
					{ids.map((id, i) => (
						<div key={i}>{id}</div>
					))}
				</div>
			</div>
		</ToolPageLayout>
	);
}
