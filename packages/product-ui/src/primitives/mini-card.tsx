import * as React from "react";

import { cn } from "../lib/cn";

export interface MiniCardProps extends React.ComponentProps<"div"> {
	accent?: boolean;
}

export function MiniCard({
	accent = true,
	className,
	children,
	...props
}: MiniCardProps) {
	return (
		<div
			data-slot="mini-card"
			className={cn(
				"bg-card text-card-foreground ring-foreground/10 relative flex h-full flex-col overflow-hidden rounded-xl ring-1",
				className,
			)}
			{...props}
		>
			{accent ? (
				<div
					aria-hidden="true"
					className="from-chart-1/50 via-chart-2/25 pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r to-transparent"
				/>
			) : null}
			{children}
		</div>
	);
}
