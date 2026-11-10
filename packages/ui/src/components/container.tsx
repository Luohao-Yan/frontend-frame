"use client";

import * as React from "react";

import { cn } from "../lib/utils";

const sizeClasses = {
	default: "container-page",
	large: "mx-auto w-full max-w-[1440px] px-6",
	small: "mx-auto w-full max-w-[960px] px-6",
} as const;

export interface ContainerProps extends React.ComponentProps<"div"> {
	size?: keyof typeof sizeClasses;
}

export function Container({
	size = "default",
	className,
	...props
}: ContainerProps) {
	return <div className={cn(sizeClasses[size], className)} {...props} />;
}
