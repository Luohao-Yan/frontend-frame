import * as React from "react";

import { cn } from "../lib/cn";

export interface MiniEyebrowProps {
	children: React.ReactNode;
	className?: string;
}

export function MiniEyebrow({ children, className }: MiniEyebrowProps) {
	return (
		<div className={cn("flex items-center gap-2", className)}>
			<span
				aria-hidden="true"
				className="bg-chart-1 inline-block h-3 w-px rounded-full"
			/>
			<span className="text-muted-foreground text-[11px] font-semibold tracking-[0.14em] uppercase">
				{children}
			</span>
		</div>
	);
}
