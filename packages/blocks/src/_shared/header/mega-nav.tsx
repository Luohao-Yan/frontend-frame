"use client";

import { useUiAdapters } from "@frontend-frame/app-kit";

import {
	cn,
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@frontend-frame/ui";

import type { SiteHeaderProps } from "../../contracts";
import { isActivePath, useCurrentPath } from "./use-current-path";

export interface MegaNavProps extends Pick<
	SiteHeaderProps,
	"site" | "activePath" | "onNavigate"
> {
	className?: string;
}

export function MegaNav({
	site,
	activePath,
	onNavigate,
	className,
}: MegaNavProps) {
	const { Link } = useUiAdapters();
	const currentPath = useCurrentPath(activePath);

	return (
		<NavigationMenu
			aria-label="主导航"
			className={cn("max-w-none flex-1 justify-center", className)}
		>
			<NavigationMenuList className="gap-1">
				{site.nav.map((item) => {
					const active = isActivePath(currentPath, item.href);

					if (item.children?.length) {
						return (
							<NavigationMenuItem key={item.href}>
								<NavigationMenuTrigger className="bg-transparent">
									{item.label}
								</NavigationMenuTrigger>
								<NavigationMenuContent>
									<ul className="grid w-[640px] grid-cols-2 gap-1 p-3">
										{item.children.map((child) => (
											<li key={child.href}>
												<NavigationMenuLink asChild>
													<Link
														href={child.href}
														onClick={() => onNavigate?.(child.href)}
														className="hover:bg-accent focus:bg-accent block rounded-md p-3 transition-colors"
													>
														<span className="block text-sm font-medium">
															{child.label}
														</span>
														{child.description ? (
															<span className="text-muted-foreground mt-1 block text-xs">
																{child.description}
															</span>
														) : null}
													</Link>
												</NavigationMenuLink>
											</li>
										))}
									</ul>
								</NavigationMenuContent>
							</NavigationMenuItem>
						);
					}

					return (
						<NavigationMenuItem key={item.href}>
							<NavigationMenuLink asChild>
								<Link
									href={item.href}
									aria-current={active ? "page" : undefined}
									onClick={() => onNavigate?.(item.href)}
									className={cn(
										"text-muted-foreground hover:text-foreground inline-flex h-9 items-center rounded-md px-3 text-sm font-medium transition-colors",
										active && "text-foreground",
									)}
								>
									{item.label}
								</Link>
							</NavigationMenuLink>
						</NavigationMenuItem>
					);
				})}
			</NavigationMenuList>
		</NavigationMenu>
	);
}
