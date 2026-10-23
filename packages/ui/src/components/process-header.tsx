"use client";

import * as React from "react";

import { cn } from "../lib/utils";

export interface ProcessHeaderProps extends React.ComponentProps<"button"> {
	label: React.ReactNode;
	meta?: React.ReactNode;
	isLoading?: boolean;
}

function ProcessHeader({
	label,
	meta,
	isLoading,
	className,
	...props
}: ProcessHeaderProps) {
	return (
		<button
			type="button"
			data-slot="process-header"
			className={cn(
				"text-muted-foreground hover:text-foreground flex w-full min-w-0 cursor-pointer items-center justify-between text-left text-xs transition-colors",
				isLoading && "animate-pulse",
				className,
			)}
			{...props}
		>
			<span className="block min-w-0 max-w-full flex-1 overflow-hidden">
				{label}
			</span>
			{meta ? (
				<span className="text-muted-foreground ml-2 flex shrink-0 items-center gap-1 text-xs">
					{meta}
				</span>
			) : null}
		</button>
	);
}

export { ProcessHeader };
