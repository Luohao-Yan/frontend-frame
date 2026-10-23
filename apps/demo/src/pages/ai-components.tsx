import {
	BrainCircuitIcon,
	CheckCircle2Icon,
	ChevronDownIcon,
	Clock3Icon,
	ExternalLinkIcon,
	Globe2Icon,
	KeyboardIcon,
	Loader2Icon,
	SearchIcon,
	SparklesIcon,
	WrenchIcon,
} from "lucide-react";
import * as React from "react";

import {
	Badge,
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
	Collapsible,
	CollapsibleContent,
	CollapsibleMessage,
	CollapsibleTrigger,
	KeyboardShortcutDialog,
	PageHeader,
	ProcessHeader,
	ProcessRail,
	Separator,
	SourceFavicons,
	Spinner,
	StatusIndicator,
	ToolBadge,
	TooltipButton,
	cn,
} from "@frontend-frame/ui";

import { Section } from "@/components/showcase";

const processSteps = [
	{
		title: "理解问题",
		status: "已完成",
		tone: "success" as const,
		detail: "识别用户意图，拆解为检索、对比与总结三个子任务。",
	},
	{
		title: "检索来源",
		status: "12 个结果",
		tone: "info" as const,
		detail: "调用搜索工具，按域名去重后保留 12 个高相关来源。",
	},
	{
		title: "生成答案",
		status: "进行中",
		tone: "warning" as const,
		detail: "正在综合来源内容，并标注引用位置与置信度。",
	},
];

const sources = [
	{
		url: "https://react.dev/reference/react",
		title: "React 官方文档",
		description: "React 19 组件与 Hooks 参考",
	},
	{
		url: "https://ui.shadcn.com/docs",
		title: "shadcn/ui 文档",
		description: "组合式组件与主题规范",
	},
	{
		url: "https://www.radix-ui.com/primitives",
		title: "Radix Primitives",
		description: "无样式可访问性原语",
	},
	{
		url: "https://tailwindcss.com/docs",
		title: "Tailwind CSS v4",
		description: "CSS-first 配置与工具类",
	},
];

const shortcuts = [
	{ id: "search", keys: ["Ctrl", "K"], description: "打开全局搜索" },
	{ id: "new", keys: ["Ctrl", "N"], description: "新建对话" },
	{ id: "shortcuts", keys: ["?"], description: "显示快捷键帮助" },
];

const carouselItems = [
	{
		title: "检索增强",
		description: "把搜索、抓取与引用整合成可追溯的答案流程。",
		icon: SearchIcon,
		gradient: "from-blue-500/15 to-cyan-500/5",
	},
	{
		title: "工具调用",
		description: "统一工具徽章、执行状态与结果展示。",
		icon: WrenchIcon,
		gradient: "from-violet-500/15 to-fuchsia-500/5",
	},
	{
		title: "过程可视化",
		description: "用轨道、折叠面板和状态指示器呈现 Agent 思考过程。",
		icon: BrainCircuitIcon,
		gradient: "from-emerald-500/15 to-teal-500/5",
	},
];

export function AiComponentsPage() {
	const [expandedStep, setExpandedStep] = React.useState(0);
	const [thinkingOpen, setThinkingOpen] = React.useState(true);
	const [shortcutOpen, setShortcutOpen] = React.useState(false);

	return (
		<div className="space-y-10">
			<PageHeader
				eyebrow="Morphic Collection"
				title="AI / Agent 组件"
				description="从 Morphic 抽取的 AI 界面通用组件：过程轨道、工具调用徽章、来源 favicon、可折叠消息、快捷键面板与 Embla 轮播。全部已去除 Next.js、Supabase 与业务状态耦合。"
				actions={
					<Badge variant="secondary" className="gap-1.5 py-1">
						<SparklesIcon className="size-3.5" />
						14 个新增组件
					</Badge>
				}
			/>

			<div className="grid gap-4 sm:grid-cols-3">
				{[
					{
						label: "过程阶段",
						value: "3",
						description: "轨道 + 状态 + 折叠内容",
					},
					{
						label: "来源去重",
						value: "4",
						description: "自动提取域名并叠加 favicon",
					},
					{ label: "快捷键", value: "3", description: "可配置的帮助面板" },
				].map((item) => (
					<Card key={item.label}>
						<CardContent className="p-5">
							<p className="text-muted-foreground text-xs">{item.label}</p>
							<p className="mt-1 text-2xl font-semibold">{item.value}</p>
							<p className="text-muted-foreground mt-1 text-xs">
								{item.description}
							</p>
						</CardContent>
					</Card>
				))}
			</div>

			<Section
				title="思考过程 Process"
				description="ProcessRail 提供时间线轨道，ProcessHeader 负责阶段标题与状态，适合 Agent 执行过程。"
			>
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-sm">
							<BrainCircuitIcon className="size-4" />
							Agent 执行轨迹
						</CardTitle>
						<CardDescription>点击阶段标题展开详情</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							{processSteps.map((step, index) => (
								<div key={step.title} className="flex gap-3">
									<ProcessRail
										isFirst={index === 0}
										isLast={index === processSteps.length - 1}
									/>
									<div className="min-w-0 flex-1 pb-4">
										<ProcessHeader
											label={
												<div className="flex flex-wrap items-center gap-2">
													<StatusIndicator
														icon={
															index === processSteps.length - 1
																? Loader2Icon
																: CheckCircle2Icon
														}
														tone={step.tone}
														iconClassName={
															index === processSteps.length - 1
																? "animate-spin"
																: undefined
														}
													>
														{step.status}
													</StatusIndicator>
													<span className="text-foreground text-sm font-medium">
														{step.title}
													</span>
												</div>
											}
											meta={
												<span className="hidden sm:inline">
													步骤 {index + 1}
												</span>
											}
											aria-expanded={expandedStep === index}
											onClick={() =>
												setExpandedStep((current) =>
													current === index ? -1 : index,
												)
											}
										/>
										{expandedStep === index ? (
											<div className="bg-muted/40 text-muted-foreground mt-2 rounded-md border p-3 text-xs leading-5">
												{step.detail}
											</div>
										) : null}
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</Section>

			<Section
				title="工具调用 Tool Invocation"
				description="用 ToolBadge 标记工具类型，StatusIndicator 表达执行状态，Spinner 与 TooltipButton 提供轻量反馈。"
			>
				<Card>
					<CardContent className="flex flex-wrap items-center gap-3 pt-6">
						<ToolBadge tool="search">Web Search · react hooks</ToolBadge>
						<ToolBadge tool="fetch">Fetch · react.dev</ToolBadge>
						<ToolBadge tool="code" isLoading>
							Running · code interpreter
						</ToolBadge>
						<ToolBadge tool="search" icon={<Globe2Icon />}>
							Custom icon
						</ToolBadge>
						<Separator orientation="vertical" className="h-6" />
						<StatusIndicator icon={CheckCircle2Icon} tone="success">
							2 个工具已完成
						</StatusIndicator>
						<StatusIndicator icon={Clock3Icon} tone="warning">
							1 个工具排队中
						</StatusIndicator>
						<Spinner className="size-4" />
						<TooltipButton
							variant="outline"
							size="sm"
							tooltipContent="重新执行当前工具"
						>
							<Loader2Icon />
							重新执行
						</TooltipButton>
					</CardContent>
				</Card>
			</Section>

			<Section
				title="可折叠消息 Collapsible Message"
				description="支持 default、minimal、process 三种密度，可传入自定义头像与左侧内容。"
			>
				<div className="grid gap-4 lg:grid-cols-2">
					<CollapsibleMessage
						isCollapsible
						isOpen={thinkingOpen}
						onOpenChange={setThinkingOpen}
						header={
							<div className="flex items-center gap-2">
								<StatusIndicator icon={SparklesIcon} tone="info">
									思考过程
								</StatusIndicator>
								<span className="text-muted-foreground text-xs">2.4s</span>
							</div>
						}
					>
						<div className="text-muted-foreground space-y-2 text-sm leading-6">
							<p>
								先确认组件库的技术栈与主题令牌，再按依赖关系拆分基础组件与业务组件。
							</p>
							<p>最终输出需要使用统一的导出入口，并保留可访问性属性。</p>
						</div>
					</CollapsibleMessage>

					<CollapsibleMessage
						variant="process"
						isCollapsible
						defaultOpen
						header={
							<ProcessHeader
								label={
									<span className="flex items-center gap-2">
										<ToolBadge tool="search">搜索</ToolBadge>
										<span>检索设计系统最佳实践</span>
									</span>
								}
								meta={<span>3 个来源</span>}
							/>
						}
					>
						<div className="text-muted-foreground text-xs leading-5">
							已检索 React、Radix UI 与 shadcn/ui 文档，并将来源域名聚合为
							favicon 栈。
						</div>
					</CollapsibleMessage>
				</div>
			</Section>

			<Section
				title="来源与引用 Sources"
				description="SourceFavicons 自动解析 URL、按域名去重并叠加展示，可直接用于搜索结果或 RAG 引用。"
			>
				<Card>
					<CardContent className="space-y-4 pt-6">
						<div className="flex items-center justify-between gap-4">
							<div>
								<p className="text-sm font-medium">检索来源</p>
								<p className="text-muted-foreground text-xs">4 个唯一域名</p>
							</div>
							<SourceFavicons sources={sources} maxDisplay={4} size={20} />
						</div>
						<Separator />
						<div className="grid gap-2 sm:grid-cols-2">
							{sources.map((source) => (
								<div
									key={source.url}
									className="hover:bg-muted/50 flex items-start gap-3 rounded-lg border p-3 transition-colors"
								>
									<SourceFavicons sources={[source]} size={18} />
									<div className="min-w-0 flex-1">
										<p className="truncate text-sm font-medium">
											{source.title}
										</p>
										<p className="text-muted-foreground truncate text-xs">
											{source.description}
										</p>
									</div>
									<ExternalLinkIcon className="text-muted-foreground mt-0.5 size-3.5 shrink-0" />
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</Section>

			<Section
				title="轮播 Carousel"
				description="基于 Embla 的无依赖轮播，支持键盘方向键、上一张/下一张与自定义 API。"
			>
				<Carousel className="mx-auto w-full max-w-2xl px-10">
					<CarouselContent>
						{carouselItems.map((item) => (
							<CarouselItem key={item.title}>
								<div
									className={cn("bg-gradient-to-br p-6 sm:p-8", item.gradient)}
								>
									<div className="bg-background mb-4 flex size-11 items-center justify-center rounded-xl border shadow-sm">
										<item.icon className="size-5" />
									</div>
									<h3 className="text-xl font-semibold tracking-tight">
										{item.title}
									</h3>
									<p className="text-muted-foreground mt-2 max-w-md text-sm leading-6">
										{item.description}
									</p>
								</div>
							</CarouselItem>
						))}
					</CarouselContent>
					<CarouselPrevious />
					<CarouselNext />
				</Carousel>
			</Section>

			<Section
				title="快捷键与折叠面板 Keyboard & Collapsible"
				description="KeyboardShortcutDialog 接受任意快捷键配置；Collapsible 提供标准的展开/收起语义。"
			>
				<div className="grid gap-4 lg:grid-cols-2">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-sm">
								<KeyboardIcon className="size-4" />
								快捷键面板
							</CardTitle>
							<CardDescription>
								按钮触发，或由业务层绑定全局快捷键
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Button variant="outline" onClick={() => setShortcutOpen(true)}>
								<KeyboardIcon />
								查看快捷键
							</Button>
							<KeyboardShortcutDialog
								open={shortcutOpen}
								onOpenChange={setShortcutOpen}
								shortcuts={shortcuts}
							/>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="text-sm">Collapsible</CardTitle>
							<CardDescription>带高度动画的基础折叠容器</CardDescription>
						</CardHeader>
						<CardContent>
							<Collapsible defaultOpen className="rounded-lg border p-4">
								<CollapsibleTrigger asChild>
									<Button
										variant="ghost"
										className="w-full justify-between px-0"
									>
										高级设置
										<ChevronDownIcon />
									</Button>
								</CollapsibleTrigger>
								<CollapsibleContent className="data-[state=closed]:animate-collapse-up data-[state=open]:animate-collapse-down">
									<div className="text-muted-foreground space-y-2 overflow-hidden pt-3 text-sm">
										<p>可以在这里放置路由策略、缓存时间与超时配置。</p>
										<p>内容会以高度动画展开，并保留 Radix 的可访问性状态。</p>
									</div>
								</CollapsibleContent>
							</Collapsible>
						</CardContent>
					</Card>
				</div>
			</Section>
		</div>
	);
}
