import {
	BellIcon,
	BrainCircuitIcon,
	ListChecksIcon,
	UserCheckIcon,
	ZapIcon,
} from "lucide-react";

import {
	ContactEnrichment,
	FeatureFrame,
	MiniDotGrid,
	MiniWavePattern,
	PipelineForecast,
	ProductMockupCard,
	WorkflowAutomation,
} from "@frontend-frame/product-ui";
import { Badge, Metric, PageHeader, Separator } from "@frontend-frame/ui";

const pipelineData = [
	{ label: "Apr", value: 40 },
	{ label: "May", value: 52 },
	{ label: "Jun", value: 48 },
	{ label: "Jul", value: 64 },
	{ label: "Aug", value: 58 },
	{ label: "Sep", value: 204.82, accent: true },
	{ label: "Oct", value: 88 },
	{ label: "Nov", value: 96 },
	{ label: "Dec", value: 84 },
] as const;

const contactFields = [
	{ label: "Email", value: "maya@basepoint.io" },
	{ label: "Phone", value: "+1 415 555 0100" },
	{ label: "Company", value: "Basepoint" },
	{ label: "Industry", value: "Software (B2B)", enriched: true },
	{ label: "Headcount" },
	{ label: "Region", value: "North America" },
] as const;

const workflowNodes = [
	{
		id: "deal",
		type: "trigger" as const,
		title: "New deal created",
		icon: ZapIcon,
	},
	{
		id: "score",
		type: "condition" as const,
		title: "AI deal score",
		icon: BrainCircuitIcon,
	},
	{
		id: "slack",
		type: "action" as const,
		title: "Notify in Slack",
		icon: BellIcon,
	},
	{
		id: "sequence",
		type: "action" as const,
		title: "Add to sequence",
		icon: ListChecksIcon,
	},
	{
		id: "owner",
		type: "action" as const,
		title: "Assign to AE",
		icon: UserCheckIcon,
	},
] as const;

const metrics = [
	{ label: "Pipeline", value: 1.28, unit: "M", decimals: 2 },
	{ label: "Win rate", value: 34, unit: "%", decimals: 0 },
	{ label: "Cycle time", value: 18, unit: "d", decimals: 0 },
] as const;

export function ProductUiPage() {
	return (
		<div className="container-page space-y-8 py-8">
			<PageHeader
				eyebrow="Product UI"
				title="产品 UI 模拟层"
				description="用真实可组合的组件展示产品能力：Pipeline 图表、Contact 资料卡、Workflow 画布。所有内容由 props 注入，支持主题、响应式与 reduced-motion。"
				actions={<Badge variant="outline">Production sample</Badge>}
			/>

			<div
				data-testid="product-ui-showcase"
				className="grid gap-5 lg:grid-cols-6"
			>
				<ProductMockupCard
					testId="mockup-pipeline"
					className="lg:col-span-4"
					eyebrow="Analytics"
					title="AI Sales Dashboard"
					description="Pipeline health, hot deals, and risks — surfaced by AI, at a glance."
					pattern={<MiniDotGrid />}
				>
					<PipelineForecast
						className="h-full justify-center"
						data={pipelineData}
						total="$204,820"
						delta="▲ 84% vs Aug"
						yAxisFormatter={(value) => `$${Math.round(value)}K`}
					/>
				</ProductMockupCard>

				<ProductMockupCard
					testId="mockup-contact"
					className="lg:col-span-2"
					eyebrow="Enrichment"
					title="Contact Management"
					description="Auto-enriched contacts and smart segments. One source of truth."
					pattern={<MiniWavePattern />}
				>
					<ContactEnrichment
						person={{
							name: "Maya Chen",
							role: "VP Sales",
							company: "Basepoint",
						}}
						fields={contactFields}
					/>
				</ProductMockupCard>

				<ProductMockupCard
					testId="mockup-workflow"
					className="lg:col-span-6"
					eyebrow="Workflows"
					title="Sales Pipeline Automation"
					description="Trigger emails, tasks, and handoffs from any signal in Flux — no code, no waiting."
					pattern={<MiniDotGrid />}
				>
					<WorkflowAutomation nodes={workflowNodes} />
				</ProductMockupCard>
			</div>

			<section className="space-y-4">
				<div className="flex items-end justify-between gap-4">
					<div>
						<p className="text-muted-foreground text-[11px] font-semibold tracking-[0.14em] uppercase">
							Feature frame
						</p>
						<h2 className="mt-1 text-xl font-semibold tracking-tight">
							产品截图容器
						</h2>
					</div>
					<p className="text-muted-foreground hidden max-w-md text-sm sm:block">
						FeatureFrame 用来承载截图、实时 mockup
						或任意产品画面，统一圆角、阴影与窗口栏。
					</p>
				</div>

				<FeatureFrame chrome="browser" label="Dashboard preview">
					<div className="bg-muted/20 grid gap-4 p-5 sm:grid-cols-3 sm:p-6">
						{metrics.map((metric) => (
							<div
								key={metric.label}
								className="bg-card ring-foreground/10 rounded-lg p-4 ring-1"
							>
								<Metric
									label={metric.label}
									value={metric.value}
									unit={metric.unit}
									decimals={metric.decimals}
									size="m"
								/>
							</div>
						))}
					</div>
					<Separator />
					<div className="bg-background p-5 sm:p-6">
						<div className="mb-4 flex items-center justify-between gap-3">
							<div>
								<p className="text-sm font-semibold">Recent pipeline</p>
								<p className="text-muted-foreground text-xs">
									Live mockup inside a framed product surface
								</p>
							</div>
							<Badge variant="secondary">Demo data</Badge>
						</div>
						<PipelineForecast
							className="justify-center"
							data={pipelineData}
							total="$204,820"
							delta="▲ 84% vs Aug"
							yAxisFormatter={(value) => `$${Math.round(value)}K`}
						/>
					</div>
				</FeatureFrame>
			</section>
		</div>
	);
}
