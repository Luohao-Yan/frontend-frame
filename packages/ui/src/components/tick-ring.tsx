"use client";

import * as React from "react";

import { animate, EASE, motionSkipped } from "../lib/motion";
import { cn } from "../lib/utils";

import { Odometer } from "./odometer";

export interface TickRingProps {
	value: number | null | undefined;
	/** 中心读数；不传则跟随 value */
	display?: number;
	unit?: string;
	label?: string;
	size?: number;
	ticks?: number;
	decimals?: number;
	className?: string;
}

/**
 * 刻度环：60 根径向刻度按顺时针逐根点亮（导 Conduct），
 * 点亮到位后末端刻度一次 back.out 过冲（结 Crystallize），中心读数逐位滚动。
 */
export function TickRing({
	value,
	display,
	unit = "%",
	label,
	size = 168,
	ticks = 60,
	decimals = 1,
	className,
}: TickRingProps) {
	const pct = React.useMemo(
		() => Math.min(100, Math.max(0, Number(value ?? 0))),
		[value],
	);
	const lit = Math.round((pct / 100) * ticks);

	const marks = React.useMemo(
		() =>
			Array.from({ length: ticks }, (_, index) => {
				const angle = (index / ticks) * Math.PI * 2 - Math.PI / 2;
				const major = index % 5 === 0;
				const inner = major ? 0.37 : 0.4;
				return {
					x1: 0.5 + Math.cos(angle) * inner,
					y1: 0.5 + Math.sin(angle) * inner,
					x2: 0.5 + Math.cos(angle) * 0.48,
					y2: 0.5 + Math.sin(angle) * 0.48,
					on: index < lit,
					major,
				};
			}),
		[ticks, lit],
	);

	const cap = React.useMemo(() => {
		if (!lit) return null;
		const angle = ((lit - 0.5) / ticks) * Math.PI * 2 - Math.PI / 2;
		return { x: 0.5 + Math.cos(angle) * 0.53, y: 0.5 + Math.sin(angle) * 0.53 };
	}, [lit, ticks]);

	const rootRef = React.useRef<SVGSVGElement | null>(null);
	const playedRef = React.useRef(false);

	React.useEffect(() => {
		if (playedRef.current || motionSkipped()) return;
		playedRef.current = true;
		const root = rootRef.current;
		if (!root) return;
		const litTicks = Array.from(
			root.querySelectorAll<SVGLineElement>(".ring-tick.is-on"),
		);
		litTicks.forEach((tick) => {
			tick.style.opacity = "0.15";
		});
		litTicks.forEach((tick, index) => {
			animate(
				tick,
				{ opacity: [0.15, 1] },
				{
					duration: 0.28,
					ease: [0.55, 0.06, 0.68, 0.19],
					delay: index * 0.014,
					onComplete: () => {
						tick.style.opacity = "";
					},
				},
			);
		});
		const capEl = root.querySelector<SVGCircleElement>(".ring-cap");
		if (capEl) {
			animate(
				capEl,
				{ scale: [0.2, 1], transformOrigin: "50% 50%" },
				{
					duration: 0.5,
					ease: EASE.settle,
					delay: litTicks.length * 0.014,
					onComplete: () => {
						capEl.style.transform = "";
					},
				},
			);
		}
	}, []);

	return (
		<div
			className={cn("tick-ring relative", className)}
			style={{ width: size, height: size }}
		>
			<svg
				ref={rootRef}
				viewBox="0 0 1 1"
				width={size}
				height={size}
				role="img"
				aria-label={`${label ?? ""} ${pct}%`}
			>
				{marks.map((mark, index) => (
					<line
						key={index}
						className={cn(
							"ring-tick",
							mark.on && "is-on",
							mark.major && "is-major",
						)}
						x1={mark.x1}
						y1={mark.y1}
						x2={mark.x2}
						y2={mark.y2}
					/>
				))}
				{cap ? (
					<circle className="ring-cap" cx={cap.x} cy={cap.y} r="0.022" />
				) : null}
			</svg>
			<div className="tick-ring-center">
				<span className="flex items-baseline gap-0.5 text-2xl font-semibold tabular-nums">
					<Odometer value={display ?? value} decimals={decimals} />
					{unit ? (
						<sup className="text-muted-foreground text-xs">{unit}</sup>
					) : null}
				</span>
				{label ? (
					<span className="text-muted-foreground mt-0.5 text-xs">{label}</span>
				) : null}
			</div>
		</div>
	);
}
