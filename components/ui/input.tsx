import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
	return (
		<input
			type={type}
			data-slot="input"
			className={cn(
				"flex h-9 w-full min-w-0 border border-ink bg-card px-3 py-1 font-mono text-sm text-foreground transition-colors placeholder:text-muted-foreground focus-visible:border-hazard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hazard disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-hazard",
				className,
			)}
			{...props}
		/>
	);
}

export { Input };
