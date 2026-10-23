import {
	AlertCircleIcon,
	ArrowRightIcon,
	BellIcon,
	CalendarIcon,
	CheckIcon,
	ChevronDownIcon,
	CloudIcon,
	InfoIcon,
	Loader2Icon,
	MailIcon,
	MoreHorizontalIcon,
	PlusIcon,
	SearchIcon,
	SettingsIcon,
	SparklesIcon,
	Trash2Icon,
} from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
	Alert,
	AlertDescription,
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
	AlertTitle,
	Avatar,
	AvatarFallback,
	AvatarImage,
	Badge,
	Button,
	Calendar,
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Checkbox,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
	Input,
	Label,
	NumberTicker,
	PageHeader,
	PasswordInput,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Progress,
	RadioGroup,
	RadioGroupItem,
	ScrollArea,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Separator,
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
	ShimmerButton,
	Skeleton,
	Slider,
	Spinner,
	StatusBadge,
	Stepper,
	Switch,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
	Textarea,
	Toggle,
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
	TooltipButton,
	cn,
} from "@frontend-frame/ui";

import { Section } from "@/components/showcase";

function DemoCard({
	title,
	description,
	children,
	className,
	action,
}: {
	title: string;
	description?: string;
	children: React.ReactNode;
	className?: string;
	action?: React.ReactNode;
}) {
	return (
		<Card className={cn("gap-4", className)}>
			<CardHeader>
				<CardTitle className="text-sm font-semibold">{title}</CardTitle>
				{description ? <CardDescription>{description}</CardDescription> : null}
				{action ? <CardAction>{action}</CardAction> : null}
			</CardHeader>
			<CardContent>{children}</CardContent>
		</Card>
	);
}

export function ComponentsPage() {
	const [date, setDate] = React.useState<Date | undefined>(new Date());
	const [sliderValue, setSliderValue] = React.useState([64]);
	const [togglePressed, setTogglePressed] = React.useState(false);
	const [step, setStep] = React.useState(1);

	return (
		<div className="space-y-10">
			<PageHeader
				eyebrow="Component Gallery"
				title="组件画廊"
				description="从 llmgateway 中抽取并解耦的 shadcn / Radix 组件基座，统一了视觉令牌、交互状态、焦点管理与深色模式表现。"
				actions={
					<Badge variant="secondary" className="gap-1.5 py-1">
						<SparklesIcon className="size-3.5" />
						62 个组件
					</Badge>
				}
			/>

			<Section
				title="按钮 Buttons"
				description="按钮承载最主要的操作层级，支持 asChild 语义化渲染。"
			>
				<div className="grid gap-4 xl:grid-cols-2">
					<DemoCard
						title="变体"
						description="Default / Destructive / Outline / Secondary / Ghost / Link"
					>
						<div className="flex flex-wrap gap-2">
							<Button>主要操作</Button>
							<Button variant="destructive">删除</Button>
							<Button variant="outline">描边</Button>
							<Button variant="secondary">次要</Button>
							<Button variant="ghost">幽灵</Button>
							<Button variant="link">链接</Button>
						</div>
					</DemoCard>
					<DemoCard
						title="尺寸与图标"
						description="从 sm 到 lg，图标按钮保持 36px 点击热区。"
					>
						<div className="flex flex-wrap items-center gap-2">
							<Button size="sm">Small</Button>
							<Button>Default</Button>
							<Button size="lg">Large</Button>
							<Button size="icon" variant="outline" aria-label="添加">
								<PlusIcon />
							</Button>
							<Button variant="outline" disabled>
								<Loader2Icon className="animate-spin" />
								加载中
							</Button>
							<TooltipButton
								variant="outline"
								tooltipContent="按钮上方的轻量提示"
							>
								<InfoIcon />
								Tooltip 按钮
							</TooltipButton>
							<Spinner className="size-5" />
							<ShimmerButton className="px-4 py-2 text-sm">
								<span className="flex items-center gap-2">
									<SparklesIcon className="size-4" />
									Shimmer
								</span>
							</ShimmerButton>
						</div>
					</DemoCard>
				</div>
			</Section>

			<Section
				title="徽章与状态 Badges"
				description="统一状态语义，避免业务应用中红绿黄各自定义。"
			>
				<div className="grid gap-4 lg:grid-cols-3">
					<DemoCard title="Badge" description="语义化徽章变体">
						<div className="flex flex-wrap gap-2">
							<Badge>Default</Badge>
							<Badge variant="secondary">Secondary</Badge>
							<Badge variant="destructive">Destructive</Badge>
							<Badge variant="outline">Outline</Badge>
						</div>
					</DemoCard>
					<DemoCard title="StatusBadge" description="业务状态的标准表达">
						<div className="flex flex-wrap gap-2">
							<StatusBadge status="active" />
							<StatusBadge status="inactive" />
							<StatusBadge status={null} />
							<StatusBadge status="active" variant="simple" />
						</div>
					</DemoCard>
					<DemoCard title="Avatar" description="头像与回退占位">
						<div className="flex items-center gap-3">
							<Avatar>
								<AvatarImage src="https://github.com/vercel.png" alt="avatar" />
								<AvatarFallback>VF</AvatarFallback>
							</Avatar>
							<Avatar>
								<AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
									KC
								</AvatarFallback>
							</Avatar>
							<Avatar className="size-12">
								<AvatarFallback className="bg-emerald-500/15 text-emerald-600">
									A
								</AvatarFallback>
							</Avatar>
						</div>
					</DemoCard>
				</div>
			</Section>

			<Section
				title="表单控件 Form Controls"
				description="所有控件共享统一的边框、焦点环、禁用态与错误态。"
			>
				<div className="grid gap-4 lg:grid-cols-2">
					<DemoCard title="输入框" description="Input / Textarea / Select">
						<div className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="email">邮箱地址</Label>
								<Input id="email" type="email" placeholder="name@company.com" />
							</div>
							<div className="space-y-2">
								<Label htmlFor="message">备注</Label>
								<Textarea id="message" placeholder="补充说明..." />
							</div>
							<div className="space-y-2">
								<Label htmlFor="password">密码</Label>
								<PasswordInput id="password" placeholder="输入密码" />
							</div>
							<div className="space-y-2">
								<Label>套餐</Label>
								<Select defaultValue="pro">
									<SelectTrigger>
										<SelectValue placeholder="选择套餐" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="starter">Starter · ¥0</SelectItem>
										<SelectItem value="pro">Pro · ¥199</SelectItem>
										<SelectItem value="enterprise">
											Enterprise · 定制
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
					</DemoCard>
					<DemoCard
						title="选择控件"
						description="Checkbox / Switch / Radio / Slider"
					>
						<div className="space-y-5">
							<div className="flex items-center gap-2">
								<Checkbox id="terms" defaultChecked />
								<Label htmlFor="terms" className="font-normal">
									接收产品更新通知
								</Label>
							</div>
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium">双因素认证</p>
									<p className="text-muted-foreground text-xs">
										登录时要求验证码
									</p>
								</div>
								<Switch defaultChecked />
							</div>
							<div className="space-y-2">
								<Label>部署环境</Label>
								<RadioGroup defaultValue="staging" className="flex gap-5">
									<div className="flex items-center gap-2">
										<RadioGroupItem value="dev" id="env-dev" />
										<Label htmlFor="env-dev" className="font-normal">
											Dev
										</Label>
									</div>
									<div className="flex items-center gap-2">
										<RadioGroupItem value="staging" id="env-staging" />
										<Label htmlFor="env-staging" className="font-normal">
											Staging
										</Label>
									</div>
									<div className="flex items-center gap-2">
										<RadioGroupItem value="prod" id="env-prod" />
										<Label htmlFor="env-prod" className="font-normal">
											Prod
										</Label>
									</div>
								</RadioGroup>
							</div>
							<div className="space-y-3">
								<div className="flex items-center justify-between text-sm">
									<Label>CPU 配额</Label>
									<span className="text-muted-foreground font-mono">
										{sliderValue[0]}%
									</span>
								</div>
								<Slider
									value={sliderValue}
									onValueChange={setSliderValue}
									max={100}
									step={1}
								/>
							</div>
						</div>
					</DemoCard>
				</div>
			</Section>

			<Section
				title="浮层与交互 Overlays"
				description="Radix 提供的可访问性基础：焦点锁定、Esc 关闭、滚动锁定与键盘导航。"
			>
				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
					<DemoCard title="Dialog" description="模态对话框">
						<Dialog>
							<DialogTrigger asChild>
								<Button variant="outline" className="w-full">
									打开对话框
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>创建新项目</DialogTitle>
									<DialogDescription>
										项目创建后可邀请成员并配置环境。
									</DialogDescription>
								</DialogHeader>
								<div className="space-y-4 py-2">
									<div className="space-y-2">
										<Label htmlFor="project-name">项目名称</Label>
										<Input
											id="project-name"
											placeholder="例如：Design System"
										/>
									</div>
								</div>
								<DialogFooter>
									<Button variant="outline">取消</Button>
									<Button>创建</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</DemoCard>

					<DemoCard title="Sheet" description="侧边抽屉">
						<Sheet>
							<SheetTrigger asChild>
								<Button variant="outline" className="w-full">
									打开抽屉
								</Button>
							</SheetTrigger>
							<SheetContent>
								<SheetHeader>
									<SheetTitle>通知设置</SheetTitle>
									<SheetDescription>配置告警渠道与静默时段。</SheetDescription>
								</SheetHeader>
								<div className="space-y-5 px-4">
									{["邮件通知", "Webhook", "每日摘要"].map((item, index) => (
										<div
											key={item}
											className="flex items-center justify-between"
										>
											<span className="text-sm">{item}</span>
											<Switch defaultChecked={index !== 1} />
										</div>
									))}
								</div>
								<SheetFooter>
									<Button className="w-full">保存设置</Button>
								</SheetFooter>
							</SheetContent>
						</Sheet>
					</DemoCard>

					<DemoCard title="Dropdown" description="操作菜单">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" className="w-full">
									<MoreHorizontalIcon />
									更多操作
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="center" className="w-48">
								<DropdownMenuLabel>项目操作</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem>
									<SettingsIcon />
									设置
								</DropdownMenuItem>
								<DropdownMenuItem>
									<MailIcon />
									邀请成员
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem className="text-destructive focus:text-destructive">
									<Trash2Icon />
									删除项目
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</DemoCard>

					<DemoCard title="Tooltip & HoverCard" description="轻量提示">
						<div className="flex items-center gap-2">
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button variant="outline" size="icon" aria-label="信息">
											<InfoIcon />
										</Button>
									</TooltipTrigger>
									<TooltipContent>这是 Tooltip 提示</TooltipContent>
								</Tooltip>
							</TooltipProvider>
							<HoverCard>
								<HoverCardTrigger asChild>
									<Button variant="link" className="px-0">
										@design-team
									</Button>
								</HoverCardTrigger>
								<HoverCardContent className="w-72">
									<div className="flex gap-3">
										<Avatar>
											<AvatarFallback className="bg-indigo-500 text-white">
												DT
											</AvatarFallback>
										</Avatar>
										<div className="space-y-1">
											<p className="text-sm font-medium">Design Team</p>
											<p className="text-muted-foreground text-xs">
												负责设计系统、组件规范与品牌一致性。
											</p>
										</div>
									</div>
								</HoverCardContent>
							</HoverCard>
						</div>
					</DemoCard>

					<DemoCard title="AlertDialog" description="危险操作确认">
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button variant="destructive" className="w-full">
									删除工作区
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>确认删除？</AlertDialogTitle>
									<AlertDialogDescription>
										该操作不可撤销，所有项目数据将被永久移除。
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>取消</AlertDialogCancel>
									<AlertDialogAction>确认删除</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</DemoCard>

					<DemoCard title="Drawer" description="移动端底部抽屉">
						<Drawer>
							<DrawerTrigger asChild>
								<Button variant="outline" className="w-full">
									打开抽屉
								</Button>
							</DrawerTrigger>
							<DrawerContent>
								<DrawerHeader>
									<DrawerTitle>快捷操作</DrawerTitle>
									<DrawerDescription>
										适合移动端的底部操作面板
									</DrawerDescription>
								</DrawerHeader>
								<div className="grid gap-2 px-4">
									<Button variant="outline" className="justify-start">
										<PlusIcon /> 新建项目
									</Button>
									<Button variant="outline" className="justify-start">
										<MailIcon /> 邀请成员
									</Button>
								</div>
								<DrawerFooter>
									<DrawerClose asChild>
										<Button variant="secondary" className="w-full">
											关闭
										</Button>
									</DrawerClose>
								</DrawerFooter>
							</DrawerContent>
						</Drawer>
					</DemoCard>

					<DemoCard title="Popover" description="非模态浮层">
						<Popover>
							<PopoverTrigger asChild>
								<Button variant="outline" className="w-full">
									<CalendarIcon />
									选择日期
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0" align="center">
								<Calendar mode="single" selected={date} onSelect={setDate} />
							</PopoverContent>
						</Popover>
					</DemoCard>

					<DemoCard title="Toggle" description="可切换按钮">
						<Toggle
							pressed={togglePressed}
							onPressedChange={setTogglePressed}
							variant="outline"
						>
							<BellIcon />
							{togglePressed ? "已订阅" : "订阅通知"}
						</Toggle>
					</DemoCard>

					<DemoCard title="Toasts" description="Sonner 全局反馈">
						<div className="flex flex-wrap gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() =>
									toast.success("保存成功", {
										description: "配置已同步到所有环境。",
									})
								}
							>
								成功
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() =>
									toast.error("请求失败", { description: "请检查网络后重试。" })
								}
							>
								错误
							</Button>
						</div>
					</DemoCard>
				</div>
			</Section>

			<Section
				title="反馈与状态 Feedback"
				description="加载、空状态、提示与进度的统一表达。"
			>
				<div className="grid gap-4 lg:grid-cols-2">
					<DemoCard title="Alert" description="页面级提示">
						<div className="space-y-3">
							<Alert>
								<InfoIcon />
								<AlertTitle>版本更新</AlertTitle>
								<AlertDescription>
									组件库 v0.1.0 已发布，建议升级。
								</AlertDescription>
							</Alert>
							<Alert variant="destructive">
								<AlertCircleIcon />
								<AlertTitle>服务异常</AlertTitle>
								<AlertDescription>
									检测到 3 个接口错误率超过阈值。
								</AlertDescription>
							</Alert>
						</div>
					</DemoCard>
					<DemoCard title="Progress & Skeleton" description="进度与占位">
						<div className="space-y-5">
							<div className="space-y-2">
								<div className="flex justify-between text-xs">
									<span>上传进度</span>
									<span className="text-muted-foreground">72%</span>
								</div>
								<Progress value={72} />
							</div>
							<div className="flex items-center gap-3">
								<Skeleton className="size-10 rounded-full" />
								<div className="flex-1 space-y-2">
									<Skeleton className="h-3 w-1/2" />
									<Skeleton className="h-3 w-3/4" />
								</div>
							</div>
							<div className="flex gap-2">
								<Button variant="outline" size="sm">
									<CloudIcon />
									同步中
									<Loader2Icon className="animate-spin" />
								</Button>
								<Button variant="outline" size="sm">
									<CheckIcon />
									已完成
								</Button>
							</div>
						</div>
					</DemoCard>
					<DemoCard
						title="Empty State"
						description="列表无数据时的引导"
						className="lg:col-span-2"
					>
						<Empty className="border">
							<EmptyHeader>
								<EmptyMedia variant="icon">
									<SearchIcon />
								</EmptyMedia>
								<EmptyTitle>没有找到结果</EmptyTitle>
								<EmptyDescription>
									尝试调整搜索关键词，或创建一条新的记录。
								</EmptyDescription>
							</EmptyHeader>
							<EmptyContent>
								<Button size="sm">
									<PlusIcon />
									新建记录
								</Button>
							</EmptyContent>
						</Empty>
					</DemoCard>
				</div>
			</Section>

			<Section
				title="导航与数据展示 Navigation & Data"
				description="标签页、折叠面板、步骤条、数字动画与滚动容器。"
			>
				<div className="grid gap-4 lg:grid-cols-2">
					<DemoCard title="Tabs" description="内容分区">
						<Tabs defaultValue="overview">
							<TabsList className="grid w-full grid-cols-3">
								<TabsTrigger value="overview">概览</TabsTrigger>
								<TabsTrigger value="usage">用量</TabsTrigger>
								<TabsTrigger value="settings">设置</TabsTrigger>
							</TabsList>
							<TabsContent
								value="overview"
								className="text-muted-foreground mt-4 text-sm"
							>
								项目概览展示请求量、延迟、错误率与成本等核心指标。
							</TabsContent>
							<TabsContent
								value="usage"
								className="text-muted-foreground mt-4 text-sm"
							>
								用量标签页提供按模型、团队和时间维度的明细数据。
							</TabsContent>
							<TabsContent
								value="settings"
								className="text-muted-foreground mt-4 text-sm"
							>
								设置标签页用于管理密钥、路由策略与告警渠道。
							</TabsContent>
						</Tabs>
					</DemoCard>

					<DemoCard title="Accordion" description="渐进披露">
						<Accordion type="single" collapsible defaultValue="item-1">
							<AccordionItem value="item-1">
								<AccordionTrigger>如何接入组件库？</AccordionTrigger>
								<AccordionContent>
									安装 @frontend-frame/ui，并在应用入口引入 ThemeProvider
									与样式文件。
								</AccordionContent>
							</AccordionItem>
							<AccordionItem value="item-2">
								<AccordionTrigger>支持服务端渲染吗？</AccordionTrigger>
								<AccordionContent>
									组件全部使用 React 19 兼容写法，可配合 Next.js App Router
									使用。
								</AccordionContent>
							</AccordionItem>
							<AccordionItem value="item-3">
								<AccordionTrigger>如何定制主题？</AccordionTrigger>
								<AccordionContent>
									覆盖 CSS 变量中的语义令牌即可，无需修改组件源码。
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					</DemoCard>

					<DemoCard title="Stepper" description="多步骤流程">
						<Stepper
							steps={[
								{ id: "connect", title: "连接仓库" },
								{ id: "config", title: "配置环境" },
								{ id: "deploy", title: "部署应用" },
							]}
							activeStep={step}
							onStepChange={setStep}
						>
							<div className="bg-muted/40 rounded-lg border border-dashed p-6 text-center text-sm">
								当前步骤：{["连接仓库", "配置环境", "部署应用"][step]}
							</div>
						</Stepper>
					</DemoCard>

					<DemoCard
						title="Number Ticker"
						description="进入视口时触发的数字动画"
					>
						<div className="grid grid-cols-2 gap-4">
							<div className="bg-muted/30 rounded-lg p-4">
								<p className="text-muted-foreground text-xs">月度请求</p>
								<NumberTicker
									value={1284200}
									className="mt-1 text-2xl font-semibold"
								/>
							</div>
							<div className="bg-muted/30 rounded-lg p-4">
								<p className="text-muted-foreground text-xs">可用性</p>
								<NumberTicker
									value={99.98}
									decimalPlaces={2}
									className="mt-1 text-2xl font-semibold"
								/>
							</div>
						</div>
					</DemoCard>

					<DemoCard
						title="Scroll Area"
						description="自定义滚动条"
						className="lg:col-span-2"
					>
						<ScrollArea className="h-44 rounded-lg border">
							<div className="space-y-2 p-3">
								{Array.from({ length: 12 }).map((_, index) => (
									<div
										key={index}
										className="bg-muted/40 flex items-center gap-3 rounded-md p-3"
									>
										<Avatar className="size-7">
											<AvatarFallback className="text-[10px]">
												U{index + 1}
											</AvatarFallback>
										</Avatar>
										<div className="flex-1">
											<p className="text-sm">成员 {index + 1}</p>
											<p className="text-muted-foreground text-xs">
												member{index + 1}@example.com
											</p>
										</div>
										<Badge variant="outline" className="text-[10px]">
											Active
										</Badge>
									</div>
								))}
							</div>
						</ScrollArea>
					</DemoCard>
				</div>
			</Section>

			<Section
				title="排版与分隔 Typography & Layout"
				description="基础排版、分隔线、卡片组合与页脚操作。"
			>
				<div className="grid gap-4 lg:grid-cols-2">
					<DemoCard title="Typography" description="标题层级与正文">
						<div className="space-y-2">
							<h1 className="text-3xl font-semibold tracking-tight">
								Heading 1
							</h1>
							<h2 className="text-2xl font-semibold tracking-tight">
								Heading 2
							</h2>
							<h3 className="text-xl font-semibold tracking-tight">
								Heading 3
							</h3>
							<p className="text-muted-foreground text-sm leading-6">
								正文使用 14px / 24px 的行高，保证中文与英文混排时的可读性。
							</p>
							<Separator />
							<p className="text-xs text-muted-foreground">
								辅助说明文字 · 12px
							</p>
						</div>
					</DemoCard>
					<DemoCard
						title="Card Composition"
						description="卡片头、内容、动作与页脚"
					>
						<Card className="shadow-none">
							<CardHeader>
								<CardTitle>团队套餐</CardTitle>
								<CardDescription>Pro · 20 个席位</CardDescription>
								<CardAction>
									<Badge>推荐</Badge>
								</CardAction>
							</CardHeader>
							<CardContent className="text-muted-foreground text-sm">
								包含高级分析、SSO、审计日志与 99.9% SLA。
							</CardContent>
							<CardFooter className="justify-between">
								<span className="text-lg font-semibold">¥199/月</span>
								<Button size="sm">
									升级
									<ArrowRightIcon />
								</Button>
							</CardFooter>
						</Card>
					</DemoCard>
				</div>
			</Section>
		</div>
	);
}
