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
pnpm lint        # ESLint 检查（0 error / 0 warning）
pnpm typecheck   # 全量类型检查
pnpm test        # Vitest 组件测试
pnpm test:visual # Playwright 视觉回归（3 mockup × light/dark × 4 断点）
pnpm build       # 构建组件库与 Demo
pnpm preview     # 预览 Demo 生产构建
pnpm changeset   # 生成变更集（发布前）
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
│  ├─ ui/                    # @frontend-frame/ui 公共组件库
│  │  ├─ src/components/     # 100+ 组件
│  │  ├─ src/hooks/          # 通用 hooks
│  │  ├─ src/lib/            # cn 等工具函数
│  │  ├─ src/styles.css      # 设计令牌与主题样式
│  │  └─ src/index.ts        # 统一导出
│  ├─ app-kit/               # 路由/图片/路径适配器
│  ├─ blocks/                # 可互换的页面区块变体
│  ├─ forms/                 # Zod Action、提交状态与字段错误回填
│  └─ build-config/          # 共享 Vite library 构建配置
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

### 5. 应用层包：app-kit 与 blocks

`@frontend-frame/app-kit` 负责框架适配，`@frontend-frame/blocks` 提供可互换的页面区块。业务应用先挂载适配器：

```tsx
import { UiAdaptersProvider, type UiLinkProps } from "@frontend-frame/app-kit";
import type * as React from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";

const Link = ({ href, ...props }: UiLinkProps) => (
	<RouterLink to={href} {...props} />
);

function AppAdapters({ children }: { children: React.ReactNode }) {
	const location = useLocation();
	const navigate = useNavigate();

	return (
		<UiAdaptersProvider
			adapters={{
				Link,
				usePathname: () => location.pathname,
				navigate,
			}}
		>
			{children}
		</UiAdaptersProvider>
	);
}
```

应用壳、跳过导航、404 和错误边界都由 `app-kit` 提供：

```tsx
import {
	AppShell,
	ErrorBoundary,
	RouteBoundary,
} from "@frontend-frame/app-kit";
import { Outlet } from "react-router-dom";

<AppShell sidebar={<NavSidebar />} header={<Header />} footer={<Footer />}>
	<ErrorBoundary>
		<Outlet />
	</ErrorBoundary>
</AppShell>;

// 404 / 空状态 / 加载态
<RouteBoundary variant="not-found" />;
<RouteBoundary variant="loading" />;
```

然后按需选择 Header 变体。推荐直接导入，只打包选中的实现：

```tsx
import { FloatingPillHeader } from "@frontend-frame/blocks/header/floating-pill";

<FloatingPillHeader
	site={site}
	activePath={pathname}
	themeToggle={<ThemeToggle />}
/>;
```

`FloatingPillHeader` 默认滚动后收缩、向下滚动隐藏。门户类应用如果希望导航常驻，可以关闭这两个行为：

```tsx
<FloatingPillHeader
	site={site}
	activePath={pathname}
	themeToggle={<ThemeToggle />}
	hideOnScroll={false}
	compactOnScroll={false}
/>
```

也可以使用懒加载的统一入口，适合 demo、文档站或低代码配置：

```tsx
import { SiteHeader } from "@frontend-frame/blocks";

<SiteHeader variant="mega-menu" site={site} activePath={pathname} />;
```

Hero、Footer、Pricing 使用同一套选择方式：

```tsx
import { Hero } from "@frontend-frame/blocks/hero/split";
import { SiteFooter } from "@frontend-frame/blocks/footer/dark-mega";
import { PricingSection } from "@frontend-frame/blocks/pricing/cards";

<Hero
	title="把组件组织成可交付的产品"
	actions={[{ label: "开始使用", href: "/signup" }]}
/>;
<SiteFooter site={site} columns={footerColumns} />;
<PricingSection plans={plans} annualHint="年付相当于省 2 个月" />;
```

也可以走懒加载统一入口：

```tsx
import { Hero, PricingSection, SiteFooter } from "@frontend-frame/blocks";

<Hero variant="bento" title="..." />;
<SiteFooter variant="minimal" site={site} columns={footerColumns} />;
<PricingSection variant="comparison" plans={plans} />;
```

动效与组件解耦，通过预设统一控制：

```tsx
import { MotionPresetProvider } from "@frontend-frame/ui";

<MotionPresetProvider preset="subtle">
	<App />
</MotionPresetProvider>;
```

可选预设：`none` / `subtle` / `playful` / `cinematic`。`prefers-reduced-motion` 会自动降级为 `none`。

### 6. 表单与 Action

`@frontend-frame/forms` 提供框架无关的提交契约。推荐配合 Zod + React Hook Form：

```tsx
import {
	applyFieldErrors,
	createFetchAction,
	useAction,
} from "@frontend-frame/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
	name: z.string().min(2),
	email: z.string().email(),
	message: z.string().min(10),
});

const submit = createFetchAction<z.infer<typeof schema>, { ticketId: string }>({
	endpoint: "/api/contact",
	timeoutMs: 15_000,
});

const form = useForm<z.infer<typeof schema>>({
	resolver: zodResolver(schema),
});
const action = useAction(submit);

const onSubmit = form.handleSubmit(async (values) => {
	const result = await action.execute(values);
	if (!result.ok) {
		applyFieldErrors(form, result.error.fieldErrors);
	}
});
```

`createFetchAction` 已处理超时、取消、非 2xx、非法 JSON，以及 `{ code, message, fieldErrors }` 错误结构；`useAction` 提供 `isExecuting` / `hasSucceeded` / `hasErrored` 状态和并发去重。

### 7. WebGL 流场背景

`FlowGridBackground` 复刻了 PortWise Hero 的点阵流场：10px 网格、竖向落块、鼠标扰动、明暗主题和 `prefers-reduced-motion` 降级。

```tsx
import { FlowGridBackground } from "@frontend-frame/ui";

<main className="bg-background relative isolate min-h-svh overflow-hidden">
	<FlowGridBackground className="absolute inset-0 z-0" />
	<div className="relative z-10">{children}</div>
</main>;
```

demo 的 `/login` 页面已接入该背景，登录表单通过 `LoginPage` 的 `onSubmit` 注入认证接口。

查看方式：

```bash
pnpm dev
# 打开 http://localhost:5173/login
```

demo 里也可以通过侧栏「登录页」、Dashboard 的「查看登录页」按钮、或用户菜单中的「登录页示例」进入。

## 组件清单

- 基础控件：Button、Input、Textarea、Select、Checkbox、SelectionCheckbox、RadioGroup、Switch、Slider、Label、Toggle
- 布局展示：Card、Tabs、Accordion、Table、DataTable、PageHeader、StatCard、Empty、Sidebar、NavSidebar、Separator、ScrollArea、Avatar、Badge、StatusBadge
- 布局与动效原语：Container、PageSection、SectionBackdrop、DashedLine、Reveal、Stagger、MotionPresetProvider
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
- 当前仓库为内部 `UNLICENSED` 项目。**对外发布或分发前，请确认上述来源的许可义务与署名要求。**
- 逐组件来源清单见 [`THIRD_PARTY_NOTICES.md`](./THIRD_PARTY_NOTICES.md)，许可声明见 [`LICENSE`](./LICENSE)。

## 工程基建（一期已落地）

- **ESLint 9 flat config**：`pnpm lint`，0 error / 0 warning 门槛。
- **Vitest + Testing Library**：`pnpm test`，覆盖核心组件交互与可访问性（jsdom）。
- **Playwright 视觉回归**：`pnpm test:visual`，覆盖 product-ui 的 light/dark、360/768/1024/1440 断点与 axe 可访问性检查。
- **husky + lint-staged**：pre-commit 自动 lint + format。
- **changesets**：发布前用 `pnpm changeset` 生成变更集，`pnpm version-packages` 升级版本并生成 changelog。
- **CI**：`.github/workflows/ci.yml`，包含 lint / typecheck / test / build 四道门禁。

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
