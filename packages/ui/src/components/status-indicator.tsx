import * as React from "react";

import { cn } from "../lib/utils";

const toneClasses = {
	muted: "text-muted-foreground",
	success: "text-emerald-600 dark:text-emerald-400",
	warning: "text-amber-600 dark:text-amber-400",
	danger: "text-destructive",
	info: "text-blue-600 dark:text-blue-400",
} as const;

interface StatusIndicatorProps extends React.ComponentProps<"span"> {
	icon: React.ElementType;
	iconClassName?: string;
	tone?: keyof typeof toneClasses;
}

function StatusIndicator({
	icon: Icon,
	iconClassName,
	tone = "muted",
	className,
	children,
	...props
}: StatusIndicatorProps) {
	return (
		<span
			data-slot="status-indicator"
			className={cn(
				"flex items-center gap-1 text-xs",
				toneClasses[tone],
				className,
			)}
			{...props}
		>
			<Icon
				className={cn("size-4 shrink-0", iconClassName)}
				aria-hidden="true"
			/>
			{children ? <span className="truncate">{children}</span> : null}
		</span>
	);
}

export { StatusIndicator };
