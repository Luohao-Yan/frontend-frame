import * as React from "react";

import {
	Badge,
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	PageHeader,
	Separator,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@frontend-frame/ui";

import { CodeBlock, Section } from "@/components/showcase";

const semanticColors = [
	{ name: "background", label: "背景", className: "bg-background border" },
	{ name: "foreground", label: "前景", className: "bg-foreground" },
	{ name: "card", label: "卡片", className: "bg-card border" },
	{ name: "primary", label: "主色", className: "bg-primary" },
	{ name: "secondary", label: "次色", className: "bg-secondary" },
	{ name: "muted", label: "弱化", className: "bg-muted" },
	{ name: "accent", label: "强调", className: "bg-accent" },
	{ name: "destructive", label: "危险", className: "bg-destructive" },
	{ name: "border", label: "边框", className: "bg-border" },
	{ name: "ring", label: "焦点环", className: "bg-ring" },
];

const chartColors = [
	{ name: "chart-1", className: "bg-chart-1" },
	{ name: "chart-2", className: "bg-chart-2" },
	{ name: "chart-3", className: "bg-chart-3" },
	{ name: "chart-4", className: "bg-chart-4" },
	{ name: "chart-5", className: "bg-chart-5" },
];

function ColorSwatch({
	name,
	label,
	className,
}: {
	name: string;
	label?: string;
	className: string;
}) {
	return (
		<div className="space-y-2">
			<div className={`h-16 rounded-lg ${className}`} />
			<div className="min-w-0">
				<p className="truncate text-xs font-medium">{label ?? name}</p>
				<p className="text-muted-foreground truncate font-mono text-[10px]">
					--{name}
				</p>
			</div>
		</div>
	);
}

function ThemePreview({ mode }: { mode: "light" | "dark" }) {
	return (
		<div className={mode === "dark" ? "dark" : undefined}>
			<div className="bg-background text-foreground overflow-hidden rounded-xl border p-4">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-sm font-semibold">组件预览</p>
						<p className="text-muted-foreground text-xs">
							{mode === "dark" ? "Dark mode" : "Light mode"}
						</p>
					</div>
					<Badge variant="secondary">Pro</Badge>
				</div>
				<Separator className="my-4" />
				<div className="bg-muted/50 space-y-3 rounded-lg p-3">
					<div className="flex items-center gap-3">
						<div className="bg-primary size-9 rounded-lg" />
						<div className="flex-1 space-y-1.5">
							<div className="bg-foreground/80 h-2.5 w-24 rounded" />
							<div className="bg-muted-foreground/40 h-2 w-16 rounded" />
						</div>
						<Button size="sm">操作</Button>
					</div>
					<div className="grid grid-cols-3 gap-2">
						<div className="bg-card h-12 rounded-md border" />
						<div className="bg-card h-12 rounded-md border" />
						<div className="bg-card h-12 rounded-md border" />
					</div>
				</div>
			</div>
		</div>
	);
}

const tokenExample = `:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.141 0.005 285.823);
  --primary: oklch(0.21 0.006 285.885);
  --primary-foreground: oklch(0.985 0 0);
  --border: oklch(0.92 0.004 286.32);
  --radius: 0.625rem;
}

/* 业务应用只需要覆盖令牌，不用改组件 */
.brand-blue {
  --primary: oklch(0.55 0.22 265);
  --primary-foreground: oklch(0.985 0 0);
}`;

export function TokensPage() {
	const [tab, setTab] = React.useState("light");

	return (
		<div className="space-y-10">
			<PageHeader
				eyebrow="Design Tokens"
				title="设计令牌"
				description="颜色、圆角、字体与间距全部通过 CSS 变量表达。业务应用只覆盖语义令牌，即可获得一致的主题能力。"
				actions={<Badge variant="outline">oklch color space</Badge>}
			/>

			<Section
				title="语义色彩"
				description="组件只消费语义变量，不直接引用具体色值"
			>
				<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
					{semanticColors.map((color) => (
						<ColorSwatch key={color.name} {...color} />
					))}
				</div>
			</Section>

			<Section
				title="图表色板"
				description="为多系列数据可视化提供稳定的色彩顺序"
			>
				<div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
					{chartColors.map((color) => (
						<ColorSwatch
							key={color.name}
							name={color.name}
							className={color.className}
						/>
					))}
				</div>
			</Section>

			<Section
				title="主题模式"
				description="同一套令牌在 light / dark 下自动切换"
			>
				<Tabs value={tab} onValueChange={setTab}>
					<TabsList>
						<TabsTrigger value="light">浅色</TabsTrigger>
						<TabsTrigger value="dark">深色</TabsTrigger>
						<TabsTrigger value="both">并排对比</TabsTrigger>
					</TabsList>
					<TabsContent value="light" className="mt-4">
						<ThemePreview mode="light" />
					</TabsContent>
					<TabsContent value="dark" className="mt-4">
						<ThemePreview mode="dark" />
					</TabsContent>
					<TabsContent value="both" className="mt-4">
						<div className="grid gap-4 lg:grid-cols-2">
							<ThemePreview mode="light" />
							<ThemePreview mode="dark" />
						</div>
					</TabsContent>
				</Tabs>
			</Section>

			<Section
				title="字体层级"
				description="Inter 作为界面字体，Geist Mono 用于代码与数字"
			>
				<Card>
					<CardContent className="space-y-6 pt-6">
						<div className="grid gap-6 lg:grid-cols-2">
							<div className="space-y-4">
								<div>
									<p className="text-muted-foreground mb-1 font-mono text-[10px]">
										text-4xl / 36px
									</p>
									<p className="text-4xl font-semibold tracking-tight">
										Design with clarity
									</p>
								</div>
								<div>
									<p className="text-muted-foreground mb-1 font-mono text-[10px]">
										text-3xl / 30px
									</p>
									<p className="text-3xl font-semibold tracking-tight">
										统一的产品体验
									</p>
								</div>
								<div>
									<p className="text-muted-foreground mb-1 font-mono text-[10px]">
										text-2xl / 24px
									</p>
									<p className="text-2xl font-semibold tracking-tight">
										页面标题
									</p>
								</div>
								<div>
									<p className="text-muted-foreground mb-1 font-mono text-[10px]">
										text-lg / 18px
									</p>
									<p className="text-lg font-semibold">区块标题</p>
								</div>
							</div>
							<div className="space-y-4">
								<div>
									<p className="text-muted-foreground mb-1 font-mono text-[10px]">
										text-base / 16px
									</p>
									<p className="text-base leading-7">
										正文内容用于承载主要信息，保持 16px 字号与 1.75 行高。
									</p>
								</div>
								<div>
									<p className="text-muted-foreground mb-1 font-mono text-[10px]">
										text-sm / 14px
									</p>
									<p className="text-sm leading-6">
										表格、表单与导航等密集界面使用 14px。
									</p>
								</div>
								<div>
									<p className="text-muted-foreground mb-1 font-mono text-[10px]">
										text-xs / 12px
									</p>
									<p className="text-muted-foreground text-xs">
										辅助说明与时间戳使用 12px。
									</p>
								</div>
								<div>
									<p className="text-muted-foreground mb-1 font-mono text-[10px]">
										font-mono
									</p>
									<p className="font-mono text-sm">
										const tokens = &#123; radius: 10 &#125;;
									</p>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</Section>

			<Section
				title="圆角、阴影与间距"
				description="以 4px 为基础的间距系统，统一组件视觉节奏"
			>
				<div className="grid gap-4 lg:grid-cols-2">
					<Card>
						<CardHeader>
							<CardTitle className="text-sm">圆角 Radius</CardTitle>
							<CardDescription>
								从 sm 到 xl，对应 6px / 8px / 10px / 14px
							</CardDescription>
						</CardHeader>
						<CardContent className="flex flex-wrap items-end gap-4">
							{[
								["rounded-sm", "sm"],
								["rounded-md", "md"],
								["rounded-lg", "lg"],
								["rounded-xl", "xl"],
								["rounded-full", "full"],
							].map(([className, label]) => (
								<div key={label} className="space-y-2 text-center">
									<div
										className={`bg-primary/15 border-primary/30 size-16 border ${className}`}
									/>
									<p className="text-muted-foreground font-mono text-[10px]">
										{label}
									</p>
								</div>
							))}
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle className="text-sm">阴影与层级</CardTitle>
							<CardDescription>浮层使用更明显的阴影表达层级</CardDescription>
						</CardHeader>
						<CardContent className="grid grid-cols-3 gap-4">
							<div className="bg-card flex h-20 items-center justify-center rounded-lg border text-xs shadow-xs">
								xs
							</div>
							<div className="bg-card flex h-20 items-center justify-center rounded-lg border text-xs shadow-sm">
								sm
							</div>
							<div className="bg-card flex h-20 items-center justify-center rounded-lg border text-xs shadow-lg">
								lg
							</div>
						</CardContent>
					</Card>
					<Card className="lg:col-span-2">
						<CardHeader>
							<CardTitle className="text-sm">间距 Spacing</CardTitle>
							<CardDescription>
								4px 基准，Tailwind 间距刻度可直接使用
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-3">
							{[1, 2, 3, 4, 6, 8, 12].map((space) => (
								<div key={space} className="flex items-center gap-3">
									<span className="text-muted-foreground w-10 font-mono text-[10px]">
										{space * 4}px
									</span>
									<div
										className="bg-primary/60 h-2 rounded-full"
										style={{ width: `${space * 16}px` }}
									/>
									<span className="text-muted-foreground font-mono text-[10px]">
										gap-{space}
									</span>
								</div>
							))}
						</CardContent>
					</Card>
				</div>
			</Section>

			<Section
				title="覆盖令牌"
				description="推荐在应用根节点增加主题类，而不是修改组件源码"
			>
				<CodeBlock code={tokenExample} language="css" />
			</Section>
		</div>
	);
}
