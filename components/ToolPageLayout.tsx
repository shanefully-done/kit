"use client";

import * as React from "react";
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
			<div
				className={cn(
					"border-2 border-ink bg-card p-4 space-y-4 md:p-6",
					cardClassName,
				)}
			>
				{children}
				{footer ? <div className="border-t border-ink pt-4">{footer}</div> : null}
			</div>
		</div>
	);
}

export default ToolPageLayout;
