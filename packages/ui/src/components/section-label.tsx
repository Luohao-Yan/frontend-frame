"use client";

import * as React from "react";

import { cn } from "../lib/utils";

export interface SectionLabelProps {
	title?: string;
	as?: "h2" | "h3";
	className?: string;
}

/**
 * 区块标题：横带分层与仪器化面板的中文小标题（不再使用英文眉标与编号）。
 */
export function SectionLabel({
	title,
	as = "h2",
	className,
}: SectionLabelProps) {
	const Comp = as;
	return (
		<div className={cn("flex items-center gap-2", className)}>
			<span
				className="bg-primary h-3.5 w-1 shrink-0 rounded-full"
				aria-hidden="true"
			/>
			{title ? (
				<Comp className="text-sm font-semibold tracking-tight">{title}</Comp>
			) : null}
		</div>
	);
}
