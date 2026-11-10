import * as React from "react";

import { cn } from "@frontend-frame/ui";

export interface SectionHeadingProps {
	eyebrow?: string;
	title: React.ReactNode;
	description?: React.ReactNode;
	align?: "left" | "center";
	as?: "h1" | "h2";
	className?: string;
	titleClassName?: string;
}

export function SectionHeading({
	eyebrow,
	title,
	description,
	align = "left",
	as: Heading = "h2",
	className,
	titleClassName,
}: SectionHeadingProps) {
	return (
		<div
			className={cn(
				align === "center" && "mx-auto max-w-3xl text-center",
				className,
			)}
		>
			{eyebrow ? (
				<p className="text-muted-foreground text-xs font-medium tracking-[0.18em] uppercase">
					{eyebrow}
				</p>
			) : null}
			<Heading
				className={cn(
					"mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl",
					titleClassName,
				)}
			>
				{title}
			</Heading>
			{description ? (
				<p
					className={cn(
						"text-muted-foreground mt-4 text-base leading-7",
						align === "center" && "mx-auto max-w-2xl",
					)}
				>
					{description}
				</p>
			) : null}
		</div>
	);
}
