import { UiAdaptersProvider, type UiAdapters } from "@frontend-frame/app-kit";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { FloatingPillHeader } from "../header/floating-pill";
import { MegaMenuHeader } from "../header/mega-menu";
import { MinimalHeader } from "../header/minimal";
import { SiteHeader } from "../variants";

import type { SiteConfig } from "../contracts";

const site: SiteConfig = {
	name: "Frontend Frame",
	description: "统一前端框架",
	logo: { text: "Frontend Frame" },
	nav: [
		{
			label: "产品",
			href: "/product",
			children: [
				{
					label: "组件库",
					href: "/product/components",
					description: "基础组件与业务组件",
				},
				{
					label: "设计令牌",
					href: "/product/tokens",
					description: "主题与布局令牌",
				},
			],
		},
		{ label: "价格", href: "/pricing" },
	],
	actions: [{ label: "开始使用", href: "/signup", variant: "default" }],
};

const adapters: UiAdapters = {
	Link: ({ href, children, ...props }) => (
		<a href={href} {...props}>
			{children}
		</a>
	),
	usePathname: () => "/pricing",
};

function renderWithAdapters(ui: React.ReactNode) {
	return render(
		<UiAdaptersProvider adapters={adapters}>
			{ui}
			<span>Theme slot</span>
		</UiAdaptersProvider>,
	);
}

describe.each([
	["floating-pill", FloatingPillHeader],
	["minimal", MinimalHeader],
	["mega-menu", MegaMenuHeader],
] as const)("%s header", (_name, Header) => {
	it("renders the site navigation and marks the active route", () => {
		renderWithAdapters(<Header site={site} themeToggle={<span>Theme</span>} />);

		expect(screen.getByRole("link", { name: "价格" })).toHaveAttribute(
			"aria-current",
			"page",
		);
		expect(screen.getByRole("link", { name: "开始使用" })).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "打开菜单" }),
		).toBeInTheDocument();
	});

	it("opens the mobile navigation", async () => {
		const user = userEvent.setup();
		renderWithAdapters(<Header site={site} themeToggle={<span>Theme</span>} />);

		await user.click(screen.getByRole("button", { name: "打开菜单" }));

		const dialog = await screen.findByRole("dialog");
		await user.click(within(dialog).getByRole("button", { name: "产品" }));
		expect(within(dialog).getByText("组件库")).toBeInTheDocument();
		expect(
			within(dialog).getByRole("link", { name: "开始使用" }),
		).toBeInTheDocument();
	});
});

describe("SiteHeader", () => {
	it("lazy-loads the selected variant", async () => {
		renderWithAdapters(<SiteHeader variant="minimal" site={site} />);

		expect(
			await screen.findByRole("link", { name: "价格" }),
		).toBeInTheDocument();
	});

	it("throws a descriptive error for an unknown variant in development", () => {
		const consoleError = vi
			.spyOn(console, "error")
			.mockImplementation(() => undefined);

		expect(() =>
			renderWithAdapters(
				<SiteHeader variant={"unknown" as never} site={site} />,
			),
		).toThrow(/Unknown header variant/);

		consoleError.mockRestore();
	});
});
