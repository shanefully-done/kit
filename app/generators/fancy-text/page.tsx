"use client";

import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Copy as CopyIcon, Type as TypeIcon } from "lucide-react";
import { toast } from "sonner";
import ToolPageLayout from "@/components/ToolPageLayout";
import ToolHeader from "@/components/ToolHeader";
import { useI18n } from "@/lib/i18n";
import { FANCY_STYLES, applyFancyStyle } from "@/lib/discord/text";

const PREVIEW_MAX = 280;

const FancyTextPage = () => {
	const { t } = useI18n();
	const [input, setInput] = useState("");

	const sourceText = input === "" ? t("tools.fancyText.sampleText") : input;

	const copyStyle = (styleName: string, text: string) => {
		navigator.clipboard.writeText(text).then(
			() =>
				toast.success(
					t("common.copiedType", {
						what: t("tools.fancyText.copiedStyle", { style: styleName }),
					}),
				),
			() => toast.error(t("common.copyFailed")),
		);
	};

	return (
		<ToolPageLayout
			header={
				<ToolHeader
					icon={<TypeIcon aria-hidden className="h-5 w-5" />}
					title={t("tools.fancyText.title")}
				/>
			}
		>
			<div className="space-y-4">
				<div className="flex items-end gap-2">
					<div className="grid flex-1 items-center gap-2">
						<label
							htmlFor="fancy-text-input"
							className="font-mono text-[11px] uppercase tracking-[0.08em]"
						>
							{t("tools.fancyText.inputLabel")}
						</label>
						<Input
							id="fancy-text-input"
							placeholder={t("tools.fancyText.inputPlaceholder")}
							value={input}
							onChange={(e) => setInput(e.target.value)}
						/>
					</div>
					<Button
						variant="ghost"
						onClick={() => setInput("")}
						aria-label={t("common.clear")}
					>
						{t("common.clear")}
					</Button>
				</div>

				<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
					{FANCY_STYLES.map((style) => {
						const output = applyFancyStyle(sourceText, style.id);
						const preview =
							output.length > PREVIEW_MAX
								? [...output].slice(0, PREVIEW_MAX).join("") + "…"
								: output;
						return (
							<Card key={style.id} className="flex h-full flex-col gap-3 py-4">
								<CardHeader className="px-4">
									<span className="font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
										{style.name}
									</span>
								</CardHeader>
								<CardContent className="px-4 flex-1">
									<p className="break-all">{preview}</p>
								</CardContent>
								<CardFooter className="px-4">
									<Button
										size="sm"
										variant="outline"
										onClick={() => copyStyle(style.name, output)}
										aria-label={t("tools.fancyText.copyStyleAria", {
											style: style.name,
										})}
									>
										<CopyIcon className="h-4 w-4" aria-hidden />
									</Button>
								</CardFooter>
							</Card>
						);
					})}
				</div>

				<p className="border-t border-ink pt-4 font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
					{t("tools.fancyText.accessibilityNote")}
				</p>
			</div>
		</ToolPageLayout>
	);
};

export default FancyTextPage;
