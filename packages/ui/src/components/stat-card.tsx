import { ArrowDownRight, ArrowUpRight, MinusIcon } from "lucide-react";
import * as React from "react";

import { cn } from "../lib/utils";

const accentClasses = {
	blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
	green: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
	purple: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
	amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
} as const;

function Sparkline({
	values,
	className,
}: {
	values: number[];
	className?: string;
}) {
	if (values.length < 2) {
		return null;
	}

	const width = 120;
	const height = 36;
	const min = Math.min(...values);
	const max = Math.max(...values);
	const range = max - min || 1;
	const points = values
		.map((value, index) => {
			const x = (index / (values.length - 1)) * width;
			const y = height - ((value - min) / range) * (height - 4) - 2;
			return `${x},${y}`;
		})
		.join(" ");

	return (
		<svg
			viewBox={`0 0 ${width} ${height}`}
			className={cn("h-9 w-28 overflow-visible", className)}
			aria-hidden="true"
		>
			<polyline
				points={points}
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				vectorEffect="non-scaling-stroke"
			/>
		</svg>
	);
}

interface StatCardProps extends React.ComponentProps<"div"> {
	title: string;
	value: React.ReactNode;
	description?: React.ReactNode;
	icon?: React.ReactNode;
	accent?: keyof typeof accentClasses;
	delta?: number;
	deltaLabel?: string;
	trend?: number[];
}

export function StatCard({
	title,
	value,
	description,
	icon,
	accent = "blue",
	delta,
	deltaLabel = "较上期",
	trend,
	className,
	...props
}: StatCardProps) {
	const hasDelta = typeof delta === "number" && Number.isFinite(delta);
	const DeltaIcon = !hasDelta
		? MinusIcon
		: delta > 0
			? ArrowUpRight
			: delta < 0
				? ArrowDownRight
				: MinusIcon;

	return (
		<div
			className={cn(
				"bg-card text-card-foreground relative overflow-hidden rounded-xl border shadow-sm",
				className,
			)}
			{...props}
		>
			<div className="flex items-start justify-between gap-4 p-5 pb-0">
				<div className="min-w-0 space-y-1">
					<p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
						{title}
					</p>
					<div className="text-2xl font-semibold tracking-tight">{value}</div>
				</div>
				{icon ? (
					<div className={cn("rounded-lg p-2", accentClasses[accent])}>
						{icon}
					</div>
				) : null}
			</div>
			<div className="flex items-end justify-between gap-3 p-5 pt-3">
				<div className="space-y-1.5">
					{hasDelta ? (
						<div
							className={cn(
								"flex items-center gap-1 text-xs font-medium",
								delta > 0 && "text-emerald-600 dark:text-emerald-400",
								delta < 0 && "text-rose-600 dark:text-rose-400",
								delta === 0 && "text-muted-foreground",
							)}
						>
							<DeltaIcon className="size-3.5" />
							<span>{Math.abs(delta).toFixed(1)}%</span>
							<span className="text-muted-foreground font-normal">
								{deltaLabel}
							</span>
						</div>
					) : null}
					{description ? (
						<p className="text-muted-foreground text-xs">{description}</p>
					) : null}
				</div>
				{trend ? (
					<Sparkline
						values={trend}
						className={cn(
							accent === "green" && "text-emerald-500",
							accent === "blue" && "text-blue-500",
							accent === "purple" && "text-violet-500",
							accent === "amber" && "text-amber-500",
						)}
					/>
				) : null}
			</div>
		</div>
	);
}
