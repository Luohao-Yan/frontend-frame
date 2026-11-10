import * as React from "react";

import { cn } from "../lib/cn";

export type MiniBadgeTone = "default" | "accent" | "muted";

export interface MiniBadgeProps {
	tone?: MiniBadgeTone;
	children: React.ReactNode;
	className?: string;
}

const toneClass: Record<MiniBadgeTone, string> = {
	default: "bg-foreground text-background",
	accent: "bg-chart-1/10 text-chart-1 ring-1 ring-chart-1/25 ring-inset",
	muted: "bg-muted text-muted-foreground",
};

export function MiniBadge({
	tone = "default",
	children,
	className,
}: MiniBadgeProps) {
	return (
		<span
			data-slot="mini-badge"
			className={cn(
				"inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] leading-none font-semibold whitespace-nowrap",
				toneClass[tone],
				className,
			)}
		>
			{children}
		</span>
	);
}
