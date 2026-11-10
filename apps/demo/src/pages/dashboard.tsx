import {
	ActivityIcon,
	ArrowRightIcon,
	CreditCardIcon,
	DatabaseIcon,
	DownloadIcon,
	LogInIcon,
	PlusIcon,
	ShieldCheckIcon,
	SparklesIcon,
	UsersIcon,
	ZapIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
	Alert,
	AlertDescription,
	AlertTitle,
	Avatar,
	AvatarFallback,
	Badge,
	Button,
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	PageHeader,
	Progress,
	Separator,
	StatCard,
	StatusBadge,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	DeltaPill,
	Metric,
	Ruler,
	SectionLabel,
	SpecPlate,
	TickRing,
	usePageEnter,
	useRevealCascade,
} from "@frontend-frame/ui";

import type { ChartConfig } from "@frontend-frame/ui";

const chartData = [
	{ date: "10-10", requests: 1840, errors: 24 },
	{ date: "10-11", requests: 2210, errors: 31 },
	{ date: "10-12", requests: 1980, errors: 18 },
	{ date: "10-13", requests: 2560, errors: 42 },
	{ date: "10-14", requests: 3120, errors: 27 },
	{ date: "10-15", requests: 2870, errors: 22 },
	{ date: "10-16", requests: 3480, errors: 35 },
	{ date: "10-17", requests: 4010, errors: 29 },
	{ date: "10-18", requests: 3760, errors: 16 },
	{ date: "10-19", requests: 4320, errors: 21 },
	{ date: "10-20", requests: 4890, errors: 33 },
	{ date: "10-21", requests: 5120, errors: 25 },
	{ date: "10-22", requests: 5480, errors: 19 },
	{ date: "10-23", requests: 6020, errors: 17 },
];

const chartConfig = {
	requests: { label: "请求数", color: "var(--chart-1)" },
	errors: { label: "错误数", color: "var(--chart-5)" },
} satisfies ChartConfig;

const recentRequests = [
	{
		id: "req_8f2a",
		model: "gpt-5.1",
		user: "林晓",
		status: "active",
		latency: "842ms",
		tokens: "12.4K",
	},
	{
		id: "req_7c1d",
		model: "claude-4.5",
		user: "陈默",
		status: "active",
		latency: "1.2s",
		tokens: "8.1K",
	},
	{
		id: "req_6b9e",
		model: "gemini-3-pro",
		user: "王磊",
		status: "inactive",
		latency: "—",
		tokens: "0",
	},
	{
		id: "req_5a3f",
		model: "gpt-5-mini",
		user: "赵敏",
		status: "active",
		latency: "312ms",
		tokens: "3.6K",
	},
	{
		id: "req_4e8c",
		model: "qwen-3-max",
		user: "周舟",
		status: "active",
		latency: "486ms",
		tokens: "5.2K",
	},
] as const;

const team = [
	{
		name: "林晓",
		role: "前端负责人",
		initials: "LX",
		color: "from-indigo-500 to-blue-500",
	},
	{
		name: "陈默",
		role: "设计系统",
		initials: "CM",
		color: "from-violet-500 to-fuchsia-500",
	},
	{
		name: "王磊",
		role: "后端工程",
		initials: "WL",
		color: "from-emerald-500 to-teal-500",
	},
	{
		name: "赵敏",
		role: "产品设计",
		initials: "ZM",
		color: "from-amber-500 to-orange-500",
	},
];

const quickActions = [
	{ title: "新建页面", description: "从模板生成", icon: PlusIcon },
	{ title: "导入组件", description: "同步设计资产", icon: DatabaseIcon },
	{ title: "邀请成员", description: "协同开发", icon: UsersIcon },
	{ title: "安全审计", description: "检查依赖风险", icon: ShieldCheckIcon },
];

export function DashboardPage() {
	const pageRef = usePageEnter<HTMLDivElement>({ key: "dashboard" });
	const instrumentsRef = useRevealCascade<HTMLDivElement>(
		true,
		":scope > *",
		0.09,
	);

	return (
		<div ref={pageRef} className="space-y-8">
			<div className="reveal">
				<PageHeader
					eyebrow="Overview"
					title="统一前端工作台"
					description="一个基于 React 19、Radix UI 与 Tailwind CSS v4 的组件框架示例。所有页面共享同一套设计令牌、交互规范与可访问性基线。"
					actions={
						<>
							<Button variant="outline" asChild>
								<Link to="/login">
									<LogInIcon />
									查看登录页
								</Link>
							</Button>
							<Button variant="outline">
								<DownloadIcon />
								导出报告
							</Button>
							<Button>
								<PlusIcon />
								新建项目
							</Button>
						</>
					}
				/>
			</div>

			<div className="reveal">
				<Alert className="border-indigo-500/25 bg-gradient-to-r from-indigo-500/10 via-violet-500/5 to-transparent">
					<SparklesIcon className="text-indigo-500" />
					<AlertTitle>组件库 v0.1.0 已发布</AlertTitle>
					<AlertDescription className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
						<span>
							新增 DataTable、PageHeader、StatCard
							与主题切换能力，可直接复用到业务应用。
						</span>
						<Button variant="link" className="h-auto p-0">
							查看变更
							<ArrowRightIcon className="size-3.5" />
						</Button>
					</AlertDescription>
				</Alert>
			</div>

			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<StatCard
					className="bento"
					title="总请求量"
					value="1.28M"
					delta={12.6}
					icon={<ActivityIcon className="size-5" />}
					accent="blue"
					description="过去 30 天"
					trend={[12, 18, 15, 24, 22, 31, 28, 38, 42, 48]}
				/>
				<StatCard
					className="bento"
					title="活跃用户"
					value="18,420"
					delta={8.2}
					icon={<UsersIcon className="size-5" />}
					accent="purple"
					description="较上期增加 1,396"
					trend={[8, 10, 9, 13, 15, 14, 18, 20, 19, 24]}
				/>
				<StatCard
					className="bento"
					title="平均延迟"
					value="642ms"
					delta={-4.8}
					icon={<ZapIcon className="size-5" />}
					accent="green"
					description="P95 延迟 1.8s"
					trend={[20, 18, 19, 16, 17, 14, 15, 12, 13, 11]}
				/>
				<StatCard
					className="bento"
					title="本月成本"
					value="$4,860"
					delta={6.4}
					icon={<CreditCardIcon className="size-5" />}
					accent="amber"
					description="预算使用 64%"
					trend={[10, 12, 11, 14, 13, 16, 18, 17, 20, 22]}
				/>
			</div>

			{/* 珍珠玻璃仪器：读数 / 刻度环 / 刻度尺（移植自 scaffold-master） */}
			<div ref={instrumentsRef} className="grid gap-4 xl:grid-cols-3">
				<Card>
					<CardHeader>
						<SectionLabel title="实时脉搏" />
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-end justify-between gap-4">
							<Metric value={1280000} size="xl" label="总请求量" />
							<DeltaPill value={12.6} label="较上期" />
						</div>
						<Separator />
						<div className="flex items-end justify-between gap-4">
							<Metric
								value={96.4}
								decimals={1}
								unit="%"
								size="l"
								label="成功率"
							/>
							<DeltaPill fresh label="新增能力" />
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<SectionLabel title="操作成功率" />
					</CardHeader>
					<CardContent className="flex flex-col items-center gap-4">
						<TickRing value={96.4} label="成功" />
						<SpecPlate
							title="运行规格"
							rows={[
								{ label: "操作", value: "12,840 次" },
								{ label: "成功率", value: "96.4%" },
								{ label: "峰值并发", value: "1,024" },
								{ label: "状态", value: "正常", tone: "lime" },
							]}
						/>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<SectionLabel title="容量区间" />
					</CardHeader>
					<CardContent className="space-y-6">
						<Ruler
							labels={["0", "50", "100", "150", "200"]}
							marker={0.72}
							markerLabel="144 GB"
						/>
						<SpecPlate
							title="存储规格"
							rows={[
								{ label: "已用", value: "144 GB" },
								{ label: "剩余", value: "32 GB" },
								{ label: "冗余", value: "3 副本", tone: "lime" },
								{ label: "告警线", value: "170 GB", tone: "red" },
							]}
						/>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-4 lg:grid-cols-7">
				<Card className="bento lg:col-span-4">
					<CardHeader>
						<CardTitle>请求趋势</CardTitle>
						<CardDescription>最近 14 天的请求量与错误量变化</CardDescription>
						<CardAction>
							<Badge variant="outline" className="gap-1.5">
								<span className="size-1.5 rounded-full bg-emerald-500" />
								实时
							</Badge>
						</CardAction>
					</CardHeader>
					<CardContent>
						<ChartContainer
							config={chartConfig}
							className="h-[280px] w-full aspect-auto"
						>
							<AreaChart
								data={chartData}
								margin={{ left: 8, right: 8, top: 8 }}
							>
								<defs>
									<linearGradient id="fillRequests" x1="0" y1="0" x2="0" y2="1">
										<stop
											offset="5%"
											stopColor="var(--color-requests)"
											stopOpacity={0.35}
										/>
										<stop
											offset="95%"
											stopColor="var(--color-requests)"
											stopOpacity={0.02}
										/>
									</linearGradient>
								</defs>
								<CartesianGrid vertical={false} strokeDasharray="3 3" />
								<XAxis
									dataKey="date"
									tickLine={false}
									axisLine={false}
									tickMargin={10}
								/>
								<ChartTooltip
									cursor={false}
									content={<ChartTooltipContent indicator="line" />}
								/>
								<Area
									dataKey="requests"
									type="monotone"
									fill="url(#fillRequests)"
									stroke="var(--color-requests)"
									strokeWidth={2}
								/>
							</AreaChart>
						</ChartContainer>
					</CardContent>
					<CardFooter className="text-muted-foreground flex items-center gap-4 text-xs">
						<span className="flex items-center gap-1.5">
							<span className="size-2 rounded-full bg-[var(--chart-1)]" />
							请求数
						</span>
						<span className="flex items-center gap-1.5">
							<span className="size-2 rounded-full bg-[var(--chart-5)]" />
							错误数
						</span>
						<span className="ml-auto">峰值 6,020 次/日</span>
					</CardFooter>
				</Card>

				<Card className="bento lg:col-span-3">
					<CardHeader>
						<CardTitle>框架迁移进度</CardTitle>
						<CardDescription>业务应用接入统一组件库的完成度</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="space-y-2">
							<div className="flex items-center justify-between text-sm">
								<span>设计令牌</span>
								<span className="text-muted-foreground">100%</span>
							</div>
							<Progress value={100} />
						</div>
						<div className="space-y-2">
							<div className="flex items-center justify-between text-sm">
								<span>基础组件</span>
								<span className="text-muted-foreground">92%</span>
							</div>
							<Progress value={92} />
						</div>
						<div className="space-y-2">
							<div className="flex items-center justify-between text-sm">
								<span>业务组件</span>
								<span className="text-muted-foreground">68%</span>
							</div>
							<Progress value={68} />
						</div>
						<div className="space-y-2">
							<div className="flex items-center justify-between text-sm">
								<span>存量页面替换</span>
								<span className="text-muted-foreground">41%</span>
							</div>
							<Progress value={41} />
						</div>
						<Separator />
						<div className="bg-muted/40 rounded-lg p-4">
							<p className="text-sm font-medium">下一步建议</p>
							<p className="text-muted-foreground mt-1 text-xs leading-5">
								优先替换高频表单与列表页面，并将主题令牌接入 CI 视觉回归测试。
							</p>
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-4 lg:grid-cols-7">
				<Card className="bento lg:col-span-4">
					<CardHeader>
						<CardTitle>最近请求</CardTitle>
						<CardDescription>跨模型、跨团队的实时调用记录</CardDescription>
						<CardAction>
							<Button
								variant="ghost"
								size="sm"
								className="text-muted-foreground"
							>
								查看全部
								<ArrowRightIcon />
							</Button>
						</CardAction>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="px-2">请求 ID</TableHead>
									<TableHead className="px-2">模型</TableHead>
									<TableHead className="px-2">用户</TableHead>
									<TableHead className="px-2">状态</TableHead>
									<TableHead className="px-2 text-right">延迟</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{recentRequests.map((request) => (
									<TableRow key={request.id}>
										<TableCell className="px-2 font-mono text-xs">
											{request.id}
										</TableCell>
										<TableCell className="px-2 text-xs">
											{request.model}
										</TableCell>
										<TableCell className="px-2 text-xs">
											{request.user}
										</TableCell>
										<TableCell className="px-2">
											<StatusBadge status={request.status} />
										</TableCell>
										<TableCell className="text-muted-foreground px-2 text-right font-mono text-xs">
											{request.latency}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>

				<Card className="bento lg:col-span-3">
					<CardHeader>
						<CardTitle>团队动态</CardTitle>
						<CardDescription>本周协作成员</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{team.map((member) => (
							<div key={member.name} className="flex items-center gap-3">
								<Avatar className="size-9">
									<AvatarFallback
										className={`bg-gradient-to-br ${member.color} text-xs font-semibold text-white`}
									>
										{member.initials}
									</AvatarFallback>
								</Avatar>
								<div className="min-w-0 flex-1">
									<p className="text-sm font-medium">{member.name}</p>
									<p className="text-muted-foreground text-xs">{member.role}</p>
								</div>
								<Badge variant="outline" className="text-[10px]">
									在线
								</Badge>
							</div>
						))}
					</CardContent>
					<CardFooter>
						<Button variant="outline" className="w-full">
							<UsersIcon />
							管理团队成员
						</Button>
					</CardFooter>
				</Card>
			</div>

			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{quickActions.map((action) => (
					<button
						key={action.title}
						type="button"
						className="bento lift bg-card hover:border-foreground/20 group flex items-center gap-3 rounded-xl border p-4 text-left shadow-sm transition-colors"
					>
						<div className="bg-muted group-hover:bg-primary group-hover:text-primary-foreground rounded-lg p-2.5 transition-colors">
							<action.icon className="size-4" />
						</div>
						<div>
							<p className="text-sm font-medium">{action.title}</p>
							<p className="text-muted-foreground text-xs">
								{action.description}
							</p>
						</div>
						<ArrowRightIcon className="text-muted-foreground ml-auto size-4 transition-transform group-hover:translate-x-0.5" />
					</button>
				))}
			</div>
		</div>
	);
}
