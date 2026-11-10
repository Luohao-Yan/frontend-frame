import { motion } from "motion/react";
import * as React from "react";

import { cn } from "../lib/cn";
import { MiniSkeleton } from "./mini-skeleton";

export interface MiniRowProps {
	label: string;
	value?: string;
	enriched?: boolean;
	enrichedLabel?: string;
	animated?: boolean;
	className?: string;
}

export function MiniRow({
	label,
	value,
	enriched = false,
	enrichedLabel = "AI enriched",
	animated = false,
	className,
}: MiniRowProps) {
	return (
		<motion.div
			data-slot="mini-row"
			data-enriched={enriched || undefined}
			initial={animated ? "hidden" : false}
			whileInView={animated ? "visible" : undefined}
			viewport={{ once: true, amount: 0.4 }}
			variants={{
				hidden: { opacity: 0, y: 5 },
				visible: {
					opacity: 1,
					y: 0,
					transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
				},
			}}
			className={cn(
				"grid grid-cols-[minmax(4.5rem,0.8fr)_minmax(0,1.2fr)] items-center gap-2 py-1",
				className,
			)}
		>
			<dt className="text-muted-foreground truncate text-[11px] font-medium">
				{label}
			</dt>
			<dd className="min-w-0">
				{value ? (
					<span
						className={cn(
							"inline-flex max-w-full items-center gap-1.5 truncate rounded px-1.5 py-0.5 text-[11px]",
							enriched
								? "bg-chart-1/10 text-chart-1 ring-chart-1/30 ring-1 ring-inset"
								: "text-foreground/80",
						)}
						title={value}
					>
						{enriched ? (
							<span
								aria-hidden="true"
								className="bg-chart-1 size-1.5 shrink-0 rounded-full"
							/>
						) : null}
						<span className="truncate">{value}</span>
						{enriched ? (
							<span className="sr-only">, {enrichedLabel}</span>
						) : null}
					</span>
				) : (
					<>
						<MiniSkeleton
							width={enriched ? "6.5rem" : "4.5rem"}
							className="align-middle"
						/>
						<span className="sr-only">Not provided</span>
					</>
				)}
			</dd>
		</motion.div>
	);
}
