"use client";

import { useUiAdapters } from "@frontend-frame/app-kit";
import { ChevronDownIcon, MenuIcon, XIcon } from "lucide-react";
import * as React from "react";
import { createPortal } from "react-dom";

import {
	Button,
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
	cn,
} from "@frontend-frame/ui";

import type { SiteHeaderProps } from "../../contracts";
import { isActivePath, useCurrentPath } from "./use-current-path";
import { HeaderWordmark } from "./wordmark";

export interface HeaderMobileMenuProps extends SiteHeaderProps {
	triggerClassName?: string;
	logoClassName?: string;
}

export function HeaderMobileMenu({
	site,
	activePath,
	actions,
	themeToggle,
	onNavigate,
	triggerClassName,
	logoClassName,
}: HeaderMobileMenuProps) {
	const [open, setOpen] = React.useState(false);
	const closeRef = React.useRef<HTMLButtonElement>(null);
	const { Link } = useUiAdapters();
	const currentPath = useCurrentPath(activePath);

	const go = React.useCallback(
		(href: string) => {
			setOpen(false);
			onNavigate?.(href);
		},
		[onNavigate],
	);

	React.useEffect(() => {
		if (!open) {
			return;
		}

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		closeRef.current?.focus();

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setOpen(false);
			}
		};

		document.addEventListener("keydown", onKeyDown);
		return () => {
			document.body.style.overflow = previousOverflow;
			document.removeEventListener("keydown", onKeyDown);
		};
	}, [open]);

	return (
		<>
			<Button
				variant="ghost"
				size="icon"
				className={cn("lg:hidden", triggerClassName)}
				aria-label="打开菜单"
				aria-expanded={open}
				aria-controls="frontend-frame-mobile-nav"
				onClick={() => setOpen(true)}
			>
				<MenuIcon className="size-5" />
			</Button>

			{open && typeof document !== "undefined"
				? createPortal(
						<div className="fixed inset-0 z-50 lg:hidden">
							<button
								type="button"
								aria-label="关闭菜单"
								className="absolute inset-0 bg-black/50"
								onClick={() => setOpen(false)}
							/>

							<div
								id="frontend-frame-mobile-nav"
								role="dialog"
								aria-modal="true"
								aria-label="站点导航"
								className="bg-background absolute inset-y-0 right-0 flex w-[min(92vw,380px)] flex-col border-l shadow-2xl"
							>
								<div className="flex items-center justify-between gap-3 border-b p-4">
									<HeaderWordmark
										site={site}
										onNavigate={go}
										logoClassName={logoClassName}
									/>
									<Button
										ref={closeRef}
										variant="ghost"
										size="icon"
										aria-label="关闭导航菜单"
										onClick={() => setOpen(false)}
									>
										<XIcon className="size-4" />
									</Button>
								</div>

								<nav
									aria-label="移动端导航"
									className="flex-1 overflow-y-auto px-4 py-3"
								>
									<ul className="flex flex-col gap-1">
										{site.nav.map((item) => {
											const active = isActivePath(currentPath, item.href);

											if (item.children?.length) {
												return (
													<li key={item.href}>
														<Collapsible>
															<CollapsibleTrigger asChild>
																<button
																	type="button"
																	className={cn(
																		"text-muted-foreground hover:bg-accent hover:text-accent-foreground flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
																		active && "text-foreground",
																	)}
																>
																	{item.label}
																	<ChevronDownIcon
																		className="size-4"
																		aria-hidden="true"
																	/>
																</button>
															</CollapsibleTrigger>
															<CollapsibleContent>
																<ul className="border-border mt-1 flex flex-col gap-1 border-l pl-3">
																	{item.children.map((child) => (
																		<li key={child.href}>
																			<Link
																				href={child.href}
																				onClick={() => go(child.href)}
																				className="text-muted-foreground hover:text-foreground block rounded-md px-3 py-2 text-sm"
																			>
																				{child.label}
																			</Link>
																		</li>
																	))}
																</ul>
															</CollapsibleContent>
														</Collapsible>
													</li>
												);
											}

											return (
												<li key={item.href}>
													<Link
														href={item.href}
														aria-current={active ? "page" : undefined}
														onClick={() => go(item.href)}
														className={cn(
															"text-muted-foreground hover:bg-accent hover:text-accent-foreground block rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
															active && "text-foreground",
														)}
													>
														{item.label}
													</Link>
												</li>
											);
										})}
									</ul>
								</nav>

								<div className="border-t p-4">
									{themeToggle ? (
										<div className="mb-3 flex justify-end">{themeToggle}</div>
									) : null}
									{actions ? (
										<div className="mb-3">{actions}</div>
									) : site.actions?.length ? (
										<div className="flex flex-col gap-2">
											{site.actions.map((action) => (
												<Button
													key={`${action.href}:${action.label}`}
													asChild
													className="w-full"
													variant={action.variant ?? "default"}
												>
													<Link
														href={action.href}
														onClick={() => go(action.href)}
													>
														{action.label}
													</Link>
												</Button>
											))}
										</div>
									) : null}
								</div>
							</div>
						</div>,
						document.body,
					)
				: null}
		</>
	);
}
