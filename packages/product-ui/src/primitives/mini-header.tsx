import * as React from "react";

import { cn } from "../lib/cn";

export interface MiniHeaderProps {
	title: string;
	subtitle?: string;
	actions?: React.ReactNode;
	className?: string;
}

export function MiniHeader({
	title,
	subtitle,
	actions,
	className,
}: MiniHeaderProps) {
	return (
		<div className={cn("flex items-start justify-between gap-3", className)}>
			<div className="min-w-0">
				<p className="truncate text-[13px] leading-tight font-semibold tracking-tight">
					{title}
				</p>
				{subtitle ? (
					<p className="text-muted-foreground mt-1 truncate text-[11px] leading-tight">
						{subtitle}
					</p>
				) : null}
			</div>
			{actions ? <div className="shrink-0">{actions}</div> : null}
		</div>
	);
}
