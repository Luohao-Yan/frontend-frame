"use client";

import * as React from "react";

import { cn } from "../lib/utils";

const spacing = {
	none: "",
	tight: "py-12 lg:py-16",
	default: "py-20 lg:py-28",
	loose: "py-28 lg:py-32",
} as const;

export interface PageSectionProps extends React.ComponentProps<"section"> {
	as?: React.ElementType;
	spacing?: keyof typeof spacing;
}

export function PageSection({
	as: Comp = "section",
	spacing: spacingKey = "default",
	className,
	...props
}: PageSectionProps) {
	return (
		<Comp
			className={cn("relative", spacing[spacingKey], className)}
			{...props}
		/>
	);
}
