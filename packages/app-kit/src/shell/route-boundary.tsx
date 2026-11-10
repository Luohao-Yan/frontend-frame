"use client";

import * as React from "react";

import { Button, Skeleton, cn } from "@frontend-frame/ui";

export type RouteBoundaryVariant = "error" | "not-found" | "empty" | "loading";

const defaults: Record<
	Exclude<RouteBoundaryVariant, "loading">,
	{ title: string; description: string; code?: string }
> = {
	error: {
		title: "页面出错了",
		description: "请求没有完成，请稍后重试。如果问题持续出现，请联系管理员。",
		code: "ERROR",
	},
	"not-found": {
		title: "页面不存在",
		description: "你访问的页面可能已被移动或删除。",
		code: "404",
	},
	empty: {
		title: "暂无内容",
		description: "当前条件下没有可展示的数据。",
	},
};

export interface RouteBoundaryProps {
	variant?: RouteBoundaryVariant;
	title?: string;
	description?: string;
	code?: string;
	action?: React.ReactNode;
	onRetry?: () => void;
	retryLabel?: string;
	className?: string;
}

export function RouteBoundary({
	variant = "error",
	title,
	description,
	code,
	action,
	onRetry,
	retryLabel = "重试",
	className,
}: RouteBoundaryProps) {
	if (variant === "loading") {
		return (
			<div
				className={cn("space-y-6", className)}
				aria-busy="true"
				aria-live="polite"
			>
				<span className="sr-only">正在加载</span>
				<div className="space-y-2">
					<Skeleton className="h-4 w-24" />
					<Skeleton className="h-9 w-72 max-w-full" />
					<Skeleton className="h-4 w-full max-w-xl" />
				</div>
				<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
					{Array.from({ length: 4 }).map((_, index) => (
						<Skeleton key={index} className="h-32 rounded-xl" />
					))}
				</div>
				<Skeleton className="h-80 rounded-xl" />
			</div>
		);
	}

	const config = defaults[variant];
	const resolvedCode = code ?? config.code;

	return (
		<div
			className={cn(
				"flex min-h-[60vh] flex-col items-center justify-center px-6 text-center",
				className,
			)}
			role={variant === "error" ? "alert" : undefined}
		>
			{resolvedCode ? (
				<span className="text-muted-foreground font-mono text-xs font-medium tracking-[0.18em]">
					{resolvedCode}
				</span>
			) : null}
			<h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
				{title ?? config.title}
			</h1>
			<p className="text-muted-foreground mt-2 max-w-md text-sm leading-6">
				{description ?? config.description}
			</p>
			{action || onRetry ? (
				<div className="mt-6 flex flex-wrap items-center justify-center gap-2">
					{action}
					{onRetry ? <Button onClick={onRetry}>{retryLabel}</Button> : null}
				</div>
			) : null}
		</div>
	);
}
