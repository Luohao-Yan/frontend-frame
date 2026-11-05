"use client";

import * as React from "react";

import { cn } from "../lib/utils";

export interface RulerProps {
	labels?: string[];
	/** marker 为 0–1 的当前位置（一根亮刻度） */
	marker?: number | null;
	markerLabel?: string;
	minor?: number;
	className?: string;
}

/**
 * 刻度尺：细刻度 + 主刻度标签，marker 为当前位置。
 * 刻度间距由 --ruler-major-pct / --ruler-minor-pct 传入（避免 calc 乘法兼容问题）。
 */
export function Ruler({
	labels = [],
	marker = null,
	markerLabel,
	minor = 4,
	className,
}: RulerProps) {
	const major = Math.max(labels.length - 1, 1);
	const clamped = marker === null ? null : Math.min(Math.max(marker, 0), 1);

	return (
		<div
			className={cn("ruler relative", className)}
			style={
				{
					"--ruler-major-pct": `${100 / major}%`,
					"--ruler-minor-pct": `${100 / (major * minor)}%`,
				} as React.CSSProperties
			}
			aria-hidden="true"
		>
			<div className="ruler-ticks" />
			<div className="ruler-labels">
				{labels.map((label, index) => (
					<span
						key={`${label}-${index}`}
						style={{ left: `${(index / major) * 100}%` }}
					>
						{label}
					</span>
				))}
			</div>
			{clamped !== null ? (
				<span className="ruler-marker" style={{ left: `${clamped * 100}%` }}>
					{markerLabel ? (
						<span className="ruler-marker-label tabular-nums">
							{markerLabel}
						</span>
					) : null}
				</span>
			) : null}
		</div>
	);
}
