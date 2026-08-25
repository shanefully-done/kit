"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type ToolHeaderProps = {
	icon?: React.ReactNode;
	title: string;
	actions?: React.ReactNode;
	className?: string;
};

export function ToolHeader({
	icon,
	title,
	actions,
	className,
}: ToolHeaderProps) {
	return (
		<div
			className={cn(
				"grid grid-cols-[auto_1fr_auto] items-stretch border-2 border-ink bg-card",
				className,
			)}
		>
			{icon ? (
				<div
					className="w-12 border-r-2 border-ink grid place-items-center text-foreground"
					aria-hidden
				>
					{icon}
				</div>
			) : null}
			<div className="px-4 py-3 flex flex-col justify-center min-w-0">
				<h1 className="font-sans font-black uppercase tracking-[-0.04em] leading-[0.9] text-2xl md:text-3xl truncate">
					{title}
				</h1>
			</div>
			{actions ? (
				<div className="flex items-center gap-2 px-3 border-l border-ink">
					{actions}
				</div>
			) : null}
		</div>
	);
}

export default ToolHeader;
