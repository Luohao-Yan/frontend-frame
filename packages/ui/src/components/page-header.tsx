import * as React from "react";

import { cn } from "../lib/utils";

interface PageHeaderProps extends React.ComponentProps<"div"> {
	title: string;
	description?: string;
	eyebrow?: React.ReactNode;
	actions?: React.ReactNode;
}

export function PageHeader({
	title,
	description,
	eyebrow,
	actions,
	className,
	children,
	...props
}: PageHeaderProps) {
	return (
		<div
			className={cn(
				"flex flex-col gap-5 border-b pb-6 sm:flex-row sm:items-end sm:justify-between",
				className,
			)}
			{...props}
		>
			<div className="min-w-0 space-y-2">
				{eyebrow ? (
					<div className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
						{eyebrow}
					</div>
				) : null}
				<h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
					{title}
				</h1>
				{description ? (
					<p className="text-muted-foreground max-w-2xl text-sm leading-6">
						{description}
					</p>
				) : null}
				{children}
			</div>
			{actions ? (
				<div className="flex shrink-0 flex-wrap items-center gap-2">
					{actions}
				</div>
			) : null}
		</div>
	);
}
