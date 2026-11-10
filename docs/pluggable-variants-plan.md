# frontend-frame 可插拔组件与动效方案

> 目标：让框架使用者可以按需选择顶部导航、移动菜单、主题开关、动效等“同类型实现”，而不是被某一种 UI 写死。
> 输入：`docs/learn-from-flux-nextjs-template.md` 的调研结论 + 当前仓库代码。
> 日期：2026-11-10
> 状态：可落地开发 plan，待排期评审。

> 与 `docs/app-layer-development-plan.md` 的关系：后者是应用层（app-kit / blocks / forms / templates）的总计划；本文是其中“同类组件可替换 + 动效可选”这一横切能力的专项方案，不重复整体排期。

---

## 1. 要解决的问题

当前 `frontend-frame` 已经有较完整的组件底座，但“同类型组件可替换”这件事还没有统一机制：

- 顶部导航只有 `NavSidebar` 一种后台侧栏形态，见 `packages/ui/src/components/nav-sidebar.tsx`；
- `NavigationMenu` 只是 Radix 原语，见 `packages/ui/src/components/navigation-menu.tsx`，没有可选的站点头部实现；
- `ThemeToggle` / `ThemeSelector` 各自独立，见 `packages/ui/src/components/theme-toggle.tsx`、`theme-selector.tsx`；
- 动效能力集中在 `packages/ui/src/lib/motion.ts` 和 `hooks/use-motion.ts`，但调用方仍在手写 `animate()` 参数，没有“预设”概念；
- demo 的 `AppShell` 把侧栏、顶栏、主题、搜索、通知写死在一起，见 `apps/demo/src/components/app-shell.tsx`；
- 导航数据模型有两套：`NavSidebarItem` 与 `apps/demo/src/lib/nav.ts` 的 `NavItem`。

Flux 的启发是：**页面由 block 组合，同类 block 可以换**。我们把它进一步抽象成：

```text
Slot（插槽） → Variant（实现变体） → Preset（组合预设） → Registry（注册表） → Provider（运行时选择）
```

用户既可以直接 import 某个变体，也可以通过配置或运行时 Playground 切换。

---

## 2. 设计原则

1. **不破坏现有用法**：`NavSidebar`、`NavigationMenu`、`ThemeToggle` 保持导出与行为，新增能力以叠加为主。
2. **契约优先**：先定义 `SiteHeaderProps`、`NavItem`、`MotionPreset` 等稳定接口，再实现变体。
3. **不把所有组件都变体化**：只对“确实存在多种合理 UI/交互”的组件做 Slot。
4. **直接用法优先**：配置系统是可选增强，不能成为使用组件的门槛。
5. **框架无关**：`packages/ui` 不依赖 React Router / Next.js，路由与图片通过 `linkComponent` / `imageComponent` 注入。
6. **可访问性一致**：所有导航变体必须满足同一套键盘、焦点、ARIA、移动端行为。
7. **动效可关闭**：默认尊重 `prefers-reduced-motion`，并支持全局 `none` 预设。
8. **可测试**：每个变体都跑同一套契约测试，避免“新变体好看但不可用”。

---

## 3. 目标架构

### 3.1 四个概念

| 概念     | 含义                        | 例子                                               |
| -------- | --------------------------- | -------------------------------------------------- |
| Slot     | 一个稳定的 UI 职责          | `siteHeader`、`mobileNav`、`themeToggle`、`reveal` |
| Variant  | 该职责的一种实现            | `floating-pill`、`classic`、`mega-menu`、`sidebar` |
| Preset   | 一组 Slot + 动效配置        | `marketing`、`dashboard`、`minimal`                |
| Registry | Slot → Variant 的映射与解析 | `useSlot("siteHeader")`                            |

### 3.2 三种使用方式

```tsx
// 1. 直接用法：显式选择变体
import { FloatingPillHeader } from "@frontend-frame/ui";

<FloatingPillHeader items={items} actions={actions} />;
```

```tsx
// 2. 配置用法：应用级选择
import { UIProvider } from "@frontend-frame/ui";

<UIProvider
	config={{
		slots: { siteHeader: "floating-pill", mobileNav: "fullscreen" },
		motion: { preset: "blur-rise", intensity: "default" },
	}}
>
	<App />
</UIProvider>;
```

```tsx
// 3. 运行期切换：Playground / URL 参数
// /playground?nav=floating-pill&motion=blur-rise&theme=glass
<VariantPlayground />
```

### 3.3 解析优先级

```text
组件显式 prop variant
  → 最近的 UIProvider config
    → 预设 preset
      → Slot 默认变体
        → 开发环境告警 + 生产环境 fallback
```

未知 variant 不应导致白屏：开发环境 `console.warn`，生产环境回退到默认实现。

---

## 4. 目录与文件改造

为了减少对现有 `components/` 平铺结构的冲击，新增按领域划分的目录，并从 `packages/ui/src/index.ts` 统一导出：

```text
packages/ui/src/
├─ navigation/
│  ├─ types.ts                    # NavItem / NavAction / SiteHeaderProps
│  ├─ nav-link.tsx                # 共享的链接/激活态渲染
│  ├─ nav-actions.tsx             # 共享的右侧操作区
│  ├─ site-header.tsx             # 分发器：根据 variant 渲染具体实现
│  ├─ variants/
│  │  ├─ classic-header.tsx
│  │  ├─ floating-pill-header.tsx
│  │  ├─ mega-menu-header.tsx
│  │  ├─ minimal-header.tsx
│  │  └─ sidebar-header.tsx       # 复用现有 NavSidebar
│  └─ mobile/
│     ├─ sheet-mobile-nav.tsx
│     ├─ fullscreen-mobile-nav.tsx
│     └─ drawer-mobile-nav.tsx
├─ motion/
│  ├─ types.ts                    # MotionPreset / MotionConfig
│  ├─ presets.ts                  # none/fade/rise/blur-rise/...
│  ├─ motion-provider.tsx         # 全局动效配置
│  ├─ reveal.tsx                  # 声明式入场
│  ├─ stagger.tsx                 # 子元素编排
│  └─ scroll-quote.tsx            # 可选：滚动逐词点亮
├─ variants/
│  ├─ define-slot.ts              # defineSlot / defineVariant
│  ├─ registry.ts                 # 内置 slot 注册表
│  ├─ provider.tsx                # UIProvider
│  ├─ use-slot.ts                 # useSlot / useVariant
│  └─ presets.ts                  # marketing/dashboard/minimal
└─ components/
   ├─ nav-sidebar.tsx             # 保持原文件，作为 sidebar 变体的基础
   ├─ navigation-menu.tsx         # 保持原文件，作为 mega-menu 的基础
   ├─ theme-toggle.tsx            # 改造为支持 variant
   └─ theme-selector.tsx          # 保持，作为 palette 选择器
```

> `@source "../../../packages/ui/src/**/*.{ts,tsx}"` 已覆盖新目录，Tailwind 不需要额外配置。

---

## 5. 核心 API 契约

### 5.1 导航数据模型

先消除两套导航类型，统一成一套：

```ts
// packages/ui/src/navigation/types.ts
import type * as React from "react";

export interface NavItem {
	id?: string;
	label: string;
	href: string;
	icon?: React.ElementType;
	description?: string;
	badge?: React.ReactNode;
	disabled?: boolean;
	external?: boolean;
	children?: NavItem[];
}

export interface NavAction {
	label: string;
	href?: string;
	onClick?: () => void;
	icon?: React.ElementType;
	variant?: "default" | "outline" | "ghost" | "secondary";
}

export interface NavLinkProps extends Omit<React.ComponentProps<"a">, "href"> {
	href: string;
}

export type NavLinkComponent = React.ComponentType<NavLinkProps>;
```

`NavSidebar` 现有类型可以在下一阶段收敛到这套模型，先保留兼容别名：

```ts
export type NavSidebarItem = NavItem;
export type NavSidebarLinkProps = NavLinkProps;
```

### 5.2 头部契约

所有站点头部变体必须实现同一个接口：

```ts
export interface SiteHeaderProps {
	brand: React.ReactNode;
	items: NavItem[];
	actions?: NavAction[];
	activePath?: string;
	linkComponent?: NavLinkComponent;
	mobileVariant?: MobileNavVariantId;
	sticky?: boolean;
	showThemeToggle?: boolean;
	showSearch?: boolean;
	onSearch?: () => void;
	className?: string;
}
```

约束：

- 必须渲染 `<header>` 与 `<nav aria-label="主导航">`；
- 当前项必须 `aria-current="page"`；
- 移动端触发器必须有 `aria-label`、`aria-expanded`、`aria-controls`；
- 必须支持 `linkComponent`，不能直接依赖 React Router 的 `Link`；
- 桌面端隐藏的移动菜单不能进入 Tab 顺序；
- 移动菜单打开时必须锁定滚动，关闭后恢复焦点。

### 5.3 Slot 定义

```ts
// packages/ui/src/variants/define-slot.ts
import type { ComponentType } from "react";

export interface VariantDefinition<P> {
	id: string;
	label: string;
	description?: string;
	component: ComponentType<P>;
	tags?: Array<"marketing" | "dashboard" | "minimal" | "motion">;
}

export interface SlotDefinition<P> {
	id: string;
	label: string;
	defaultVariant: string;
	variants: Record<string, VariantDefinition<P>>;
}

export function defineSlot<P>(slot: SlotDefinition<P>) {
	return slot;
}
```

```ts
// packages/ui/src/variants/registry.ts
export const slots = {
	siteHeader: defineSlot<SiteHeaderProps>({
		id: "siteHeader",
		label: "顶部导航",
		defaultVariant: "classic",
		variants: {
			classic: { id: "classic", label: "经典通栏", component: ClassicHeader },
			"floating-pill": {
				id: "floating-pill",
				label: "浮动胶囊",
				component: FloatingPillHeader,
			},
			"mega-menu": {
				id: "mega-menu",
				label: "Mega Menu",
				component: MegaMenuHeader,
			},
			minimal: { id: "minimal", label: "极简", component: MinimalHeader },
			sidebar: { id: "sidebar", label: "侧边栏", component: SidebarHeader },
		},
	}),
	// mobileNav / themeToggle / reveal / heroBackground ...
} as const;
```

### 5.4 Provider

```tsx
// packages/ui/src/variants/provider.tsx
export interface UIConfig {
	slots?: Partial<Record<keyof typeof slots, string>>;
	motion?: MotionConfig;
	theme?: {
		mode?: "light" | "dark" | "system";
		palette?: string;
	};
}

export function UIProvider({
	config,
	children,
}: {
	config?: UIConfig;
	children: React.ReactNode;
}) {
	// 1. 合并 preset + config
	// 2. 提供 variant 解析
	// 3. 安装 useMotionEffects()（内部已幂等）
	// 4. 提供 reducedMotion / intensity
	return <UIContext value={resolved}>{children}</UIContext>;
}
```

### 5.5 使用 Slot

```tsx
const Header = useSlot("siteHeader");
return <Header {...props} />;
```

也可以保留显式变体：

```tsx
<SiteHeader variant="floating-pill" {...props} />
```

实现上 `SiteHeader` 是一个很薄的 dispatcher：

```tsx
export function SiteHeader({
	variant,
	...props
}: SiteHeaderProps & { variant?: string }) {
	const Component = useVariant("siteHeader", variant);
	return <Component {...props} />;
}
```

---

## 6. 导航变体矩阵

### 6.1 桌面 Header

| Variant         | 视觉/交互                                     | 适用场景                      | 依赖                       |
| --------------- | --------------------------------------------- | ----------------------------- | -------------------------- |
| `classic`       | 通栏固定，Logo 左、菜单中、操作右，底部细边框 | 后台、文档站、通用站点        | `NavigationMenu`、`Button` |
| `floating-pill` | 居中悬浮胶囊，圆角、毛玻璃、滚动后收紧        | 营销站、产品首页（Flux 风格） | `NavigationMenu`、`Motion` |
| `mega-menu`     | 多列下拉，带图标/描述/分组，Radix Viewport    | 产品功能多、需要导航说明      | `NavigationMenu`           |
| `minimal`       | Logo + 2–4 个链接 + 主 CTA，无下拉            | Landing Page、活动页          | `Button`                   |
| `sidebar`       | 左侧可折叠侧栏 + 顶部工具条                   | 管理后台、AI 工作台           | 现有 `NavSidebar`          |

### 6.2 移动菜单

| Variant      | 交互                                      | 适用场景            | 依赖                          |
| ------------ | ----------------------------------------- | ------------------- | ----------------------------- |
| `sheet`      | 右侧抽屉，保留桌面导航上下文              | 后台、工具型产品    | 现有 `Sheet`                  |
| `fullscreen` | 全屏覆盖，垂直 NavigationMenu + Accordion | 营销站（Flux 风格） | `NavigationMenu`、`Accordion` |
| `drawer`     | 底部/侧边 Drawer，适合移动端手势          | 内容型产品          | 现有 `Drawer`                 |

### 6.3 主题开关

| Variant          | 交互                            | 说明                          |
| ---------------- | ------------------------------- | ----------------------------- |
| `dropdown`       | 图标按钮 + 下拉三态             | 现有 `ThemeToggle` 行为，默认 |
| `icon-cycle`     | 单击在 light/dark/system 间循环 | 极简头部                      |
| `segmented`      | 三段式切换                      | 设置页/演示页                 |
| `palette-select` | 选择 11 套主题                  | 现有 `ThemeSelector`          |

> `mode`（明暗）与 `palette`（11 套主题）是两个维度，不要混成一个变体。`ThemeToggle` 负责 mode，`ThemeSelector` 负责 palette。

---

## 7. 动效预设

### 7.1 预设清单

| Preset          | initial                                  | animate                             | 适用                 |
| --------------- | ---------------------------------------- | ----------------------------------- | -------------------- |
| `none`          | —                                        | —                                   | 低端设备、无动画偏好 |
| `fade`          | `opacity: 0`                             | `opacity: 1`                        | 轻量淡入             |
| `rise`          | `opacity: 0, y: 16`                      | `opacity: 1, y: 0`                  | 通用段落             |
| `blur-rise`     | `opacity: 0, y: 30, filter: blur(2px)`   | `opacity: 1, y: 0, filter: blur(0)` | Flux 默认风格        |
| `scale-in`      | `opacity: 0, scale: 0.96`                | `opacity: 1, scale: 1`              | 卡片、图片           |
| `spring-pop`    | `opacity: 0, scale: 0.92, y: 8`          | `opacity: 1, scale: 1, y: 0`        | 徽标、按钮、浮层     |
| `stagger`       | 父容器编排                               | 子元素依次进入                      | 列表、网格、Hero     |
| `scroll-reveal` | `whileInView`，`once: true, amount: 0.3` | 进入视口播放                        | 页面区块             |
| `page-enter`    | 复用 `pageEnter()`                       | 路由切换                            | 页面级进场           |

### 7.2 强度

```ts
export type MotionIntensity = "subtle" | "default" | "expressive";

export const intensityMap = {
	subtle: { distance: 12, duration: 0.32, stiffness: 140, damping: 26 },
	default: { distance: 24, duration: 0.5, stiffness: 100, damping: 25 },
	expressive: { distance: 40, duration: 0.7, stiffness: 80, damping: 20 },
} as const;
```

### 7.3 配置

```tsx
<UIProvider
	motion={{
		preset: "blur-rise",
		intensity: "default",
		reducedMotion: "respect", // respect | always | never
	}}
>
	<App />
</UIProvider>
```

### 7.4 `Reveal` 组件

```tsx
<Reveal preset="blur-rise" delay={0.1}>
	<h2>...</h2>
</Reveal>
```

约束：

- `prefers-reduced-motion: reduce` 时直接输出终态；
- 首帧默认可见，挂载后再启用隐藏初态，避免 JS 失败/SSR 时内容不可见；
- 支持 `as` 指定元素；
- 支持 `once`、`amount`、`delay`、`stagger`；
- 不直接依赖 `motion/react` 的外部调用方，统一从 `@frontend-frame/ui` 取。

---

## 8. 其他可插槽组件

第一批只做“高频且差异明显”的 Slot，避免变体爆炸：

| Slot                | 变体                                                    | 优先级 | 理由                            |
| ------------------- | ------------------------------------------------------- | ------ | ------------------------------- |
| `siteHeader`        | classic / floating-pill / mega-menu / minimal / sidebar | P0     | 用户最先感知，Flux 的核心差异点 |
| `mobileNav`         | sheet / fullscreen / drawer                             | P0     | 与 Header 成对出现              |
| `reveal` / `motion` | none / fade / rise / blur-rise / scale-in / stagger     | P0     | 统一全站动效                    |
| `themeToggle`       | dropdown / icon-cycle / segmented                       | P1     | 与主题系统直接相关              |
| `heroBackground`    | none / dot-grid / wave / shader                         | P1     | 营销站视觉层                    |
| `toast`             | sonner / radix                                          | P1     | 现有两套实现可收敛              |
| `emptyState`        | illustration / minimal                                  | P2     | 后台与营销站差异大              |
| `carousel`          | embla / motion                                          | P2     | 现有 Embla，可按需扩展          |

**不纳入首批**：Button、Input、Card 等基础控件不做多实现。它们通过 `variant` / `size` / 主题 token 表达差异，不需要 Slot。

> 注：导航/外壳之外，Flux 最关键的是“产品 UI 模拟层”（Pipeline 图表、Contact 卡、Workflow 画布）。这部分单独放在 `docs/product-ui-mockup-plan.md`，避免把内容型 UI 混进通用组件库。

---

## 9. Demo Playground

新增 `apps/demo/src/pages/variants.tsx`，路由 `/variants`：

```text
┌─────────────────────────────────────────────────────┐
│ 变体实验室                                          │
│ 导航：[经典] [浮动胶囊] [Mega] [极简] [侧边栏]      │
│ 移动：[Sheet] [全屏] [Drawer]                       │
│ 动效：[None] [Fade] [Rise] [Blur Rise] [Scale]      │
│ 强度：[Subtle] [Default] [Expressive]               │
│ 主题：[Glass] [Claude] [Vercel] ...                 │
│ 模式：[Light] [Dark] [System]                       │
├─────────────────────────────────────────────────────┤
│ 实时预览：Header + Hero + 内容卡片                  │
├─────────────────────────────────────────────────────┤
│ [复制配置] [重置] [应用到 Demo Shell]               │
└─────────────────────────────────────────────────────┘
```

行为：

- 选择写入 URL query，便于分享；
- 选择写入 `localStorage`，刷新后保留；
- “复制配置”输出 `UIProvider` 的 TSX/JSON；
- “应用到 Demo Shell”让现有 `AppShell` 立即切换导航/动效；
- 移动端预览用容器缩放，不强制切换窗口尺寸。

这个页面是“想用哪个就用哪个”的可视化证明，也是后续文档与截图来源。

---

## 10. 分阶段任务

### Phase 0：契约、注册表、样式令牌（2 天）

**任务**

1. 新建 `packages/ui/src/navigation/types.ts`，定义 `NavItem`、`NavAction`、`SiteHeaderProps`。
2. 新建 `packages/ui/src/variants/define-slot.ts`、`registry.ts`、`provider.tsx`、`use-slot.ts`。
3. 在 `packages/ui/src/index.ts` 增加导出。
4. 在 `packages/ui/src/styles.css` 增加导航/动效 CSS 变量：

```css
:root {
	--nav-height: 3.5rem;
	--nav-radius: 0px;
	--nav-bg: var(--background);
	--nav-border: var(--border);
	--nav-shadow: none;
	--nav-blur: 0px;
	--motion-distance: 24px;
	--motion-duration: 500ms;
	--motion-ease: cubic-bezier(0.16, 1, 0.3, 1);
}

[data-nav-variant="floating-pill"] {
	--nav-height: 4.75rem;
	--nav-radius: 9999px;
	--nav-bg: color-mix(in oklab, var(--background) 80%, transparent);
	--nav-border: color-mix(in oklab, var(--border) 60%, transparent);
	--nav-shadow: 0 1px 2px rgb(0 0 0 / 0.06);
	--nav-blur: 12px;
}
```

5. 为 `defineSlot`、`useSlot`、fallback 行为写单元测试。

**验收**

- `pnpm lint`、`pnpm typecheck`、`pnpm test`、`pnpm build` 全绿；
- 未注册 variant 时开发环境有 warning，生产环境回退默认；
- `packages/ui` 不新增 React Router / Next 依赖；
- 现有 `NavSidebar`、`NavigationMenu`、`ThemeToggle` 的测试不回归。

### Phase 1：Header 变体 + 移动菜单（3–4 天）

**任务**

1. 实现 `ClassicHeader`、`FloatingPillHeader`、`MegaMenuHeader`、`MinimalHeader`、`SidebarHeader`。
2. 实现 `SheetMobileNav`、`FullscreenMobileNav`、`DrawerMobileNav`。
3. 抽出 `NavLink`、`NavActions`、`NavBrand` 共享子组件，避免每个变体复制激活态/可访问性逻辑。
4. `SidebarHeader` 适配现有 `NavSidebar`，保持 `linkComponent`、`storageKey`、`mobileOpen` 等能力。
5. 新增 `/variants` 页面，支持切换 Header/Mobile。

**验收**

- 每个 Header 变体都通过同一套契约测试：
  - 渲染 `<header>` + `<nav aria-label="主导航">`；
  - 当前项 `aria-current="page"`；
  - 999/768/1024/1440 无横向滚动；
  - 移动端触发器有 `aria-label`/`aria-expanded`；
  - 打开移动菜单后焦点进入菜单，Esc/遮罩/路由变化可关闭，焦点回到触发器；
  - 桌面隐藏菜单不进入 Tab 顺序；
  - 不直接 import `react-router-dom` 或 `next/link`。
- 5 个 Header × 2 个主题 × 3 个断点的 Playwright 截图通过；
- 视觉上 `classic` 与现有 demo 的顶栏接近，`floating-pill` 与 Flux 风格接近；
- 移动菜单打开时 `document.body` 滚动锁定，关闭后恢复。

### Phase 2：动效预设 + Reveal/Stagger（2–3 天）

**任务**

1. 新建 `packages/ui/src/motion/types.ts`、`presets.ts`、`motion-provider.tsx`。
2. 实现 `Reveal`、`Stagger`、`useMotionPreset`。
3. 支持 `preset` / `intensity` / `reducedMotion` 三层配置。
4. 把 demo 现有 `useMotionEffects` 接到 `UIProvider`，避免重复安装。
5. 在 `/variants` 页面增加动效切换与实时预览。

**验收**

- 模拟 `prefers-reduced-motion: reduce` 时，`Reveal` 不产生 `opacity: 0` / `transform`，内容直接可见；
- 首帧可见，挂载后才启用动画，JS 失败时内容不消失；
- `none` 预设下无动画、无延迟；
- 同一 `Reveal` 在 `once: true` 下只播放一次；
- `stagger` 子元素顺序稳定，不因列表重渲染乱序；
- `pnpm test` 覆盖 6 个预设 × 3 个强度；
- Lighthouse/Performance 不因默认动效出现明显 CLS。

### Phase 3：主题开关、Hero 背景与第一批扩展 Slot（3 天）

**任务**

1. `ThemeToggle` 改为支持 `variant="dropdown" | "icon-cycle" | "segmented"`，默认保持 `dropdown`。
2. 新增 `HeroBackground` Slot：`none` / `dot-grid` / `wave` / `shader`。
3. `shader` 变体动态 import + fallback，不进入主 bundle。
4. 支持 `/variants?hero=dot-grid` 运行时切换。
5. `toast` Slot 收敛 `sonner` 与 `radix` 两套实现。

**验收**

- `ThemeToggle` 三种变体都支持 light/dark/system，且有 `aria-label`；
- `HeroBackground` 的每个变体都 `aria-hidden` + `pointer-events-none`；
- `shader` 变体在低端设备/`prefers-reduced-motion` 下可回退到 `dot-grid` 或 `none`；
- 引入 `dot-grid` 时，产物不包含 Three.js；
- `toast` 两套实现 API 一致，切换不改变调用方代码。

### Phase 4：文档、视觉回归与发布（2–3 天）

**任务**

1. 在 `docs/` 增加变体矩阵、API、迁移说明。
2. 为 `/variants` 生成截图，纳入 README 或文档站。
3. 增加 Playwright 视觉回归矩阵：
   - Header：5 变体 × light/dark × 360/768/1024/1440；
   - Motion：6 预设 × reduced-motion 开/关；
   - Theme：4 个主题 × light/dark。
4. 增加 bundle 预算检查。
5. 发布 `@frontend-frame/ui` 0.2.0 + changeset。

**验收**

- `pnpm lint` / `typecheck` / `test` / `build` / `preview` 全绿；
- 文档中的每个代码片段可运行；
- 视觉回归无未审核 diff；
- 单个导航变体按需引入时，不带上其他变体的独有依赖；
- changeset 包含 breaking change 说明（如有）。

---

## 11. 全局验收标准

### 11.1 功能

- [ ] 用户可以直接 import 任一变体，不需要 Provider。
- [ ] 用户可以通过 `UIProvider config` 选择变体。
- [ ] 用户可以在 `/variants` 运行时切换，并复制配置。
- [ ] 未知 variant 有 dev warning，生产环境 fallback。
- [ ] 自定义 variant 可以通过注册表注入。
- [ ] 动效预设支持 `none` 与 reduced-motion。

### 11.2 可访问性

- [ ] 所有 Header 变体：一个 `<header>`、一个 `<nav aria-label>`、当前项 `aria-current="page"`。
- [ ] 移动菜单：触发器 `aria-expanded`/`aria-controls`，Esc/遮罩关闭，焦点返回。
- [ ] 键盘可以完成 Logo → 菜单 → 操作按钮 → 移动菜单的完整路径。
- [ ] 装饰层 `aria-hidden`，不进入可访问性树。
- [ ] 颜色不是唯一状态表达，焦点态可见。
- [ ] `prefers-reduced-motion` 下无位移动画。

### 11.3 响应式与主题

- [ ] 360 / 768 / 1024 / 1440 无横向滚动。
- [ ] light/dark/11 套主题下对比度可读。
- [ ] `floating-pill` 在 1024 以下正确降级。
- [ ] 移动菜单在 iOS Safari / Android Chrome 可滚动。

### 11.4 工程质量

- [ ] `packages/ui` 不依赖 React Router / Next.js。
- [ ] 新目录被 `@source` 扫描，Tailwind 类不丢失。
- [ ] `pnpm lint` 0 error / 0 warning。
- [ ] `pnpm typecheck` 通过。
- [ ] `pnpm test` 通过，新增契约测试覆盖所有变体。
- [ ] `pnpm build` 通过，产物可 tree-shake。
- [ ] 视觉回归矩阵通过。

### 11.5 性能

- [ ] 默认入口不包含 Three.js / Shader 代码。
- [ ] `HeroBackground=shader` 为动态 import。
- [ ] 单变体引入不显著增加首屏 JS（建议用 `size-limit` 设预算）。
- [ ] 动效不造成 CLS；图片有宽高。

---

## 12. 兼容性与迁移

### 12.1 现有用法不变

```tsx
// 继续可用
<NavSidebar
	groups={groups}
	activePath={pathname}
	linkComponent={RouterNavLink}
/>
```

```tsx
// 新增：同一套数据走 SidebarHeader
<SidebarHeader
	items={items}
	brand={<Brand />}
	activePath={pathname}
	linkComponent={RouterNavLink}
/>
```

### 12.2 Demo 迁移

`apps/demo/src/components/app-shell.tsx` 当前直接渲染 `NavSidebar`。迁移步骤：

1. 保留 `AppShell` 作为 demo 壳；
2. 把 `NavSidebar` 相关代码抽到 `SidebarHeader`；
3. `AppShell` 改为：

```tsx
<AppShell navigation="sidebar" motion="rise">
	<Outlet />
</AppShell>
```

4. 默认仍渲染 `sidebar`，视觉不变；
5. 在 `/variants` 页面切换后，`AppShell` 读取同一个 `UIProvider` 配置。

### 12.3 数据迁移

- `apps/demo/src/lib/nav.ts` 的 `NavItem` 改为从 `@frontend-frame/ui` 导入；
- `NavSidebarGroup` 保留，作为 `NavItem[]` 的分组包装；
- `navItems` 仍可由 `navGroups.flatMap` 生成。

### 12.4 版本策略

- 新增导出为 minor；
- `ThemeToggle` 增加 variant 参数为 minor；
- 如果未来把 `NavSidebarItem` 改为 `NavItem` 别名，先保留 deprecated 类型，下一 major 再移除；
- 变体 ID 一旦发布视为稳定 API，新增变体用新 ID，不改旧 ID 的视觉语义。

---

## 13. 风险与对策

| 风险                      | 影响                   | 对策                                                                  |
| ------------------------- | ---------------------- | --------------------------------------------------------------------- |
| 变体太多，维护成本高      | 每个变体都要修 bug     | 共享 `NavLink` / `NavActions` / `MobileNavShell`；只对高频组件做 Slot |
| 各变体可访问性不一致      | 键盘/读屏体验退化      | 同一套契约测试 + axe 检查                                             |
| 动效导致眩晕/性能问题     | 用户体验差             | 默认 `respect`，提供 `none` 与强度档位                                |
| 配置系统过度设计          | 学习成本高             | 直接 import 仍是主路径；Provider 只做可选增强                         |
| SSR/首帧不可见            | SEO/无 JS 场景内容消失 | 首帧可见，挂载后再启用动画                                            |
| 包体积膨胀                | 首屏变慢               | 变体独立导出、动态 import 重依赖、size-limit                          |
| 主题 token 与变体样式冲突 | 换主题后导航错乱       | 导航只消费 `--nav-*` / 语义 token，不写死颜色                         |
| 未知 variant 白屏         | 线上事故               | dev warning + 生产 fallback + 错误边界                                |

---

## 14. 交付物清单

- `packages/ui/src/navigation/*`：导航契约、共享组件、5 个 Header 变体、3 个移动菜单变体；
- `packages/ui/src/motion/*`：动效预设、Provider、Reveal、Stagger；
- `packages/ui/src/variants/*`：Slot 注册表、UIProvider、useSlot；
- `packages/ui/src/styles.css`：导航/动效 token；
- `apps/demo/src/pages/variants.tsx`：变体实验室；
- `docs/pluggable-variants-plan.md`：本方案；
- `docs/variant-matrix.md`：最终变体矩阵与 API（Phase 4 产出）；
- 测试：契约测试、reduced-motion 测试、Playwright 视觉矩阵；
- changeset + 0.2.0 发布说明。

---

## 15. 建议排期

| 阶段    | 内容                            | 预计    |
| ------- | ------------------------------- | ------- |
| Phase 0 | 契约、注册表、令牌、测试骨架    | 2 天    |
| Phase 1 | Header + 移动菜单 + Playground  | 3–4 天  |
| Phase 2 | 动效预设 + Reveal/Stagger       | 2–3 天  |
| Phase 3 | 主题开关、Hero 背景、Toast Slot | 3 天    |
| Phase 4 | 文档、视觉回归、发布            | 2–3 天  |
| 合计    | 可交付 0.2.0                    | 约 2 周 |

如果只能先做一件事：**先做 Phase 1 的 `classic` + `floating-pill` + `fullscreen-mobile-nav` + `/variants` 页面**。它最能直观体现“同一个框架，用户想用哪种导航就用哪种”，也能验证契约与注册表是否成立。

---

## 16. 与 Flux 调研的对应关系

| Flux 的做法                     | 本方案的落点                                  |
| ------------------------------- | --------------------------------------------- |
| 浮动胶囊 Header + 全屏移动菜单  | `floating-pill` + `fullscreen` 变体           |
| Radix NavigationMenu + 下拉描述 | `mega-menu` 变体                              |
| 统一 Motion 变体 / spring 参数  | `motion/presets.ts` + `Reveal`                |
| 主题 View Transitions / 防闪烁  | `themeToggle` 变体 + 后续 ThemeProvider 增强  |
| 数据驱动导航                    | `NavItem` / `NavAction` 契约                  |
| block 化页面                    | Slot 注册表 + 后续 `packages/blocks`          |
| 装饰层与 Shader 可选            | `heroBackground` Slot，动态 import + fallback |

> Flux 是付费模板，本方案只借鉴其交互结构与工程模式，不复制模板源码、图片或文案。
