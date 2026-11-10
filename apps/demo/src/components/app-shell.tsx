"use client";

import {
	AppShell as AppShellLayout,
	ErrorBoundary,
	RouteBoundary,
} from "@frontend-frame/app-kit";
import {
	headerVariants,
	SiteHeader,
	type HeaderVariant,
	type SiteConfig,
} from "@frontend-frame/blocks";
import {
	Avatar,
	AvatarFallback,
	Badge,
	Button,
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	NavSidebar,
	Separator,
	SonnerToaster,
	ThemeSelector,
	ThemeToggle,
	cn,
	useMotionEffects,
} from "@frontend-frame/ui";
import {
	BellIcon,
	CheckIcon,
	ChevronRightIcon,
	GithubIcon,
	LayoutTemplateIcon,
	MenuIcon,
	PanelLeftIcon,
	PanelTopIcon,
	SearchIcon,
	SparklesIcon,
} from "lucide-react";
import * as React from "react";
import {
	NavLink,
	Outlet,
	useLocation,
	useNavigate,
	useSearchParams,
} from "react-router-dom";

import { RouteFallback } from "@/components/route-fallback";
import { getPageTitle, navGroups, navItems } from "@/lib/nav";

import type { NavSidebarGroup, NavSidebarLinkProps } from "@frontend-frame/ui";

type ShellVariant = "sidebar" | "topbar";

const SHELL_STORAGE_KEY = "frontend-frame-shell-variant";
const HEADER_STORAGE_KEY = "frontend-frame-header-variant";

function isHeaderVariant(value: string | null): value is HeaderVariant {
	return (
		value === "floating-pill" || value === "minimal" || value === "mega-menu"
	);
}

function getStoredHeaderVariant(): HeaderVariant {
	if (typeof window === "undefined") {
		return "floating-pill";
	}
	const stored = window.localStorage.getItem(HEADER_STORAGE_KEY);
	return isHeaderVariant(stored) ? stored : "floating-pill";
}

const RouterNavLink = React.forwardRef<HTMLAnchorElement, NavSidebarLinkProps>(
	({ href, ...props }, ref) => <NavLink ref={ref} to={href} end {...props} />,
);
RouterNavLink.displayName = "RouterNavLink";

const sidebarGroups: NavSidebarGroup[] = navGroups.map((group, groupIndex) => ({
	id: `group-${groupIndex}`,
	label: group.label,
	items: group.items.map((item) => ({
		id: item.href,
		label: item.title,
		href: item.href,
		icon: item.icon,
		badge: item.badge ? (
			<Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
				{item.badge}
			</Badge>
		) : undefined,
	})),
}));

function getStoredShellVariant(): ShellVariant {
	if (typeof window === "undefined") {
		return "sidebar";
	}
	return window.localStorage.getItem(SHELL_STORAGE_KEY) === "topbar"
		? "topbar"
		: "sidebar";
}

function Brand({ collapsed = false }: { collapsed?: boolean }) {
	return (
		<NavLink
			to="/"
			className={cn(
				"flex min-w-0 items-center gap-2.5 rounded-md",
				collapsed && "justify-center",
			)}
		>
			<div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg shadow-sm">
				<SparklesIcon className="size-4" />
			</div>
			{!collapsed ? (
				<div className="grid min-w-0 flex-1 text-left leading-tight">
					<span className="truncate text-[13px] font-semibold">
						Frontend Frame
					</span>
					<span className="text-muted-foreground truncate text-[10px] tracking-wider uppercase">
						Unified UI System
					</span>
				</div>
			) : null}
		</NavLink>
	);
}

function WorkspaceMenu({ collapsed }: { collapsed: boolean }) {
	const navigate = useNavigate();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					aria-label="用户菜单"
					className={cn(
						"hover:bg-sidebar-accent focus-visible:ring-ring flex w-full min-w-0 items-center gap-2 rounded-lg px-1.5 py-1.5 text-left transition-colors focus-visible:ring-2 focus-visible:outline-none",
						collapsed && "justify-center",
					)}
				>
					<Avatar className="size-7 rounded-lg">
						<AvatarFallback className="rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-[10px] font-semibold text-white">
							FF
						</AvatarFallback>
					</Avatar>
					{!collapsed ? (
						<div className="grid min-w-0 flex-1 text-left leading-tight">
							<span className="truncate text-xs font-medium">开发团队</span>
							<span className="text-muted-foreground truncate text-[10px]">
								Pro Workspace
							</span>
						</div>
					) : null}
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent side="top" align="start" className="w-56">
				<DropdownMenuLabel>我的工作区</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem>账号设置</DropdownMenuItem>
				<DropdownMenuItem>团队成员</DropdownMenuItem>
				<DropdownMenuItem>账单与用量</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={() => navigate("/login")}>
					登录页示例
				</DropdownMenuItem>
				<DropdownMenuItem>退出登录</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function LayoutMenu({
	shellVariant,
	onShellVariantChange,
	headerVariant,
	onHeaderVariantChange,
	className,
}: {
	shellVariant: ShellVariant;
	onShellVariantChange: (value: ShellVariant) => void;
	headerVariant: HeaderVariant;
	onHeaderVariantChange: (value: HeaderVariant) => void;
	className?: string;
}) {
	const shellOptions = [
		{ value: "sidebar" as const, label: "侧边导航", icon: PanelLeftIcon },
		{ value: "topbar" as const, label: "顶部导航", icon: PanelTopIcon },
	];

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className={cn("size-9", className)}
					aria-label="布局设置"
					title="布局设置"
					data-testid="layout-menu-trigger"
				>
					<LayoutTemplateIcon className="size-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-60">
				<DropdownMenuLabel>根布局</DropdownMenuLabel>
				{shellOptions.map((option) => {
					const Icon = option.icon;
					const active = shellVariant === option.value;
					return (
						<DropdownMenuItem
							key={option.value}
							data-testid={`shell-variant-${option.value}`}
							onSelect={() => onShellVariantChange(option.value)}
						>
							<Icon className="size-4" />
							<span className="flex-1">{option.label}</span>
							{active ? (
								<CheckIcon className="size-4" aria-hidden="true" />
							) : null}
						</DropdownMenuItem>
					);
				})}
				<DropdownMenuSeparator />
				<DropdownMenuLabel>顶部导航样式</DropdownMenuLabel>
				{headerVariants.map((variant) => (
					<DropdownMenuItem
						key={variant.id}
						data-testid={`header-variant-${variant.id}`}
						onSelect={() => onHeaderVariantChange(variant.id as HeaderVariant)}
					>
						<span className="flex-1">{variant.name}</span>
						{headerVariant === variant.id ? (
							<CheckIcon className="size-4" aria-hidden="true" />
						) : null}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function SearchTrigger({
	onClick,
	compact = false,
}: {
	onClick: () => void;
	compact?: boolean;
}) {
	if (compact) {
		return (
			<Button
				variant="ghost"
				size="icon"
				className="size-9 md:hidden"
				onClick={onClick}
				aria-label="搜索"
			>
				<SearchIcon className="size-4" />
			</Button>
		);
	}

	return (
		<Button
			variant="outline"
			size="sm"
			className="text-muted-foreground hidden w-52 justify-start gap-2 md:flex"
			onClick={onClick}
		>
			<SearchIcon className="size-3.5" />
			<span className="text-xs">搜索页面...</span>
			<kbd className="bg-muted text-muted-foreground ml-auto rounded border px-1.5 py-0.5 font-mono text-[10px]">
				Ctrl K
			</kbd>
		</Button>
	);
}

function HeaderActions({
	shellVariant,
	onShellVariantChange,
	onOpenSearch,
	headerVariant,
	onHeaderVariantChange,
	mode = "sidebar",
}: {
	shellVariant: ShellVariant;
	onShellVariantChange: (value: ShellVariant) => void;
	onOpenSearch: () => void;
	headerVariant: HeaderVariant;
	onHeaderVariantChange: (value: HeaderVariant) => void;
	mode?: "sidebar" | "topbar";
}) {
	return (
		<>
			<LayoutMenu
				shellVariant={shellVariant}
				onShellVariantChange={onShellVariantChange}
				headerVariant={headerVariant}
				onHeaderVariantChange={onHeaderVariantChange}
			/>
			<SearchTrigger onClick={onOpenSearch} />
			<SearchTrigger onClick={onOpenSearch} compact />
			{mode === "sidebar" ? (
				<>
					<div className="hidden sm:block">
						<ThemeSelector />
					</div>
					<ThemeToggle />
				</>
			) : null}
			<Button
				variant="ghost"
				size="icon"
				className="relative size-9"
				aria-label="通知"
			>
				<BellIcon className="size-4" />
				<span className="bg-destructive absolute top-2 right-2 size-1.5 rounded-full" />
			</Button>
			{mode === "sidebar" ? (
				<Button
					variant="ghost"
					size="icon"
					className="hidden size-9 sm:inline-flex"
					asChild
				>
					<a
						href="https://github.com"
						target="_blank"
						rel="noreferrer"
						aria-label="GitHub"
					>
						<GithubIcon className="size-4" />
					</a>
				</Button>
			) : null}
			<Separator orientation="vertical" className="mx-1 hidden h-5 sm:block" />
			<Avatar className="hidden size-8 sm:flex">
				<AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-semibold text-white">
					KC
				</AvatarFallback>
			</Avatar>
		</>
	);
}

function AppSidebarHeader({
	title,
	shellVariant,
	onShellVariantChange,
	headerVariant,
	onHeaderVariantChange,
	onOpenMobileMenu,
	onOpenSearch,
}: {
	title: string;
	shellVariant: ShellVariant;
	onShellVariantChange: (value: ShellVariant) => void;
	headerVariant: HeaderVariant;
	onHeaderVariantChange: (value: HeaderVariant) => void;
	onOpenMobileMenu: () => void;
	onOpenSearch: () => void;
}) {
	return (
		<header className="bg-background/80 sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b backdrop-blur-xl">
			<div className="flex w-full items-center gap-2 px-4">
				<Button
					variant="ghost"
					size="icon"
					className="-ml-1 size-9 lg:hidden"
					onClick={onOpenMobileMenu}
					aria-label="打开菜单"
				>
					<MenuIcon className="size-5" />
				</Button>
				<Separator orientation="vertical" className="mr-1 h-4" />
				<span className="text-muted-foreground hidden text-sm sm:inline">
					工作台
				</span>
				<ChevronRightIcon className="text-muted-foreground hidden size-3.5 sm:block" />
				<span className="text-sm font-medium">{title}</span>
				<div className="ml-auto flex items-center gap-1.5">
					<HeaderActions
						shellVariant={shellVariant}
						onShellVariantChange={onShellVariantChange}
						headerVariant={headerVariant}
						onHeaderVariantChange={onHeaderVariantChange}
						onOpenSearch={onOpenSearch}
					/>
				</div>
			</div>
		</header>
	);
}

export function AppShell() {
	useMotionEffects();
	const [commandOpen, setCommandOpen] = React.useState(false);
	const [mobileOpen, setMobileOpen] = React.useState(false);
	const mainScrollRef = React.useRef<HTMLElement | null>(null);
	const [searchParams, setSearchParams] = useSearchParams();
	const [shellVariant, setShellVariant] = React.useState<ShellVariant>(() => {
		const fromQuery = searchParams.get("shell");
		return fromQuery === "topbar" || fromQuery === "sidebar"
			? fromQuery
			: getStoredShellVariant();
	});
	const [headerVariant, setHeaderVariant] = React.useState<HeaderVariant>(
		() => {
			const fromQuery = searchParams.get("header");
			return isHeaderVariant(fromQuery) ? fromQuery : getStoredHeaderVariant();
		},
	);
	const location = useLocation();
	const navigate = useNavigate();
	const title = getPageTitle(location.pathname);
	const isSidebar = shellVariant === "sidebar";
	const queryShell = searchParams.get("shell");
	const queryHeader = searchParams.get("header");

	const siteConfig = React.useMemo<SiteConfig>(
		() => ({
			name: "Frontend Frame",
			description: "统一前端 UI 框架",
			logo: { text: "Frontend Frame" },
			nav: navGroups.map((group) => ({
				label: group.label,
				href: group.items[0]?.href ?? "/",
				children: group.items.map((item) => ({
					label: item.title,
					href: item.href,
					description:
						item.badge && /^\d+$/.test(item.badge)
							? `${item.badge} 个组件`
							: undefined,
				})),
			})),
		}),
		[],
	);

	React.useEffect(() => {
		setMobileOpen(false);
	}, [location.pathname]);

	React.useEffect(() => {
		if (queryShell === "topbar" || queryShell === "sidebar") {
			setShellVariant(queryShell);
			window.localStorage.setItem(SHELL_STORAGE_KEY, queryShell);
		}
	}, [queryShell]);

	React.useEffect(() => {
		if (isHeaderVariant(queryHeader)) {
			setHeaderVariant(queryHeader);
			window.localStorage.setItem(HEADER_STORAGE_KEY, queryHeader);
		}
	}, [queryHeader]);

	React.useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
				event.preventDefault();
				setCommandOpen((open) => !open);
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	const changeShellVariant = React.useCallback(
		(next: ShellVariant) => {
			setShellVariant(next);
			window.localStorage.setItem(SHELL_STORAGE_KEY, next);
			setSearchParams(
				(previous) => {
					const params = new URLSearchParams(previous);
					params.set("shell", next);
					return params;
				},
				{ replace: true },
			);
		},
		[setSearchParams],
	);

	const changeHeaderVariant = React.useCallback(
		(next: HeaderVariant) => {
			setHeaderVariant(next);
			window.localStorage.setItem(HEADER_STORAGE_KEY, next);
			setSearchParams(
				(previous) => {
					const params = new URLSearchParams(previous);
					params.set("header", next);
					return params;
				},
				{ replace: true },
			);
		},
		[setSearchParams],
	);

	const navSidebar = (
		<NavSidebar
			desktop={isSidebar}
			fill
			groups={sidebarGroups}
			activePath={location.pathname}
			brand={({ collapsed }) => <Brand collapsed={collapsed} />}
			footer={({ collapsed }) => <WorkspaceMenu collapsed={collapsed} />}
			linkComponent={RouterNavLink}
			mobileOpen={mobileOpen}
			onMobileOpenChange={setMobileOpen}
			onNavigate={() => setMobileOpen(false)}
			storageKey="frontend-frame-nav-collapsed"
			searchPlaceholder="搜索页面..."
		/>
	);

	return (
		<AppShellLayout
			heightMode="viewport"
			contentRef={mainScrollRef}
			sidebar={isSidebar ? navSidebar : undefined}
			header={
				isSidebar ? (
					<AppSidebarHeader
						title={title}
						shellVariant={shellVariant}
						onShellVariantChange={changeShellVariant}
						headerVariant={headerVariant}
						onHeaderVariantChange={changeHeaderVariant}
						onOpenMobileMenu={() => setMobileOpen(true)}
						onOpenSearch={() => setCommandOpen(true)}
					/>
				) : undefined
			}
			footer={
				<footer className="text-muted-foreground border-t px-6 py-3 text-xs">
					Frontend Frame · 统一 UI 组件框架 Demo · React 19 + TypeScript +
					Tailwind CSS v4
				</footer>
			}
			contentClassName={cn(
				"mx-auto w-full max-w-[1440px] p-4 sm:p-6 lg:p-8",
				!isSidebar && "pt-24 sm:pt-24 lg:pt-28",
			)}
			overlay={
				<>
					{!isSidebar ? (
						<SiteHeader
							variant={headerVariant}
							site={siteConfig}
							activePath={location.pathname}
							scrollContainer={mainScrollRef}
							themeToggle={<ThemeToggle />}
							actions={
								<HeaderActions
									shellVariant={shellVariant}
									onShellVariantChange={changeShellVariant}
									headerVariant={headerVariant}
									onHeaderVariantChange={changeHeaderVariant}
									mode="topbar"
									onOpenSearch={() => setCommandOpen(true)}
								/>
							}
							className="fixed inset-x-0 top-4 z-40"
						/>
					) : null}
					<Dialog open={commandOpen} onOpenChange={setCommandOpen}>
						<DialogContent className="overflow-hidden p-0 sm:max-w-lg">
							<DialogTitle className="sr-only">快速导航</DialogTitle>
							<DialogDescription className="sr-only">
								搜索并跳转到应用页面
							</DialogDescription>
							<Command>
								<CommandInput placeholder="输入页面名称..." />
								<CommandList>
									<CommandEmpty>没有找到匹配的页面</CommandEmpty>
									<CommandGroup heading="导航">
										{navItems.map((item) => (
											<CommandItem
												key={item.href}
												value={item.title}
												onSelect={() => {
													navigate(item.href);
													setCommandOpen(false);
												}}
											>
												<item.icon className="size-4" />
												<span>{item.title}</span>
												<span className="ml-auto font-mono text-xs text-muted-foreground">
													{item.href}
												</span>
											</CommandItem>
										))}
									</CommandGroup>
								</CommandList>
							</Command>
						</DialogContent>
					</Dialog>
					<SonnerToaster position="top-right" richColors />
				</>
			}
		>
			<ErrorBoundary
				fallback={({ error, reset }) => (
					<RouteBoundary
						variant="error"
						description={
							import.meta.env.DEV
								? `开发环境错误：${error.message}`
								: "页面渲染失败，请重试或返回首页。"
						}
						onRetry={reset}
					/>
				)}
			>
				<React.Suspense fallback={<RouteFallback />}>
					<Outlet />
				</React.Suspense>
			</ErrorBoundary>
		</AppShellLayout>
	);
}
