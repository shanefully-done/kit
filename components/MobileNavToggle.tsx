"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { SheetTrigger } from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import { useI18n } from "@/lib/i18n";

type MobileNavToggleProps = {
	label?: string;
	className?: string;
};

export function MobileNavToggle({
	label,
	className,
}: MobileNavToggleProps) {
	const { t } = useI18n();
	const text = label ?? t("ui.openNavigation");
	return (
		<SheetTrigger asChild>
			<Button
				aria-label={text}
				title={text}
				variant="outline"
				size="icon"
				className={className ? className : "md:hidden"}
			>
				<MenuIcon className="h-5 w-5" aria-hidden="true" />
			</Button>
		</SheetTrigger>
	);
}

export default MobileNavToggle;
