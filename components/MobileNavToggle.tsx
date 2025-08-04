"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { SheetTrigger } from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";

type MobileNavToggleProps = {
	label?: string;
	className?: string;
};

export function MobileNavToggle({
	label = "Open navigation",
	className,
}: MobileNavToggleProps) {
	return (
		<SheetTrigger asChild>
			<Button
				aria-label={label}
				title={label}
				variant="ghost"
				size="icon"
				className={className ? className : "md:hidden"}
			>
				<MenuIcon className="h-5 w-5" aria-hidden="true" />
			</Button>
		</SheetTrigger>
	);
}

export default MobileNavToggle;
