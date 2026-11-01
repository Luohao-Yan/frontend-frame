"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 共享计时 hook（可冻结）。
 *
 * active=true 时每 100ms 递增，用于「思考中…」跳动计时；
 * active=false 时返回冻结终值，用于「思考了 Ns」停表展示。
 *
 * 格式：<60s 显示 X.X秒，>=60s 显示 X分 Y.Y秒。
 *
 * @origin Apache-2.0 / fde-workspace (src/lib/use-elapsed.ts)
 */

function formatDuration(seconds: number): string {
	if (seconds < 60) return `${seconds.toFixed(1)}秒`;
	const m = Math.floor(seconds / 60);
	const s = seconds % 60;
	return `${m}分${s.toFixed(1)}秒`;
}

export function useElapsed(
	active: boolean,
	startedAt?: number,
): { label: string; seconds: number } {
	const [seconds, setSeconds] = useState(0);
	const frozenRef = useRef<number | null>(null);

	useEffect(() => {
		// 首次进入或切换到 active：重置起点
		if (active) {
			frozenRef.current = null;
			setSeconds(0);
			const base = startedAt ?? Date.now();
			const tick = () => setSeconds((Date.now() - base) / 1000);
			tick();
			const timer = setInterval(tick, 100);
			return () => clearInterval(timer);
		}
		// 非 active：冻结当前终值（保留上次 active 结束时的读数）
		if (frozenRef.current === null) {
			frozenRef.current = seconds;
		}
		return undefined;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [active, startedAt]);

	const effective = active ? seconds : (frozenRef.current ?? seconds);
	return { label: formatDuration(effective), seconds: effective };
}
