"use client";

import * as React from "react";

import { cn } from "../lib/utils";

export interface SpecPlateRow {
	label: string;
	value: string | number | null | undefined;
	tone?: "lime" | "red";
}

export interface SpecPlateProps {
	rows: SpecPlateRow[];
	title?: string;
	className?: string;
}

/**
 * 规格铭牌：深色玻璃小板，等宽键值行。只读读数，不带可点的样子。
 * 深色铭牌在浅 / 深两种主题下都是深色面（--plate-bg）。
 */
export function SpecPlate({ rows, title, className }: SpecPlateProps) {
	return (
		<dl
			className={cn("spec-plate rounded-xl p-4", className)}
			aria-label={title}
		>
			{title ? (
				<div className="mb-2 text-xs font-medium tracking-wide opacity-80">
					{title}
				</div>
			) : null}
			{rows.map((row) => (
				<div
					key={row.label}
					className="flex items-baseline justify-between gap-4 py-1"
				>
					<dt className="text-xs opacity-70">{row.label}</dt>
					<dd
						className="tabular-nums text-sm font-medium"
						style={
							row.tone === "lime"
								? { color: "var(--lime-text, #9be35a)" }
								: row.tone === "red"
									? { color: "var(--red-text, #ff7a71)" }
									: undefined
						}
					>
						{row.value ?? "—"}
					</dd>
				</div>
			))}
		</dl>
	);
}
