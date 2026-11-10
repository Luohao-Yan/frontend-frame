"use client";

import * as React from "react";

import { cn } from "@frontend-frame/ui";

export interface SkipLinkProps extends Omit<
	React.ComponentPropsWithoutRef<"a">,
	"href"
> {
	href?: string;
}

export function SkipLink({
	href = "#main-content",
	children = "跳到主要内容",
	className,
	...props
}: SkipLinkProps) {
	return (
		<a
			href={href}
			className={cn(
				"bg-background text-foreground focus:ring-ring sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:border focus:px-3 focus:py-2 focus:text-sm focus:shadow-lg focus:ring-2 focus:outline-none",
				className,
			)}
			{...props}
		>
			{children}
		</a>
	);
}
