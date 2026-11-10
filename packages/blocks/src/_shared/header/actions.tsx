"use client";

import { useUiAdapters } from "@frontend-frame/app-kit";

import { Button, cn } from "@frontend-frame/ui";

import type { SiteHeaderProps } from "../../contracts";

export interface HeaderActionsProps extends Pick<
	SiteHeaderProps,
	"site" | "actions" | "onNavigate"
> {
	className?: string;
}

export function HeaderActions({
	site,
	actions,
	onNavigate,
	className,
}: HeaderActionsProps) {
	const { Link } = useUiAdapters();

	if (actions) {
		return (
			<div className={cn("flex items-center gap-2", className)}>{actions}</div>
		);
	}

	if (!site.actions?.length) {
		return null;
	}

	return (
		<div className={cn("flex items-center gap-2", className)}>
			{site.actions.map((action) => (
				<Button
					key={`${action.href}:${action.label}`}
					asChild
					size="sm"
					variant={action.variant ?? "default"}
				>
					<Link href={action.href} onClick={() => onNavigate?.(action.href)}>
						{action.label}
					</Link>
				</Button>
			))}
		</div>
	);
}
