"use client";

import React from "react";
import { cn } from "@/lib/utils";

type PageContainerSize = "sm" | "md" | "lg" | "full";

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
	size?: PageContainerSize;
}

/**
 * PageContainer
 * Centers content both vertically and horizontally with a minimal max-width.
 *
 * Usage:
 *   <PageContainer size="md">...content...</PageContainer>
 */
export default function PageContainer({
	className,
	size = "md",
	children,
	...rest
}: PageContainerProps) {
	const sizeClass =
		size === "sm"
			? "max-w-prose"
			: size === "md"
			? "max-w-screen-md"
			: size === "lg"
			? "max-w-screen-lg"
			: "max-w-none";

	return (
		<div
			className={cn(
				"min-h-screen w-full flex items-center justify-center px-4 sm:px-6 lg:px-8",
				className
			)}
			{...rest}
		>
			<div className={cn("w-full", sizeClass)}>{children}</div>
		</div>
	);
}
