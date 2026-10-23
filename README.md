# Frontend Frame

统一的前端 UI 组件框架 Demo。项目采用 pnpm workspace 组织，包含可复用的 React 组件库与一个完整的演示应用。

组件基座抽取自 `D:/develop/llmgateway/apps/ui/src/lib/components`，并完成了内部依赖解耦、主题系统替换与类型产物构建。

## 技术栈

- React 19 + TypeScript 5.9
- Vite 7 + pnpm workspace
- Tailwind CSS v4
- Radix UI / shadcn 组合式组件
- React Hook Form
- TanStack Table
- Recharts
- Sonner

## 快速开始

```bash
pnpm install
pnpm dev
```

默认访问地址：`http://localhost:5173`

```bash
pnpm typecheck   # 全量类型检查
pnpm build       # 构建组件库与 Demo
pnpm preview     # 预览 Demo 生产构建
```

## 项目结构

```text
frontend-frame/
├─ apps/
│  └─ demo/                  # Vite 演示应用
│     ├─ src/components/     # 应用壳、Masthead、展示辅助组件
│     ├─ src/pages/          # 总览、组件画廊、表单、数据、令牌、文档
│     └─ src/styles.css      # Tailwind 入口与组件库样式接入
├─ packages/
│  └─ ui/                    # @frontend-frame/ui 公共组件库
│     ├─ src/components/     # 62 个组件
│     ├─ src/hooks/          # 通用 hooks
│     ├─ src/lib/            # cn 等工具函数
│     ├─ src/styles.css      # 设计令牌与主题样式
│     └─ src/index.ts        # 统一导出
├─ tsconfig.base.json
└─ pnpm-workspace.yaml
```

## 在业务应用中使用

### 1. 声明依赖

在 workspace 内：

```bash
pnpm add @frontend-frame/ui --filter your-app
```

或在 `package.json` 中声明：

```json
{
	"dependencies": {
		"@frontend-frame/ui": "workspace:*"
	}
}
```

### 2. 接入样式

```css
@import "tailwindcss";
@import "@frontend-frame/ui/styles.css";

@source "../../packages/ui/src/**/*.{ts,tsx}";
@plugin "tailwindcss-animate";
```

`@source` 用于让 Tailwind 扫描组件库中的类名；如果业务项目与组件库目录层级不同，请按实际相对路径调整。

### 3. 挂载主题 Provider

```tsx
import { ThemeProvider } from "@frontend-frame/ui";

createRoot(document.getElementById("root")!).render(
	<ThemeProvider>
		<App />
	</ThemeProvider>,
);
```

### 4. 使用组件

```tsx
import {
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@frontend-frame/ui";

export function UsageCard() {
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
}
```

## 组件清单

- 基础控件：Button、Input、Textarea、Select、Checkbox、SelectionCheckbox、RadioGroup、Switch、Slider、Label、Toggle
- 布局展示：Card、Tabs、Accordion、Table、DataTable、PageHeader、StatCard、Empty、Sidebar、NavSidebar、Separator、ScrollArea、Avatar、Badge、StatusBadge
- 反馈浮层：Alert、Dialog、AlertDialog、Sheet、Popover、Tooltip、HoverCard、DropdownMenu、Progress、Skeleton、Toast、Toaster、SonnerToaster
- 表单与主题：Form、Field、ThemeProvider、ThemeToggle、Calendar、Stepper、NumberTicker、ShimmerButton
- AI / Agent：Collapsible、CollapsibleMessage、ProcessHeader、ProcessRail、ToolBadge、SourceFavicons、StatusIndicator、Spinner、PasswordInput、TooltipButton、Carousel、Drawer、KeyboardShortcutDialog、ThemeMenuItems
- 数据可视化：ChartContainer、ChartTooltip、ChartLegend

## 设计令牌与主题

组件只消费语义变量，不直接依赖具体色值。核心令牌位于 `packages/ui/src/styles.css`：

```css
:root {
	--background: oklch(1 0 0);
	--foreground: oklch(0.141 0.005 285.823);
	--primary: oklch(0.21 0.006 285.885);
	--border: oklch(0.92 0.004 286.32);
	--radius: 0.625rem;
}
```

业务应用可通过覆盖语义变量实现品牌换肤，无需修改组件源码：

```css
.brand-blue {
	--primary: oklch(0.55 0.22 265);
	--primary-foreground: oklch(0.985 0 0);
}
```

主题模式支持 `light`、`dark`、`system`，存储在 `localStorage` 的 `frontend-frame-theme` 键中。演示站也支持通过 `?theme=dark` 直接预览深色模式。

## NavSidebar 接入

`NavSidebar` 不依赖 React Router 或具体鉴权方案，通过 `linkComponent` 注入路由 Link：

```tsx
const RouterNavLink = ({ href, ...props }: NavSidebarLinkProps) => (
	<NavLink to={href} end {...props} />
);

<NavSidebar
	groups={groups}
	activePath={location.pathname}
	brand={({ collapsed }) => <Brand collapsed={collapsed} />}
	footer={({ collapsed }) => <WorkspaceMenu collapsed={collapsed} />}
	linkComponent={RouterNavLink}
	mobileOpen={mobileOpen}
	onMobileOpenChange={setMobileOpen}
	storageKey="app-nav-collapsed"
/>;
```

内置能力：分组折叠、菜单搜索（按 `/` 聚焦）、收起态悬浮子菜单、移动端抽屉、激活态、嵌套菜单叶子节点扁平化与收起状态持久化。

## 抽取与解耦说明

- 组件源码来自 llmgateway 的 `apps/ui/src/lib/components`，保留了 shadcn/Radix 的 `data-slot` 约定与组合式 API。
- 所有 `@/lib/components/*`、`@/lib/utils`、`@/hooks/*` 内部别名已改写为相对路径，避免声明文件污染消费方。
- 移除了对 `@llmgateway/shared` 的依赖：图表格式化与侧栏骨架宽度改为库内实现。
- `next-themes` 替换为库内 `ThemeProvider`，降低对 Next.js 的耦合。
- 修正了原 `checkbox.tsx` 实际渲染 Switch 的问题，`Checkbox` 与 `SelectionCheckbox` 现在均为真正的方形复选框。
- `useIsMobile` 改为同步初始化，避免移动端首帧渲染桌面侧栏造成闪烁。
- 组件库通过 Vite library mode 输出 ESM，并通过 `tsc` 输出完整 `.d.ts` 声明。
- 第二批组件抽取自 Morphic 的 `components/ui` 与 `components`：加入了 Carousel、Drawer、Collapsible、PasswordInput、Spinner、StatusIndicator、TooltipButton、ToolBadge、SourceFavicons、ProcessHeader、ProcessRail、CollapsibleMessage、KeyboardShortcutDialog、ThemeMenuItems。
- Morphic 组件已完成 Next.js Image/Link、Tabler 图标、业务类型与硬编码快捷键的替换；品牌 Logo、鉴权、Supabase、AI 流式逻辑未迁入公共库。
- `NavSidebar` 抽取自 llm-gateway v2 的左侧菜单，已解耦 React Router、鉴权 Store、品牌配置与后端菜单：支持分组折叠、菜单搜索、收起态悬浮子菜单、移动端抽屉、激活态、URL 渲染器与收起状态持久化。

## 来源与许可

- llmgateway 源码按其仓库许可（核心为 AGPLv3）使用。
- Morphic 源码基于 Apache-2.0 许可。
- 当前仓库为内部 `UNLICENSED` 项目。对外发布或分发前，请确认上述来源的许可义务与署名要求。

## 开发约定

1. 新增基础组件优先复用 Radix / shadcn 原语。
2. 新组件必须从 `packages/ui/src/index.ts` 导出。
3. 图标按钮必须提供 `aria-label`；表单错误必须通过 `FormMessage` 关联。
4. 颜色不得作为唯一状态表达，状态徽章需同时包含文字与图标。
5. 业务语义组件与基础组件分层维护，避免把领域逻辑下沉到组件库。

## 后续建议

- 增加 Vitest + Testing Library 组件测试，覆盖交互与可访问性。
- 增加 Storybook 或独立文档站，作为组件 API 的单一事实来源。
- 接入 Playwright 视觉回归，覆盖 light/dark 与移动端断点。
- 发布到私有 npm registry，并补充语义化版本与 changelog。
- 增加 ESLint / Prettier 统一规则与 CI 流水线。
