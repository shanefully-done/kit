"use client";

import { Toaster as Sonner, ToasterProps } from "sonner";
import { useTheme } from "next-themes";

const Toaster = ({ ...props }: ToasterProps) => {
	const { resolvedTheme } = useTheme();
	return (
		<Sonner
			theme={(resolvedTheme as "light" | "dark") ?? "light"}
			className="toaster group"
			style={
				{
					"--normal-bg": "var(--card)",
					"--normal-text": "var(--foreground)",
					"--normal-border": "var(--ink)",
					"--border-radius": "0px",
				} as React.CSSProperties
			}
			toastOptions={{
				style: {
					borderRadius: 0,
					border: "2px solid var(--ink)",
					background: "var(--card)",
					color: "var(--foreground)",
					boxShadow: "4px 4px 0 0 #0A0A0A",
					fontFamily: "var(--font-ibm-plex-mono)",
				},
				classNames: {
					title: "text-xs uppercase tracking-[0.08em] font-semibold",
					description: "text-xs text-muted-foreground",
					actionButton: "bg-ink text-paper border-ink rounded-none",
					cancelButton: "bg-muted text-foreground border-ink rounded-none",
				},
			}}
			{...props}
		/>
	);
};

export { Toaster };
