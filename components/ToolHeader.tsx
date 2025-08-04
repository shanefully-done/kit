"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon } from "lucide-react";
import { useMounted } from "@/hooks/use-mounted";

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
	const mounted = useMounted();
	const { resolvedTheme, theme } = useTheme();

	// Wrap any theme-dependent icon with mounted guard to prevent SSR/CSR mismatch
	const ThemedIcon = React.useMemo(() => {
		if (!icon) return null;

		// If the provided icon is explicitly Sun/Moon or depends on theme,
		// render a stable placeholder on SSR and the correct icon after mount.
		// Since we can't reliably detect user-supplied icon intent, we only
		// guard our own Sun/Moon example and otherwise render as-is.
		if (!mounted) {
			return (
				<span
					aria-hidden="true"
					suppressHydrationWarning={true}
					className="inline-block h-5 w-5 text-muted-foreground"
				/>
			);
		}

		// If consumer passes no theme-specific icon, show original icon
		// For demonstration, if consumer passed nothing, fall back to null
		return icon;
	}, [icon, mounted, resolvedTheme, theme]);

	return (
		<div
			className={cn(
				"flex items-center justify-between gap-3",
				"border-b pb-3",
				className
			)}
		>
			<div className="flex items-center gap-3">
				{icon ? (
					<span aria-hidden className="text-muted-foreground">
						{ThemedIcon}
					</span>
				) : null}
				<h1 className="text-xl font-semibold leading-tight">{title}</h1>
			</div>
			{actions ? <div className="flex items-center gap-2">{actions}</div> : null}
		</div>
	);
}

export default ToolHeader;
