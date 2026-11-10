# frontend-frame 应用层能力建设开发计划

> 依据：`docs/learn-from-mainline-nextjs-template.md`、`docs/learn-from-flux-nextjs-template.md`
> 目标版本：`0.2.0`
> 计划周期：MVP 约 5 周，完整版约 8 周（1 人全职估算）
> 适用仓库：`/Users/yanluohao/develop/frontend-frame`
> 日期：2026-11-10

## 1. 计划目标与范围

### 1.1 三个可验证的结果

1. 业务方可以用 `@frontend-frame/app-kit` 在 30 分钟内搭出一个带侧栏、顶栏、路由边界和主题切换的应用壳。
2. 业务方可以从同一类组件的多个变体中自由选择（例如 3 种 Header、3 种 Hero、2 种 Pricing），并在 1 小时内拼出一个营销落地页；Phase 5 再用 `@frontend-frame/templates` 固化成页面模板。
3. 业务方可以用 `@frontend-frame/forms` 完成「Zod 校验 → Action 提交 → 服务端字段错误回填 → 成功态」的完整表单链路，且不绑定 Next.js。

### 1.2 MVP 范围

MVP 只做 Phase 0 ~ Phase 4：

- 设计底座：主题防闪烁、字体/布局令牌、装饰原语、声明式 `Reveal` / `Stagger`。
- 应用壳：`app-kit` 的 adapters、AppShell、PageHeader、RouteBoundary。
- 页面区块：至少 5 个组件族、每族 2~3 个变体（Header / Footer / Hero / Pricing / FAQ / Testimonials），并在 demo 新增 `/marketing` 页面和变体切换器。
- 表单闭环：`forms` 的 `createAction` / `useAction` / `applyFieldErrors` / `createFetchAction`，并在 demo 跑通 `ContactForm`。

MVP 后的 Phase 5 ~ Phase 7：

- Phase 5：`packages/templates` + `apps/site` 页面模板、SEO、MDX 内容层。
- Phase 6：子路径导出、Tailwind 预设、体积门禁、脚手架。
- Phase 7：可选视觉层（DotGrid / Wave / Beam / Shader），必须动态加载且可降级。

### 1.3 非目标

- 不把项目迁移到 Next.js。
- 不新增后端、数据库、鉴权服务。
- 不重构 `packages/ui/src/components` 下全部 101 个 `.tsx` 文件；目录治理按 `docs/framework-improvement-plan.md` 二期单独排期。
- 不把 `next-safe-action` 作为运行时硬依赖，只提供可选适配器。
- 本期不做 i18n、RSC/SSR 支持、Storybook 全量迁移。

### 1.4 当前基线（来自现有代码）

| 项目     | 现状                                                                               |
| -------- | ---------------------------------------------------------------------------------- |
| 组件规模 | `packages/ui/src/components/*.tsx` 共 101 个文件                                   |
| 主题     | 12 套主题，`ThemeProvider` + `ActiveThemeProvider` 双层                            |
| 测试     | 8 个测试文件，`vitest.config.ts` 只覆盖 `packages/ui/src/**` 与 `apps/demo/src/**` |
| 构建     | `packages/ui` 为 Vite 单入口 lib + `tsc` 声明                                      |
| demo     | 7 个页面，路由在 `apps/demo/src/app.tsx`，导航在 `apps/demo/src/lib/nav.ts`        |
| 质量门禁 | `lint` / `typecheck` / `test` / `build` 四个 CI job 已存在                         |
| 应用层   | 无 `app-kit` / `blocks` / `templates` / `forms` / `content` / `seo` / `visuals` 包 |

### 1.5 与既有计划的关系

| 文档                                          | 负责范围                                | 本计划是否重复           |
| --------------------------------------------- | --------------------------------------- | ------------------------ |
| `docs/framework-improvement-plan.md`          | 工程基建、目录分层、组件补齐、Storybook | 不重复；本计划只补应用层 |
| `docs/learn-from-mainline-nextjs-template.md` | 调研与借鉴清单                          | 本计划是其执行版         |
| `docs/learn-from-flux-nextjs-template.md`     | 页面模板、区块、动效、内容层调研        | 本计划合并其执行项       |

## 2. 架构决策

### 2.1 包边界

```text
@frontend-frame/ui
   ↑          ↑            ↑
   │          │            │
app-kit    forms         seo
   ↑
   │
blocks
   ↑
   │
templates

content ──→ templates（只提供数据与 MDX 解析，不依赖 UI）
visuals ──→ ui（可选装饰，动态 import）
```

依赖规则：

- `ui` 不依赖任何新包，也不依赖路由库。
- `app-kit` 依赖 `ui`，负责路由/图片/路径适配、应用壳、路由边界。
- `blocks` 依赖 `ui` + `app-kit`，只做页面编排，不直接依赖 `next/*` 或 `react-router-dom`。
- `templates` 依赖 `blocks`，负责页面级组合（Home / Pricing / About / Contact / Auth / 404），不直接写路由。
- `content` 负责 frontmatter schema、MDX 解析与文章/职位数据，不依赖 UI。
- `forms` 依赖 `ui` + `react-hook-form` + `zod`，不依赖任何路由或框架。
- `seo` 不依赖 `ui`，只输出 metadata / JSON-LD / sitemap 工具，保持纯函数优先。
- `visuals` 可选，依赖 `ui`，所有重型视觉（DotGrid / Wave / Beam / Shader）必须动态 import 并提供降级。

### 2.2 核心契约

#### UiAdapters

```ts
export interface UiAdapters {
	Link: React.ComponentType<
		React.ComponentPropsWithoutRef<"a"> & { href: string }
	>;
	Image: React.ComponentType<{
		src: string;
		alt: string;
		width?: number;
		height?: number;
		className?: string;
	}>;
	usePathname: () => string;
	navigate?: (href: string) => void;
}
```

#### ActionResult

```ts
export type FieldErrors = Record<string, string[] | undefined>;

export interface ActionErrorPayload {
	code: string;
	message: string;
	fieldErrors?: FieldErrors;
}

export type ActionResult<T> =
	{ ok: true; data: T } | { ok: false; error: ActionErrorPayload };
```

#### PageMeta

```ts
export interface SiteConfig {
	name: string;
	url: string;
	description: string;
	ogImage?: string;
	twitter?: string;
}

export interface PageMeta {
	title: string;
	description: string;
	path?: string;
	image?: string;
	noIndex?: boolean;
}
```

### 2.3 兼容策略

- `packages/ui` 的 `src/index.ts` 现有导出保持不变。
- 新包从第一天就提供子路径导出，例如 `@frontend-frame/forms/use-action`。
- 新组件优先放进新包，不继续往 `packages/ui/src/components` 平铺。
- 任何对 `ui` 的改动必须保持 `pnpm typecheck` 与 `pnpm build` 通过。
- Phase 0 之后每个 PR 必须带 changeset。
- 新增变体属于 `minor`，不构成 breaking change；删除/重命名已发布变体属于 `major`，必须先提供 alias 并标记 deprecated。
- `catalog.ts` 中的 `status: "beta"` 变体不进入默认推荐，也不在 `blocks` 根入口导出。

### 2.4 构建与样式接入

需要一次性解决新包的工程接入，否则会出现「本地能跑、构建失败、Tailwind 类名丢失」：

1. **共享构建配置**：把 `packages/ui/vite.config.ts` 的 `strip-use-client` / `preserve-use-client` 插件抽到 `packages/build-config`，所有新包复用。
2. **TypeScript 路径**：在 `apps/demo/tsconfig.json` 增加新包到源码的 `paths`。
3. **Vite 开发解析**：每个新包 `package.json` 的 `exports` 增加 `"development": "./src/index.ts"`。
4. **Tailwind 扫描**：在 `apps/demo/src/styles.css` 与 `apps/site/src/styles.css` 增加新包的 `@source`。
5. **测试范围**：`vitest.config.ts` 的 `include` 改为 `packages/*/src/**/*.{test,spec}.{ts,tsx}`。

### 2.5 站点形态决策

两份调研都指向同一个问题：营销站用 Vite 还是 Next.js。本计划先选定路线，避免边做边改：

| 方案                                  | 适用                                   | 本计划取舍                                                                |
| ------------------------------------- | -------------------------------------- | ------------------------------------------------------------------------- |
| A. Vite + React Router + 构建期预渲染 | 内部演示、产品官网、文档站             | **本期采用**；Phase 5 新增 `apps/site`，与现有 demo 共用 blocks/templates |
| B. Next.js App Router                 | 公开营销站、强 SEO、MDX/Image 开箱即用 | **不在本期**；保留 `app-kit` 的 Next 适配器，后续可加 `apps/site-next`    |

决策：

- MVP 先把 `apps/demo` 的 `/marketing` 跑通，验证 blocks。
- Phase 5 新增 `apps/site`，用 React Router 组织 6 个页面 + 404，并接入构建期预渲染或静态导出。
- 如果上线后 Lighthouse SEO 或首屏指标不达标，再评估 Next.js 站点；`ui` / `blocks` / `templates` 不因此改动。

### 2.6 多变体与可选能力（核心设计）

**目标**：同一类组件不锁定单一实现。用户想要「浮动胶囊 Header」「极简 Header」「带 Mega Menu 的 Header」，或者想要「居中 Hero」「左右分栏 Hero」「Bento Hero」，都能按需选择；动效也可以独立选择，而不是和组件绑死。

#### 2.6.1 四条设计原则

1. **契约先行**：每个组件族先定义稳定的 `XxxProps` 和 `XxxVariant`，所有变体必须满足同一套契约。
2. **显式导入优先**：默认用法是 `import { FloatingPillHeader } from "@frontend-frame/blocks/header/floating-pill"`，只打包用户选中的变体。
3. **模板注入**：`templates` 通过 `components` 映射接收实现，不在内部 `switch` 所有变体，避免把整个变体库打进业务包。
4. **元数据驱动**：每个变体声明 `id` / `name` / `tags` / `status` / `motion` / `preview`，demo 和文档站据此生成「组件市场」。

#### 2.6.2 三种选择方式

**方式 A：直接导入（推荐，tree-shaking 最好）**

```tsx
import { FloatingPillHeader } from "@frontend-frame/blocks/header/floating-pill";
import { SplitHero } from "@frontend-frame/blocks/hero/split";
import { CardsPricing } from "@frontend-frame/blocks/pricing/cards";

export function Page() {
	return (
		<HomeTemplate
			components={{
				SiteHeader: FloatingPillHeader,
				Hero: SplitHero,
				Pricing: CardsPricing,
			}}
			content={content}
		/>
	);
}
```

**方式 B：全局注入（适合整个应用统一选型）**

```tsx
import { BlocksProvider } from "@frontend-frame/blocks";
import { MinimalHeader } from "@frontend-frame/blocks/header/minimal";
import { CenteredHero } from "@frontend-frame/blocks/hero/centered";

<BlocksProvider
	components={{
		SiteHeader: MinimalHeader,
		Hero: CenteredHero,
	}}
>
	<App />
</BlocksProvider>;
```

**方式 C：`variant` 属性（只用于 demo / 文档站 / 低代码配置）**

```tsx
<SiteHeader variant="floating-pill" />
<Hero variant="bento" />
```

`variant` 属性走懒加载注册表，只加载被选中的变体；生产环境遇到未知变体时回退到默认变体并 `console.warn`，开发环境直接抛错。它不能成为业务代码的主用法，否则容易把全部变体打进首屏。

#### 2.6.3 变体命名与目录

```text
packages/blocks/src/
├─ header/
│  ├─ floating-pill.tsx
│  ├─ minimal.tsx
│  └─ mega-menu.tsx
├─ hero/
│  ├─ centered.tsx
│  ├─ split.tsx
│  └─ bento.tsx
├─ pricing/
│  ├─ cards.tsx
│  └─ comparison.tsx
├─ faq/
│  ├─ accordion.tsx
│  └─ two-column.tsx
├─ testimonials/
│  ├─ carousel.tsx
│  └─ grid.tsx
├─ footer/
│  ├─ dark-mega.tsx
│  └─ minimal.tsx
├─ contracts.ts       # 各组件族 Props
├─ catalog.ts         # 变体元数据
└─ variants.ts        # 懒加载注册表（demo / 文档站用）
```

包导出同步提供子路径，例如：

```json
{
	"exports": {
		"./header/floating-pill": "./dist/header/floating-pill.js",
		"./header/minimal": "./dist/header/minimal.js",
		"./hero/split": "./dist/hero/split.js"
	}
}
```

#### 2.6.4 变体元数据

```ts
export interface BlockVariantMeta {
	id: string;
	family: "header" | "hero" | "footer" | "pricing" | "faq" | "testimonials";
	name: string;
	description: string;
	tags: string[];
	status: "stable" | "beta";
	motion: Array<MotionPreset>;
	preview?: string;
}

export const headerVariants: BlockVariantMeta[] = [
	{
		id: "floating-pill",
		family: "header",
		name: "浮动胶囊",
		description: "居中悬浮、毛玻璃、移动端全屏菜单",
		tags: ["marketing", "glass", "floating"],
		status: "stable",
		motion: ["none", "subtle", "playful"],
		preview: "/previews/header-floating-pill.webp",
	},
	{
		id: "minimal",
		family: "header",
		name: "极简通栏",
		description: "白底/暗底通栏，适合后台和文档站",
		tags: ["app", "minimal", "docs"],
		status: "stable",
		motion: ["none", "subtle"],
	},
];
```

#### 2.6.5 动效预设与组件解耦

动效不写死在 Header/Hero 里，而是由 `MotionPresetProvider` 统一控制：

```tsx
<MotionPresetProvider preset="subtle">
	<App />
</MotionPresetProvider>
```

| 预设        | 行为                        | 适用                      |
| ----------- | --------------------------- | ------------------------- |
| `none`      | 关闭所有入场/滚动动效       | 低端设备、可访问性优先    |
| `subtle`    | 120~200ms 淡入/位移         | 默认                      |
| `playful`   | Spring、stagger、hover lift | 营销站、演示              |
| `cinematic` | 滚动叙事、逐词点亮、视差    | Hero / 长页面，按区块启用 |

规则：

- 每个变体声明支持哪些预设；不支持时回退到 `subtle`。
- `prefers-reduced-motion: reduce` 强制等价于 `none`。
- `MotionPresetProvider` 只影响动效，不影响布局和颜色，避免「换动效导致页面重排」。
- 动效层复用现有 `packages/ui/src/lib/motion.ts` 和 `use-motion.ts`，不新增动画库。

#### 2.6.6 UI 风格的选择边界

- 颜色与明暗继续走现有 12 套主题，不新增第二套颜色系统。
- 如果要做「玻璃 / 扁平 / 编辑风 / 粗野风」的布局差异，用 `data-style` 或 `StylePackProvider` 控制圆角、阴影、边框、密度，不复制颜色 token。
- 同一页面允许混用不同族变体（例如 `FloatingPillHeader` + `BentoHero` + `CardsPricing`），但一个族在一个页面内只选一个实现。

#### 2.6.7 禁止事项

- 禁止一个 `switch (variant)` 里静态 import 所有变体，导致业务包全量膨胀。
- 禁止把变体私有 props 泄漏进公共契约；差异通过 `slots` / `renderXxx` / `className` 解决。
- 禁止复制粘贴出 10 份几乎一样的 Header；共有逻辑抽到 `ui` 或 `blocks/_shared`。
- 禁止把变体 ID 和路由绑定；变体只负责渲染，路由由 `app-kit` / `apps/site` 决定。

## 3. 工作分解（WBS）

### Phase 0：准备与工程接入（1 天）

**目标**：让新包可以稳定创建、开发、测试、构建。

| ID    | 任务                  | 涉及文件                                                              | 产出                                  | 验收                                     |
| ----- | --------------------- | --------------------------------------------------------------------- | ------------------------------------- | ---------------------------------------- |
| P0-01 | 新建共享 lib 构建配置 | `packages/build-config/package.json`、`packages/build-config/vite.ts` | `createLibConfig()`                   | `packages/ui` 改用它后 `pnpm build` 不变 |
| P0-02 | 扩展测试范围          | `vitest.config.ts`                                                    | 覆盖 `packages/*/src`                 | `pnpm test` 能找到新包测试               |
| P0-03 | 扩展 demo 路径别名    | `apps/demo/tsconfig.json`                                             | 新包 paths                            | `pnpm typecheck` 通过                    |
| P0-04 | 扩展 Tailwind 扫描    | `apps/demo/src/styles.css`                                            | 所有含样式新包的 `@source`            | 新包类名在 demo 生效                     |
| P0-05 | 补 lint/format 插件   | `package.json`、`eslint.config.js`、`.prettierrc.json`                | jsx-a11y、import/order、Tailwind 排序 | `pnpm lint` 0 error / 0 warning          |
| P0-06 | 建立新包骨架          | `packages/{app-kit,blocks,forms,seo}/`                                | `src/index.ts` + 构建脚本             | `pnpm -r build` 通过                     |

> Phase 0 只创建 MVP 需要的 `app-kit` / `blocks` / `forms` / `seo`；`templates` / `content` / `visuals` 在对应 Phase 创建，避免空包长期占位。

**交付物**

- MVP 的 4 个空包可以 `pnpm -r build`。
- 新包改动后 `pnpm lint` / `pnpm typecheck` / `pnpm test` / `pnpm build` 全绿。
- 1 个 changeset：`.changeset/app-layer-foundation.md`。

---

### Phase 1：设计底座（4 天）

**目标**：把主题、字体、布局节奏和装饰原语补到「业务方开箱可用」。

| ID    | 任务                      | 涉及文件                                                                               | 产出                                                                 | 验收                |
| ----- | ------------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | ------------------- |
| P1-01 | 主题首帧防闪烁            | `packages/ui/src/components/theme-provider.tsx`、`packages/ui/src/lib/theme-script.ts` | `getThemeScript()`                                                   | 刷新无浅色闪屏      |
| P1-02 | 主题切换禁用过渡          | 同上 + `packages/ui/src/styles.css`                                                    | `disableTransitionOnChange`                                          | 切换瞬间无全站抖动  |
| P1-03 | 补字体/阴影/断点/容器令牌 | `packages/ui/src/styles.css`                                                           | `--font-display`、`--shadow-*`、`--breakpoint-2xl`、`container-page` | tokens 页面可见     |
| P1-04 | 新增布局原语              | `packages/ui/src/components/{container,page-section,section-backdrop,dashed-line}.tsx` | `Container` + 3 个装饰组件并从 `index.ts` 导出                       | demo 使用且样式正确 |
| P1-05 | 统一区块小标签            | `packages/ui/src/components/section-label.tsx` 或新增 `eyebrow.tsx`                    | `Eyebrow`（复用 `SectionLabel` 也可）                                | blocks 统一使用     |
| P1-06 | 声明式入场动效            | `packages/ui/src/components/{reveal,stagger}.tsx`                                      | `Reveal` / `Stagger` + reduced-motion 降级                           | 无 CLS、可关动效    |
| P1-07 | 补测试                    | `packages/ui/src/components/__tests__/layout-primitives.test.tsx`                      | 渲染/变体/动效降级测试                                               | `pnpm test` 通过    |
| P1-08 | 更新 demo tokens 页       | `apps/demo/src/pages/tokens.tsx`                                                       | 字体/阴影/断点/动效展示                                              | 页面无控制台报错    |

**交付物**

- `getThemeScript` 可供 Vite / Next 两种入口复用。
- `Container`、`PageSection`、`SectionBackdrop`、`DashedLine`、`Reveal`、`Stagger` 从 `@frontend-frame/ui` 导出。
- tokens 页面能看到字体、阴影、容器、断点、动效五组令牌。

---

### Phase 2：app-kit 应用壳（4 天）

**目标**：把 demo 的 `app-shell.tsx` 变成可复用包，并提供跨框架适配。

| ID    | 任务                       | 涉及文件                                                               | 产出                              | 验收                |
| ----- | -------------------------- | ---------------------------------------------------------------------- | --------------------------------- | ------------------- |
| P2-01 | UiAdapters Provider        | `packages/app-kit/src/adapters/ui-adapters.tsx`                        | Context + hook                    | 缺失时报错清晰      |
| P2-02 | React Router 适配器        | `packages/app-kit/src/adapters/react-router.tsx`                       | `createReactRouterAdapters()`     | demo 可注入         |
| P2-03 | Next 适配器示例            | `packages/app-kit/src/adapters/next.tsx`                               | `createNextAdapters()`            | 文档示例可编译      |
| P2-04 | AppShell 抽包              | `packages/app-kit/src/shell/app-shell.tsx`                             | 侧栏 + 顶栏 + 内容区              | demo 改为消费包     |
| P2-05 | PageHeader / RouteBoundary | `packages/app-kit/src/shell/*.tsx`                                     | 页面头 + 错误/加载边界            | demo 404/错误页可用 |
| P2-06 | demo 路由边界              | `apps/demo/src/app.tsx`、`apps/demo/src/components/route-fallback.tsx` | error/loading/not-found           | 手动触发可见        |
| P2-07 | 测试                       | `packages/app-kit/src/**/__tests__/*.test.tsx`                         | Provider、AppShell、RouteBoundary | `pnpm test` 通过    |

**交付物**

- `@frontend-frame/app-kit` 可独立安装使用。
- demo 的 `app-shell.tsx` 只保留业务配置，不再复制布局代码。
- 同一套 `AppShell` 可在 React Router 与 Next 中运行；Phase 3 的 `SiteHeader` 复用同一适配器。

---

### Phase 3：blocks 多变体组件族（9 天）

**目标**：先建立变体契约与选择机制，再交付 6 个组件族、15+ 个变体，并在 demo 里实时切换。

| ID    | 任务                   | 涉及文件                                                                                         | 产出                                                 | 验收                           |
| ----- | ---------------------- | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------- | ------------------------------ |
| P3-00 | 变体契约与目录         | `packages/blocks/src/{contracts.ts,catalog.ts,variants.ts}`                                      | 各组件族 Props + 元数据 + 懒加载注册表               | `variant` 未知时开发环境抛错   |
| P3-01 | Header 族              | `packages/blocks/src/header/{floating-pill,minimal,mega-menu}.tsx`                               | 3 个 Header 变体                                     | 同一 Props 契约，DOM 明显不同  |
| P3-02 | Footer 族              | `packages/blocks/src/footer/{dark-mega,minimal}.tsx`                                             | 2 个 Footer 变体                                     | 链接可键盘访问                 |
| P3-03 | Hero 族                | `packages/blocks/src/hero/{centered,split,bento}.tsx`                                            | 3 个 Hero 变体                                       | 移动端 CTA 不溢出              |
| P3-04 | LogoMarquee 族         | `packages/blocks/src/logo-marquee/{marquee,static}.tsx`                                          | 滚动/静态 2 个变体                                   | reduced-motion 下自动用 static |
| P3-05 | FeatureGrid 族         | `packages/blocks/src/features/{grid,bento,alternating}.tsx`                                      | 3 个布局变体                                         | 1024 断点布局正确              |
| P3-06 | Pricing 族             | `packages/blocks/src/pricing/{cards,comparison}.tsx`                                             | 2 个 Pricing 变体                                    | 月付/年付状态正确              |
| P3-07 | FAQ 族                 | `packages/blocks/src/faq/{accordion,two-column}.tsx`                                             | 2 个 FAQ 变体                                        | 键盘可展开                     |
| P3-08 | Testimonials 族        | `packages/blocks/src/testimonials/{carousel,grid}.tsx`                                           | 2 个证言变体                                         | 触控/键盘可切换                |
| P3-09 | CtaBand / Announcement | `packages/blocks/src/{cta-band,announcement-banner}.tsx`                                         | 2 个转化组件                                         | Banner 关闭记忆 + Header 偏移  |
| P3-10 | AuthLayout 族          | `packages/blocks/src/auth/{centered,split}.tsx`                                                  | 2 个认证布局                                         | 营销导航隐藏                   |
| P3-11 | siteConfig             | `packages/blocks/src/config/site-config.ts`                                                      | 品牌、导航、社交、Footer 配置                        | blocks 无硬编码品牌名          |
| P3-12 | 动效预设               | `packages/ui/src/components/motion-preset-provider.tsx`、`packages/blocks/src/_shared/motion.ts` | `none/subtle/playful/cinematic`                      | 切换预设不导致重排             |
| P3-13 | demo 落地页            | `apps/demo/src/pages/marketing.tsx`、`app.tsx`、`lib/nav.ts`                                     | `/marketing` + 变体切换器                            | 可实时切换 6 个组件族          |
| P3-14 | 变体目录页             | `apps/demo/src/pages/variants.tsx`、`packages/blocks/src/catalog.ts`                             | 预览 + 代码片段 + 标签筛选                           | 每个变体可单独预览             |
| P3-15 | 契约测试               | `packages/blocks/src/**/__tests__/*.test.tsx`、`package.json` scripts                            | 每族共享契约测试 + 每变体渲染测试 + `test:contracts` | 新增变体自动跑同一套契约       |

**交付物**

- `@frontend-frame/blocks` 提供 6 个组件族、15+ 个变体：
  - Header：`floating-pill` / `minimal` / `mega-menu`
  - Footer：`dark-mega` / `minimal`
  - Hero：`centered` / `split` / `bento`
  - Pricing：`cards` / `comparison`
  - FAQ：`accordion` / `two-column`
  - Testimonials：`carousel` / `grid`
  - 辅助：`logo-marquee`、`feature-grid`、`cta-band`、`announcement-banner`、`auth-layout`
- 支持直接导入、`BlocksProvider` 注入、`variant` 属性三种选择方式。
- demo `/marketing` 可实时切换组件族；`/variants` 可浏览所有变体。
- 所有区块不出现 `next/*`、`react-router-dom` 直接依赖。
- `siteConfig` 集中品牌、导航、社交与 Footer 数据，blocks 只消费 props。

---

### Phase 4：forms 表单闭环（4 天）

**目标**：交付框架无关的表单/action 契约，并跑通真实提交示例。

| ID    | 任务             | 涉及文件                                                                            | 产出                          | 验收                       |
| ----- | ---------------- | ----------------------------------------------------------------------------------- | ----------------------------- | -------------------------- |
| P4-01 | Action 核心      | `packages/forms/src/create-action.ts`                                               | `createAction`、`ActionError` | 单测覆盖校验/业务/未知错误 |
| P4-02 | useAction        | `packages/forms/src/use-action.ts`                                                  | idle/pending/success/error    | 状态流转正确               |
| P4-03 | 字段错误回填     | `packages/forms/src/apply-field-errors.ts`                                          | `applyFieldErrors`            | 服务端错误落到对应字段     |
| P4-04 | fetch 适配器     | `packages/forms/src/create-fetch-action.ts`                                         | 超时/取消/HTTP 错误           | 4 类错误测试通过           |
| P4-05 | demo ContactForm | `apps/demo/src/pages/forms.tsx` 或 `packages/blocks/src/marketing/contact-form.tsx` | 可提交表单                    | 成功/失败/重复提交均正确   |
| P4-06 | 测试             | `packages/forms/src/**/__tests__/*.test.ts(x)`                                      | ≥ 8 个用例                    | `pnpm test` 通过           |

**交付物**

- `@frontend-frame/forms` 不依赖 React 之外的框架。
- demo 表单有客户端校验、服务端校验、字段错误回填、成功态。
- 文档给出 Next Server Action / fetch 两种接入示例。

---

### Phase 5：页面模板、SEO 与内容层（8 天，MVP 后）

**目标**：把 blocks 组合成可交付页面，并补齐 SEO 与 MDX 内容能力。

| ID    | 任务             | 涉及文件                                                                                         | 产出                                    | 验收                                            |
| ----- | ---------------- | ------------------------------------------------------------------------------------------------ | --------------------------------------- | ----------------------------------------------- |
| P5-01 | Metadata 工具    | `packages/seo/src/metadata.ts`                                                                   | `createPageMetadata`                    | 输出 canonical/OG/Twitter/robots                |
| P5-02 | JSON-LD          | `packages/seo/src/json-ld.tsx`                                                                   | Organization/FAQ/Breadcrumb             | 序列化结果可被解析                              |
| P5-03 | SPA head 适配    | `packages/seo/src/use-document-meta.ts`                                                          | `useDocumentMeta`                       | 路由切换 title/canonical 更新                   |
| P5-04 | sitemap/robots   | `packages/seo/src/sitemap.ts`、`scripts/gen-sitemap.ts`                                          | 构建期生成                              | 产物包含 `sitemap.xml`、`robots.txt`            |
| P5-05 | 页面模板         | `packages/templates/src/{home,pricing,about,contact,auth,not-found}.tsx`                         | 6 个页面模板                            | 只组合 blocks，不写路由                         |
| P5-06 | `apps/site` 站点 | `apps/site/{package.json,vite.config.ts,tsconfig.json}`、`apps/site/src/{routes.tsx,styles.css}` | `@frontend-frame/site` + 6 个页面 + 404 | 7 条路由可访问，Tailwind 类名与 demo 一致       |
| P5-07 | 内容层           | `packages/content/src/{schema,mdx}.ts`、`content/blog/*.mdx`                                     | frontmatter schema + MDX 解析           | 非法 frontmatter 构建失败                       |
| P5-08 | MDX 文档站       | `apps/docs/`                                                                                     | 3 篇 MDX + TOC + 代码高亮               | `pnpm --filter @frontend-frame/docs build` 通过 |
| P5-09 | 视觉回归         | `playwright/`、`package.json` scripts、`.github/workflows/ci.yml`                                | light/dark + 移动端截图                 | `pnpm test:e2e` 通过                            |

**交付物**

- `@frontend-frame/templates` 提供 Home / Pricing / About / Contact / Auth / 404 六个页面模板，且每个模板接受 `components` 映射覆盖默认变体。
- `apps/site` 用模板拼出可浏览的站点，并接入 metadata、JSON-LD、sitemap/robots。
- `apps/docs` 可本地启动和构建。
- FAQ 页输出合法 JSON-LD。

---

### Phase 6：发布与消费体验（5 天，可选）

**目标**：让组件库从「源码可读」升级为「可安装、可按需引入、可脚手架创建」。

| ID    | 任务          | 涉及文件                                             | 产出            | 验收                                                      |
| ----- | ------------- | ---------------------------------------------------- | --------------- | --------------------------------------------------------- |
| P6-01 | 多入口构建    | `packages/ui/vite.config.ts`、`package.json#exports` | 子路径导出      | `import { Button } from "@frontend-frame/ui/button"` 可用 |
| P6-02 | Tailwind 预设 | `packages/ui/tailwind.css`                           | 一行接入        | 消费方无需手写多个 `@source`                              |
| P6-03 | 体积门禁      | `size-limit` 配置、CI                                | 阈值检查        | `pnpm size` 通过                                          |
| P6-04 | 脚手架        | `packages/create-frontend-frame/`                    | `vite-spa` 模板 | `npx create-frontend-frame` 可运行                        |
| P6-05 | 区块 registry | `registry.json`、CLI `add` 命令                      | 按变体复制源码  | `add hero --variant split` 可落地                         |

**交付物**

- 子路径导入可用，且不会拉入无关依赖。
- 一条命令创建新项目。
- 区块可通过 CLI 复制到业务项目。

---

### Phase 7：可选视觉层（3 天，可选）

**目标**：把 Flux 的「炫技视觉」隔离成独立、可关闭、可降级的层，不污染主包。

| ID    | 任务               | 涉及文件                                        | 产出                           | 验收                   |
| ----- | ------------------ | ----------------------------------------------- | ------------------------------ | ---------------------- |
| P7-01 | DotGrid            | `packages/visuals/src/dot-grid.tsx`             | 点阵背景 + 主题感知            | 不产生滚动条           |
| P7-02 | WavePattern        | `packages/visuals/src/wave-pattern.tsx`         | SVG 波浪纹理                   | 可设置 `aria-hidden`   |
| P7-03 | BeamBorder         | `packages/visuals/src/beam-border.tsx`          | 边框光束                       | reduced-motion 下静态  |
| P7-04 | ShaderBackground   | `packages/visuals/src/shader-background.tsx`    | 动态 import + fallback         | 不进入主 bundle        |
| P7-05 | BreakpointDebugBar | `packages/visuals/src/breakpoint-debug-bar.tsx` | 仅开发环境断点提示             | 生产构建不包含         |
| P7-06 | 低端设备降级       | `packages/visuals/src/use-visual-quality.ts`    | `low` / `medium` / `high` 三档 | 可手动关闭，首屏无 CLS |

**交付物**

- `@frontend-frame/visuals` 可按需引入，主包不包含 Three.js / Shader。
- 所有视觉层接受 `quality` 和 `enabled`，默认在 reduced-motion 或低端设备降级。

## 4. 验收标准

> 原则：能用命令验证的，不靠人工判断；必须人工看的，写清设备和视口。

### 4.1 全局 Definition of Done

每个 PR 合并前必须满足：

- [ ] `pnpm lint` 输出 0 error / 0 warning。
- [ ] `pnpm typecheck` 所有 workspace 包通过。
- [ ] `pnpm test` 全绿，新增代码有对应测试。
- [ ] `pnpm build` 所有包通过。
- [ ] `pnpm --filter @frontend-frame/demo build` 通过。
- [ ] Phase 5 起：`pnpm --filter @frontend-frame/site build` 与 `pnpm --filter @frontend-frame/docs build` 通过。
- [ ] Phase 5 起：`pnpm test:e2e` 通过，视觉回归基线已更新。
- [ ] 新增/修改的公共 API 有 README 或 docs 说明。
- [ ] 包含 changeset；包版本变更类型正确（`patch` / `minor`）。
- [ ] 不引入 `next/*`、`react-router-dom` 到 `packages/ui`、`packages/forms`、`packages/seo`。
- [ ] 新增变体必须登记到 `catalog.ts`，通过同族契约测试，并提供子路径导出。
- [ ] 组件在 `light` / `dark` 两种模式下可读。
- [ ] 交互元素有可见 focus ring；纯图标按钮有 `aria-label`。

### 4.2 Phase 0 验收

- [ ] `packages/build-config` 被 `packages/ui` 使用，且 `packages/ui/dist` 产物与改造前结构一致（入口、声明文件、`"use client"` 保留）。
- [ ] `vitest.config.ts` 的 `include` 覆盖 `packages/*/src/**/*.{test,spec}.{ts,tsx}`。
- [ ] `apps/demo/tsconfig.json` 能解析新包源码，`pnpm typecheck` 通过。
- [ ] `apps/demo/src/styles.css` 包含所有含样式新包的 `@source`，新包组件类名在 demo 生效。
- [ ] `pnpm lint` 在新增 `jsx-a11y`、`import/order` 后仍为 0 warning。
- [ ] `pnpm exec prettier --check .` 通过。

### 4.3 Phase 1 验收

**功能**

- [ ] 首次加载、刷新、切换主题时没有「先浅色再深色」的闪烁。
- [ ] 切换 light/dark 时页面不出现大面积 transition 抖动。
- [ ] `PageSection` 支持 `none` / `tight` / `default` / `loose` 四档间距。
- [ ] `Container` 支持 `default` / `large` / `small` 三种宽度，且与 `container-page` 数值一致。
- [ ] `SectionBackdrop` 支持 `top` / `bottom` / `none` 三种变体。
- [ ] `DashedLine` 支持横竖两向，且在 light/dark 下可见。
- [ ] `container-page` 最大宽度 1220px，左右 padding 24px。
- [ ] `Eyebrow`（或复用 `SectionLabel`）在所有 blocks 中提供统一的小标签样式。
- [ ] `Reveal` / `Stagger` 在 `prefers-reduced-motion: reduce` 下直接显示终态，无动画、无 CLS。

**自动化**

- [ ] 新增 `layout-primitives.test.tsx`，覆盖 `Container`、`PageSection`、`SectionBackdrop`、`DashedLine` 的默认渲染和变体。
- [ ] 新增 `reveal.test.tsx`，覆盖 reduced-motion 降级和 delay 参数。
- [ ] 新增主题脚本单测：`light` / `dark` / `system` / 非法 localStorage 四种输入。
- [ ] `pnpm --filter @frontend-frame/demo build` 通过。

**人工检查**

- [ ] 视口 375 / 768 / 1024 / 1440 下 `SectionBackdrop` 不产生横向滚动。
- [ ] tokens 页面展示字体、阴影、断点、容器、动效五组令牌。

### 4.4 Phase 2 验收

**功能**

- [ ] `<UiAdaptersProvider>` 缺失时，`useUiAdapters()` 抛出包含组件名的错误。
- [ ] React Router 适配器下，导航激活态与 `usePathname()` 一致（Phase 2 用测试 fixture 验证，Phase 3 再接 `SiteHeader`）。
- [ ] Next 适配器示例可编译，且不进入 `ui` 包依赖。
- [ ] `AppShell` 支持 `sidebar`、`header`、`children` 三个插槽。
- [ ] `RouteBoundary` 支持 `title`、`description`、`onRetry`，重试按钮可点击。
- [ ] demo 的 404 路由、错误边界、加载骨架均可手动触发。

**自动化**

- [ ] `app-kit` 新增 ≥ 5 个测试：Provider 正常/异常、AppShell 插槽、RouteBoundary 重试、导航激活态。
- [ ] `pnpm --filter @frontend-frame/demo build` 通过。

**人工检查**

- [ ] 移动端打开/关闭侧栏抽屉，焦点不丢失。
- [ ] 键盘 `Tab` 可以遍历侧栏、顶栏、主内容。

### 4.5 Phase 3 验收

**功能**

- [ ] `/marketing` 页面可实时切换 6 个组件族：Header、Footer、Hero、Pricing、FAQ、Testimonials。
- [ ] Header 提供 3 个变体：`floating-pill` / `minimal` / `mega-menu`；Footer、Pricing、FAQ、Testimonials 各 2 个变体；Hero 提供 3 个变体。
- [ ] 直接导入可用：`import { FloatingPillHeader } from "@frontend-frame/blocks/header/floating-pill"`。
- [ ] `BlocksProvider` 注入可用：`<BlocksProvider components={{ SiteHeader: MinimalHeader }}>`。
- [ ] `variant` 属性可用：`<SiteHeader variant="floating-pill" />`，且只懒加载选中的变体。
- [ ] 未知 `variant`：开发环境抛错并指出可选值；生产环境回退默认变体并 `console.warn`。
- [ ] 同一组件族的所有变体共享同一套 Props 契约；新增变体不需要修改消费方代码。
- [ ] `variant` 切换不改变页面布局结构（Header 高度、主内容起始位置保持一致）。
- [ ] `MotionPresetProvider` 支持 `none` / `subtle` / `playful` / `cinematic`；切换预设不导致重排。
- [ ] `prefers-reduced-motion: reduce` 下所有变体自动等价于 `none`。
- [ ] `/variants` 页面可浏览所有变体，带预览、标签、代码片段和「复制导入」按钮。
- [ ] 所有区块接受数据 props，不在区块内部硬编码业务文案（demo 数据放在页面层）。
- [ ] `siteConfig` 集中品牌、导航、社交、Footer 数据；`rg -n "Frontend Frame" packages/blocks/src` 返回空（示例数据除外）。
- [ ] `AnnouncementBanner` 关闭后刷新仍隐藏；`?banner=false` 强制隐藏；Header 顶部偏移随之更新。
- [ ] `Pricing` 的 `cards` 与 `comparison` 变体都支持月付/年付切换，价格文案正确。
- [ ] `ComparisonTable` 支持 `check` / `dash` / `text` 三种单元格，移动端横向滚动不撑破页面。
- [ ] `AuthLayout` 的 `centered` / `split` 变体渲染时不显示营销导航。
- [ ] `FAQ` 支持键盘展开/收起，同一时间只展开一项（或明确支持多项）。
- [ ] `Testimonials` 支持触控滑动和左右按钮。
- [ ] `LogoMarquee` 在 `prefers-reduced-motion: reduce` 下停止滚动且内容完整。

**自动化**

- [ ] 每个组件族有一套共享契约测试，所有变体都必须通过。
- [ ] 每个变体至少 1 个渲染测试，`blocks` 测试总数 ≥ 20。
- [ ] 变体数量校验：Header ≥ 3、Hero ≥ 3、Footer/Pricing/FAQ/Testimonials ≥ 2。
- [ ] 只导入 `FloatingPillHeader` 的 fixture 构建产物不包含 `minimal` / `mega-menu` 变体。
- [ ] `pnpm --filter @frontend-frame/demo build` 通过。
- [ ] `rg -n "next/|react-router-dom" packages/blocks/src` 返回空。
- [ ] `pnpm test:e2e` 为每个稳定变体保存 light/dark 截图基线。

**人工检查**

- [ ] 每个变体在 375 / 768 / 1024 / 1440 四个视口无横向滚动。
- [ ] light/dark 下文字对比度可读，按钮 hover/focus 可见。
- [ ] 在 `/marketing` 连续切换 6 个组件族，页面不闪烁、不丢失滚动位置、不重复挂载全局监听。
- [ ] 键盘走查每个 Header 变体的移动端菜单和下拉菜单。

### 4.6 Phase 4 验收

**功能**

- [ ] `createAction(schema, handler)` 返回的函数接受 `unknown`，非法输入返回 `VALIDATION_ERROR`。
- [ ] `handler` 抛出 `ActionError` 时，错误码、消息、字段错误原样返回。
- [ ] `handler` 抛出未知错误时，返回 `INTERNAL_ERROR`，不泄露堆栈。
- [ ] `useAction` 状态严格按 `idle → pending → success | error` 流转。
- [ ] 提交中按钮禁用，重复点击不会发起第二次请求。
- [ ] 服务端字段错误通过 `applyFieldErrors` 落到对应 `FormMessage`。
- [ ] `createFetchAction` 支持 `timeoutMs`、`signal`、非 2xx 响应、JSON 解析失败。

**自动化**

- [ ] `forms` 测试 ≥ 10 个，覆盖：校验失败、业务错误、未知错误、成功、超时、取消、HTTP 500、非法 JSON、字段错误、重复提交。
- [ ] demo `ContactForm` 至少有 1 个集成测试：非法邮箱 → 错误提示；合法提交 → 成功态。
- [ ] `pnpm --filter @frontend-frame/demo build` 通过。

**人工检查**

- [ ] 表单错误提示与输入框通过 `aria-describedby` 关联。
- [ ] 成功态出现后，表单不会保留旧值。

### 4.7 Phase 5 验收

- [ ] `createPageMetadata` 输出包含 `title`、`description`、`alternates.canonical`、`openGraph`、`twitter`、`robots`。
- [ ] `noIndex: true` 时 `robots.index === false`。
- [ ] JSON-LD 输出是合法 JSON，`<script type="application/ld+json">` 内容可被 `JSON.parse`。
- [ ] `apps/site` 路由切换后 `document.title`、`meta[name=description]`、`link[rel=canonical]` 同步更新。
- [ ] 构建产物包含 `sitemap.xml` 与 `robots.txt`。
- [ ] `packages/templates` 提供 Home / Pricing / About / Contact / Auth / NotFound 六个模板，且只组合 blocks。
- [ ] 六个模板都接受 `components?: Partial<TemplateComponents>`，未传时使用默认变体，传入时整族替换。
- [ ] `apps/site` 的 `/`、`/pricing`、`/about`、`/contact`、`/sign-in`、`/sign-up`、`*` 七条路由可访问。
- [ ] `apps/site` 首页与 Pricing 页 Lighthouse SEO ≥ 95，LCP ≤ 2.5s，CLS ≤ 0.1。
- [ ] `packages/content` 对非法 frontmatter 抛出明确错误，构建失败并指出文件路径。
- [ ] `apps/docs` 至少有 3 篇 MDX，包含 TOC、代码高亮、复制按钮。
- [ ] `pnpm --filter @frontend-frame/docs build` 通过。
- [ ] `pnpm test:e2e` 覆盖 light/dark + 375/1440 两组视口，截图无基线差异（首次先建立基线）。

### 4.8 Phase 6 验收

- [ ] `@frontend-frame/ui/button` 子路径导入可用。
- [ ] 只导入 `Button` 的 fixture 构建产物不包含 `recharts`、`@tanstack/react-table`、`embla-carousel-react`。
- [ ] `@frontend-frame/ui/tailwind.css` 一行接入后，消费方无需再写 `@source`。
- [ ] `pnpm size` 通过，阈值在 CI 中生效。
- [ ] `npx create-frontend-frame my-app --template vite-spa` 可安装、启动、构建。
- [ ] `create-frontend-frame add hero --variant split` 能把选中变体源码复制到目标项目并生成依赖说明。

### 4.9 Phase 7 验收

- [ ] `@frontend-frame/visuals` 可独立引入，不使用视觉层的项目不需要安装 Three.js。
- [ ] `ShaderBackground` 使用动态 import；只引入 `Button` 的 fixture 构建产物不包含 `three`。
- [ ] `DotGrid` / `WavePattern` / `BeamBorder` 不产生横向滚动，且带 `aria-hidden="true"`。
- [ ] `prefers-reduced-motion: reduce` 下所有视觉层静态化或隐藏。
- [ ] `useVisualQuality()` 在 `navigator.hardwareConcurrency <= 4` 或 `deviceMemory <= 4` 时返回 `low`。
- [ ] `BreakpointDebugBar` 只在 `import.meta.env.DEV` 下渲染，生产构建产物中不存在。

### 4.10 回归与兼容性

- [ ] `packages/ui/src/index.ts` 的现有导出名一个不少；用 `git diff` 或脚本比对导出列表。
- [ ] 现有 demo 7 个页面 + 新增 `/marketing` / `/variants` 全部可访问，无控制台 error。
- [ ] `apps/site` 的 6 个页面 + 404 全部可访问，无控制台 error。
- [ ] 现有 8 个测试文件全部通过。
- [ ] 现有 `ThemeProvider` / `ActiveThemeProvider` 的 localStorage key 不变：
  - `frontend-frame-theme`
  - `frontend-frame-active-theme`
- [ ] 现有 `NavSidebar` 的 `linkComponent` API 不变。
- [ ] `pnpm build` 产物体积相对基线增长不超过 10%（新包除外）。
- [ ] 新增区块若借鉴 mainline / Flux，`THIRD_PARTY_NOTICES.md` 已登记来源与许可。

### 4.11 人工检查清单

每个 Phase 结束执行一次：

- [ ] Chrome / Safari / Firefox 最新版各打开一次 demo。
- [ ] 视口 375 / 768 / 1024 / 1440 检查布局。
- [ ] light / dark 各截图一次，重点看边框、阴影、禁用态、占位符。
- [ ] 键盘走查：Tab 顺序、Esc 关闭弹层、Enter 触发按钮。
- [ ] 屏幕阅读器抽查：导航、表单错误、对话框标题。
- [ ] 网络限速 Slow 3G，首屏不出现布局跳动。

### 4.12 性能、可访问性、SEO 预算

| 项目                | 预算                                  | 验证方式                  |
| ------------------- | ------------------------------------- | ------------------------- |
| demo / site 首屏 JS | 不超过当前基线 + 10%                  | `vite build` 产物对比     |
| `Button` 子入口     | ≤ 10KB gzip（依赖 external）          | `size-limit`              |
| `DataTable` 子入口  | ≤ 20KB gzip（依赖 external）          | `size-limit`              |
| 组件库全量入口      | ≤ 150KB gzip                          | `size-limit`              |
| `header/*` 单变体   | ≤ 8KB gzip（依赖 external）           | `size-limit`              |
| 单变体隔离          | 只包含被选变体，不含同族其他变体      | 构建 fixture + 产物 grep  |
| 可访问性            | 关键页面无 critical/serious axe 问题  | `vitest-axe` 或浏览器插件 |
| SEO                 | 每页 title/description/canonical 唯一 | 单测 + 手工检查           |
| Lighthouse SEO      | 首页 / Pricing ≥ 95                   | 本地 preview + Lighthouse |
| 首屏指标            | LCP ≤ 2.5s，CLS ≤ 0.1                 | Lighthouse / Playwright   |
| 主题切换            | 首帧无闪烁                            | Playwright 截图对比       |
| 视觉层              | 主 bundle 不含 `three` / Shader       | `size-limit` + 产物 grep  |

### 4.13 验收命令汇总

```bash
# 基础门禁
pnpm lint
pnpm typecheck
pnpm test
pnpm build

# demo / site / docs
pnpm --filter @frontend-frame/demo build
pnpm --filter @frontend-frame/site build
pnpm --filter @frontend-frame/docs build

# 格式
pnpm exec prettier --check .

# 新包结构检查
! rg -n "next/|react-router-dom" packages/ui/src packages/forms/src packages/seo/src packages/content/src
! rg -n "next/|react-router-dom" packages/blocks/src packages/templates/src
! rg -n "Frontend Frame" packages/blocks/src packages/templates/src
! rg -n "switch \\(variant\\)" packages/blocks/src

# 变体契约（Phase 3）
pnpm test:contracts

# 视觉层不进主包（Phase 7）
! rg -n "from \"three\"|from 'three'" packages/ui/dist packages/blocks/dist

# 体积（Phase 6）
pnpm size

# 视觉回归（Phase 5）
pnpm test:e2e

# 发布演练
pnpm changeset
pnpm version-packages
```

## 5. 排期与里程碑

| 周      | Phase             | 交付物                           | 质量门禁                  |
| ------- | ----------------- | -------------------------------- | ------------------------- |
| W1 前半 | Phase 0           | 新包骨架 + 工程接入              | lint/typecheck/test/build |
| W1 后半 | Phase 1           | 主题/字体/布局/动效底座          | 无闪屏 + tokens 页        |
| W2      | Phase 2           | app-kit 应用壳                   | demo 迁移完成             |
| W3~W4   | Phase 3           | 6 个组件族 + 15+ 变体 + 两个页面 | 契约测试 + 变体截图       |
| W5      | Phase 4           | 表单/action 闭环                 | 集成测试 + MVP 评审       |
| W6      | Phase 5           | templates + apps/site + SEO      | 6 个页面 + 404 + SEO 单测 |
| W7      | Phase 5           | content + docs + 视觉回归        | docs build + e2e          |
| W8      | Phase 6 + Phase 7 | 子路径/CLI/体积门禁 + 可选视觉层 | size + 脚手架演练         |

**并行建议**

- Phase 1 完成后，Phase 3（blocks）与 Phase 4（forms）可以并行。
- Phase 5 的 `seo` 包与 Phase 3/4 无依赖，可由第二人并行推进；`templates` 必须等 blocks 稳定。
- Phase 6 必须在 Phase 3/4 的公共 API 稳定后再做。
- Phase 7 必须在 Phase 6 的按需构建稳定后再做，避免 Shader 进入主 bundle。

## 6. PR 拆分

| PR    | 标题                                                            | 范围    | 依赖       |
| ----- | --------------------------------------------------------------- | ------- | ---------- |
| PR-1  | `chore: add shared lib build config`                            | Phase 0 | 无         |
| PR-2  | `feat(ui): theme script + design tokens + layout primitives`    | Phase 1 | PR-1       |
| PR-3  | `feat(app-kit): adapters + app shell + route boundary`          | Phase 2 | PR-2       |
| PR-4  | `feat(blocks): multi-variant families + landing/catalog`        | Phase 3 | PR-3       |
| PR-5  | `feat(forms): action contract + contact form`                   | Phase 4 | PR-2       |
| PR-6  | `feat(seo): metadata + json-ld + sitemap`                       | Phase 5 | PR-2       |
| PR-7  | `feat(templates): page templates + apps/site`                   | Phase 5 | PR-4、PR-6 |
| PR-8  | `feat(content): mdx content + docs app`                         | Phase 5 | PR-2       |
| PR-9  | `feat(release): subpath exports + tailwind preset + size-limit` | Phase 6 | PR-4、PR-5 |
| PR-10 | `feat(visuals): optional dot-grid / wave / beam / shader`       | Phase 7 | PR-4、PR-9 |

每个 PR 的合并条件：

- 只包含一个 Phase 的可评审变更。
- 新增公共 API 有类型导出、文档、测试。
- 至少 1 个 changeset。
- 不夹带无关格式化或组件搬迁。

## 7. 风险与应对

| 风险                       | 影响 | 应对                                                                                                            |
| -------------------------- | ---- | --------------------------------------------------------------------------------------------------------------- |
| 新包数量增加维护成本       | 中   | 先建 `app-kit` + `forms`，`blocks`/`seo` 随后；`templates`/`content`/`visuals` 放 Phase 5+；共享 `build-config` |
| Tailwind 扫描不到新包类名  | 高   | Phase 0 先加 `@source`，每个 Phase 用 demo 视觉验收                                                             |
| 新包 `"use client"` 丢失   | 高   | 复用 `packages/ui` 的 strip/preserve 插件，构建后抽检 `dist`                                                    |
| 路由库绑定回流到 `ui`      | 高   | ESLint 加 `no-restricted-imports`，CI 用 `rg` 检查                                                              |
| 表单 action 契约设计过度   | 中   | 先只做 `createAction` / `useAction` / `createFetchAction`，不引入状态库                                         |
| 区块样式与现有主题冲突     | 中   | 所有区块只消费语义令牌，不写死颜色                                                                              |
| 变体数量爆炸、维护困难     | 高   | MVP 每族最多 3 个变体；共有逻辑抽 `_shared`；每个变体必须过同一套契约测试；`beta` 变体不进默认推荐              |
| `variant` 属性拉入全部变体 | 高   | 业务默认用子路径导入；`variant` 只用于 demo/文档；构建 fixture 断言未选变体不出现                               |
| 动效预设与变体互相打架     | 中   | 动效只由 `MotionPresetProvider` 控制；变体声明支持范围；reduced-motion 强制 `none`                              |
| `apps/site` 与 demo 重复   | 中   | 页面只写组合，数据与布局放 `templates`/`blocks`；禁止复制粘贴                                                   |
| Vite 预渲染/SSG 配置复杂   | 中   | 先用 `vite preview` + 构建期脚本；SEO 不达标再评估 Next.js                                                      |
| 视觉层拖慢首屏             | 中   | 动态 import + `quality` 降级 + reduced-motion 静态化；主 bundle 禁用 Three.js                                   |
| MDX frontmatter 脏数据     | 低   | `packages/content` 用 Zod 校验，构建失败并指出文件                                                              |
| 许可风险                   | 中   | 借鉴结构、重写代码；如复制，更新 `THIRD_PARTY_NOTICES.md` 并做法务确认                                          |
| 目录重构与组件搬迁冲突     | 中   | 本计划不做 101 组件搬迁，避免和二期计划打架                                                                     |
| demo 体积增长              | 低   | 路由级 `React.lazy` 已存在，新页面继续 lazy                                                                     |
| 测试环境缺少浏览器 API     | 低   | 复用 `vitest.setup.ts`，必要时补 `IntersectionObserver` mock                                                    |

## 8. 依赖与前置条件

### 8.1 新增依赖

```bash
# 根目录工程质量
pnpm add -Dw eslint-plugin-jsx-a11y eslint-plugin-import prettier-plugin-tailwindcss

# forms
pnpm --filter @frontend-frame/forms add zod

# content：frontmatter + MDX 解析
pnpm --filter @frontend-frame/content add zod gray-matter

# 可选：可访问性测试
pnpm add -Dw vitest-axe axe-core

# 可选：Phase 5 文档站
pnpm --filter @frontend-frame/docs add @mdx-js/rollup remark-gfm rehype-pretty-code shiki

# 可选：Phase 5 视觉回归
pnpm add -Dw @playwright/test

# 可选：Phase 7 视觉层（只有使用 Shader 的项目才安装 three）
pnpm --filter @frontend-frame/visuals add three
pnpm add -Dw @types/three

# 可选：Phase 6 体积门禁
pnpm add -Dw size-limit @size-limit/preset-app rollup-plugin-visualizer
```

### 8.2 环境

- Node.js 20（与现有 CI 一致）。
- pnpm 11.28.5（`packageManager` 已固定）。
- 浏览器：Chrome / Safari / Firefox 最新版。
- 视口：375 / 768 / 1024 / 1440。

### 8.3 前置确认

- [ ] 确认 `blocks` 借鉴 mainline 的方式是「重写结构」还是「复制代码」。若复制，先登记许可。
- [ ] 确认 `@frontend-frame/forms` 是否需要兼容后端返回的 `errors` 字段格式；当前按 `Record<string, string[]>` 设计。
- [ ] 确认 Phase 5 的文档站是 `apps/docs` 还是 Storybook；本计划默认 `apps/docs`。
- [ ] 确认 Phase 6 是否本期执行；若否，MVP 到 Phase 4 结束。
- [ ] 确认 `apps/site` 采用 Vite + React Router（本计划默认）还是 Next.js；若选 Next，`templates`/`blocks` 仍保持框架无关。
- [ ] 确认 `packages/templates` 是否独立发包；若不想增加包，可先放 `packages/blocks/src/pages/`。
- [ ] 确认 Phase 7 视觉层是否本期执行；若否，`packages/visuals` 不创建，避免无用依赖。
- [ ] 确认首批变体清单：Header 3 / Hero 3 / Footer 2 / Pricing 2 / FAQ 2 / Testimonials 2 是否够用，是否要加 Mega Menu / Bento / 视频 Hero。
- [ ] 确认业务主用法是「子路径直接导入」还是「`variant` 属性」；本计划推荐前者，后者只用于 demo/低代码。
- [ ] 确认动效预设的四个档位是否满足需求，是否需要增加 `cinematic` 之外的滚动叙事档。

## 9. 上线与回滚

### 9.1 上线策略

- 新包先以 `0.1.0` 发布，demo 内部使用 1 周后再对外推荐。
- `@frontend-frame/ui` 的改动走 `minor`；新增包走 `minor`；纯修复走 `patch`。
- `blocks` / `forms` / `seo` 在 README 标注「实验性」，API 稳定后再去掉标记。
- demo `/marketing` 路由先作为内部示例，不放进主导航，稳定后加入。

### 9.2 回滚策略

- 新包独立版本，出问题回滚对应包版本即可，不影响 `ui`。
- `ui` 的主题/令牌改动若导致视觉回归，优先通过 CSS 变量回退，不回滚组件源码。
- demo 页面通过路由移除即可下线，不影响组件库消费方。
- 每个 Phase 的 changeset 独立，避免一次回滚牵连多个包。

## 10. 附录

### 10.1 目标目录结构

```text
frontend-frame/
├─ apps/
│  ├─ demo/
│  │  ├─ src/pages/marketing.tsx        # Phase 3 新增
│  │  └─ src/pages/variants.tsx         # Phase 3 新增：变体目录
│  ├─ site/                             # Phase 5 新增：Vite 营销站
│  │  └─ src/routes.tsx
│  └─ docs/                             # Phase 5 新增：MDX 文档站
├─ packages/
│  ├─ build-config/                     # Phase 0 新增
│  ├─ ui/                               # 保持现有 API
│  ├─ app-kit/
│  │  └─ src/{adapters,shell}/
│  ├─ blocks/
│  │  ├─ src/{contracts.ts,catalog.ts,variants.ts}
│  │  ├─ src/header/{floating-pill,minimal,mega-menu}.tsx
│  │  ├─ src/hero/{centered,split,bento}.tsx
│  │  ├─ src/{footer,pricing,faq,testimonials,features,logo-marquee,auth}/
│  │  ├─ src/{cta-band,announcement-banner}.tsx
│  │  └─ src/{_shared,config}/
│  ├─ templates/
│  │  └─ src/{home,pricing,about,contact,auth,not-found}.tsx
│  ├─ forms/
│  │  └─ src/{create-action,use-action,apply-field-errors,create-fetch-action}.ts
│  ├─ content/
│  │  └─ src/{schema,mdx}.ts
│  ├─ seo/
│  │  └─ src/{metadata,json-ld,use-document-meta,sitemap}.ts
│  └─ visuals/                          # Phase 7 可选
│     └─ src/{dot-grid,wave-pattern,beam-border,shader-background}.tsx
├─ content/                             # Phase 5 新增：MDX 文章/职位
├─ playwright/                          # Phase 5 新增：视觉回归
└─ docs/
   ├─ learn-from-mainline-nextjs-template.md
   ├─ learn-from-flux-nextjs-template.md
   └─ app-layer-development-plan.md      # 本文件
```

### 10.2 关键组件 API

```ts
// app-kit
export interface AppShellProps {
	sidebar?: React.ReactNode;
	header?: React.ReactNode;
	children: React.ReactNode;
}

export interface RouteBoundaryProps {
	title?: string;
	description?: string;
	onRetry?: () => void;
}

// ui
export interface ContainerProps extends React.ComponentProps<"div"> {
	size?: "default" | "large" | "small";
}

export interface PageSectionProps extends React.ComponentProps<"section"> {
	as?: React.ElementType;
	spacing?: "none" | "tight" | "default" | "loose";
}

export interface RevealProps {
	children: React.ReactNode;
	delay?: number;
	once?: boolean;
	amount?: number;
	className?: string;
}

export type MotionPreset = "none" | "subtle" | "playful" | "cinematic";

export interface MotionPresetProviderProps {
	preset?: MotionPreset;
	children: React.ReactNode;
}

// blocks
export type BlockFamily =
	"header" | "hero" | "footer" | "pricing" | "faq" | "testimonials";

export interface BlockVariantMeta {
	id: string;
	family: BlockFamily;
	name: string;
	description: string;
	tags: string[];
	status: "stable" | "beta";
	motion: MotionPreset[];
	preview?: string;
}

export interface SiteHeaderProps {
	site: SiteConfig;
	activePath?: string;
	actions?: React.ReactNode;
	onNavigate?: (href: string) => void;
}

export type HeaderVariant = "floating-pill" | "minimal" | "mega-menu";

export interface BlocksProviderProps {
	components: Partial<TemplateComponents>;
	children: React.ReactNode;
}

export interface SiteConfig {
	name: string;
	description: string;
	logo: { src: string; alt: string };
	nav: Array<{
		label: string;
		href: string;
		children?: Array<{ label: string; href: string; description?: string }>;
	}>;
	footer: {
		columns: Array<{
			title: string;
			links: Array<{ label: string; href: string }>;
		}>;
		legal: string;
	};
	social?: Array<{ label: string; href: string; icon: React.ComponentType }>;
}

// templates
export interface TemplateComponents {
	SiteHeader: React.ComponentType<SiteHeaderProps>;
	Hero: React.ComponentType<HeroProps>;
	Pricing: React.ComponentType<PricingProps>;
	FAQ: React.ComponentType<FAQProps>;
	Testimonials: React.ComponentType<TestimonialsProps>;
	SiteFooter: React.ComponentType<SiteFooterProps>;
}

export interface HomeTemplateProps {
	components?: Partial<TemplateComponents>;
	content: HomeContent;
}

// forms
export function createAction<TSchema extends z.ZodType, TOutput>(
	schema: TSchema,
	handler: (input: z.infer<TSchema>) => Promise<TOutput>,
): (raw: unknown) => Promise<ActionResult<TOutput>>;

export function useAction<TInput, TOutput>(
	action: (input: TInput) => Promise<ActionResult<TOutput>>,
): {
	status: "idle" | "pending" | "success" | "error";
	execute: (input: TInput) => Promise<ActionResult<TOutput>>;
	isExecuting: boolean;
	hasSucceeded: boolean;
	data?: TOutput;
	error?: ActionErrorPayload;
};

// seo
export function createPageMetadata(
	meta: PageMeta,
	site: SiteConfig,
): Record<string, unknown>;

// content
export const postSchema: z.ZodObject<{
	title: z.ZodString;
	description: z.ZodString;
	date: z.ZodString;
	author: z.ZodString;
	tags: z.ZodArray<z.ZodString>;
	draft: z.ZodDefault<z.ZodBoolean>;
}>;

// visuals
export interface VisualProps {
	enabled?: boolean;
	quality?: "low" | "medium" | "high";
	className?: string;
}
```

> `HeroProps` / `PricingProps` / `FAQProps` / `TestimonialsProps` / `SiteFooterProps` 均在 `packages/blocks/src/contracts.ts` 定义；每个变体用 `satisfies React.ComponentType<XxxProps>` 约束，保证同一族变体可互换。

### 10.3 验收记录模板

每个 Phase 结束时复制到 PR 描述：

```md
## 验收记录

- Phase：
- 验收人：
- 日期：

### 命令

- [ ] pnpm lint
- [ ] pnpm typecheck
- [ ] pnpm test
- [ ] pnpm build
- [ ] pnpm --filter @frontend-frame/demo build

### 功能

- [ ] 功能点 1：
- [ ] 功能点 2：

### 视觉 / 可访问性

- [ ] 375 / 768 / 1024 / 1440
- [ ] light / dark
- [ ] 键盘走查

### 遗留问题

-
```

## 11. 落地记录（2026-11-10）

本批已按生产标准落地 Phase 0 的公共工程底座、Phase 1，以及 Phase 3 的 Header / Hero / Footer / Pricing 变体切片：

- [x] `packages/build-config`：共享 Vite library 构建配置，`ui` / `app-kit` / `blocks` 复用。
- [x] `packages/app-kit`：`UiAdaptersProvider` / `useUiAdapters`，React Router 适配器在 demo 中验证。
- [x] `packages/app-kit`：`AppShell`、`SkipLink`、`RouteBoundary`、`ErrorBoundary`。
- [x] `packages/forms`：`createAction`、`createFetchAction`、`useAction`、`applyFieldErrors`、`ActionError`。
- [x] `packages/blocks`：`SiteHeaderProps` 契约、变体 catalog、懒加载 `SiteHeader`、3 个 Header 变体。
- [x] `packages/blocks`：3 个 Hero、2 个 Footer、2 个 Pricing 变体，全部通过统一契约与懒加载入口。
- [x] `packages/ui`：`getThemeScript`、`ThemeProvider` 防闪烁/禁用过渡、字体/阴影/断点/容器令牌。
- [x] `packages/ui`：`Container`、`PageSection`、`SectionBackdrop`、`DashedLine`、`Reveal`、`Stagger`、`MotionPresetProvider`。
- [x] `packages/ui`：`FlowGridBackground`，按 PortWise Hero 同构参数复刻 WebGL 点阵流场（10px 网格、主题、鼠标、reduced-motion、DPR 上限）。
- [x] demo：`/variants` 支持 Header / Hero / Footer / Pricing 4 个组件族、10 个变体切换；`UiAdaptersProvider` 接入、AppShell 迁移、404/错误边界/加载态、路由级懒加载、vendor 分块。
- [x] demo：`ContactForm` 使用 Zod + RHF + `createAction` / `useAction` / `applyFieldErrors`，包含成功态、失败态与服务端字段错误回填。
- [x] demo：`/login` 登录页模板，接入 `FlowGridBackground`、Zod/RHF 校验与 forms action 错误链路，认证接口通过 `onSubmit` 注入。
- [x] demo：登录页可从侧栏「登录页」、Dashboard「查看登录页」、用户菜单「登录页示例」三个入口访问。
- [x] 测试：`Vitest` 覆盖 app-kit adapters、blocks 10 个变体、布局原语、动效预设、主题脚本、forms Action。
- [x] 变更集：`.changeset/app-layer-foundation.md`。

本批验证结果：

```text
pnpm lint      通过（0 error / 0 warning）
pnpm typecheck 通过（ui / app-kit / blocks / demo）
pnpm test      通过（27 files / 134 tests）
pnpm build     通过（ui / app-kit / blocks / demo）
```

尚未进入本批范围：FAQ / Testimonials 变体、LogoMarquee / FeatureGrid / CtaBand / AnnouncementBanner / AuthLayout、`seo`、`templates` / `apps/site`、`visuals`。
