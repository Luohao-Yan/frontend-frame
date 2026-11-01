// @origin Apache-2.0 / fde-workspace (components/ui/loading.tsx)
import { cn } from "../lib/utils";

interface LoadingProps {
	/** 容器 className */
	className?: string;
	/** 是否内联（不铺满居中，随内容流动） */
	inline?: boolean;
	/**
	 * 双方块颜色（Tailwind 语义色类，如 text-primary / text-foreground）。
	 * 默认 text-primary，随当前激活主题自动适配。
	 */
	color?: string;
}

export function Loading({
	className,
	inline,
	color = "text-primary",
}: LoadingProps) {
	return (
		<div
			role="status"
			aria-live="polite"
			className={cn(
				!inline && "flex flex-1 flex-col items-center justify-center gap-3 p-6",
				inline && "inline-flex items-center gap-2.5",
				className,
			)}
		>
			<span aria-hidden className={cn("loading-bounce", color)} />
		</div>
	);
}
