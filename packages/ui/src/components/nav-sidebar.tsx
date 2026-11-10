"use client";

// @origin llm-gateway v2 (internal) - nav-sidebar
import {
	ChevronRightIcon,
	PanelLeftCloseIcon,
	PanelLeftOpenIcon,
	SearchIcon,
	XIcon,
} from "lucide-react";
import * as React from "react";

import { cn } from "../lib/utils";
import { Button } from "./button";
import { Input } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "./tooltip";

export interface NavSidebarItem {
	id?: string;
	label: string;
	href: string;
	icon?: React.ElementType;
	badge?: React.ReactNode;
	keywords?: string;
	disabled?: boolean;
	children?: NavSidebarItem[];
}

export interface NavSidebarGroup {
	id: string;
	label: string;
	icon?: React.ElementType;
	items: NavSidebarItem[];
}

export interface NavSidebarLinkProps extends Omit<
	React.ComponentProps<"a">,
	"href"
> {
	href: string;
}

export type NavSidebarLinkComponent = React.ComponentType<NavSidebarLinkProps>;

interface NavSidebarSlotState {
	collapsed: boolean;
}

type NavSidebarSlot =
	React.ReactNode | ((state: NavSidebarSlotState) => React.ReactNode);

export interface NavSidebarProps extends Omit<
	React.ComponentProps<"aside">,
	"children"
> {
	groups: NavSidebarGroup[];
	activePath: string;
	brand?: NavSidebarSlot;
	footer?: NavSidebarSlot;
	headerActions?: React.ReactNode;
	linkComponent?: React.ElementType<NavSidebarLinkProps>;
	onNavigate?: (item: NavSidebarItem) => void;
	collapsed?: boolean;
	defaultCollapsed?: boolean;
	onCollapsedChange?: (collapsed: boolean) => void;
	mobileOpen?: boolean;
	defaultMobileOpen?: boolean;
	onMobileOpenChange?: (open: boolean) => void;
	width?: number | string;
	collapsedWidth?: number | string;
	searchPlaceholder?: string;
	emptyMessage?: string;
	showSearch?: boolean;
	showCollapseButton?: boolean;
	showMobileClose?: boolean;
	/** 是否渲染桌面侧栏；false 时仅保留移动端抽屉。 */
	desktop?: boolean;
	/** 是否填满父容器高度；适合 fixed app shell。 */
	fill?: boolean;
	expandLabel?: string;
	collapseLabel?: string;
	closeLabel?: string;
	storageKey?: string;
	contentClassName?: string;
}

function renderSlot(slot: NavSidebarSlot, state: NavSidebarSlotState) {
	return typeof slot === "function" ? slot(state) : slot;
}

export function isNavPathActive(pathname: string, href: string) {
	if (href === "/") {
		return pathname === "/";
	}
	return pathname === href || pathname.startsWith(`${href}/`);
}

function flattenItems(
	items: NavSidebarItem[],
	ancestors: string[] = [],
): NavSidebarItem[] {
	return items.flatMap((item) => {
		const trail = [...ancestors, item.label];
		if (item.children?.length) {
			return flattenItems(item.children, trail);
		}
		return [
			{
				...item,
				keywords: [item.keywords, ...trail].filter(Boolean).join(" "),
			},
		];
	});
}

function matchesQuery(item: NavSidebarItem, query: string) {
	const haystack = [item.label, item.href, item.keywords]
		.filter(Boolean)
		.join(" ")
		.toLowerCase();
	return haystack.includes(query);
}

function useControllableState<T>({
	value,
	defaultValue,
	onChange,
}: {
	value: T | undefined;
	defaultValue: T;
	onChange?: (value: T) => void;
}) {
	const [internalValue, setInternalValue] = React.useState(defaultValue);
	const resolvedValue = value ?? internalValue;

	const setValue = React.useCallback(
		(nextValue: T) => {
			if (value === undefined) {
				setInternalValue(nextValue);
			}
			onChange?.(nextValue);
		},
		[onChange, value],
	);

	return [resolvedValue, setValue] as const;
}

function NavSidebarLink({
	item,
	activePath,
	collapsed,
	linkComponent: LinkComponent = "a",
	onNavigate,
}: {
	item: NavSidebarItem;
	activePath: string;
	collapsed: boolean;
	linkComponent?: React.ElementType<NavSidebarLinkProps>;
	onNavigate?: (item: NavSidebarItem) => void;
}) {
	const isActive = isNavPathActive(activePath, item.href);
	const Icon = item.icon;

	const link = (
		<LinkComponent
			href={item.href}
			onClick={() => onNavigate?.(item)}
			aria-current={isActive ? "page" : undefined}
			aria-disabled={item.disabled || undefined}
			data-active={isActive || undefined}
			className={cn(
				"group text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex h-8 items-center gap-2.5 rounded-md px-2.5 text-[13px] transition-colors",
				collapsed && "mx-auto h-9 w-9 justify-center px-0",
				isActive &&
					(collapsed
						? "bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary font-medium"
						: "bg-background text-sidebar-foreground shadow-sm hover:bg-background dark:bg-white/10 dark:hover:bg-white/10 font-medium"),
				item.disabled && "pointer-events-none opacity-50",
			)}
		>
			{Icon ? (
				<Icon className={cn("size-4 shrink-0", isActive && "text-primary")} />
			) : null}
			{!collapsed ? <span className="truncate">{item.label}</span> : null}
			{!collapsed && item.badge ? (
				<span className="ml-auto shrink-0">{item.badge}</span>
			) : null}
		</LinkComponent>
	);

	if (!collapsed) {
		return link;
	}

	return (
		<Tooltip>
			<TooltipTrigger asChild>{link}</TooltipTrigger>
			<TooltipContent side="right" sideOffset={8}>
				{item.label}
			</TooltipContent>
		</Tooltip>
	);
}

function NavSidebarNavList({
	items,
	activePath,
	collapsed,
	linkComponent,
	onNavigate,
}: {
	items: NavSidebarItem[];
	activePath: string;
	collapsed: boolean;
	linkComponent?: React.ElementType<NavSidebarLinkProps>;
	onNavigate?: (item: NavSidebarItem) => void;
}) {
	return (
		<nav className="space-y-0.5" aria-label="主导航">
			{items.map((item) => (
				<NavSidebarLink
					key={item.id ?? item.href}
					item={item}
					activePath={activePath}
					collapsed={collapsed}
					linkComponent={linkComponent}
					onNavigate={onNavigate}
				/>
			))}
		</nav>
	);
}

export function NavSidebar({
	groups,
	activePath,
	brand,
	footer,
	headerActions,
	linkComponent,
	onNavigate,
	collapsed: collapsedProp,
	defaultCollapsed = false,
	onCollapsedChange,
	mobileOpen: mobileOpenProp,
	defaultMobileOpen = false,
	onMobileOpenChange,
	width = 264,
	collapsedWidth = 72,
	searchPlaceholder = "搜索菜单...",
	emptyMessage = "没有匹配的菜单",
	showSearch = true,
	showCollapseButton = true,
	showMobileClose = true,
	desktop = true,
	fill = false,
	expandLabel = "展开侧边栏",
	collapseLabel = "折叠侧边栏",
	closeLabel = "关闭菜单",
	storageKey,
	className,
	contentClassName,
	...props
}: NavSidebarProps) {
	const [collapsed, setCollapsed] = useControllableState({
		value: collapsedProp,
		defaultValue: React.useMemo(() => {
			if (typeof window === "undefined" || !storageKey) {
				return defaultCollapsed;
			}
			const stored = window.localStorage.getItem(storageKey);
			return stored === null ? defaultCollapsed : stored === "true";
		}, [defaultCollapsed, storageKey]),
		onChange: onCollapsedChange,
	});
	const [mobileOpen, setMobileOpen] = useControllableState({
		value: mobileOpenProp,
		defaultValue: defaultMobileOpen,
		onChange: onMobileOpenChange,
	});
	const [query, setQuery] = React.useState("");
	const [openGroups, setOpenGroups] = React.useState<Set<string>>(new Set());
	const [collapsedMenu, setCollapsedMenu] = React.useState<string | null>(null);
	const searchRef = React.useRef<HTMLInputElement>(null);
	const menuOpenTimer = React.useRef<ReturnType<typeof setTimeout> | null>(
		null,
	);
	const menuCloseTimer = React.useRef<ReturnType<typeof setTimeout> | null>(
		null,
	);
	const normalizedQuery = query.trim().toLowerCase();

	const sidebarGroups = React.useMemo(() => {
		return groups
			.map((group) => ({
				...group,
				items: flattenItems(group.items),
			}))
			.map((group) => ({
				...group,
				items: normalizedQuery
					? group.items.filter((item) => matchesQuery(item, normalizedQuery))
					: group.items,
			}))
			.filter((group) => group.items.length > 0);
	}, [groups, normalizedQuery]);

	const activeGroupId = sidebarGroups.find((group) =>
		group.items.some((item) => isNavPathActive(activePath, item.href)),
	)?.id;

	React.useEffect(() => {
		if (!activeGroupId) {
			return;
		}
		setOpenGroups((current) => {
			if (current.has(activeGroupId)) {
				return current;
			}
			const next = new Set(current);
			next.add(activeGroupId);
			return next;
		});
	}, [activeGroupId]);

	React.useEffect(() => {
		setCollapsedMenu(null);
	}, [collapsed, activePath]);

	React.useEffect(() => {
		if (collapsed || !showSearch) {
			return;
		}
		const handleKeyDown = (event: KeyboardEvent) => {
			const target = event.target as HTMLElement | null;
			const isTyping =
				target?.tagName === "INPUT" ||
				target?.tagName === "TEXTAREA" ||
				target?.tagName === "SELECT" ||
				target?.isContentEditable;
			if (event.key === "/" && !isTyping) {
				event.preventDefault();
				searchRef.current?.focus();
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [collapsed, showSearch]);

	React.useEffect(
		() => () => {
			if (menuOpenTimer.current) {
				clearTimeout(menuOpenTimer.current);
			}
			if (menuCloseTimer.current) {
				clearTimeout(menuCloseTimer.current);
			}
		},
		[],
	);

	const updateCollapsed = (nextCollapsed: boolean) => {
		setCollapsed(nextCollapsed);
		if (storageKey && typeof window !== "undefined") {
			window.localStorage.setItem(storageKey, String(nextCollapsed));
		}
	};

	const handleNavigate = (item: NavSidebarItem) => {
		setCollapsedMenu(null);
		setMobileOpen(false);
		onNavigate?.(item);
	};

	const openCollapsedMenu = (groupId: string) => {
		if (menuCloseTimer.current) {
			clearTimeout(menuCloseTimer.current);
			menuCloseTimer.current = null;
		}
		if (menuOpenTimer.current) {
			clearTimeout(menuOpenTimer.current);
		}
		menuOpenTimer.current = setTimeout(() => setCollapsedMenu(groupId), 120);
	};

	const cancelCollapsedMenuClose = () => {
		if (menuCloseTimer.current) {
			clearTimeout(menuCloseTimer.current);
			menuCloseTimer.current = null;
		}
	};

	const closeCollapsedMenu = (groupId: string) => {
		if (menuOpenTimer.current) {
			clearTimeout(menuOpenTimer.current);
			menuOpenTimer.current = null;
		}
		if (menuCloseTimer.current) {
			clearTimeout(menuCloseTimer.current);
		}
		menuCloseTimer.current = setTimeout(() => {
			setCollapsedMenu((current) => (current === groupId ? null : current));
		}, 180);
	};

	const toggleGroup = (groupId: string) => {
		if (normalizedQuery) {
			setQuery("");
			setOpenGroups(new Set([groupId]));
			return;
		}
		setOpenGroups((current) => {
			const next = new Set(current);
			if (next.has(groupId)) {
				next.delete(groupId);
			} else {
				next.add(groupId);
			}
			return next;
		});
	};

	const renderContent = (isCollapsed: boolean) => (
		<div
			className={cn(
				"border-sidebar-border bg-sidebar flex h-full flex-col overflow-hidden rounded-xl border shadow-sm",
				contentClassName,
			)}
		>
			<div
				className={cn(
					"border-sidebar-border/70 flex shrink-0 items-center gap-2 border-b px-2.5",
					isCollapsed ? "h-auto flex-col py-2.5" : "h-14",
				)}
			>
				<div
					className={cn(
						"min-w-0",
						isCollapsed ? "flex justify-center" : "flex-1",
					)}
				>
					{renderSlot(brand, { collapsed: isCollapsed })}
				</div>
				{headerActions}
				{showMobileClose ? (
					<Button
						variant="ghost"
						size="icon"
						className="size-7 lg:hidden"
						onClick={() => setMobileOpen(false)}
						aria-label={closeLabel}
					>
						<XIcon className="size-4" />
					</Button>
				) : null}
			</div>

			{!isCollapsed && showSearch ? (
				<div className="relative shrink-0 px-2.5 pt-2.5">
					<div className="relative">
						<SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-2 size-3.5 -translate-y-1/2" />
						<Input
							ref={searchRef}
							value={query}
							onChange={(event) => setQuery(event.target.value)}
							onKeyDown={(event) => {
								if (event.key === "Escape") {
									setQuery("");
								}
							}}
							placeholder={searchPlaceholder}
							aria-label={searchPlaceholder}
							className="border-sidebar-border bg-background/70 h-8 rounded-lg pr-8 pl-8 text-xs shadow-none"
						/>
						{!query ? (
							<kbd className="border-border bg-muted text-muted-foreground pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 rounded border px-1.5 font-mono text-[10px]">
								/
							</kbd>
						) : null}
					</div>
				</div>
			) : null}

			<div
				className={cn(
					"flex-1 overflow-y-auto py-3",
					isCollapsed ? "px-1.5" : "px-2",
				)}
			>
				{sidebarGroups.length === 0 ? (
					<p className="text-muted-foreground px-2 py-6 text-center text-xs">
						{emptyMessage}
					</p>
				) : isCollapsed ? (
					<nav className="space-y-1" aria-label="主导航">
						{sidebarGroups.map((group) => {
							if (group.items.length === 1) {
								return (
									<NavSidebarNavList
										key={group.id}
										items={group.items}
										activePath={activePath}
										collapsed
										linkComponent={linkComponent}
										onNavigate={handleNavigate}
									/>
								);
							}

							const GroupIcon = group.icon ?? group.items[0]?.icon;
							const firstItem = group.items[0];
							if (!firstItem) {
								return null;
							}
							const active = group.id === activeGroupId;
							return (
								<Popover
									key={group.id}
									open={collapsedMenu === group.id}
									onOpenChange={(open) => {
										if (!open) {
											setCollapsedMenu((current) =>
												current === group.id ? null : current,
											);
										}
									}}
								>
									<PopoverTrigger asChild>
										<button
											type="button"
											onPointerEnter={() => openCollapsedMenu(group.id)}
											onPointerLeave={() => closeCollapsedMenu(group.id)}
											onFocus={() => openCollapsedMenu(group.id)}
											onBlur={() => closeCollapsedMenu(group.id)}
											aria-label={group.label}
											className={cn(
												"text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground mx-auto flex size-9 items-center justify-center rounded-md transition-colors",
												active &&
													"bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary",
											)}
										>
											{GroupIcon ? <GroupIcon className="size-4" /> : null}
										</button>
									</PopoverTrigger>
									<PopoverContent
										side="right"
										align="start"
										sideOffset={10}
										className="w-56 p-1.5"
										onOpenAutoFocus={(event) => event.preventDefault()}
										onPointerEnter={cancelCollapsedMenuClose}
										onPointerLeave={() => closeCollapsedMenu(group.id)}
									>
										<div className="text-muted-foreground px-2 py-1.5 text-[11px] font-medium tracking-wide uppercase">
											{group.label}
										</div>
										<NavSidebarNavList
											items={group.items}
											activePath={activePath}
											collapsed={false}
											linkComponent={linkComponent}
											onNavigate={handleNavigate}
										/>
									</PopoverContent>
								</Popover>
							);
						})}
					</nav>
				) : (
					<div className="space-y-1">
						{sidebarGroups.map((group) => {
							if (group.items.length === 1) {
								return (
									<NavSidebarNavList
										key={group.id}
										items={group.items}
										activePath={activePath}
										collapsed={false}
										linkComponent={linkComponent}
										onNavigate={handleNavigate}
									/>
								);
							}

							const GroupIcon = group.icon ?? group.items[0]?.icon;
							const active = group.id === activeGroupId;
							const open = Boolean(normalizedQuery) || openGroups.has(group.id);
							return (
								<div key={group.id}>
									<button
										type="button"
										aria-expanded={open}
										onClick={() => toggleGroup(group.id)}
										className={cn(
											"text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex h-8 w-full items-center gap-2.5 rounded-md px-2.5 text-[13px] transition-colors",
											active && "text-sidebar-foreground font-medium",
										)}
									>
										{GroupIcon ? (
											<GroupIcon
												className={cn(
													"size-4 shrink-0",
													active && "text-primary",
												)}
											/>
										) : null}
										<span className="flex-1 truncate text-left">
											{group.label}
										</span>
										<ChevronRightIcon
											className={cn(
												"size-3.5 transition-transform",
												open && "rotate-90",
											)}
										/>
									</button>
									{open ? (
										<div className="border-sidebar-border mt-0.5 ml-4 border-l pl-3">
											<NavSidebarNavList
												items={group.items}
												activePath={activePath}
												collapsed={false}
												linkComponent={linkComponent}
												onNavigate={handleNavigate}
											/>
										</div>
									) : null}
								</div>
							);
						})}
					</div>
				)}
			</div>

			<div className="border-sidebar-border/70 shrink-0 border-t p-2">
				<div
					className={cn("flex items-center gap-1", isCollapsed && "flex-col")}
				>
					<div className={cn("min-w-0 flex-1", isCollapsed && "flex-none")}>
						{renderSlot(footer, { collapsed: isCollapsed })}
					</div>
					{showCollapseButton ? (
						<Button
							variant="ghost"
							size="icon"
							className="hidden size-8 shrink-0 lg:inline-flex"
							onClick={() => updateCollapsed(!isCollapsed)}
							aria-label={isCollapsed ? expandLabel : collapseLabel}
						>
							{isCollapsed ? (
								<PanelLeftOpenIcon className="size-4" />
							) : (
								<PanelLeftCloseIcon className="size-4" />
							)}
						</Button>
					) : null}
				</div>
			</div>
		</div>
	);

	return (
		<TooltipProvider delayDuration={120}>
			{desktop ? (
				<aside
					data-slot="nav-sidebar"
					className={cn(
						"relative hidden shrink-0 p-2 lg:block",
						fill && "h-full",
						className,
					)}
					style={{ width: collapsed ? collapsedWidth : width }}
					{...props}
				>
					<div
						className={cn(
							fill ? "h-full" : "sticky top-2 h-[calc(100svh-1rem)]",
						)}
					>
						{renderContent(collapsed)}
					</div>
					<button
						type="button"
						tabIndex={-1}
						aria-label={collapsed ? expandLabel : collapseLabel}
						title={collapsed ? expandLabel : collapseLabel}
						onClick={() => updateCollapsed(!collapsed)}
						className={cn(
							"absolute inset-y-0 right-0 z-20 hidden w-3 translate-x-1/2 cursor-w-resize lg:block",
							"after:bg-transparent after:absolute after:inset-y-0 after:left-1/2 after:w-0.5 after:-translate-x-1/2 after:transition-colors",
							"hover:after:bg-sidebar-border",
							collapsed && "cursor-e-resize",
						)}
					/>
				</aside>
			) : null}

			<div
				className={cn(
					"fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px] transition-opacity lg:hidden",
					mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
				)}
				onClick={() => setMobileOpen(false)}
				aria-hidden="true"
			/>
			<aside
				data-slot="nav-sidebar-mobile"
				className={cn(
					"fixed inset-y-0 left-0 z-50 w-[280px] p-2 transition-transform duration-200 lg:hidden",
					mobileOpen ? "translate-x-0" : "-translate-x-full",
				)}
				aria-hidden={!mobileOpen}
				inert={!mobileOpen}
			>
				<div className="h-full">{renderContent(false)}</div>
			</aside>
		</TooltipProvider>
	);
}
