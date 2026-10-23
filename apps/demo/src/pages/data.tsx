import {
	DownloadIcon,
	MoreHorizontalIcon,
	PencilIcon,
	PlusIcon,
	Table2Icon,
	Trash2Icon,
	TruckIcon,
	WalletIcon,
} from "lucide-react";
import { toast } from "sonner";

import {
	Avatar,
	AvatarFallback,
	Badge,
	Button,
	DataTable,
	DataTableColumnHeader,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	PageHeader,
	StatCard,
	StatusBadge,
} from "@frontend-frame/ui";

import { CodeBlock, Section } from "@/components/showcase";

import type { ColumnDef } from "@tanstack/react-table";

interface ServiceRequest {
	id: string;
	customer: string;
	email: string;
	service: string;
	amount: number;
	status: "active" | "inactive" | "deleted";
	date: string;
	region: string;
}

const rows: ServiceRequest[] = [
	{
		id: "INV-2081",
		customer: "林晓",
		email: "lin.xiao@example.com",
		service: "企业版套餐",
		amount: 1299,
		status: "active",
		date: "2026-10-23",
		region: "华东",
	},
	{
		id: "INV-2080",
		customer: "陈默",
		email: "chen.mo@example.com",
		service: "团队版套餐",
		amount: 699,
		status: "active",
		date: "2026-10-22",
		region: "华北",
	},
	{
		id: "INV-2079",
		customer: "王磊",
		email: "wang.lei@example.com",
		service: "API 用量包",
		amount: 320,
		status: "inactive",
		date: "2026-10-22",
		region: "华南",
	},
	{
		id: "INV-2078",
		customer: "赵敏",
		email: "zhao.min@example.com",
		service: "企业版套餐",
		amount: 1299,
		status: "active",
		date: "2026-10-21",
		region: "华东",
	},
	{
		id: "INV-2077",
		customer: "周舟",
		email: "zhou.zhou@example.com",
		service: "团队版套餐",
		amount: 699,
		status: "active",
		date: "2026-10-21",
		region: "西南",
	},
	{
		id: "INV-2076",
		customer: "孙悦",
		email: "sun.yue@example.com",
		service: "API 用量包",
		amount: 180,
		status: "deleted",
		date: "2026-10-20",
		region: "华中",
	},
	{
		id: "INV-2075",
		customer: "李想",
		email: "li.xiang@example.com",
		service: "企业版套餐",
		amount: 1299,
		status: "active",
		date: "2026-10-20",
		region: "华北",
	},
	{
		id: "INV-2074",
		customer: "吴迪",
		email: "wu.di@example.com",
		service: "团队版套餐",
		amount: 699,
		status: "active",
		date: "2026-10-19",
		region: "华东",
	},
	{
		id: "INV-2073",
		customer: "郑爽",
		email: "zheng.shuang@example.com",
		service: "API 用量包",
		amount: 240,
		status: "inactive",
		date: "2026-10-19",
		region: "华南",
	},
	{
		id: "INV-2072",
		customer: "钱峰",
		email: "qian.feng@example.com",
		service: "企业版套餐",
		amount: 1299,
		status: "active",
		date: "2026-10-18",
		region: "西北",
	},
	{
		id: "INV-2071",
		customer: "冯雪",
		email: "feng.xue@example.com",
		service: "团队版套餐",
		amount: 699,
		status: "active",
		date: "2026-10-18",
		region: "华东",
	},
	{
		id: "INV-2070",
		customer: "何平",
		email: "he.ping@example.com",
		service: "API 用量包",
		amount: 160,
		status: "active",
		date: "2026-10-17",
		region: "华中",
	},
	{
		id: "INV-2069",
		customer: "许诺",
		email: "xu.nuo@example.com",
		service: "企业版套餐",
		amount: 1299,
		status: "deleted",
		date: "2026-10-17",
		region: "华北",
	},
	{
		id: "INV-2068",
		customer: "高远",
		email: "gao.yuan@example.com",
		service: "团队版套餐",
		amount: 699,
		status: "active",
		date: "2026-10-16",
		region: "华南",
	},
];

const columns: ColumnDef<ServiceRequest>[] = [
	{
		accessorKey: "id",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="订单号" />
		),
		cell: ({ row }) => (
			<span className="font-mono text-xs font-medium">
				{row.getValue("id")}
			</span>
		),
	},
	{
		accessorKey: "customer",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="客户" />
		),
		cell: ({ row }) => {
			const request = row.original;
			return (
				<div className="flex items-center gap-2.5">
					<Avatar className="size-7">
						<AvatarFallback className="bg-muted text-[10px]">
							{request.customer.slice(0, 1)}
						</AvatarFallback>
					</Avatar>
					<div className="min-w-0">
						<p className="truncate text-xs font-medium">{request.customer}</p>
						<p className="text-muted-foreground truncate text-[11px]">
							{request.email}
						</p>
					</div>
				</div>
			);
		},
	},
	{
		accessorKey: "service",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="服务" />
		),
		cell: ({ row }) => (
			<span className="text-xs">{row.getValue("service")}</span>
		),
	},
	{
		accessorKey: "status",
		header: "状态",
		cell: ({ row }) => <StatusBadge status={row.original.status} />,
	},
	{
		accessorKey: "amount",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="金额" />
		),
		cell: ({ row }) => {
			const amount = Number(row.getValue("amount"));
			return (
				<span className="font-mono text-xs font-medium">
					{new Intl.NumberFormat("zh-CN", {
						style: "currency",
						currency: "CNY",
						maximumFractionDigits: 0,
					}).format(amount)}
				</span>
			);
		},
	},
	{
		accessorKey: "region",
		header: "区域",
		cell: ({ row }) => (
			<Badge variant="outline" className="text-[10px]">
				{row.getValue("region")}
			</Badge>
		),
	},
	{
		accessorKey: "date",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="日期" />
		),
		cell: ({ row }) => (
			<span className="text-muted-foreground font-mono text-xs">
				{row.getValue("date")}
			</span>
		),
	},
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						className="size-8"
						aria-label="操作"
					>
						<MoreHorizontalIcon className="size-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-40">
					<DropdownMenuLabel>{row.original.id}</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						onClick={() =>
							toast.info("编辑订单", { description: row.original.id })
						}
					>
						<PencilIcon />
						编辑
					</DropdownMenuItem>
					<DropdownMenuItem
						className="text-destructive focus:text-destructive"
						onClick={() =>
							toast.error("订单已删除", { description: row.original.id })
						}
					>
						<Trash2Icon />
						删除
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		),
	},
];

const dataTableExample = `<DataTable
  columns={columns}
  data={rows}
  filterColumn="customer"
  searchPlaceholder="搜索客户..."
  pageSize={8}
  toolbar={<Button size="sm">导出</Button>}
/>`;

export function DataPage() {
	const total = rows.reduce((sum, row) => sum + row.amount, 0);

	return (
		<div className="space-y-8">
			<PageHeader
				eyebrow="Data Grid"
				title="数据表格"
				description="基于 TanStack Table 封装的 DataTable，内置排序、跨列搜索、列显隐、分页与空状态，可直接用于后台列表页。"
				actions={
					<Button>
						<PlusIcon />
						新建订单
					</Button>
				}
			/>

			<div className="grid gap-4 sm:grid-cols-3">
				<StatCard
					title="订单总额"
					value={new Intl.NumberFormat("zh-CN", {
						style: "currency",
						currency: "CNY",
						maximumFractionDigits: 0,
					}).format(total)}
					description="当前筛选周期"
					icon={<WalletIcon className="size-5" />}
					accent="green"
					delta={14.2}
				/>
				<StatCard
					title="有效订单"
					value={rows.filter((row) => row.status === "active").length}
					description={`共 ${rows.length} 条记录`}
					icon={<TruckIcon className="size-5" />}
					accent="blue"
					delta={5.7}
				/>
				<StatCard
					title="异常订单"
					value={rows.filter((row) => row.status !== "active").length}
					description="需要人工跟进"
					icon={<Table2Icon className="size-5" />}
					accent="amber"
					delta={-2.1}
				/>
			</div>

			<DataTable
				columns={columns}
				data={rows}
				filterColumn="customer"
				searchPlaceholder="搜索客户或邮箱..."
				pageSize={6}
				emptyMessage="没有匹配的订单"
				toolbar={
					<Button
						variant="outline"
						size="sm"
						onClick={() =>
							toast.success("导出完成", {
								description: "订单数据已导出为 CSV。",
							})
						}
					>
						<DownloadIcon className="size-4" />
						导出
					</Button>
				}
			/>

			<Section
				title="使用方式"
				description="把列定义交给 DataTable，其余交互由组件统一处理。"
			>
				<CodeBlock code={dataTableExample} />
			</Section>
		</div>
	);
}
