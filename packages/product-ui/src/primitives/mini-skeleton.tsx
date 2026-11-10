import * as React from "react";

import { cn } from "../lib/cn";

export interface MiniSkeletonProps extends React.ComponentProps<"span"> {
	width?: string;
}

export function MiniSkeleton({
	width = "5rem",
	className,
	...props
}: MiniSkeletonProps) {
	return (
		<span
			data-slot="mini-skeleton"
			className={cn("bg-muted inline-block h-2 rounded-full", className)}
			style={{ width }}
			{...props}
		/>
	);
}
