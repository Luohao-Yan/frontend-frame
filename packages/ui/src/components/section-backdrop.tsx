"use client";

import * as React from "react";

import { cn } from "../lib/utils";

export interface SectionBackdropProps extends React.ComponentProps<"div"> {
	variant?: "top" | "bottom" | "none";
}

export function SectionBackdrop({
	children,
	variant = "top",
	className,
	...props
}: SectionBackdropProps) {
	return (
		<div
			className={cn(
				"relative mx-2.5 mt-2.5 lg:mx-4",
				variant === "top" &&
					"from-primary/40 via-background to-background/80 rounded-t-4xl rounded-b-2xl bg-linear-to-b via-20%",
				variant === "bottom" &&
					"from-background via-background to-primary/40 rounded-t-2xl rounded-b-4xl bg-linear-to-b",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
}
