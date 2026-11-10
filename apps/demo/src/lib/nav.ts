import {
	Blocks,
	BotIcon,
	BookOpen,
	ClipboardPen,
	LayoutDashboard,
	LayoutTemplate,
	LogInIcon,
	PanelsTopLeft,
	Palette,
	Table2,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

export interface NavItem {
	title: string;
	href: string;
	icon: LucideIcon;
	badge?: string;
}

export interface NavGroup {
	label: string;
	items: NavItem[];
}

export const navGroups: NavGroup[] = [
	{
		label: "应用",
		items: [
			{ title: "总览", href: "/", icon: LayoutDashboard },
			{ title: "组件画廊", href: "/components", icon: Blocks, badge: "62" },
			{ title: "表单示例", href: "/forms", icon: ClipboardPen },
			{ title: "数据表格", href: "/data", icon: Table2 },
			{ title: "AI 组件", href: "/ai", icon: BotIcon, badge: "Morphic" },
			{
				title: "组件变体",
				href: "/variants",
				icon: LayoutTemplate,
				badge: "10",
			},
			{
				title: "产品 UI",
				href: "/product-ui",
				icon: PanelsTopLeft,
				badge: "New",
			},
			{
				title: "登录页",
				href: "/login",
				icon: LogInIcon,
				badge: "New",
			},
		],
	},
	{
		label: "设计系统",
		items: [
			{ title: "设计令牌", href: "/tokens", icon: Palette },
			{ title: "接入文档", href: "/docs", icon: BookOpen },
		],
	},
];

export const navItems = navGroups.flatMap((group) => group.items);

export function getPageTitle(pathname: string) {
	if (pathname === "/") {
		return "总览";
	}
	return (
		navItems.find((item) => item.href !== "/" && pathname.startsWith(item.href))
			?.title ?? "页面"
	);
}
