"use client";

import * as React from "react";

import { cn } from "@frontend-frame/ui";

import type { HeroAction, HeroStat } from "../contracts";
import { ActionLink } from "./action-link";

export function HeroActions({
	actions,
	onNavigate,
	className,
}: {
	actions?: HeroAction[];
	onNavigate?: (href: string) => void;
	className?: string;
}) {
	if (!actions?.length) {
		return null;
	}

	return (
		<div className={cn("flex flex-wrap items-center gap-3", className)}>
			{actions.map((action) => (
				<ActionLink
					key={`${action.href}:${action.label}`}
					href={action.href}
					label={action.label}
					variant={action.variant}
					size="lg"
					onNavigate={onNavigate}
				/>
			))}
		</div>
	);
}

export function HeroStats({
	stats,
	className,
}: {
	stats?: HeroStat[];
	className?: string;
}) {
	if (!stats?.length) {
		return null;
	}

	return (
		<dl
			className={cn(
				"grid grid-cols-2 gap-6 border-t pt-6 sm:grid-cols-3",
				className,
			)}
		>
			{stats.map((stat) => (
				<div key={`${stat.value}:${stat.label}`}>
					<dt className="text-muted-foreground text-xs tracking-wide uppercase">
						{stat.label}
					</dt>
					<dd className="mt-1 text-2xl font-semibold tracking-tight">
						{stat.value}
					</dd>
				</div>
			))}
		</dl>
	);
}

export function HeroMedia({
	media,
	className,
}: {
	media?: React.ReactNode;
	className?: string;
}) {
	if (!media) {
		return null;
	}

	return (
		<div
			className={cn(
				"bg-muted/40 relative overflow-hidden rounded-3xl border p-2 shadow-xl",
				className,
			)}
		>
			<div className="bg-background overflow-hidden rounded-2xl">{media}</div>
		</div>
	);
}
