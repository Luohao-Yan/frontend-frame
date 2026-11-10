import {
	DEFAULT_FOOTER_VARIANT,
	DEFAULT_HEADER_VARIANT,
	DEFAULT_HERO_VARIANT,
	DEFAULT_PRICING_VARIANT,
	Hero,
	PricingSection,
	SiteFooter,
	SiteHeader,
	footerVariants,
	headerVariants,
	heroVariants,
	pricingVariants,
	type BlockVariantMeta,
	type FooterVariant,
	type HeaderVariant,
	type HeroVariant,
	type PricingVariant,
	type SiteConfig,
} from "@frontend-frame/blocks";
import {
	Badge,
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	MotionPresetProvider,
	PageHeader,
	Reveal,
	Stagger,
	StaggerItem,
	ThemeToggle,
} from "@frontend-frame/ui";
import { GithubIcon, GlobeIcon, LayoutTemplateIcon } from "lucide-react";
import * as React from "react";

import type { MotionPreset } from "@frontend-frame/ui";

const site: SiteConfig = {
	name: "Frontend Frame",
	description: "统一前端 UI 框架：组件、区块、主题与表单闭环。",
	logo: { text: "Frontend Frame" },
	nav: [
		{
			label: "产品",
			href: "/product",
			children: [
				{
					label: "组件库",
					href: "/components",
					description: "基础组件与业务组件",
				},
				{
					label: "组件变体",
					href: "/variants",
					description: "可替换的页面区块",
				},
			],
		},
		{ label: "价格", href: "/pricing" },
		{ label: "文档", href: "/docs" },
	],
	actions: [{ label: "开始使用", href: "/signup" }],
	social: [
		{ label: "GitHub", href: "https://github.com", icon: GithubIcon },
		{
			label: "官网",
			href: "https://example.com",
			icon: GlobeIcon,
		},
	],
};

const footerColumns = [
	{
		title: "产品",
		links: [
			{ label: "组件库", href: "/components" },
			{ label: "组件变体", href: "/variants" },
			{ label: "设计令牌", href: "/tokens" },
		],
	},
	{
		title: "资源",
		links: [
			{ label: "文档", href: "/docs" },
			{ label: "表单示例", href: "/forms" },
			{ label: "数据表格", href: "/data" },
		],
	},
	{
		title: "公司",
		links: [
			{ label: "关于", href: "/about" },
			{ label: "联系", href: "/contact" },
			{ label: "隐私", href: "/privacy" },
		],
	},
];

const plans = [
	{
		id: "starter",
		name: "Starter",
		description: "适合个人项目和早期原型。",
		monthlyPrice: 99,
		annualPrice: 990,
		features: ["全部基础组件", "12 套主题", "社区支持"],
		cta: { label: "开始使用", href: "/signup" },
	},
	{
		id: "pro",
		name: "Pro",
		description: "适合团队和正式产品。",
		monthlyPrice: 299,
		annualPrice: 2990,
		highlighted: true,
		badge: "推荐",
		features: [
			"包含 Starter",
			"区块变体与模板",
			"表单 Action 契约",
			"优先支持",
		],
		cta: { label: "升级 Pro", href: "/signup" },
	},
];

function HeroPreview() {
	return (
		<div className="from-primary/15 via-background to-background bg-gradient-to-br p-5 sm:p-7">
			<div className="grid gap-3 sm:grid-cols-3">
				{[
					["组件覆盖", "100+"],
					["主题", "12"],
					["变体", "15+"],
				].map(([label, value]) => (
					<div key={label} className="bg-card rounded-xl border p-4">
						<p className="text-muted-foreground text-xs">{label}</p>
						<p className="mt-2 text-2xl font-semibold">{value}</p>
					</div>
				))}
			</div>
			<div className="mt-3 space-y-2">
				<div className="bg-muted h-3 w-4/5 rounded-full" />
				<div className="bg-muted h-3 w-3/5 rounded-full" />
				<div className="bg-primary/20 h-3 w-2/3 rounded-full" />
			</div>
		</div>
	);
}

const heroProps = {
	eyebrow: "Frontend Frame 0.2",
	title: (
		<>
			把组件组织成
			<br />
			可交付的产品
		</>
	),
	description:
		"同一类组件提供多个可替换变体，主题、动效和路由都可以按项目选择，而不是被单一实现锁死。",
	actions: [
		{ label: "开始使用", href: "/signup" },
		{ label: "查看组件", href: "/components", variant: "outline" as const },
	],
	media: <HeroPreview />,
	stats: [
		{ value: "100+", label: "组件" },
		{ value: "12", label: "主题" },
		{ value: "6", label: "组件族" },
	],
	highlights: [
		{
			title: "可替换变体",
			description: "Header、Hero、Footer、Pricing 按需选择。",
		},
		{
			title: "框架无关",
			description: "通过 adapters 接入 React Router 或 Next.js。",
		},
		{
			title: "生产可用",
			description: "类型、测试、构建和可访问性一起交付。",
		},
	],
};

type FamilyId = "header" | "hero" | "footer" | "pricing";

interface FamilyDefinition {
	id: FamilyId;
	label: string;
	description: string;
	defaultVariant: string;
	variants: BlockVariantMeta[];
	render: (variant: string) => React.ReactNode;
}

const families: FamilyDefinition[] = [
	{
		id: "header",
		label: "Header",
		description: "导航形态从浮动胶囊到 Mega Menu。",
		defaultVariant: DEFAULT_HEADER_VARIANT,
		variants: headerVariants,
		render: (variant) => (
			<div className="relative min-h-[300px] overflow-hidden rounded-xl border bg-background">
				<SiteHeader
					variant={variant as HeaderVariant}
					site={site}
					activePath="/product"
					themeToggle={<ThemeToggle />}
				/>
				<div className="px-6 pt-24 pb-8">
					<p className="text-muted-foreground text-xs tracking-widest uppercase">
						Header preview
					</p>
					<h2 className="mt-2 text-2xl font-semibold tracking-tight">
						页面内容从这里开始
					</h2>
				</div>
			</div>
		),
	},
	{
		id: "hero",
		label: "Hero",
		description: "首屏从居中到 Bento 布局。",
		defaultVariant: DEFAULT_HERO_VARIANT,
		variants: heroVariants,
		render: (variant) => (
			<div className="overflow-hidden rounded-xl border bg-background">
				<Hero variant={variant as HeroVariant} {...heroProps} />
			</div>
		),
	},
	{
		id: "footer",
		label: "Footer",
		description: "品牌收尾或极简信息栏。",
		defaultVariant: DEFAULT_FOOTER_VARIANT,
		variants: footerVariants,
		render: (variant) => (
			<div className="overflow-hidden rounded-xl border">
				<SiteFooter
					variant={variant as FooterVariant}
					site={site}
					columns={footerColumns}
				/>
			</div>
		),
	},
	{
		id: "pricing",
		label: "Pricing",
		description: "卡片定价或功能对比表。",
		defaultVariant: DEFAULT_PRICING_VARIANT,
		variants: pricingVariants,
		render: (variant) => (
			<div className="overflow-hidden rounded-xl border bg-background">
				<PricingSection
					variant={variant as PricingVariant}
					plans={plans}
					annualHint="年付相当于省 2 个月"
				/>
			</div>
		),
	},
];

const presets: Array<{ value: MotionPreset; label: string }> = [
	{ value: "none", label: "关闭" },
	{ value: "subtle", label: "克制" },
	{ value: "playful", label: "活泼" },
	{ value: "cinematic", label: "电影感" },
];

export function VariantsPage() {
	const [activeFamilyId, setActiveFamilyId] =
		React.useState<FamilyId>("header");
	const [selected, setSelected] = React.useState<Record<FamilyId, string>>({
		header: DEFAULT_HEADER_VARIANT,
		hero: DEFAULT_HERO_VARIANT,
		footer: DEFAULT_FOOTER_VARIANT,
		pricing: DEFAULT_PRICING_VARIANT,
	});
	const [preset, setPreset] = React.useState<MotionPreset>("subtle");

	const activeFamily =
		families.find((family) => family.id === activeFamilyId) ?? families[0];
	const selectedVariant = selected[activeFamily.id];
	const selectedMeta =
		activeFamily.variants.find((variant) => variant.id === selectedVariant) ??
		activeFamily.variants[0];
	const importPath = selectedMeta.importPath ?? "@frontend-frame/blocks";
	const exportName = selectedMeta.exportName ?? "Variant";

	const selectVariant = (variant: string) => {
		setSelected((current) => ({ ...current, [activeFamily.id]: variant }));
	};

	return (
		<div className="container-page space-y-8 py-8">
			<PageHeader
				eyebrow="Blocks / Variants"
				title="组件变体"
				description="同一套 Props 契约，多种实现。直接导入、Provider 注入或 variant 属性都可以选择，当前页面只演示实时候选。"
			/>

			<div className="flex flex-wrap gap-2">
				{families.map((family) => (
					<Button
						key={family.id}
						variant={family.id === activeFamily.id ? "default" : "outline"}
						onClick={() => setActiveFamilyId(family.id)}
					>
						<LayoutTemplateIcon />
						{family.label}
						<Badge variant="secondary" className="ml-1">
							{family.variants.length}
						</Badge>
					</Button>
				))}
			</div>

			<MotionPresetProvider preset={preset}>
				<div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
					<Card className="overflow-hidden">
						<CardHeader className="border-b">
							<CardTitle>{activeFamily.label} 实时预览</CardTitle>
							<CardDescription>
								{activeFamily.description} 当前变体：{selectedVariant}
							</CardDescription>
						</CardHeader>
						<CardContent className="bg-muted/30 p-4">
							<Reveal>{activeFamily.render(selectedVariant)}</Reveal>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>选择变体</CardTitle>
							<CardDescription>每个变体都满足同一套契约。</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex flex-col gap-2">
								{activeFamily.variants.map((item) => {
									const active = item.id === selectedVariant;
									return (
										<Button
											key={item.id}
											variant={active ? "default" : "outline"}
											className="h-auto justify-between px-3 py-2"
											onClick={() => selectVariant(item.id)}
										>
											<span className="flex flex-col items-start gap-0.5">
												<span>{item.name}</span>
												<span
													className={
														active
															? "text-primary-foreground/70 text-xs"
															: "text-muted-foreground text-xs"
													}
												>
													{item.id}
												</span>
											</span>
											<Badge variant={active ? "secondary" : "outline"}>
												{item.status}
											</Badge>
										</Button>
									);
								})}
							</div>

							<div className="border-t pt-4">
								<p className="mb-2 text-sm font-medium">动效预设</p>
								<div className="grid grid-cols-2 gap-2">
									{presets.map((item) => (
										<Button
											key={item.value}
											size="sm"
											variant={preset === item.value ? "secondary" : "outline"}
											onClick={() => setPreset(item.value)}
										>
											{item.label}
										</Button>
									))}
								</div>
							</div>

							<div className="bg-muted rounded-md p-3 text-xs">
								<p className="text-muted-foreground mb-1">直接导入</p>
								<code className="break-all">
									{`import { ${exportName} } from "${importPath}";`}
								</code>
							</div>
						</CardContent>
					</Card>
				</div>

				<Stagger className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
					{activeFamily.variants.map((item) => (
						<StaggerItem key={item.id}>
							<Card className="h-full">
								<CardHeader>
									<CardTitle className="flex items-center justify-between gap-2">
										{item.name}
										<Badge variant="outline">{item.id}</Badge>
									</CardTitle>
									<CardDescription>{item.description}</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="flex flex-wrap gap-1.5">
										{item.tags.map((tag) => (
											<Badge key={tag} variant="secondary">
												{tag}
											</Badge>
										))}
									</div>
									<Button
										className="mt-4 w-full"
										variant={
											item.id === selectedVariant ? "default" : "outline"
										}
										onClick={() => selectVariant(item.id)}
									>
										{item.id === selectedVariant ? "当前使用" : "使用此变体"}
									</Button>
								</CardContent>
							</Card>
						</StaggerItem>
					))}
				</Stagger>
			</MotionPresetProvider>
		</div>
	);
}
