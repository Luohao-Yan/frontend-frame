import * as React from "react";

import { cn } from "../lib/cn";
import { MiniCard } from "./mini-card";
import { MiniEyebrow } from "./mini-eyebrow";

import type { ProductMockupCardProps } from "../types";

export function ProductMockupCard({
	eyebrow,
	title,
	description,
	pattern,
	className,
	testId,
	children,
}: ProductMockupCardProps) {
	const hasFooter = Boolean(eyebrow || title || description);

	return (
		<MiniCard
			data-testid={testId}
			className={cn(
				"group transition-[border-color,box-shadow] duration-300 hover:shadow-md",
				className,
			)}
		>
			<div className="relative flex flex-1 flex-col p-6 sm:p-8">
				{pattern ? (
					<div
						aria-hidden="true"
						className="pointer-events-none absolute inset-4"
					>
						{pattern}
					</div>
				) : null}
				<div className="relative">{children}</div>
			</div>
			{hasFooter ? (
				<div className="mt-auto flex flex-col gap-1.5 px-6 pb-6 sm:px-8 sm:pb-8">
					{eyebrow ? <MiniEyebrow>{eyebrow}</MiniEyebrow> : null}
					{title ? (
						<h3 className="text-base leading-tight font-semibold tracking-tight">
							{title}
						</h3>
					) : null}
					{description ? (
						<p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
							{description}
						</p>
					) : null}
				</div>
			) : null}
		</MiniCard>
	);
}
