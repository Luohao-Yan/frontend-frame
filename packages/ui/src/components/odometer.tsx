"use client";

import * as React from "react";

import { cn } from "../lib/utils";

export interface OdometerProps {
	value: number | null | undefined;
	/** 小数位数（千分位分组按 `group`） */
	decimals?: number;
	group?: boolean;
	className?: string;
}

/**
 * 逐位滚动读数（结 Crystallize）：每一位是一条 0–9 的竖带，只有变化的位会滚。
 * 位次按「从右往左」编号作为 key，位数变化时个位、十位不会错位重排。
 * 首帧显示 0 再滚到目标值；后台标签页里 rAF 不触发，用定时器兜底。
 */
export function Odometer({
	value,
	decimals = 0,
	group = true,
	className,
}: OdometerProps) {
	const [mounted, setMounted] = React.useState(false);

	React.useEffect(() => {
		const settle = () => setMounted(true);
		if (document.hidden) {
			settle();
			return;
		}
		const raf = requestAnimationFrame(settle);
		const timer = window.setTimeout(settle, 120);
		return () => {
			cancelAnimationFrame(raf);
			window.clearTimeout(timer);
		};
	}, []);

	const text = React.useMemo(() => {
		if (value === null || value === undefined || Number.isNaN(value)) {
			return "—";
		}
		return Number(value).toLocaleString("en-US", {
			minimumFractionDigits: decimals,
			maximumFractionDigits: decimals,
			useGrouping: group,
		});
	}, [value, decimals, group]);

	const chars = React.useMemo(() => {
		const list = [...text];
		const dot = list.indexOf(".");
		return list.map((ch, index) => ({
			ch,
			key: list.length - index,
			digit: /\d/.test(ch) ? Number(ch) : null,
			fraction: dot !== -1 && index > dot,
		}));
	}, [text]);

	return (
		<span
			className={cn("odometer tabular-nums", className)}
			aria-label={text}
			role="img"
		>
			{chars.map((char) => (
				<span
					key={char.key}
					className={cn(
						"odo-cell",
						char.fraction && "is-fraction",
						char.digit === null && "is-sep",
					)}
					aria-hidden="true"
				>
					{char.digit !== null ? (
						<span
							className="odo-strip"
							style={{
								transform: `translateY(${-(mounted ? char.digit : 0) * 10}%)`,
								transitionDelay: `${(char.key % 6) * 40}ms`,
							}}
						>
							{Array.from({ length: 10 }, (_, digit) => (
								<span key={digit}>{digit}</span>
							))}
						</span>
					) : (
						char.ch
					)}
				</span>
			))}
		</span>
	);
}
