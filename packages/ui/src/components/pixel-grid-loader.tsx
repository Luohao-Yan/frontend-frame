// @origin Apache-2.0 / fde-workspace (components/ui/pixel-grid-loader.tsx)
import { useEffect, useState } from "react";

// 3×3 网格，chevron 波前：列 + |行-1| 驱动从左上到右下的波浪
const chevron = Array.from({ length: 9 }, (_, i) => {
	const r = Math.floor(i / 3);
	const c = i % 3;
	return (c + Math.abs(r - 1)) * 90;
});

const DUR = 650;

function LoaderGrid() {
	return (
		<span
			aria-hidden
			className="grid shrink-0 grid-cols-[repeat(3,4px)] gap-[1.5px]"
		>
			{chevron.map((delay, index) => (
				<span
					key={index}
					className="size-[4px] rounded-[1px] bg-foreground"
					style={{
						opacity: 0.15,
						animation: `pixel-on ${DUR}ms ease-in-out ${delay}ms infinite`,
					}}
				/>
			))}
		</span>
	);
}

function useElapsed() {
	const [ds, setDs] = useState(0);
	useEffect(() => {
		const t = setInterval(() => setDs((d) => d + 1), 100);
		return () => clearInterval(t);
	}, []);
	const total = ds / 10;
	if (total < 60) return `${total.toFixed(1)}s`;
	return `${Math.floor(total / 60)}m ${(total % 60).toFixed(1)}s`;
}

/**
 * 流式思考态加载器：9 格点阵波浪 + shimmer 文字 + 计时器。
 * @param label 状态文字（默认「正在思考」）
 */
export function PixelGridLoader({ label = "正在思考" }: { label?: string }) {
	const elapsed = useElapsed();
	return (
		<div role="status" className="flex w-fit items-center gap-2.5">
			<LoaderGrid />
			<span
				className="bg-clip-text text-[12px] font-medium text-transparent"
				style={{
					backgroundImage:
						"linear-gradient(90deg, var(--muted-foreground) 35%, var(--foreground) 50%, var(--muted-foreground) 65%)",
					backgroundSize: "200% 100%",
					animation: "shimmer-text 1.4s linear infinite",
				}}
			>
				{label}
			</span>
			<span className="font-mono text-[11px] tabular-nums text-muted-foreground">
				{elapsed}
			</span>
		</div>
	);
}
