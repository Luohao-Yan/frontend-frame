import * as React from "react";

import { cn } from "../lib/cn";

export interface MiniPatternProps {
	className?: string;
}

export function MiniDotGrid({ className }: MiniPatternProps) {
	return (
		<div
			aria-hidden="true"
			data-slot="mini-dot-grid"
			className={cn(
				"text-foreground pointer-events-none absolute inset-0 opacity-[0.05] dark:opacity-[0.08]",
				className,
			)}
			style={{
				backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
				backgroundSize: "14px 14px",
			}}
		/>
	);
}

export function MiniWavePattern({ className }: MiniPatternProps) {
	const rawId = React.useId();
	const patternId = `product-wave-${rawId.replace(/:/g, "")}`;

	return (
		<svg
			aria-hidden="true"
			data-slot="mini-wave-pattern"
			className={cn(
				"text-foreground pointer-events-none absolute inset-0 h-full w-full opacity-[0.05] dark:opacity-[0.07]",
				className,
			)}
		>
			<defs>
				<pattern
					id={patternId}
					width="16"
					height="8"
					patternUnits="userSpaceOnUse"
					patternTransform="rotate(45)"
				>
					<path
						d="M0 8 L8 0 L16 8"
						fill="none"
						stroke="currentColor"
						strokeWidth="0.5"
					/>
				</pattern>
			</defs>
			<rect width="100%" height="100%" fill={`url(#${patternId})`} />
		</svg>
	);
}
