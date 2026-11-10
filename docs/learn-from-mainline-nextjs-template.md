# 从 mainline-nextjs-template 反哺 frontend-frame 的改造清单

> 状态：调研稿，可作为下一阶段规划输入
> 对比对象：`frontend-frame`（pnpm workspace，组件库 + Vite 演示站）
> 参考对象：`mainline-nextjs-template`（Next.js 15 营销站模板）
> 日期：2026-11-10

## 0. 一句话结论

`mainline-nextjs-template` 值得学的不是 Next.js 本身，而是它把「一堆 UI 组件」组织成「一个可交付应用」的中间层：页面骨架、区块分层、表单闭环、主题/字体/SEO、内容层和多框架适配边界。`frontend-frame` 的组件底座、测试、CI、changesets 已经比它更完整，**不要降级照搬**，只补应用层能力。

## 1. 先对齐两个项目的定位

`frontend-frame` 目前是「纯 UI 基座」：65+ 组件、12 套主题、Vitest、ESLint、husky、changesets、GitHub Actions 都有，但能力止于组件和演示站。`mainline-nextjs-template` 也不是完整后端框架，它是一个营销站模板，后端只有 `next-safe-action` 的一个 stub。

| 能力                 | frontend-frame             | mainline                           | 结论                            |
| -------------------- | -------------------------- | ---------------------------------- | ------------------------------- |
| 组件数量与主题       | ✅ 65+ 组件 / 12 套主题    | 🟡 20+ 组件 / 明暗两态             | frontend-frame 更强             |
| 测试 / CI / 版本管理 | ✅ 已有                    | ❌ 无测试、无 CI、无 changesets    | 不要照搬它的工程化              |
| 应用壳与路由边界     | 🟡 仅 demo 的 AppShell     | ✅ layout + not-found + App Router | 值得补                          |
| 页面区块（blocks）   | ❌ 无                      | ✅ 14 个营销区块                   | 值得补                          |
| 表单组件             | ✅ Form/Field/RHF          | ✅ 同样基于 RHF                    | 持平                            |
| 表单校验与提交闭环   | ❌ 无 schema/action 层     | ✅ Zod + next-safe-action          | 值得补                          |
| API/Action 契约      | ❌ 无                      | 🟡 仅 Next Server Action           | 值得抽象成框架无关层            |
| 多框架适配           | 🟡 仅 NavSidebar 注入 Link | ❌ 深度绑定 Next                   | frontend-frame 方向更对，需扩大 |
| SEO / Metadata       | ❌ 无                      | ✅ 完整 metadata                   | 值得补                          |
| 字体与排版体系       | 🟡 demo 内定义             | ✅ font token + OpenType           | 值得补                          |
| 内容层 / MDX         | ❌ 文档页硬编码            | ✅ MDX 页面                        | 值得补                          |
| 文档站               | 🟡 TSX 手写                | 🟡 MDX + StyleGlide                | 都需升级                        |
| 发布与消费体验       | 🟡 单入口 barrel export    | 🟡 模板复制                        | 值得补 subpath/CLI              |

> 无论你说的「纯后端」是指「只有 UI 层」还是「业务后端在另一个仓库」，第 2~4 节补应用层，第 5 节补前后端契约，两条线都覆盖。

## 2. 可借鉴清单总览

优先级定义：P0 影响所有业务接入；P1 显著提升交付效率；P2 锦上添花。

| #   | 借鉴点                             | 来源文件                                                                            | 落地到 frontend-frame                 | 优先级 |
| --- | ---------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------- | ------ |
| 1   | 页面骨架与 404 边界                | `src/app/layout.tsx`、`src/app/not-found.tsx`                                       | `packages/app-kit` + demo 路由边界    | P0     |
| 2   | 区块化页面（blocks）               | `src/components/blocks/*`                                                           | `packages/blocks`                     | P0     |
| 3   | RHF + Zod + Action 表单闭环        | `src/lib/form-schema.ts`、`src/actions/*`、`src/components/blocks/contact-form.tsx` | `packages/forms`                      | P0     |
| 4   | Action 客户端与错误模型            | `src/actions/safe-action.ts`                                                        | 框架无关 `createAction` / `useAction` | P0     |
| 5   | 主题防闪烁与切换细节               | `src/app/layout.tsx`、`src/components/theme-provider.tsx`                           | 增强现有 `ThemeProvider`              | P0     |
| 6   | 字体 token 与排版规则              | `src/app/layout.tsx`、`src/styles/globals.css`                                      | 移入 `packages/ui/src/styles.css`     | P0     |
| 7   | SEO / Metadata / JSON-LD           | `src/app/layout.tsx`                                                                | `packages/seo`                        | P1     |
| 8   | MDX 内容层                         | `next.config.ts`、`src/app/privacy/privacy.mdx`                                     | `apps/docs` 或 `packages/content`     | P1     |
| 9   | 装饰性布局原语                     | `src/components/background.tsx`、`src/components/dashed-line.tsx`                   | `packages/ui` 新增基础原语            | P1     |
| 10  | 布局节奏与容器                     | `src/styles/globals.css`                                                            | `PageSection` + `container-page`      | P1     |
| 11  | 多框架适配层                       | `src/components/blocks/navbar.tsx` 的 Next 绑定                                     | `UiAdaptersProvider`                  | P0     |
| 12  | 页面模板 / recipes                 | `src/app/{login,signup,pricing,faq,about}/*`                                        | `templates/` + demo 页面              | P1     |
| 13  | ESLint 可访问性与 import 排序      | `eslint.config.mjs`                                                                 | 现有 flat config 补插件               | P1     |
| 14  | Prettier Tailwind 排序             | `package.json`、`.prettierrc`                                                       | 补 `prettier-plugin-tailwindcss`      | P1     |
| 15  | 组件目录分层                       | `components/ui` vs `components/blocks`                                              | 重构 `components/` 子目录             | P1     |
| 16  | 消费体验：subpath / registry / CLI | `components.json`                                                                   | 多入口构建 + `create-frontend-frame`  | P2     |
| 17  | 性能预算                           | `next/image`、动态 import                                                           | `size-limit` + 多入口 tree-shaking    | P2     |
| 18  | 动效微交互                         | `contact-form.tsx` 成功态                                                           | 复用现有 motion 层                    | P2     |

## 3. 重点拆解

### 3.1 应用骨架：把「页面」变成一等公民

**它做了什么**

- `src/app/layout.tsx` 统一挂 Provider、Navbar、Footer、字体和全局样式。
- `src/app/not-found.tsx` 有完整 404 页面，而不是空白或重定向。
- 每个路由目录自带 `page.tsx`，页面只负责组合区块。
- `src/components/background.tsx` 用 `variant="top" | "bottom"` 统一页面背景渐变和圆角。

**frontend-frame 的缺口**

- demo 只有 `apps/demo/src/app.tsx` 的 `Routes`，没有 `error` / `loading` / `not-found` 边界。
- 没有可复用的 `AppShell` 包，业务方接入要自己抄 `app-shell.tsx`。
- 没有「页面元信息 / 标题 / 面包屑」的统一约定。

**建议落地**

新增 `packages/app-kit`：

```text
packages/app-kit/src/
├─ shell/
│  ├─ app-shell.tsx          # 侧栏 + 顶栏 + 内容区
│  ├─ page-header.tsx        # 标题 / 描述 / 操作区
│  ├─ route-boundary.tsx     # loading / error / empty
│  └─ skip-link.tsx
├─ adapters/
│  ├─ ui-adapters.tsx        # Link / Image / usePathname 注入
│  ├─ next-adapter.tsx
│  └─ react-router-adapter.tsx
└─ index.ts
```

`RouteBoundary` 建议同时支持 React Router 的 `errorElement` 和 Next 的 `error.tsx` 两种用法，核心 UI 共用：

```tsx
export function RouteBoundary({
	title = "页面出错了",
	description = "请稍后重试，或返回首页。",
	onRetry,
}: {
	title?: string;
	description?: string;
	onRetry?: () => void;
}) {
	return (
		<div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
			<h1 className="text-2xl font-semibold">{title}</h1>
			<p className="text-muted-foreground max-w-md text-sm">{description}</p>
			{onRetry ? <Button onClick={onRetry}>重试</Button> : null}
		</div>
	);
}
```

**验收标准**

- demo 增加 `/404` 演示页和路由级错误边界。
- `RouteBoundary` 有 Vitest 用例，覆盖重试回调。
- 业务方可以用一行 `<AppShell>` 接入，不需要复制 demo 代码。

---

### 3.2 区块（blocks）分层：组件库到应用之间的那层

**它做了什么**

`src/components/blocks/` 把页面拆成可复用区块，而不是把页面写成一个大组件：

- `hero.tsx`、`features.tsx`、`logos.tsx`、`resource-allocation.tsx`
- `testimonials.tsx`、`pricing.tsx`、`pricing-table.tsx`、`faq.tsx`
- `navbar.tsx`、`footer.tsx`、`contact.tsx`、`contact-form.tsx`
- `about.tsx`、`about-hero.tsx`、`investors.tsx`

关键点不是「有这些区块」，而是**区块只做编排，不碰数据获取和路由实现**。例如 `features.tsx` 只消费本地 `items` 数组，导航链接通过 `next/link` 渲染。

**frontend-frame 的缺口**

- 65 个组件全是「原子/组合件」，没有「页面级区块」。
- 演示页 `apps/demo/src/pages/*` 里的组合无法被业务方复用。
- 营销站、后台、文档站三类场景没有各自的区块集合。

**建议落地**

新增 `packages/blocks`，依赖 `@frontend-frame/ui`，不依赖具体路由库：

```text
packages/blocks/src/
├─ marketing/
│  ├─ hero.tsx
│  ├─ logo-marquee.tsx
│  ├─ feature-grid.tsx
│  ├─ stats-band.tsx
│  ├─ pricing-table.tsx
│  ├─ testimonials.tsx
│  ├─ faq.tsx
│  ├─ cta-band.tsx
│  ├─ site-navbar.tsx
│  └─ site-footer.tsx
├─ app/
│  ├─ dashboard-hero.tsx
│  ├─ settings-section.tsx
│  ├─ empty-state.tsx
│  └─ auth-card.tsx
└─ docs/
   ├─ code-block.tsx
   ├─ prop-table.tsx
   └─ toc.tsx
```

区块的 props 只接受**数据和回调**，不直接调用 `useNavigate`：

```tsx
export interface NavItem {
	label: string;
	href: string;
	description?: string;
	children?: NavItem[];
}

export interface SiteNavbarProps {
	items: NavItem[];
	activePath?: string;
	actions?: React.ReactNode;
	onNavigate?: (href: string) => void;
}

export function SiteNavbar({
	items,
	activePath,
	actions,
	onNavigate,
}: SiteNavbarProps) {
	const { Link } = useUiAdapters();
	// 只负责渲染，不关心是 Next Link 还是 React Router Link
}
```

**验收标准**

- 至少交付 8 个营销区块：Navbar、Hero、LogoMarquee、FeatureGrid、PricingTable、FAQ、Testimonials、Footer。
- 每个区块在 light/dark 下可读，移动端不横向滚动。
- 区块不直接 import `next/*` 或 `react-router-dom`。
- 每个区块至少一个渲染测试。

---

### 3.3 表单闭环：RHF + Zod + Action

**它做了什么**

模板把「表单」拆成四层，这是最值得直接借鉴的部分：

1. **Schema 单一事实来源**：`src/lib/form-schema.ts`
2. **Action 客户端**：`src/actions/safe-action.ts`，`createSafeActionClient()`
3. **服务端动作**：`src/actions/server-action.ts`，`.inputSchema(formSchema).action(...)`
4. **客户端表单**：`src/components/blocks/contact-form.tsx`，`useAction(serverAction)` 拿到 `isExecuting` / `hasSucceeded`，成功后渲染动画成功态

核心代码形态：

```ts
// 1. schema
export const formSchema = z.object({
	name: z.string({ message: "This field is required" }),
	email: z.string({ message: "This field is required" }),
	message: z.string({ message: "This field is required" }),
	agree: z.literal(true, { message: "This field is required" }),
});

// 2. server action
export const serverAction = actionClient
	.inputSchema(formSchema)
	.action(async ({ parsedInput }) => {
		return { success: true, message: "Form submitted successfully" };
	});

// 3. client
const formAction = useAction(serverAction, {
	onSuccess: () => form.reset(),
});
formAction.execute(data);
```

**frontend-frame 的缺口**

- 有 `Form` / `FormField` / `FormMessage`，但没有 schema 约定、错误映射、提交状态 hook。
- demo 的 `forms.tsx` 只展示控件，没有真实提交链路。
- 没有「服务端字段错误回填到表单」的机制。

**建议落地**

新增 `packages/forms`：

```text
packages/forms/src/
├─ schema.ts        # 通用字段 schema、错误消息
├─ create-action.ts # 框架无关 action 包装
├─ use-action.ts    # 提交状态 hook
├─ field-errors.ts  # 服务端字段错误 -> RHF setError
└─ index.ts
```

服务端错误回填示例：

```ts
export function applyFieldErrors<T extends FieldValues>(
	form: UseFormReturn<T>,
	fieldErrors?: Record<string, string[] | undefined>,
) {
	if (!fieldErrors) return;
	for (const [name, messages] of Object.entries(fieldErrors)) {
		if (messages?.length) {
			form.setError(name as Path<T>, { type: "server", message: messages[0] });
		}
	}
}
```

**注意：模板本身有缺陷，不要照抄**

- `email` 只用了 `z.string()`，没有 `.email()`，邮箱格式不会校验。
- 每个 `FormField` 又写了 `rules={{ required: true }}`，与 Zod resolver 重复，错误来源不唯一。
- `agree: z.literal(true)` 与 `defaultValues: { agree: false } as unknown as Schema` 用了类型断言，掩盖了类型不一致。
- 服务端返回的字段错误没有回填，`onError` 里只有 TODO。
- 成功态用 `hasSucceeded` 渲染，但没有处理重复提交和网络异常。

**验收标准**

- 新增一个可运行的 `ContactForm` 示例，包含客户端校验、服务端校验、字段错误回填、成功态。
- 提交中禁用按钮，防重复提交。
- 至少有 3 个测试：校验失败、提交成功、服务端字段错误。

---

### 3.4 Action / API 契约层：把 next-safe-action 抽象成框架无关能力

**它做了什么**

`next-safe-action` 提供了：输入校验、类型安全、中间件（鉴权/日志）、`useAction` 状态、错误模型。模板只用了最基础的 `createSafeActionClient()`。

**frontend-frame 应该做得更通用**

业务后端可能不在 Next 里，所以不要直接依赖 `next-safe-action`。定义一个与传输方式无关的 action 契约：

```ts
// packages/forms/src/create-action.ts
import type { z } from "zod";

export type FieldErrors = Record<string, string[] | undefined>;

export interface ActionErrorPayload {
	code: string;
	message: string;
	fieldErrors?: FieldErrors;
}

export type ActionResult<T> =
	{ ok: true; data: T } | { ok: false; error: ActionErrorPayload };

export class ActionError extends Error {
	constructor(
		public code: string,
		message: string,
		public fieldErrors?: FieldErrors,
	) {
		super(message);
		this.name = "ActionError";
	}
}

export function createAction<TSchema extends z.ZodType, TOutput>(
	schema: TSchema,
	handler: (input: z.infer<TSchema>) => Promise<TOutput>,
) {
	return async (raw: unknown): Promise<ActionResult<TOutput>> => {
		const parsed = schema.safeParse(raw);
		if (!parsed.success) {
			return {
				ok: false,
				error: {
					code: "VALIDATION_ERROR",
					message: "提交内容有误，请检查后重试",
					fieldErrors: parsed.error.flatten().fieldErrors,
				},
			};
		}

		try {
			return { ok: true, data: await handler(parsed.data) };
		} catch (error) {
			if (error instanceof ActionError) {
				return {
					ok: false,
					error: {
						code: error.code,
						message: error.message,
						fieldErrors: error.fieldErrors,
					},
				};
			}
			return {
				ok: false,
				error: {
					code: "INTERNAL_ERROR",
					message: "服务暂时不可用，请稍后重试",
				},
			};
		}
	};
}
```

客户端 hook 对齐 `useAction` 的使用习惯：

```tsx
type ActionState<TOutput> =
	| { status: "idle" }
	| { status: "pending" }
	| { status: "success"; data: TOutput }
	| { status: "error"; error: ActionErrorPayload };

export function useAction<TInput, TOutput>(
	action: (input: TInput) => Promise<ActionResult<TOutput>>,
) {
	const [state, setState] = React.useState<ActionState<TOutput>>({
		status: "idle",
	});

	const execute = React.useCallback(
		async (input: TInput) => {
			setState({ status: "pending" });
			const result = await action(input);
			setState(
				result.ok
					? { status: "success", data: result.data }
					: { status: "error", error: result.error },
			);
			return result;
		},
		[action],
	);

	return {
		...state,
		execute,
		isExecuting: state.status === "pending",
		hasSucceeded: state.status === "success",
	};
}
```

再提供两个适配器：

- `createNextServerAction(...)`：包一层 `"use server"` + `next-safe-action`。
- `createFetchAction(...)`：包一层 `fetch`，自动处理 JSON、HTTP 错误、AbortSignal。

这样业务方无论后端是 Next、Java、Go 还是 Python，前端表单层都不用改。

**验收标准**

- `createAction` 不依赖任何框架。
- `createFetchAction` 支持 `baseUrl`、超时、取消、错误标准化。
- 有测试覆盖：校验失败、业务错误、网络错误、成功。

---

### 3.5 主题系统补强：防闪烁、令牌完整度、可预览

`frontend-frame` 的主题系统已经比模板强（12 套主题、`data-theme` + `.dark` 双层），但模板有 4 个细节值得补：

**1）首帧防闪烁**

模板在 `<html>` 上加了 `suppressHydrationWarning`，并用 `next-themes` 处理 SSR 首帧。Vite SPA 没有 SSR，但仍有「先渲染浅色再切深色」的闪烁。建议在 `index.html` 的 `<head>` 里放同步脚本：

```html
<script>
	(() => {
		try {
			const key = "frontend-frame-theme";
			const stored = localStorage.getItem(key);
			const system = matchMedia("(prefers-color-scheme: dark)").matches
				? "dark"
				: "light";
			const theme = stored === "light" || stored === "dark" ? stored : system;
			const root = document.documentElement;
			root.classList.toggle("dark", theme === "dark");
			root.style.colorScheme = theme;
			root.setAttribute(
				"data-theme",
				localStorage.getItem("frontend-frame-active-theme") || "glass",
			);
		} catch {}
	})();
</script>
```

并把这段脚本生成器放进 `@frontend-frame/ui`，避免每个业务方手写：

```ts
export function getThemeScript(options?: {
	storageKey?: string;
	activeThemeKey?: string;
	defaultTheme?: "light" | "dark" | "system";
}) {
	// 返回可注入 <script> 的字符串
}
```

**2）切换时禁用过渡**

模板用了 `disableTransitionOnChange`。`frontend-frame` 的 `ThemeProvider` 可以在切换瞬间给 `<html>` 加一个 `data-theme-changing`，CSS 里统一 `transition: none`，避免深色切换时全站动画抖动：

```tsx
const root = document.documentElement;
root.setAttribute("data-theme-changing", "");
root.classList.toggle("dark", next === "dark");
requestAnimationFrame(() => root.removeAttribute("data-theme-changing"));
```

```css
html[data-theme-changing] *,
html[data-theme-changing] *::before,
html[data-theme-changing] *::after {
	transition: none !important;
}
```

**3）补全令牌层级**

模板 `globals.css` 里有几条 `frontend-frame` 还缺的：

- 断点令牌：`--breakpoint-2xl: 1400px`（默认 1536px，营销站更紧凑）
- 容器工具类：`@utility container { max-width: 1220px; padding-inline: 1.5rem; }`
- 阴影梯度：`--shadow-2xs` 到 `--shadow-2xl` 全部映射
- 字体令牌：`--font-display` / `--font-text` / `--font-weight-display` / `--font-weight-text`
- 圆角梯度：`--radius-xs` 到 `--radius-4xl`

建议在 `packages/ui/src/styles.css` 的 `@theme inline` 里补：

```css
@theme inline {
	--breakpoint-2xl: 1400px;
	--container-page: 1220px;

	--shadow-2xs: 0 1px 2px 0 oklch(0 0 0 / 0.04);
	--shadow-xs: 0 1px 3px 0 oklch(0 0 0 / 0.06);
	--shadow-sm: 0 1px 4px 0 oklch(0 0 0 / 0.08);
	--shadow-md: 0 4px 12px -2px oklch(0 0 0 / 0.12);
	--shadow-lg: 0 12px 24px -6px oklch(0 0 0 / 0.16);
	--shadow-xl: 0 24px 48px -12px oklch(0 0 0 / 0.2);

	--duration-fast: 120ms;
	--duration-normal: 200ms;
	--ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
	--z-header: 30;
	--z-overlay: 50;
}

@utility container-page {
	margin-inline: auto;
	width: 100%;
	max-width: var(--container-page);
	padding-inline: 1.5rem;
}
```

**4）主题预览与外部工具兼容**

模板在 `<head>` 里挂了 tweakcn 的 live preview 脚本，方便实时调色。`frontend-frame` 已有 12 套主题，可以做得更好：

- 支持 `?theme=pearl-glass&mode=dark` 预览，用于设计评审和截图回归。
- 提供 `ThemePreviewPanel`，把 `THEMES` 渲染成可视化色卡。
- 导出一份 `theme.schema.json` / `tokens.json`，方便设计工具和 tweakcn 互通。

**验收标准**

- 刷新页面时无深浅色闪烁（录屏或 Playwright 截图对比）。
- `ThemeProvider` 支持 `storageKey`、`disableTransitionOnChange`、`getThemeScript`。
- `container-page`、阴影、断点、字重令牌在 demo 的 tokens 页面可见。
- 12 套主题在 light/dark 下都有对照截图。

---

### 3.6 字体与排版体系

**它做了什么**

`src/app/layout.tsx` 用 `next/font/local` 加载 DM Sans 8 个字重，`Inter` 作为辅助字体，变量分别是 `--font-dm-sans` / `--font-inter`；`globals.css` 再把它们映射成 `--font-display` / `--font-text` / `--font-weight-*`，并对 `h1/h2` 开启 `ss02/ss03/ss04` 字形特性。

**frontend-frame 的缺口**

- 字体只在 `apps/demo/src/styles.css` 里定义，业务方安装组件库后拿不到统一排版。
- 没有 display/text/mono 三档语义，组件里出现 `font-sans` / `font-mono` 混用。
- 没有字重令牌，标题和正文的粗细靠散落的 `font-semibold`。

**建议落地**

在 `packages/ui/src/styles.css` 定义语义字体令牌：

```css
@theme inline {
	--font-sans: "Inter Variable", ui-sans-serif, system-ui, sans-serif;
	--font-mono: "Geist Mono Variable", ui-monospace, monospace;
	--font-display: "DM Sans Variable", var(--font-sans);
	--font-text: var(--font-sans);

	--font-weight-display: 600;
	--font-weight-text: 400;
	--tracking-display: -0.02em;
	--tracking-eyebrow: 0.08em;
}

@layer utilities {
	.font-display {
		font-family: var(--font-display);
		font-weight: var(--font-weight-display);
		letter-spacing: var(--tracking-display);
		font-feature-settings:
			"ss02" on,
			"ss03" on,
			"ss04" on;
	}
	.font-text {
		font-family: var(--font-text);
		font-weight: var(--font-weight-text);
	}
}
```

同时把 `@fontsource-variable/dm-sans` 加入 demo 依赖，或在业务方文档中说明如何加载本地字体。

**验收标准**

- 组件库默认排版开箱即用，业务方不需要再写 `font-family`。
- H1/H2/正文/代码四档在 tokens 页面有对照。
- 字体加载使用 `font-display: swap`，首屏无长时间空白。

---

### 3.7 SEO / Metadata / 结构化数据

**它做了什么**

`src/app/layout.tsx` 的 `metadata` 覆盖了：标题模板、描述、关键词、作者、robots、多尺寸 favicon、Open Graph（1200x630）、Twitter Card。这是营销站的标配。

**frontend-frame 的缺口**

- 完全没有 SEO 层。
- demo 是 SPA，`document.title` 不随路由变化。
- 没有 sitemap、robots、canonical、JSON-LD。

**建议落地**

新增 `packages/seo`，提供与框架无关的配置和 helper：

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

export function createPageMetadata(meta: PageMeta, site: SiteConfig) {
	const url = new URL(meta.path ?? "/", site.url).toString();
	return {
		title: meta.title,
		description: meta.description,
		alternates: { canonical: url },
		robots: meta.noIndex
			? { index: false, follow: false }
			: { index: true, follow: true },
		openGraph: {
			type: "website",
			url,
			title: meta.title,
			description: meta.description,
			siteName: site.name,
			images: [
				{
					url: meta.image ?? site.ogImage,
					width: 1200,
					height: 630,
					alt: meta.title,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: meta.title,
			description: meta.description,
			images: [meta.image ?? site.ogImage],
			creator: site.twitter,
		},
	};
}
```

再补三类 JSON-LD 构造器：

- `organizationJsonLd(site)`
- `faqJsonLd(items)`
- `breadcrumbJsonLd(items)`

Next 项目直接 `export const metadata = createPageMetadata(...)`；Vite/React Router 项目提供 `useDocumentMeta(meta)` hook 或 `react-helmet-async` 适配。

**注意模板的不足**

- 没有 `metadataBase`，相对 OG 图片在部分部署环境会失效。
- 子页面没有各自的 `metadata`，所有页面共享首页标题和描述。
- 没有 `sitemap.ts` / `robots.ts`。
- 没有 canonical 和 JSON-LD。

**验收标准**

- demo 每个路由的 `title` / `description` / canonical 正确。
- 首页、FAQ 页输出有效 JSON-LD（用 Rich Results Test 验证）。
- 构建产物包含 `sitemap.xml` 和 `robots.txt`。

---

### 3.8 MDX 内容层

**它做了什么**

- `next.config.ts` 里 `pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"]`
- `src/app/privacy/privacy.mdx` 直接作为页面
- `@next/mdx` + `@mdx-js/loader` + `@mdx-js/react`

**frontend-frame 的缺口**

- `apps/demo/src/pages/docs.tsx` 把安装说明、代码块、组件清单全写成 TSX 字符串，维护成本高。
- 没有内容目录、TOC、代码高亮、可交互示例。

**建议落地**

优先做 `apps/docs`（Vite + React Router + MDX），而不是直接上 Storybook：

```text
apps/docs/
├─ content/
│  ├─ getting-started.mdx
│  ├─ theming.mdx
│  ├─ forms.mdx
│  └─ components/
│     ├─ button.mdx
│     └─ data-table.mdx
├─ src/
│  ├─ mdx-components.tsx     # 把 h1/code/table 映射到 UI 组件
│  ├─ live-preview.tsx       # react-live / sandpack
│  └─ toc.tsx
└─ vite.config.ts
```

Vite 侧用 `@mdx-js/rollup`，配 `remark-gfm`、`rehype-pretty-code`（Shiki）、`remark-toc`。组件 API 表格可以用 `react-docgen-typescript` 从 `packages/ui` 自动生成，避免手写。

如果后续仍要 Storybook，可以让 Storybook 复用同一批 MDX 内容，而不是两套文档。

**验收标准**

- 新增组件时，只需要写一个 `.mdx` 和一个 story/example，不再改 `docs.tsx`。
- 代码块有语法高亮、复制按钮、文件名。
- 文档站可以嵌入真实组件示例，而不是截图。

---

### 3.9 装饰性布局原语与布局节奏

**它做了什么**

- `background.tsx`：统一页面背景渐变、圆角、外边距。
- `dashed-line.tsx`：用 `repeating-linear-gradient` + `mask-image` 做虚线分隔，横竖两向。
- `globals.css`：`@utility container` 统一 1220px 内容宽度。
- 区块统一 `py-28 lg:py-32`，形成稳定节奏。

**frontend-frame 的缺口**

- 有大量业务组件，但缺少「页面装饰原语」。
- 间距靠每个页面手写，容易出现 `py-20` / `py-28` / `py-32` 混用。

**建议落地**

新增三个基础原语 + 一个布局组件：

```tsx
// packages/ui/src/components/section-backdrop.tsx
export function SectionBackdrop({
	children,
	variant = "top",
	className,
}: {
	children: React.ReactNode;
	variant?: "top" | "bottom" | "none";
	className?: string;
}) {
	return (
		<div
			className={cn(
				"relative mx-2.5 mt-2.5 lg:mx-4",
				variant === "top" &&
					"from-primary/40 via-background to-background/80 rounded-t-4xl rounded-b-2xl bg-linear-to-b via-20%",
				variant === "bottom" &&
					"from-background via-background to-primary/40 rounded-t-2xl rounded-b-4xl bg-linear-to-b",
				className,
			)}
		>
			{children}
		</div>
	);
}
```

```tsx
// packages/ui/src/components/dashed-line.tsx
export function DashedLine({
	orientation = "horizontal",
	className,
}: {
	orientation?: "horizontal" | "vertical";
	className?: string;
}) {
	const horizontal = orientation === "horizontal";
	return (
		<div
			className={cn(
				"text-muted-foreground relative",
				horizontal ? "h-px w-full" : "h-full w-px",
				className,
			)}
		>
			<div
				className={cn(
					horizontal
						? "h-px w-full bg-[repeating-linear-gradient(90deg,transparent,transparent_4px,currentColor_4px,currentColor_10px)] [mask-image:linear-gradient(90deg,transparent,black_25%,black_75%,transparent)]"
						: "h-full w-px bg-[repeating-linear-gradient(180deg,transparent,transparent_4px,currentColor_4px,currentColor_10px)] [mask-image:linear-gradient(180deg,transparent,black_25%,black_75%,transparent)]",
				)}
			/>
		</div>
	);
}
```

```tsx
// packages/ui/src/components/page-section.tsx
const spacing = {
	none: "",
	tight: "py-12 lg:py-16",
	default: "py-20 lg:py-28",
	loose: "py-28 lg:py-32",
} as const;

export function PageSection({
	as: Comp = "section",
	spacing: size = "default",
	className,
	children,
	...props
}: React.ComponentProps<"section"> & {
	as?: React.ElementType;
	spacing?: keyof typeof spacing;
}) {
	return (
		<Comp className={cn(spacing[size], className)} {...props}>
			{children}
		</Comp>
	);
}
```

**验收标准**

- `PageSection` 覆盖 `none/tight/default/loose` 四档，demo 页面不再手写 `py-*`。
- `DashedLine` 横竖两向在 light/dark 下可见。
- `SectionBackdrop` 不引入横向滚动。

---

### 3.10 多框架适配层：把 Next 绑定收口

模板深度绑定 `next/link`、`next/image`、`next/navigation`、`next/font`。这对模板没问题，对组件库是灾难。

`frontend-frame` 已经有一个正确方向：`NavSidebar` 通过 `linkComponent` 注入路由 Link。建议把这个模式扩展到所有需要路由/图片/路径的组件：

```tsx
// packages/app-kit/src/adapters/ui-adapters.tsx
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

const UiAdaptersContext = React.createContext<UiAdapters | null>(null);

export function UiAdaptersProvider({
	adapters,
	children,
}: {
	adapters: UiAdapters;
	children: React.ReactNode;
}) {
	return <UiAdaptersContext value={adapters}>{children}</UiAdaptersContext>;
}

export function useUiAdapters() {
	const context = React.use(UiAdaptersContext);
	if (!context) {
		throw new Error("useUiAdapters must be used within <UiAdaptersProvider>");
	}
	return context;
}
```

Next 适配器：

```tsx
export const nextAdapters: UiAdapters = {
	Link: NextLink,
	Image: NextImage,
	usePathname,
	navigate: (href) => router.push(href),
};
```

React Router 适配器：

```tsx
export const routerAdapters: UiAdapters = {
	Link: RouterLink,
	Image: (props) => <img {...props} />,
	usePathname: () => useLocation().pathname,
	navigate: (href) => useNavigate()(href),
};
```

**验收标准**

- `packages/blocks` 不出现 `next/*` 或 `react-router-dom`。
- 同一套 `SiteNavbar` 可以分别在 demo（React Router）和 Next 示例中运行。
- 适配器缺失时给出明确错误，而不是静默降级。

---

### 3.11 工程规范：只补它比我们强的地方

模板的工程化整体弱于 `frontend-frame`（无测试、无 CI、无 typecheck、无 changesets），但 ESLint/Prettier 有两点值得补：

**1）ESLint 补 `jsx-a11y` 和 `import/order`**

模板 `eslint.config.mjs` 启用了：

```js
plugin:jsx-a11y/recommended
plugin:import/recommended
plugin:import/typescript
```

以及 `import/order` 分组：内置/外部 → 内部/父级/兄弟，`react` 和 `next/**` 置顶，`@/**` 置底，空行分隔，字母排序。

`frontend-frame` 目前只有 `@eslint/js`、`typescript-eslint`、`react-hooks`、`react-refresh`。建议补：

```js
import jsxA11y from "eslint-plugin-jsx-a11y";
import importPlugin from "eslint-plugin-import";

export default tseslint.config(
	// ...
	{
		plugins: { "jsx-a11y": jsxA11y, import: importPlugin },
		rules: {
			...jsxA11y.flatConfigs.recommended.rules,
			"import/order": [
				"error",
				{
					groups: [
						["builtin", "external"],
						["internal", "parent", "sibling", "index"],
					],
					pathGroups: [
						{ pattern: "react", group: "builtin", position: "before" },
						{ pattern: "@/**", group: "internal", position: "after" },
					],
					pathGroupsExcludedImportTypes: ["builtin"],
					"newlines-between": "always",
					alphabetize: { order: "asc", caseInsensitive: true },
				},
			],
			"no-console": ["warn", { allow: ["warn", "error"] }],
		},
	},
);
```

注意：组件库允许 `@frontend-frame/ui` 内部别名，`pathGroups` 按实际配置调整。

**2）Prettier 补 Tailwind 类名排序**

模板用了 `prettier-plugin-tailwindcss`。`frontend-frame` 的 `.prettierrc.json` 目前只有格式规则，没有插件。Tailwind v4 需要指定样式入口：

```json
{
	"useTabs": true,
	"tabWidth": 2,
	"printWidth": 80,
	"semi": true,
	"singleQuote": false,
	"trailingComma": "all",
	"plugins": ["prettier-plugin-tailwindcss"],
	"tailwindStylesheet": "./packages/ui/src/styles.css"
}
```

**不建议照搬**

- `images: { unoptimized: true }` 是模板为了部署简化，不要带到组件库。
- `no-console` 只在模板里 warn，组件库应允许 `console.warn/error`，禁止 `log`。
- 模板没有 `format:check`、`lint:fix`、`typecheck` 脚本，frontend-frame 已有更完整的脚本，保持即可。

**验收标准**

- `pnpm lint` 仍为 0 error / 0 warning。
- `pnpm format:check` 可接入 CI。
- 新增组件默认通过 `jsx-a11y` 规则。

---

### 3.12 发布与消费体验

**模板的做法**

- 作为模板仓库整体复制，`components.json` 让 shadcn CLI 知道组件、工具、别名、registry 的位置。
- 消费方式是 `git clone` 或 `npx shadcn add`，不是 npm 包。

**frontend-frame 的现状**

- `@frontend-frame/ui` 是单入口 barrel export（`src/index.ts` 导出 100+ 模块）。
- 消费方要手写 `@source` 让 Tailwind 扫描组件源码。
- 没有 `create-frontend-frame` 脚手架，没有区块 registry。

**建议落地**

1. **多入口构建**：Vite lib mode 改成多入口，`exports` 支持子路径：

```json
{
	"exports": {
		".": { "types": "./dist/index.d.ts", "import": "./dist/index.js" },
		"./button": { "types": "./dist/button.d.ts", "import": "./dist/button.js" },
		"./data-table": {
			"types": "./dist/data-table.d.ts",
			"import": "./dist/data-table.js"
		},
		"./styles.css": "./src/styles.css",
		"./package.json": "./package.json"
	}
}
```

2. **提供 Tailwind 预设**：把 `@source`、`@plugin`、主题 `@import` 收口成一个 `@frontend-frame/ui/tailwind.css`，消费方只写一行：

```css
@import "tailwindcss";
@import "@frontend-frame/ui/tailwind.css";
```

3. **区块 registry**：参考 `components.json`，提供 `registry.json`，让内部 CLI 可以 `npx create-frontend-frame add hero`，直接复制源码到业务项目。

4. **脚手架**：`create-frontend-frame` 提供三个模板：

   - `vite-spa`：React Router + AppShell + 登录页
   - `next-app`：App Router + adapters + metadata
   - `docs-site`：MDX + 组件文档

5. **体积预算**：加 `size-limit` 或 `rollup-plugin-visualizer`，分别约束 `button`、`data-table`、`chart` 三个典型入口。

**验收标准**

- 业务方可以只 `import { Button } from "@frontend-frame/ui/button"`，构建产物不包含 DataTable/Recharts。
- `npx create-frontend-frame my-app --template vite-spa` 可跑通。
- `pnpm size` 在 CI 中有阈值。

---

## 4. 不建议照搬的点

| 点                                        | 原因                                                                       | 建议                                          |
| ----------------------------------------- | -------------------------------------------------------------------------- | --------------------------------------------- |
| Next.js 绑定                              | `next/link`、`next/image`、`next/font`、`next/navigation` 让组件无法跨框架 | 用 adapters 注入                              |
| 无测试 / 无 CI                            | 模板是展示型仓库，不承担长期维护                                           | 保持 frontend-frame 现有质量门禁              |
| `z.string()` 当邮箱                       | 邮箱格式不校验                                                             | 用 `z.email()` 或 `z.string().email()`        |
| `rules={{ required: true }}` + Zod 双校验 | 错误来源不唯一                                                             | 只保留 resolver，`rules` 仅用于非 Zod 场景    |
| `as unknown as Schema`                    | 掩盖 `agree` 默认值类型不一致                                              | 用 `z.boolean().refine(Boolean)` 或正确默认值 |
| 静态登录/注册表单                         | 没有提交逻辑，只是视觉稿                                                   | 抽成 `AuthCard` 视觉组件，提交逻辑由业务注入  |
| `images.unoptimized: true`                | 放弃图片优化                                                               | 组件库不涉及，模板示例按需开启                |
| tweakcn 外链脚本                          | 生产环境引入第三方脚本有隐私/可用性风险                                    | 仅开发环境启用，或用本地主题编辑器            |
| 所有页面共享一个 metadata                 | 子页面 SEO 缺失                                                            | 每页 `createPageMetadata`                     |
| 单入口巨包                                | 组件库消费方被迫引入全部依赖                                               | 多入口 + subpath exports                      |

## 5. 目标目录结构

建议在现有 workspace 上做增量扩展，不推翻 `packages/ui`：

```text
frontend-frame/
├─ apps/
│  ├─ demo/                     # Vite 演示站（保留）
│  └─ docs/                     # 新增：MDX 文档站
├─ packages/
│  ├─ ui/                       # 保留：原子/组合组件、主题、hooks
│  │  └─ src/
│  │     ├─ components/
│  │     │  ├─ primitives/      # button/input/dialog...
│  │     │  ├─ patterns/        # data-table/form/page-header...
│  │     │  ├─ charts/
│  │     │  ├─ ai/
│  │     │  └─ decorative/      # section-backdrop/dashed-line...
│  │     ├─ styles/
│  │     │  ├─ themes/
│  │     │  └─ tokens.css
│  │     └─ index.ts
│  ├─ blocks/                   # 新增：页面区块
│  ├─ app-kit/                  # 新增：AppShell、adapters、route boundary
│  ├─ forms/                    # 新增：schema、action、useAction
│  └─ seo/                      # 新增：metadata、JSON-LD、sitemap
├─ templates/                   # 新增：vite-spa / next-app / docs-site
└─ docs/                        # 设计文档（本文件所在目录）
```

如果不想拆太多包，也可以先做一个 `packages/kit`，内部用子目录分层，等稳定后再拆包。关键是**先把边界定清楚**，不要把所有东西继续堆进 `packages/ui/src/components`。

## 6. 落地路线图

### 迭代 0：底座补强（约 3~5 天）

- [ ] `ThemeProvider` 增加 `storageKey`、`disableTransitionOnChange`、`getThemeScript`。
- [ ] demo `index.html` 接入首帧防闪烁脚本。
- [ ] `styles.css` 补字体、阴影、断点、容器、z-index、动效时长令牌。
- [ ] ESLint 补 `jsx-a11y`、`import/order`；Prettier 补 Tailwind 插件。
- [ ] 新增 `PageSection`、`SectionBackdrop`、`DashedLine`。

### 迭代 1：应用层与区块（约 1 周）

- [ ] 新增 `packages/app-kit`：`AppShell`、`RouteBoundary`、`UiAdaptersProvider`。
- [ ] 新增 `packages/blocks`：Navbar、Hero、LogoMarquee、FeatureGrid、PricingTable、FAQ、Testimonials、Footer。
- [ ] demo 新增 `/marketing` 页面，用区块拼一个完整落地页。
- [ ] demo 增加 404、错误边界、加载骨架。

### 迭代 2：表单与契约（约 1 周）

- [ ] 新增 `packages/forms`：`createAction`、`useAction`、`applyFieldErrors`。
- [ ] 新增 `createFetchAction` 适配器，支持超时/取消/错误标准化。
- [ ] demo 新增可运行的 `ContactForm`，覆盖客户端 + 服务端校验。
- [ ] 补 3 个表单测试和 4 个 action 测试。

### 迭代 3：SEO 与内容（约 1 周）

- [ ] 新增 `packages/seo`：`createPageMetadata`、`OrganizationJsonLd`、`FaqJsonLd`、`BreadcrumbJsonLd`。
- [ ] demo 每个路由接入 `useDocumentMeta`。
- [ ] 新增 `apps/docs`，用 MDX 重写 `docs.tsx`。
- [ ] 代码块接 Shiki，组件 API 用 `react-docgen-typescript` 自动生成。

### 迭代 4：发布与体验（约 1 周）

- [ ] 多入口构建 + subpath exports。
- [ ] `@frontend-frame/ui/tailwind.css` 预设。
- [ ] `create-frontend-frame` 脚手架 + 三个模板。
- [ ] `size-limit` 接入 CI。

## 7. 验收命令

每个迭代结束至少跑：

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm --filter @frontend-frame/demo build
```

新增内容层/SEO 后再加：

```bash
pnpm --filter @frontend-frame/docs build
pnpm size
pnpm test:e2e
```

## 8. 参考文件索引

| 文件                                      | 能学到什么                                  |
| ----------------------------------------- | ------------------------------------------- |
| `src/app/layout.tsx`                      | Provider 编排、字体加载、metadata、主题首帧 |
| `src/app/not-found.tsx`                   | 404 页面结构                                |
| `src/app/page.tsx`                        | 页面只做区块组合                            |
| `src/components/background.tsx`           | 页面背景渐变与圆角变体                      |
| `src/components/dashed-line.tsx`          | 渐变遮罩虚线                                |
| `src/components/blocks/navbar.tsx`        | 响应式导航、下拉菜单、移动端菜单            |
| `src/components/blocks/hero.tsx`          | 营销首屏布局                                |
| `src/components/blocks/features.tsx`      | 卡片式功能区块                              |
| `src/components/blocks/pricing-table.tsx` | 定价表组合                                  |
| `src/components/blocks/faq.tsx`           | Accordion 分类问答                          |
| `src/components/blocks/testimonials.tsx`  | Embla 轮播证言                              |
| `src/components/blocks/contact-form.tsx`  | RHF + Zod + Action + 成功态                 |
| `src/lib/form-schema.ts`                  | Schema 单一事实来源                         |
| `src/actions/safe-action.ts`              | Action 客户端                               |
| `src/actions/server-action.ts`            | 服务端动作定义                              |
| `src/components/theme-provider.tsx`       | next-themes 薄封装                          |
| `src/styles/globals.css`                  | 令牌、`@theme inline`、容器、字体、动效     |
| `next.config.ts`                          | MDX pageExtensions                          |
| `eslint.config.mjs`                       | jsx-a11y、import/order、no-console          |
| `components.json`                         | shadcn registry 与别名约定                  |

## 9. 许可提醒

`mainline-nextjs-template` 的 LICENSE 是 **MIT + Commons Clause License Condition v1.0**，不是纯 MIT。它允许作为应用/产品的一部分使用和分发，但有限制（例如不能单独售卖该软件本身）。`frontend-frame` 目前是内部 `UNLICENSED` 仓库，若直接复制区块或样式代码，建议：

- 在 `THIRD_PARTY_NOTICES.md` 增加来源与许可说明；
- 对外发布前做一次法务确认；
- 优先借鉴结构与设计思路，代码按本项目规范重写，降低许可耦合。
