import type { MotionPreset } from "@frontend-frame/ui";

import type {
	FooterVariant,
	HeaderVariant,
	HeroVariant,
	PricingVariant,
} from "./contracts";

export type BlockFamily =
	"header" | "hero" | "footer" | "pricing" | "faq" | "testimonials";

export interface BlockVariantMeta {
	id: string;
	family: BlockFamily;
	name: string;
	description: string;
	tags: string[];
	status: "stable" | "beta";
	motion: MotionPreset[];
	preview?: string;
	exportName?: string;
	importPath?: string;
}

export const DEFAULT_HEADER_VARIANT: HeaderVariant = "floating-pill";
export const DEFAULT_HERO_VARIANT: HeroVariant = "centered";
export const DEFAULT_FOOTER_VARIANT: FooterVariant = "dark-mega";
export const DEFAULT_PRICING_VARIANT: PricingVariant = "cards";

export const headerVariants: BlockVariantMeta[] = [
	{
		id: "floating-pill",
		family: "header",
		name: "浮动胶囊",
		description: "居中悬浮、毛玻璃、移动端抽屉菜单。",
		tags: ["marketing", "glass", "floating"],
		status: "stable",
		motion: ["none", "subtle", "playful"],
		exportName: "FloatingPillHeader",
		importPath: "@frontend-frame/blocks/header/floating-pill",
	},
	{
		id: "minimal",
		family: "header",
		name: "极简通栏",
		description: "通栏吸顶、细分隔线，适合官网和文档站。",
		tags: ["app", "minimal", "docs"],
		status: "stable",
		motion: ["none", "subtle"],
		exportName: "MinimalHeader",
		importPath: "@frontend-frame/blocks/header/minimal",
	},
	{
		id: "mega-menu",
		family: "header",
		name: "Mega Menu",
		description: "多列下拉面板，适合产品线较多的站点。",
		tags: ["marketing", "navigation", "mega"],
		status: "stable",
		motion: ["none", "subtle"],
		exportName: "MegaMenuHeader",
		importPath: "@frontend-frame/blocks/header/mega-menu",
	},
];

export const heroVariants: BlockVariantMeta[] = [
	{
		id: "centered",
		family: "hero",
		name: "居中首屏",
		description: "居中标题、行动按钮与产品预览，适合大多数营销页。",
		tags: ["marketing", "centered", "product"],
		status: "stable",
		motion: ["none", "subtle", "playful", "cinematic"],
		exportName: "CenteredHero",
		importPath: "@frontend-frame/blocks/hero/centered",
	},
	{
		id: "split",
		family: "hero",
		name: "左右分栏",
		description: "左侧文案、右侧媒体，适合需要强调产品截图或视频的页面。",
		tags: ["marketing", "split", "screenshot"],
		status: "stable",
		motion: ["none", "subtle", "playful"],
		exportName: "SplitHero",
		importPath: "@frontend-frame/blocks/hero/split",
	},
	{
		id: "bento",
		family: "hero",
		name: "Bento 首屏",
		description: "大标题搭配 Bento 能力卡，适合 AI / 平台型产品。",
		tags: ["marketing", "bento", "ai"],
		status: "stable",
		motion: ["none", "subtle", "playful", "cinematic"],
		exportName: "BentoHero",
		importPath: "@frontend-frame/blocks/hero/bento",
	},
];

export const footerVariants: BlockVariantMeta[] = [
	{
		id: "dark-mega",
		family: "footer",
		name: "深色巨幕",
		description: "黑底、巨型品牌字与水印纹理，适合品牌官网收尾。",
		tags: ["marketing", "dark", "brand"],
		status: "stable",
		motion: ["none", "subtle"],
		exportName: "DarkMegaFooter",
		importPath: "@frontend-frame/blocks/footer/dark-mega",
	},
	{
		id: "minimal",
		family: "footer",
		name: "极简页脚",
		description: "细边框、单行导航，适合后台、文档站和工具型产品。",
		tags: ["app", "minimal", "docs"],
		status: "stable",
		motion: ["none"],
		exportName: "MinimalFooter",
		importPath: "@frontend-frame/blocks/footer/minimal",
	},
];

export const pricingVariants: BlockVariantMeta[] = [
	{
		id: "cards",
		family: "pricing",
		name: "卡片定价",
		description: "月付/年付切换 + 高亮推荐套餐，适合转化页。",
		tags: ["marketing", "pricing", "cards"],
		status: "stable",
		motion: ["none", "subtle", "playful"],
		exportName: "CardsPricing",
		importPath: "@frontend-frame/blocks/pricing/cards",
	},
	{
		id: "comparison",
		family: "pricing",
		name: "对比表定价",
		description: "按功能逐项对比，适合套餐差异较多的 B2B 产品。",
		tags: ["marketing", "pricing", "comparison"],
		status: "stable",
		motion: ["none", "subtle"],
		exportName: "ComparisonPricing",
		importPath: "@frontend-frame/blocks/pricing/comparison",
	},
];

export const catalog: BlockVariantMeta[] = [
	...headerVariants,
	...heroVariants,
	...footerVariants,
	...pricingVariants,
];
