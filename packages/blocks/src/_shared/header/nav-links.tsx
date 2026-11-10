"use client";

import { useUiAdapters } from "@frontend-frame/app-kit";
import { ChevronDownIcon } from "lucide-react";

import {
	cn,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@frontend-frame/ui";

import type { SiteHeaderProps } from "../../contracts";
import { isActivePath, useCurrentPath } from "./use-current-path";

export interface HeaderNavLinksProps extends Pick<
	SiteHeaderProps,
	"site" | "activePath" | "onNavigate"
> {
	className?: string;
}

export function HeaderNavLinks({
	site,
	activePath,
	onNavigate,
	className,
}: HeaderNavLinksProps) {
	const { Link } = useUiAdapters();
	const currentPath = useCurrentPath(activePath);

	return (
		<nav
			aria-label="主导航"
			className={cn("shrink-0 items-center gap-1", className)}
		>
			{site.nav.map((item) => {
				const active = item.children?.length
					? item.children.some((child) => isActivePath(currentPath, child.href))
					: isActivePath(currentPath, item.href);

				if (item.children?.length) {
					return (
						<DropdownMenu key={item.href}>
							<DropdownMenuTrigger asChild>
								<button
									type="button"
									className={cn(
										"text-muted-foreground hover:text-foreground inline-flex h-9 shrink-0 items-center gap-1 rounded-md px-3 text-sm font-medium whitespace-nowrap transition-colors",
										active && "text-foreground",
									)}
								>
									{item.label}
									<ChevronDownIcon className="size-3.5" aria-hidden="true" />
								</button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="start" className="w-64">
								{item.children.map((child) => (
									<DropdownMenuItem key={child.href} asChild>
										<Link
											href={child.href}
											onClick={() => onNavigate?.(child.href)}
											className="flex w-full flex-col items-start gap-0.5"
										>
											<span className="text-sm font-medium">{child.label}</span>
											{child.description ? (
												<span className="text-muted-foreground text-xs">
													{child.description}
												</span>
											) : null}
										</Link>
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
					);
				}

				return (
					<Link
						key={item.href}
						href={item.href}
						aria-current={active ? "page" : undefined}
						onClick={() => onNavigate?.(item.href)}
						className={cn(
							"text-muted-foreground hover:text-foreground inline-flex h-9 shrink-0 items-center rounded-md px-3 text-sm font-medium whitespace-nowrap transition-colors",
							active && "text-foreground",
						)}
					>
						{item.label}
					</Link>
				);
			})}
		</nav>
	);
}
