import { UiAdaptersProvider, type UiAdapters } from "@frontend-frame/app-kit";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DarkMegaFooter } from "../footer/dark-mega";
import { MinimalFooter } from "../footer/minimal";
import { BentoHero } from "../hero/bento";
import { CenteredHero } from "../hero/centered";
import { SplitHero } from "../hero/split";
import { CardsPricing } from "../pricing/cards";
import { ComparisonPricing } from "../pricing/comparison";

import type { SiteConfig } from "../contracts";

const site: SiteConfig = {
	name: "Frontend Frame",
	description: "统一前端 UI 框架",
	logo: { text: "Frontend Frame" },
	nav: [{ label: "产品", href: "/product" }],
	actions: [{ label: "开始使用", href: "/signup" }],
	social: [{ label: "GitHub", href: "https://github.com" }],
};

const columns = [
	{
		title: "产品",
		links: [{ label: "组件库", href: "/components" }],
	},
];

const plans = [
	{
		id: "starter",
		name: "Starter",
		description: "个人项目",
		monthlyPrice: 99,
		annualPrice: 990,
		features: ["基础组件", "社区支持"],
		cta: { label: "开始使用", href: "/signup" },
	},
	{
		id: "pro",
		name: "Pro",
		description: "团队项目",
		monthlyPrice: 299,
		annualPrice: 2990,
		highlighted: true,
		badge: "推荐",
		features: ["基础组件", "社区支持", "优先支持"],
		cta: { label: "升级 Pro", href: "/signup" },
	},
];

const adapters: UiAdapters = {
	Link: ({ href, children, ...props }) => (
		<a href={href} {...props}>
			{children}
		</a>
	),
	usePathname: () => "/",
};

function renderWithAdapters(ui: React.ReactNode) {
	return render(
		<UiAdaptersProvider adapters={adapters}>{ui}</UiAdaptersProvider>,
	);
}

const heroProps = {
	title: "Hero title",
	description: "Hero description",
	actions: [
		{ label: "开始使用", href: "/signup" },
		{ label: "了解更多", href: "/docs", variant: "outline" as const },
	],
	media: <div>Hero media</div>,
	stats: [{ value: "100+", label: "组件" }],
	highlights: [{ title: "可替换变体", description: "按需选择" }],
};

describe.each([
	["centered", CenteredHero],
	["split", SplitHero],
	["bento", BentoHero],
] as const)("%s hero", (_name, Hero) => {
	it("renders heading, actions, media and stats", () => {
		renderWithAdapters(<Hero {...heroProps} />);

		expect(
			screen.getByRole("heading", { level: 1, name: "Hero title" }),
		).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "开始使用" })).toBeInTheDocument();
		expect(screen.getByText("Hero media")).toBeInTheDocument();
		expect(screen.getByText("100+")).toBeInTheDocument();
	});
});

describe.each([
	["dark-mega", DarkMegaFooter],
	["minimal", MinimalFooter],
] as const)("%s footer", (_name, Footer) => {
	it("renders brand, columns and social links", () => {
		renderWithAdapters(
			<Footer site={site} columns={columns} legal="© 2026 Frontend Frame" />,
		);

		expect(screen.getAllByText("Frontend Frame").length).toBeGreaterThan(0);
		expect(screen.getByRole("link", { name: "组件库" })).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "GitHub" })).toBeInTheDocument();
	});
});

describe("pricing variants", () => {
	it("renders plan cards and switches billing", () => {
		renderWithAdapters(<CardsPricing plans={plans} />);

		expect(screen.getByText("Starter")).toBeInTheDocument();
		expect(screen.getByText("¥99")).toBeInTheDocument();

		fireEvent.click(screen.getByRole("button", { name: "年付" }));
		expect(screen.getByText("¥990")).toBeInTheDocument();
	});

	it("renders the comparison table with included and missing features", () => {
		renderWithAdapters(<ComparisonPricing plans={plans} />);

		expect(screen.getByText("方案功能对比")).toBeInTheDocument();
		expect(screen.getByText("优先支持")).toBeInTheDocument();
		expect(screen.getAllByLabelText("包含").length).toBeGreaterThan(0);
		expect(screen.getAllByLabelText("不包含").length).toBeGreaterThan(0);
	});
});
