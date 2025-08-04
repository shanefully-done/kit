"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ToolPageLayoutProps = {
	header?: React.ReactNode;
	children: React.ReactNode;
	className?: string;
	cardClassName?: string;
	footer?: React.ReactNode;
};

export function ToolPageLayout({
	header,
	children,
	className,
	cardClassName,
	footer,
}: ToolPageLayoutProps) {
	return (
		<div className={cn("space-y-4", className)}>
			{header}
			<Card className={cn("p-4 space-y-4 md:p-6", cardClassName)}>
				{children}
				{footer ? <div className="pt-2">{footer}</div> : null}
			</Card>
		</div>
	);
}

export default ToolPageLayout;
