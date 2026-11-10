import * as React from "react";

import { cn } from "../lib/cn";

import type { FeatureFrameProps } from "../types";

export function FeatureFrame({
	children,
	chrome = "app",
	className,
	label,
}: FeatureFrameProps) {
	return (
		<div
			data-slot="feature-frame"
			role={label ? "group" : undefined}
			aria-label={label}
			className={cn(
				"bg-card ring-foreground/10 relative overflow-hidden rounded-xl shadow-[0_24px_48px_-18px_rgb(0_0_0/0.35)] ring-1",
				className,
			)}
		>
			{chrome !== "none" ? (
				<div
					aria-hidden="true"
					className="border-border bg-muted/40 flex h-8 items-center gap-1.5 border-b px-3"
				>
					<span className="bg-chart-1/70 size-2 rounded-full" />
					<span className="bg-chart-2/70 size-2 rounded-full" />
					<span className="bg-chart-3/70 size-2 rounded-full" />
					{chrome === "browser" ? (
						<span className="bg-background text-muted-foreground ml-2 h-4 flex-1 rounded-sm px-2 text-[8px] leading-4">
							frontend-frame.local
						</span>
					) : null}
				</div>
			) : null}
			<div className="relative overflow-hidden">{children}</div>
		</div>
	);
}
