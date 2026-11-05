"use client";

import * as React from "react";

import { cn } from "../lib/utils";

export interface DeltaPillProps {
	value?: number | null | undefined;
	/** 显式方向；不传则按 value 正负判断 */
	up?: boolean | null;
	/** 上一周期为 0 时传 true，显示「新增」，不给出误导的 +100% */
	fresh?: boolean;
	suffix?: string;
	label?: string;
	className?: string;
}

const tones = {
	up: "text-emerald-600 dark:text-emerald-400",
	down: "text-rose-600 dark:text-rose-400",
	new: "text-foreground",
	flat: "text-muted-foreground",
} as const;

/**
 * 环比胶囊：上升青柠、下降红、持平中性；上一周期为 0（fresh）时显示「新增」中性态。
 */
export function DeltaPill({
	value,
	up = null,
	fresh = false,
	suffix = "%",
	label,
	className,
}: DeltaPillProps) {
	const dir = React.useMemo(() => {
		if (fresh) return "new";
		const v = Number(value ?? 0);
		if (!v) return "flat";
		if (up === null) return v > 0 ? "up" : "down";
		return up ? "up" : "down";
	}, [fresh, value, up]);

	const text = React.useMemo(() => {
		if (fresh) return "新增";
		const v = Math.abs(Number(value ?? 0));
		const sign = dir === "up" ? "+" : dir === "down" ? "−" : "±";
		return `${sign}${Number.isInteger(v) ? v : v.toFixed(1)}${suffix}`;
	}, [fresh, value, dir, suffix]);

	return (
		<span
			className={cn(
				"inline-flex items-center gap-1 text-xs font-medium",
				tones[dir],
				className,
			)}
			title={label}
		>
			<svg
				width="8"
				height="8"
				viewBox="0 0 8 8"
				aria-hidden="true"
				className="shrink-0"
			>
				{dir === "up" && <path d="M4 1.2 7 6H1z" fill="currentColor" />}
				{dir === "down" && <path d="M4 6.8 1 2h6z" fill="currentColor" />}
				{dir === "new" && <circle cx="4" cy="4" r="2.2" fill="currentColor" />}
				{dir === "flat" && (
					<rect
						x="1"
						y="3.3"
						width="6"
						height="1.4"
						rx=".7"
						fill="currentColor"
					/>
				)}
			</svg>
			<span className="tabular-nums">{text}</span>
			{label ? <span className="sr-only">{label}</span> : null}
		</span>
	);
}
