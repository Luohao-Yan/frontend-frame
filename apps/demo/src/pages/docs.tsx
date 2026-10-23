import {
	ArrowRightIcon,
	BrainCircuitIcon,
	BoxesIcon,
	CheckCircle2Icon,
	LayersIcon,
	PackageIcon,
	PaletteIcon,
	ShieldCheckIcon,
	TerminalIcon,
} from "lucide-react";

import {
	Alert,
	AlertDescription,
	AlertTitle,
	Badge,
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	PageHeader,
	Separator,
} from "@frontend-frame/ui";

import { CodeBlock, PropTable, Section } from "@/components/showcase";

const installCode = `# 在 workspace 内安装
pnpm add @frontend-frame/ui --filter your-app

# 或者直接在 package.json 中声明
{
  "dependencies": {
    "@frontend-frame/ui": "workspace:*"
  }
}`;

const cssCode = `/* app/styles.css */
@import "tailwindcss";
@import "@frontend-frame/ui/styles.css";

/* 让 Tailwind 扫描组件库源码中的类名 */
@source "../../packages/ui/src/**/*.{ts,tsx}";
@plugin "tailwindcss-animate";`;

const providerCode = `import { ThemeProvider } from "@frontend-frame/ui";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>,
);`;

const usageCode = `import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@frontend-frame/ui";

export function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>月度用量</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <span className="text-2xl font-semibold">1,284,200</span>
        <Button>查看详情</Button>
      </CardContent>
    </Card>
  );
}`;

const treeCode = `frontend-frame/
├─ apps/
│  └─ demo/                 # Vite 演示应用（应用壳 + 页面示例）
├─ packages/
│  └─ ui/                   # 公共组件库 @frontend-frame/ui
│     ├─ src/components/    # Radix / shadcn 组件与业务通用组件
│     ├─ src/hooks/         # 通用 hooks
│     ├─ src/lib/           # cn 等工具函数
│     ├─ src/styles.css     # 设计令牌与全局样式入口
│     └─ src/index.ts       # 统一导出
├─ tsconfig.base.json
└─ pnpm-workspace.yaml`;

const componentGroups = [
	{
		icon: BoxesIcon,
		title: "基础控件",
		items: [
			"Button",
			"Input",
			"Textarea",
			"Select",
			"Checkbox",
			"RadioGroup",
			"Switch",
			"Slider",
			"Label",
		],
	},
	{
		icon: LayersIcon,
		title: "布局与展示",
		items: [
			"Card",
			"Tabs",
			"Accordion",
			"Table",
			"DataTable",
			"PageHeader",
			"StatCard",
			"Empty",
			"Sidebar",
			"NavSidebar",
		],
	},
	{
		icon: PaletteIcon,
		title: "反馈与浮层",
		items: [
			"Dialog",
			"AlertDialog",
			"Sheet",
			"Popover",
			"Tooltip",
			"HoverCard",
			"DropdownMenu",
			"Alert",
			"Sonner",
		],
	},
	{
		icon: ShieldCheckIcon,
		title: "表单与主题",
		items: [
			"Form",
			"Field",
			"ThemeProvider",
			"ThemeToggle",
			"Calendar",
			"Stepper",
			"NumberTicker",
			"Chart",
		],
	},
	{
		icon: BrainCircuitIcon,
		title: "AI / Agent",
		items: [
			"Collapsible",
			"CollapsibleMessage",
			"ProcessHeader",
			"ProcessRail",
			"ToolBadge",
			"SourceFavicons",
			"StatusIndicator",
			"Spinner",
			"PasswordInput",
			"TooltipButton",
			"Carousel",
			"Drawer",
			"KeyboardShortcutDialog",
			"ThemeMenuItems",
		],
	},
];

export function DocsPage() {
	return (
		<div className="space-y-10">
			<PageHeader
				eyebrow="Documentation"
				title="接入文档"
				description="面向业务应用的组件库接入指南。目标是把页面开发收敛到同一套组件、令牌与交互约定上。"
				actions={
					<Button asChild>
						<a href="https://ui.shadcn.com" target="_blank" rel="noreferrer">
							组件规范
							<ArrowRightIcon />
						</a>
					</Button>
				}
			/>

			<div className="grid gap-4 sm:grid-cols-3">
				{[
					{
						label: "组件数量",
						value: "62",
						description: "基础 + 业务通用组件",
					},
					{
						label: "运行时依赖",
						value: "React 19",
						description: "Radix UI + Tailwind v4",
					},
					{
						label: "主题模式",
						value: "3",
						description: "Light / Dark / System",
					},
				].map((item) => (
					<Card key={item.label}>
						<CardContent className="p-5">
							<p className="text-muted-foreground text-xs">{item.label}</p>
							<p className="mt-1 text-2xl font-semibold tracking-tight">
								{item.value}
							</p>
							<p className="text-muted-foreground mt-1 text-xs">
								{item.description}
							</p>
						</CardContent>
					</Card>
				))}
			</div>

			<Section
				title="快速开始"
				description="三步接入：安装依赖、引入样式、包裹 ThemeProvider"
			>
				<div className="grid gap-4 lg:grid-cols-3">
					<div className="space-y-2">
						<div className="flex items-center gap-2">
							<Badge className="size-6 justify-center rounded-full p-0">
								1
							</Badge>
							<p className="text-sm font-medium">安装组件库</p>
						</div>
						<CodeBlock code={installCode} language="bash" />
					</div>
					<div className="space-y-2">
						<div className="flex items-center gap-2">
							<Badge className="size-6 justify-center rounded-full p-0">
								2
							</Badge>
							<p className="text-sm font-medium">引入主题样式</p>
						</div>
						<CodeBlock code={cssCode} language="css" />
					</div>
					<div className="space-y-2">
						<div className="flex items-center gap-2">
							<Badge className="size-6 justify-center rounded-full p-0">
								3
							</Badge>
							<p className="text-sm font-medium">挂载主题 Provider</p>
						</div>
						<CodeBlock code={providerCode} />
					</div>
				</div>
			</Section>

			<Alert>
				<TerminalIcon />
				<AlertTitle>开发命令</AlertTitle>
				<AlertDescription>
					<code className="font-mono text-xs">pnpm dev</code> 启动演示应用，
					<code className="ml-1 font-mono text-xs">pnpm build</code>{" "}
					构建组件库与 Demo，
					<code className="ml-1 font-mono text-xs">pnpm typecheck</code>{" "}
					执行全量类型检查。
				</AlertDescription>
			</Alert>

			<Section
				title="项目结构"
				description="组件库与演示应用分离，业务应用只依赖 packages/ui"
			>
				<div className="grid gap-4 lg:grid-cols-2">
					<CodeBlock code={treeCode} language="text" />
					<div className="space-y-4">
						{[
							{
								title: "包边界清晰",
								description:
									"组件、hooks、工具函数全部通过 @frontend-frame/ui 统一导出，业务不直接引用内部路径。",
							},
							{
								title: "双向类型安全",
								description:
									"组件库输出 .d.ts 声明，Demo 在 CI 中执行 tsc --noEmit，避免隐式 any。",
							},
							{
								title: "主题可覆盖",
								description:
									"设计令牌使用 CSS 变量，支持按品牌覆盖而无需 fork 组件源码。",
							},
						].map((item) => (
							<div
								key={item.title}
								className="flex gap-3 rounded-lg border p-4"
							>
								<CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-emerald-600" />
								<div>
									<p className="text-sm font-medium">{item.title}</p>
									<p className="text-muted-foreground mt-1 text-xs leading-5">
										{item.description}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</Section>

			<Section
				title="基础用法"
				description="组件保持 shadcn 的组合式 API，业务侧通过 children 组合结构"
			>
				<CodeBlock code={usageCode} />
			</Section>

			<Section
				title="组件清单"
				description="按职责分组，避免业务应用重复实现同类交互"
			>
				<div className="grid gap-4 md:grid-cols-2">
					{componentGroups.map((group) => (
						<Card key={group.title}>
							<CardHeader className="flex-row items-center gap-3">
								<div className="bg-muted rounded-lg p-2">
									<group.icon className="size-4" />
								</div>
								<div>
									<CardTitle className="text-sm">{group.title}</CardTitle>
									<CardDescription>{group.items.length} 个组件</CardDescription>
								</div>
							</CardHeader>
							<CardContent className="flex flex-wrap gap-1.5">
								{group.items.map((item) => (
									<Badge
										key={item}
										variant="secondary"
										className="font-mono text-[10px]"
									>
										{item}
									</Badge>
								))}
							</CardContent>
						</Card>
					))}
				</div>
			</Section>

			<Section
				title="DataTable API"
				description="后台列表页的核心封装，默认启用排序、搜索、分页与列显隐"
			>
				<PropTable
					rows={[
						{
							name: "columns",
							type: "ColumnDef<TData, TValue>[]",
							description: "TanStack Table 列定义，必填。",
						},
						{
							name: "data",
							type: "TData[]",
							description: "表格数据源，必填。",
						},
						{
							name: "filterColumn",
							type: "string",
							description: "指定搜索列 id；缺省时跨所有字段搜索。",
						},
						{
							name: "searchPlaceholder",
							type: "string",
							defaultValue: "搜索...",
							description: "搜索框占位文案。",
						},
						{
							name: "pageSize",
							type: "number",
							defaultValue: "8",
							description: "每页记录数。",
						},
						{
							name: "toolbar",
							type: "ReactNode",
							description: "搜索框右侧的自定义操作区。",
						},
					]}
				/>
			</Section>

			<Section
				title="开发约定"
				description="为了保证统一体验，业务应用应遵循以下约束"
			>
				<div className="grid gap-4 lg:grid-cols-2">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-sm">
								<PackageIcon className="size-4" />
								组件新增
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2 text-sm leading-6">
							<p>1. 优先复用 shadcn / Radix 原语，避免自造基础交互。</p>
							<p>
								2. 所有可复用组件必须提供 ref 或 React 19 的 ref prop 兼容。
							</p>
							<p>
								3. 新增导出后同步更新{" "}
								<code className="font-mono text-xs">src/index.ts</code>。
							</p>
							<p>4. 业务语义（如 StatusBadge）与基础组件分层放置。</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-sm">
								<ShieldCheckIcon className="size-4" />
								可访问性
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2 text-sm leading-6">
							<p>
								1. 图标按钮必须提供{" "}
								<code className="font-mono text-xs">aria-label</code>。
							</p>
							<p>2. 表单错误通过 FormMessage 关联 aria-describedby。</p>
							<p>3. 弹层使用 Radix Dialog / Sheet，保留焦点锁定与 Esc 关闭。</p>
							<p>4. 颜色不能作为唯一状态表达，状态徽章需同时包含文字与图标。</p>
						</CardContent>
					</Card>
				</div>
			</Section>

			<Separator />
			<div className="text-muted-foreground flex flex-col gap-2 text-xs sm:flex-row sm:items-center sm:justify-between">
				<span>Frontend Frame · v0.1.0</span>
				<span>React 19 · TypeScript 5.9 · Tailwind CSS 4 · Radix UI</span>
			</div>
		</div>
	);
}
