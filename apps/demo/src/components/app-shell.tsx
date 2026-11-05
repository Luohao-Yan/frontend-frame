"use client";

import {
	BellIcon,
	ChevronRightIcon,
	GithubIcon,
	MenuIcon,
	SearchIcon,
	SparklesIcon,
} from "lucide-react";
import * as React from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

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

import { RouteFallback } from "@/components/route-fallback";
import { getPageTitle, navGroups, navItems } from "@/lib/nav";

import type { NavSidebarGroup, NavSidebarLinkProps } from "@frontend-frame/ui";

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

function Brand({ collapsed }: { collapsed: boolean }) {
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
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					aria-label="用户菜单"
					className={cn(
						"hover:bg-sidebar-accent flex w-full min-w-0 items-center gap-2 rounded-lg px-1.5 py-1.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
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
				<DropdownMenuItem>退出登录</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export function AppShell() {
	useMotionEffects();
	const [commandOpen, setCommandOpen] = React.useState(false);
	const [mobileOpen, setMobileOpen] = React.useState(false);
	const location = useLocation();
	const navigate = useNavigate();
	const title = getPageTitle(location.pathname);

	React.useEffect(() => {
		setMobileOpen(false);
	}, [location.pathname]);

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

	return (
		<div className="bg-background flex min-h-svh w-full">
			<NavSidebar
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

			<div className="flex min-w-0 flex-1 flex-col">
				<header className="bg-background/80 sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b backdrop-blur-xl">
					<div className="flex w-full items-center gap-2 px-4">
						<Button
							variant="ghost"
							size="icon"
							className="-ml-1 size-9 lg:hidden"
							onClick={() => setMobileOpen(true)}
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
							<Button
								variant="outline"
								size="sm"
								className="text-muted-foreground hidden w-52 justify-start gap-2 md:flex"
								onClick={() => setCommandOpen(true)}
							>
								<SearchIcon className="size-3.5" />
								<span className="text-xs">搜索页面...</span>
								<kbd className="bg-muted text-muted-foreground ml-auto rounded border px-1.5 py-0.5 font-mono text-[10px]">
									Ctrl K
								</kbd>
							</Button>
							<Button
								variant="ghost"
								size="icon"
								className="size-9 md:hidden"
								onClick={() => setCommandOpen(true)}
								aria-label="搜索"
							>
								<SearchIcon className="size-4" />
							</Button>
							<ThemeSelector />
							<ThemeToggle />
							<Button
								variant="ghost"
								size="icon"
								className="relative size-9"
								aria-label="通知"
							>
								<BellIcon className="size-4" />
								<span className="bg-destructive absolute top-2 right-2 size-1.5 rounded-full" />
							</Button>
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
							<Separator
								orientation="vertical"
								className="mx-1 hidden h-5 sm:block"
							/>
							<Avatar className="hidden size-8 sm:flex">
								<AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-semibold text-white">
									KC
								</AvatarFallback>
							</Avatar>
						</div>
					</div>
				</header>

				<main className="mx-auto w-full max-w-[1440px] flex-1 p-4 sm:p-6 lg:p-8">
					<React.Suspense fallback={<RouteFallback />}>
						<Outlet />
					</React.Suspense>
				</main>

				<footer className="text-muted-foreground border-t px-6 py-4 text-xs">
					Frontend Frame · 统一 UI 组件框架 Demo · React 19 + TypeScript +
					Tailwind CSS v4
				</footer>
			</div>

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
										<span className="text-muted-foreground ml-auto font-mono text-xs">
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
		</div>
	);
}
