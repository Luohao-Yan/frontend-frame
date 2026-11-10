"use client";

import { useUiAdapters } from "@frontend-frame/app-kit";

import { Button, cn } from "@frontend-frame/ui";

import type { ActionVariant } from "../contracts";

export interface ActionLinkProps {
	href: string;
	label: string;
	variant?: ActionVariant;
	size?: "default" | "sm" | "lg";
	className?: string;
	onNavigate?: (href: string) => void;
}

export function ActionLink({
	href,
	label,
	variant = "default",
	size = "default",
	className,
	onNavigate,
}: ActionLinkProps) {
	const { Link } = useUiAdapters();

	return (
		<Button asChild variant={variant} size={size} className={cn(className)}>
			<Link href={href} onClick={() => onNavigate?.(href)}>
				{label}
			</Link>
		</Button>
	);
}
