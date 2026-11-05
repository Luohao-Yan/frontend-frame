"use client";

import * as React from "react";

import { cn } from "../lib/utils";

import { Odometer } from "./odometer";

export interface MetricProps {
	value: number | null | undefined;
	unit?: string;
	decimals?: number;
	/** size 对应 --fs-display-xl / l / m 三档（s 为 24px 兜底） */
	size?: "xl" | "l" | "m" | "s";
	label?: string;
	className?: string;
	children?: React.ReactNode;
}

/**
 * 显示级读数：等宽大数字 + 上标单位。等宽字体只留给数字与编码，不做装饰。
 */
export function Metric({
	value,
	unit,
	decimals = 0,
	size = "m",
	label,
	className,
	children,
}: MetricProps) {
	return (
		<div className={cn("metric flex flex-col gap-1", className)}>
			{label ? (
				<span className="metric-label text-muted-foreground text-xs font-medium uppercase tracking-[var(--track-eyebrow,0.08em)]">
					{label}
				</span>
			) : null}
			<span
				className={cn(
					"metric-figure flex items-baseline gap-1 font-semibold tracking-tight",
					`metric-${size}`,
				)}
			>
				<Odometer value={value} decimals={decimals} />
				{unit ? (
					<sup className="metric-unit text-xs font-medium text-muted-foreground">
						{unit}
					</sup>
				) : null}
			</span>
			{children}
		</div>
	);
}
