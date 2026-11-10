# 从 Flux 模板学习：给 frontend-frame 补上“应用层”

> 调研对象：<https://flux-nextjs-template.vercel.app/>
> 本地对照：`frontend-frame`（pnpm workspace + `@frontend-frame/ui` + Vite 演示站）
> 日期：2026-11-10
> 方法：对线上页面、HTML、CSS、JS 产物做逆向观察；未获取模板源码，不复制其代码、图片与文案。

## 0. 一句话结论

Flux 值得学的不是 Next.js 本身，而是它把“组件”组织成“可交付网站”的四层中间结构：

```text
UI 原语（Button/Card/Accordion…）
  → 通用展示组件（Eyebrow/LogosMarquee/Carousel…）
    → 页面区块 blocks（Hero/FeaturesBento/Pricing/FAQ…）
      → 页面模板 pages（Home/Pricing/About/Blog/Careers/Auth/404）
        → 内容与元数据（MDX、SEO、OG、Sitemap）
```

`frontend-frame` 的组件底座、主题、测试、CI、changesets 已经比 Flux 更完整，不需要降级重做。真正缺的是上面这层“应用层”：页面骨架、营销区块、页面模板、内容层、SEO、表单闭环和可选的视觉动效层。

> 关于“纯后端”的说明：当前仓库实际是一个前端 UI 组件框架，不是后端框架。若你的意思是“业务后端在别的仓库”，那 Flux 可借鉴的正好是当前缺失的站点层与应用层；若你指的是“只有组件底座、没有业务页面”，结论相同。

---

## 1. Flux 是什么，不是什么

Flux 是 Cruip 售卖的营销站模板（$79），官方描述为：

- Next.js 16 + TypeScript + Tailwind CSS v4；
- 另有 Astro 6 版本；
- 14+ 页面、100+ 组件、block-based 组合式架构；
- MDX 驱动的 Blog 与 Careers；
- 实时 WebGL Shader、Motion 动画；
- 完整移动端适配、SEO 与 metadata。

它**不是**业务后台模板，也不是全栈框架：

- 登录、注册、联系表单都是前端演示，没有真实后端；
- 没有数据库、鉴权、支付、权限；
- 页面内容大多是硬编码数据数组或 MDX；
- 更适合学习“营销站如何工程化”，不适合学习“后端如何设计”。

---

## 2. 页面地图：14+ 页面是怎么拆的

| 路由                                      | 页面角色        | 主要区块                                                                                                                                                        | 可复用结论                               |
| ----------------------------------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| `/`                                       | 产品首页/转化页 | 购买提示条 → 浮动胶囊导航 → WebGL Hero → 客户 Logo 跑马灯 → Bento 能力矩阵 → 滚动大字 → 交替 Feature Showcase → 证言 Carousel → 价格卡 → 末尾 CTA → 黑色 Footer | 一个首页就是 10 个独立 block 的组合      |
| `/about`                                  | 品牌故事        | Hero → Vision / Origin / Impact 三段 → 34% 数据卡 → 证言 → 视频弹层 → 12 人团队网格 → 招聘 CTA                                                                  | 长内容页用 Section + Prose + 数据/人物卡 |
| `/pricing`                                | 价格转化        | 标题 + 月/年 Switch → 2 张价格卡 → 功能对比表 → CTA                                                                                                             | 价格卡、对比表、计费切换应独立成 block   |
| `/contact`                                | 线索收集        | 两列表单 → 证言/联系方式 → FAQ Accordion                                                                                                                        | 表单 + 社会证明 + FAQ 是标准三件套       |
| `/blog`                                   | 内容索引        | 标题 → 精选文章 → 分类 chips → 10 篇文章卡 → 分页                                                                                                               | 文章卡、分类、分页独立                   |
| `/blog/[slug]`                            | 文章详情        | 返回链接 → 标题/摘要/作者/日期/阅读时长 → Prose 正文（引用、列表、表格）→ 相关文章                                                                              | MDX + Prose 排版                         |
| `/careers`                                | 招聘索引        | 标题 → 职位列表                                                                                                                                                 | 职位卡                                   |
| `/careers/[slug]`                         | 职位详情        | 标签 → 标题 → 正文 → 邮件 CTA → 其他职位                                                                                                                        | 内容驱动详情页                           |
| `/signin` `/signup` `/forgot-password`    | 认证            | 左侧品牌/右侧表单卡，或居中卡；Google 按钮                                                                                                                      | 独立 AuthLayout                          |
| `/privacy-policy` `/terms-and-conditions` | 法务            | Prose                                                                                                                                                           | 同一 MDX 模板                            |
| 404                                       | 错误页          | 大号 404 + 返回首页                                                                                                                                             | 独立 NotFound 模板                       |

首页的实际区块顺序（从 HTML 结构可验证）：

1. 顶部购买提示条：可关闭，`localStorage` 记忆，`?banner=false` 强制关闭。
2. 浮动胶囊 Header：桌面端固定悬浮、圆角、毛玻璃；移动端全屏菜单。
3. Hero：Three.js Shader 背景 + 点阵 + 渐变遮罩 + 徽标 + 大标题 + CTA + 产品截图。
4. 客户 Logo 跑马灯：三组重复内容、CSS 动画、hover 暂停、左右渐隐。
5. Bento 能力矩阵：Analytics / Enrichment / Workflows 三张卡，内嵌自绘 SVG 动画。
6. 滚动大字宣言：sticky 200vh，逐词点亮 + 环形进度。
7. Feature Showcase：01–04 交替左右布局，图片卡 + 点阵 + 装饰线。
8. 证言 Carousel：四张人物卡，前后按钮。
9. Pricing：月/年 Switch、两张价格卡、功能清单。
10. 末尾 CTA + 黑色 Footer。

---

## 3. 代码组织：四层结构

从产物中的组件名、`data-slot`、RSC payload 和 chunk 划分，可以推断出类似下面的结构：

```text
src/
├─ components/
│  ├─ ui/                 # shadcn/Radix 原语
│  ├─ blocks/             # 页面区块
│  ├─ illustrations/      # SVG/Canvas/WebGL 视觉
│  ├─ layouts/            # Header/Footer/AuthLayout
│  └─ shared/             # Eyebrow/LogosMarquee/Carousel 等
├─ app/
│  ├─ (marketing)/        # 首页、About、Pricing、Contact
│  ├─ blog/[slug]/        # 文章详情
│  ├─ careers/[slug]/     # 职位详情
│  ├─ (auth)/             # 登录、注册、找回密码
│  └─ not-found.tsx
├─ content/
│  ├─ blog/*.mdx
│  └─ careers/*.mdx
└─ lib/
   ├─ site-config.ts      # 品牌、导航、社交链接
   └─ utils.ts
```

几个关键做法：

- **页面只负责组合区块**：页面文件里主要是 `<Hero /> <FeaturesBento /> <Pricing />`，而不是几百行 JSX。
- **数据与视图分离**：`NAV_LINKS`、价格方案、Feature 列表、证言、职位、文章都以数组/对象配置，block 接收 props。
- **站点配置集中**：从产物能看到 `siteConfig.logo.src` 被 Logo、Footer、Shader 等复用。品牌名、URL、社交链接不应散落在组件里。
- **Server / Client 边界清晰**：页面与内容在服务端渲染，Header、价格切换、Carousel、Shader、滚动动画是客户端小岛。
- **认证页复用同一套 Layout**：Header 在 `/signin`、`/signup`、`/forgot-password` 等路径下会被隐藏，避免营销导航干扰转化。

---

## 4. 设计系统：统一感来自 token，不是每页手写

Flux 的 CSS 变量基本沿用 shadcn 的语义 token，并扩展了 `chart-*`、`sidebar-*`、`font-*`：

| 项       | 实际值/做法                                                                  | 作用                        |
| -------- | ---------------------------------------------------------------------------- | --------------------------- |
| 页面背景 | light `#f6f6f6`，dark `#0a0a0a`                                              | 不是纯白，卡片才有层级      |
| 前景色   | light `#0a0a0a`，dark `#fafafa`                                              | 高对比正文                  |
| 卡片     | light `#fff`，dark `#0a0a0a`                                                 | 卡片与页面背景拉开          |
| 边框     | light `#e5e5e5`，dark `#ffffff1a`                                            | 轻量分隔                    |
| 圆角     | `--radius: 8px`；`rounded-md = 6px`，`rounded-lg = 8px`，`rounded-xl = 12px` | 统一“微圆角”语言            |
| 字体     | 标题/品牌 `DM Sans`，正文 `Inter`                                            | 标题更有几何感，正文更耐读  |
| 图表色   | `--chart-1..5`                                                               | 同一套色用于 SVG/WebGL/图表 |
| 容器     | `.container` 左右 `2rem`；`.container-large` 72rem；`.container-small` 64rem | 页面宽度统一                |
| 区块间距 | `.section-padding` 3rem / 4rem / 6rem（随断点）                              | 节奏统一                    |
| 顶部偏移 | `--header-height` 约 5.75rem；桌面悬浮 18px；`page-top-padding` 16rem        | 固定 Header 不被内容遮挡    |

排版规则：

| 层级       | 类名/尺寸                                                               | 说明               |
| ---------- | ----------------------------------------------------------------------- | ------------------ |
| H1         | `text-4xl md:text-5xl lg:text-6xl`，`tracking-tighter`，`leading-[1.1]` | 36/48/60px，紧字距 |
| H2         | `text-4xl lg:text-5xl`，`tracking-tight`                                | 36/48px            |
| Pricing H2 | `text-4xl md:text-6xl lg:text-7xl`                                      | 更强的转化页标题   |
| H3         | `text-2xl lg:text-3xl`                                                  | 24/30px            |
| 正文       | `text-base md:text-lg`，`text-muted-foreground`                         | 16/18px            |
| Eyebrow    | `text-[11px] uppercase tracking-[0.14em]` + 1px 色条                    | 每个区块的“小标签” |

可复用的两个小原语：

- `Eyebrow`：小标签 + 前置细色条，统一所有区块的“栏目名”。
- `Section` / `Container`：把 `section-padding`、`container`、`container-large` 封装成组件，避免每页重复。

Header/Footer 的视觉语言：

- Header 桌面端是**浮动胶囊**：`lg:fixed`、`lg:rounded-full`、`lg:shadow-sm`、`lg:backdrop-blur-md`。
- 移动端是**全屏覆盖菜单**：三横线按钮 + 垂直 NavigationMenu + Accordion 子菜单 + 滚动锁定。
- Footer 固定黑底，顶部大 CTA，底部巨大品牌字水印 + 波浪纹理，和浅色页面形成强收尾。

---

## 5. 动效体系：Flux 最值得学的部分

Flux 的动效不是“到处加 transition”，而是有统一的参数和触发策略。

### 5.1 统一入场变体

从产物中可读到的高频配置：

```ts
const fadeUp = {
	hidden: { opacity: 0, y: 30, filter: "blur(2px)" },
	visible: {
		opacity: 1,
		y: 0,
		filter: "blur(0px)",
		transition: {
			type: "spring",
			stiffness: 100,
			damping: 25,
			mass: 1,
			duration: 0.6,
		},
	},
};
```

使用策略：

- Hero 用 `animate="visible"`，页面加载即播放；
- 内容区块用 `whileInView="visible"` + `viewport={{ once: true, amount: 0.3 }}`；
- 容器用 `staggerChildren: 0.2`、`delayChildren: 0.3` 编排子元素；
- 图片卡用 `scale: 0.95 → 1` + `blur: 1px → 0`，延迟 `0.2s`；
- 所有动画都受 `useReducedMotion()` 控制，SSR 首帧用 `opacity: 0` 内联样式避免闪烁。

### 5.2 滚动叙事

首页大字宣言是典型的 scroll storytelling：

- 外层 `h-[min(200vh,72rem)]`；
- 内层 `sticky top-1/2 -translate-y-1/2`；
- `useScroll` 的 offset 是 `["start 0.92", "end 0.55"]`；
- 每个词按阅读进度映射 `opacity 0 → 1`；
- 同时用 `[.24, .54] → 0..360°` 驱动一个圆环/Logo 的 conic-gradient 填充。

这种模式很适合“品牌宣言 / 产品理念 / 关键指标”段落，但要注意：

- 移动端短视口要降级；
- `prefers-reduced-motion` 下直接显示终态；
- 不要让 sticky 段落挡住键盘焦点。

### 5.3 SVG 动画

Flux 的 Bento 卡片里有大量自绘 SVG，使用 Motion 的：

- `pathLength: 0 → 1`：折线/曲线绘制；
- `offsetDistance: 0% → 100%`：小圆点沿路径移动；
- `d` 属性 morph：柱状图从 0 长到目标高度；
- `fillOpacity` / `strokeOpacity`：图层淡入；
- `whileInView` + 延迟序列：卡片进入视口后依次播放。

这比“放一张静态产品截图”更有说服力，也更适合组件库沉淀。

### 5.4 边框光束与 Logo 扫光

产物里有一个可复用的视觉原语：

- 用 `offset-path: inset(1px round 5px)` 让 80px 的渐变条沿圆角边框跑；
- 两条光束、不同颜色、不同延迟；
- 用 `mask-image: url(logo.svg)` 把 conic-gradient 裁成品牌 Logo；
- 滚动进度驱动 `conic-gradient` 角度，形成“Logo 被点亮”的效果。

这类效果可以抽象成：

- `BeamBorder`：给卡片/头像/Logo 加流动边框；
- `LogoOrb`：品牌 Logo + 进度环 + 扫光。

### 5.5 其他微交互

- Logo 跑马灯：CSS `@keyframes marquee`，复制两组内容，`hover` 暂停，左右 `mask` 渐隐；
- 主题切换：View Transitions API，`.35s` 交叉淡入淡出；
- 按钮：`active:translate-y-px`，图标在圆形底里；
- 徽标：`animate-ping` 小圆点；
- 图片：`hover:scale-105`，但只用于 Logo 等小元素；
- 主题图标：SVG path 动画旋转/缩放。

---

## 6. WebGL 与装饰层：把“炫技”隔离成可选层

Flux 首页的 Hero 背景是一个 Three.js Shader：

```ts
<FluxShader
  backgroundColor={dark ? "#0a0a0d" : "#ffffff"}
  objectColor={dark ? "#ffffff" : "#0a0a0d"}
  accentColors={[chart1, chart2, chart3]}
  accentStrength={0.14}
  className="pointer-events-none absolute inset-0 opacity-60 dark:opacity-50"
/>
```

可验证的实现特征：

- 产物中存在 890KB 左右的 Three.js chunk；
- 使用 `WebGLRenderer`、`ShaderMaterial`、`PMREMGenerator` 等；
- Shader 颜色来自 CSS 变量 `--chart-*`，通过 `useChartColors()` 读取并转换；
- 容器 `pointer-events-none`、`aria-hidden`，只做背景；
- 深色/浅色切换时重新传色，而不是写死；
- 页面底部有渐变遮罩，让 Shader 与内容自然衔接。

除了 Shader，还有三个更轻量的装饰原语：

| 原语              | 做法                                                           | 用途                    |
| ----------------- | -------------------------------------------------------------- | ----------------------- |
| `FluxDotGrid`     | 径向点阵 + `mask-image` 椭圆渐隐                               | 卡片背景、Hero 点阵     |
| `FluxWavePattern` | SVG `<pattern>` 画斜向折线，支持 `radial/top/bottom/band` 遮罩 | CTA、Footer、Feature 区 |
| `BackgroundImage` | 背景图 + 渐隐 + 渐变叠加                                       | Pricing/About 的氛围层  |

**对本地框架的启示**：

- 视觉层要独立成 `packages/visuals`，不要混进 `packages/ui`；
- Shader 必须 `React.lazy` + `Suspense`，并提供 CSS/SVG fallback；
- 颜色从 token 读取，避免主题切换后视觉层不跟随；
- 所有装饰层 `aria-hidden` + `pointer-events-none`，不影响可访问性与交互。

---

## 7. 可产品化的区块清单

建议把 Flux 的页面拆成下面这些 block。每个 block 只接收数据与少量布局 props，不直接依赖路由或后端。

> 更细的“产品 UI 模拟层”（Pipeline 图表、Contact 卡、Workflow 画布）拆解见 `docs/product-ui-mockup-plan.md`。

| Block                  | 关键 props                                                          | 变体/备注                        |
| ---------------------- | ------------------------------------------------------------------- | -------------------------------- |
| `AnnouncementBanner`   | `message`, `action`, `dismissible`, `storageKey`                    | 顶部购买条/公告条                |
| `SiteHeader`           | `nav`, `actions`, `brand`, `linkComponent`                          | 桌面胶囊 + 移动全屏菜单          |
| `Hero`                 | `eyebrow`, `title`, `description`, `actions`, `media`, `background` | 居中/左对齐、带/不带视觉层       |
| `LogosMarquee`         | `logos`, `speed`, `pauseOnHover`                                    | 双组循环、边缘渐隐               |
| `BentoGrid`            | `items`, `columns`                                                  | 不同 `col-span` 的组合           |
| `ScrollQuote`          | `text`, `progressRing`                                              | sticky 滚动逐词点亮              |
| `FeatureShowcase`      | `items`, `alternate`                                                | 01–04 编号、左右交替             |
| `TestimonialsCarousel` | `items`, `autoplay`                                                 | Embla/Motion + 前后按钮          |
| `PricingSection`       | `plans`, `billing`, `onBillingChange`                               | 月/年切换、Popular 标记          |
| `ComparisonTable`      | `groups`                                                            | 功能分组、勾选/横线/文案         |
| `FAQAccordion`         | `items`, `type`                                                     | 单开/多开                        |
| `CTASection`           | `title`, `description`, `actions`                                   | 末尾转化                         |
| `SiteFooter`           | `brand`, `columns`, `contact`, `social`, `legal`                    | 黑底 + 巨型品牌字                |
| `AuthLayout`           | `title`, `description`, `footer`, `brand`                           | 左右分栏/居中卡                  |
| `PageHeader`           | `eyebrow`, `title`, `description`, `actions`                        | 内页统一头部                     |
| `BlogCard`             | `post`                                                              | 封面、分类、阅读时长、作者、日期 |
| `BlogList`             | `posts`, `categories`, `pagination`                                 | 精选 + 网格 + 分页               |
| `ArticleLayout`        | `post`, `children`, `related`                                       | Prose + 作者 + 相关文章          |
| `CareersList`          | `roles`                                                             | 职位卡                           |
| `CareerDetail`         | `role`, `children`                                                  | 标签、正文、邮件 CTA             |
| `TeamGrid`             | `members`                                                           | 头像、姓名、职位                 |
| `StatBlock`            | `value`, `label`, `description`                                     | 34% 这类数据                     |
| `VideoDialog`          | `src`, `poster`, `title`                                            | 视频弹层                         |
| `ContactForm`          | `fields`, `onSubmit`                                                | 两列表单 + 侧栏                  |
| `NotFound`             | `title`, `description`, `action`                                    | 独立 404                         |
| `Prose`                | `children`                                                          | MDX 排版容器                     |

---

## 8. 表单、导航与交互细节

### 8.1 联系表单

线上可验证的结构：

- 两列网格：First Name / Last Name / Email / Company size / Role / Message；
- `Company size`、`Role` 是 Select；
- 每个字段有 Label，输入框有 placeholder；
- 提交按钮文案是 “Continue”；
- 右侧是社会证明（证言）与联系方式（邮箱、Chat、电话、Office）；
- 下方是 FAQ Accordion。

注意：静态产物里看不到真实的提交逻辑与错误状态，演示站大概率是前端演示。真正落地时要补：

- Zod schema；
- `react-hook-form` + `zodResolver`；
- 提交中/成功/失败状态；
- 服务端 action 或 API adapter；
- 错误信息通过 `FormMessage` 关联 `aria-describedby`。

### 8.2 认证页

- `/signin`：Email、Password、Login、Google 登录、Sign up、Forgot password；
- `/signup`：Email、Password、Confirm Password、Create Account、Google；
- 输入框有 `required`，表单是原生 `<form>`；
- 页面去掉了营销 Header，只保留品牌与表单卡。

### 8.3 价格切换

- 使用 Switch 组件，`aria-label="Toggle annual billing"`；
- 状态驱动 `monthlyPrice` / `annualPrice`；
- Monthly/Annual 文案颜色随状态切换；
- 下方固定提示 “Save 25% on annual plan”。

### 8.4 FAQ

- Radix Accordion，`data-orientation="vertical"`；
- 触发器整行可点，右侧 Chevron 图标；
- 默认全部关闭；
- 适合抽成 `FAQAccordion`，支持 `type="single" | "multiple"`。

### 8.5 移动端导航

- 全屏 `fixed inset-0` 覆盖层；
- 打开时锁定 `html/body` 的 `overflow`；
- 垂直 NavigationMenu + Accordion 子菜单；
- 底部固定 Sign in / Get started；
- 三横线按钮有 `sr-only` 文本 “Open main menu”；
- 关闭后恢复滚动。

### 8.6 主题切换

- 使用 `next-themes` 的 `ThemeProvider`；
- `<head>` 里有内联脚本，在 React 水合前读取 `localStorage`，避免闪烁；
- 支持 `light` / `dark` / `system`；
- 切换时使用 View Transitions API：

```css
::view-transition-old(root) {
	animation: theme-fade-out 0.35s ease;
}
::view-transition-new(root) {
	animation: theme-fade-in 0.35s ease;
}
```

- 主题按钮的图标本身有 path 动画。

### 8.7 顶部提示条

- `localStorage` key：`banner-dismissed`；
- URL 参数 `?banner=false` 可强制关闭；
- 用 `ResizeObserver` 把高度写到 `--banner-height`；
- Header 用 `top-[var(--banner-height)]` 跟随，避免被遮挡；
- 组件卸载时把变量重置为 `0px`。

这是一个很小但很值得学的“布局变量”模式。

---

## 9. 内容层与 SEO

### 9.1 内容层

Flux 的 Blog 与 Careers 是 MDX 驱动：

- `/blog` 有 10 篇文章；
- `/blog/[slug]` 有标题、摘要、作者、日期、阅读时长、正文、相关文章；
- 正文包含引用、有序列表、表格，说明 `Prose` 排版是重点；
- `/careers/[slug]` 有职位标签、正文、邮件 CTA、其他职位。

值得学的结构：

```text
content/
├─ blog/
│  └─ ai-copilot-sales-workflows.mdx
└─ careers/
   └─ senior-software-engineer.mdx
```

frontmatter 至少包含：

```yaml
title: How AI Copilots Are Reshaping Sales Workflows
description: From call summaries to next-best actions...
date: 2025-06-18
author: Elena Park
category: Guides
readTime: 2 min read
image: /images/blog/...
```

### 9.2 SEO

做得好的部分：

- 每个页面有独立 `title` / `description`；
- 完整 OG / Twitter Card；
- 文章页有 `og:type=article`、`article:published_time`、`article:author`；
- 有 keywords、creator、publisher、robots；
- 字体、Hero 图有 preload。

明显的缺口（不要照抄）：

- 没有 `<link rel="canonical">`；
- 没有 JSON-LD（Article / Organization / Breadcrumb）；
- `/sitemap.xml`、`/robots.txt`、`/manifest.webmanifest` 都返回 404；
- 首页 `og:url` 指向旧域名 `lumen-nextjs-template.vercel.app`；
- 404 页面正文是 Lorem ipsum 占位文案；
- Blog 分页链接指向 `#`，演示站没有真实第二页数据。

这些缺口正好是 `frontend-frame` 可以做得更好的地方。

---

## 10. 性能与可访问性

做得好的部分：

- Hero 图 `loading="eager"` + `fetchPriority="high"`；
- 33 张图片 `loading="lazy"`；
- Hero 主图有 `width` / `height`，首屏 CLS 控制得较好；但 41 张图中只有 5 张写了宽高，多数 Logo/人物图依赖 CSS 尺寸；
- 装饰层 `aria-hidden` + `pointer-events-none`；
- 图标按钮有 `aria-label`；
- 焦点态统一 `focus-visible:ring-3`；
- 动画尊重 `prefers-reduced-motion`；
- 抽查页面的标题层级基本正确（首页、404 等均为单 H1）。

需要注意的问题：

- 页面输出的是普通 `<img>`，没有 `srcset`，没有 Next Image 优化痕迹；
- Three.js chunk 较大，首页首屏成本高；
- 主 CSS 约 142KB（线上传输的压缩产物），需要关注产物预算；
- 200vh sticky 段落对移动端短视口不友好；
- 大量玻璃/模糊/阴影叠加，低端设备要提供降级。

对本地框架的启示：

- 组件库不要把 Three.js 作为默认依赖；
- 视觉层单独打包、按需加载；
- 给每个 block 建立 bundle 预算；
- 视觉回归要覆盖 light/dark、360/768/1024/1440。

---

## 11. 对照 frontend-frame：缺什么、补什么

| 能力          | Flux                                                | frontend-frame 现状                   | 建议                                                   | 优先级 |
| ------------- | --------------------------------------------------- | ------------------------------------- | ------------------------------------------------------ | ------ |
| 布局原语      | `container` / `section-padding` / `container-large` | demo 内零散使用                       | `packages/ui` 增加 `Container` / `Section` / `Eyebrow` | P0     |
| 营销区块      | 20+ blocks                                          | 无                                    | 新建 `packages/blocks`                                 | P0     |
| 页面模板      | 14+ 页面                                            | 7 个组件展示页                        | 新建 `apps/site` 或 `packages/templates`               | P0     |
| Header/Footer | 浮动胶囊 + 全屏移动菜单 + 黑底 Footer               | 只有后台 `NavSidebar`                 | 新建 `SiteHeader` / `SiteFooter`，与后台导航分离       | P0     |
| 404/错误边界  | 独立 404 页                                         | 路由兜底 `Navigate`                   | `packages/app-kit` + `NotFound` / `ErrorBoundary`      | P0     |
| 主题          | 防闪烁 + View Transitions                           | `ThemeProvider` 有，但无首屏脚本/过渡 | 增强现有 provider                                      | P1     |
| 动效          | Motion variants + scroll storytelling               | 有 `lib/motion`，缺声明式 variants    | 增加 `Reveal` / `Stagger` / `ScrollQuote`              | P1     |
| 内容层        | MDX Blog/Careers                                    | docs 手写 TSX                         | `packages/content` + MDX                               | P1     |
| SEO           | Metadata/OG/Twitter                                 | 无                                    | `packages/seo` + sitemap/robots/JSON-LD                | P1     |
| 表单闭环      | 静态演示                                            | RHF 有，无 Zod/action                 | `packages/forms` + zodResolver + action adapter        | P1     |
| 视觉装饰      | Shader/Dot/Wave/Beam                                | 无                                    | `packages/visuals`，动态 import + fallback             | P2     |
| 开发体验      | DebugBar（断点提示）                                | 无                                    | 可选 `BreakpointDebugBar`                              | P2     |
| 文档          | MDX 内容                                            | README + docs 页                      | Storybook 或 MDX docs                                  | P2     |

### 11.1 当前最该补的三件事

1. **页面/区块层**：现在只有“组件展示”，没有“可交付页面”。先把 Hero、Pricing、FAQ、Footer、Header 做出来，框架的感知会立刻不同。
2. **内容与 SEO**：营销站没有 MDX、metadata、sitemap、JSON-LD，就不能算完整模板。
3. **表单闭环**：`Form` 组件有了，但缺 schema、提交状态、错误模型和 action 适配层。

---

## 12. 建议的目标结构

保持现有 pnpm workspace，不把 `packages/ui` 绑定到 Next.js：

```text
frontend-frame/
├─ apps/
│  ├─ demo/                 # 现有组件画廊，保留
│  └─ site/                 # 新增营销站模板
├─ packages/
│  ├─ ui/                   # 基础组件 + 布局原语
│  ├─ blocks/               # 营销区块
│  ├─ templates/            # 页面模板（可选）
│  ├─ content/              # MDX 加载、frontmatter schema
│  ├─ seo/                  # metadata、JSON-LD、sitemap
│  ├─ forms/                # RHF + Zod + action
│  ├─ visuals/              # DotGrid/Wave/Beam/Shader
│  └─ app-kit/              # Providers/ErrorBoundary/NotFound
├─ content/
│  ├─ blog/
│  └─ careers/
└─ docs/
```

### 12.1 `apps/site` 用 Vite 还是 Next.js？

两条路线都可以，取决于你要的是“内部演示”还是“公开营销站”：

| 方案                                       | 优点                                       | 代价                                         | 适用                           |
| ------------------------------------------ | ------------------------------------------ | -------------------------------------------- | ------------------------------ |
| **A. 保持 Vite + React Router + 预渲染**   | 与现有技术栈一致，构建快，组件库复用成本低 | SEO/SSG 需要额外配置；MDX 生态不如 Next 成熟 | 内部站点、产品演示、文档站     |
| **B. 新增 Next.js App Router `apps/site`** | 最接近 Flux；SSG/SEO/MDX/Image 开箱即用    | 多一套构建与部署；要防止 Next 依赖渗入组件库 | 公开营销站、内容站、需要强 SEO |

**建议**：

- 如果只是丰富 `frontend-frame` 的演示能力，选 A；
- 如果目标是“可交付给业务方的营销站模板”，选 B；
- 无论选哪个，`packages/ui` / `packages/blocks` 都必须保持框架无关，通过 `linkComponent`、`imageComponent` 注入适配器。

### 12.2 关键 API 草图

```tsx
// packages/ui/src/components/section.tsx
export function Section({
	className,
	container = "default",
	...props
}: SectionProps) {
	return (
		<section
			className={cn(
				"section-padding relative",
				container === "large" && "container-large",
				container === "small" && "container-small",
				container === "none" ? "" : "container",
				className,
			)}
			{...props}
		/>
	);
}
```

```tsx
// packages/ui/src/components/reveal.tsx
export function Reveal({ children, delay = 0, once = true }: RevealProps) {
	const reduce = useReducedMotion();
	return (
		<motion.div
			initial={reduce ? "visible" : "hidden"}
			whileInView="visible"
			viewport={{ once, amount: 0.3 }}
			variants={{
				hidden: { opacity: 0, y: 30, filter: "blur(2px)" },
				visible: {
					opacity: 1,
					y: 0,
					filter: "blur(0px)",
					transition: { type: "spring", stiffness: 100, damping: 25, delay },
				},
			}}
		>
			{children}
		</motion.div>
	);
}
```

```tsx
// packages/blocks/src/hero.tsx
<Hero
	eyebrow="Now available — Flux v2.0"
	title={<>The AI CRM that closes deals while you sleep</>}
	description="..."
	actions={[
		{ label: "Start free trial", href: "/signup" },
		{ label: "Book a demo", href: "/contact", variant: "outline" },
	]}
	media={<img src="/images/hero.webp" alt="..." width={1682} height={1122} />}
	background={<ShaderBackground />}
/>
```

```tsx
// packages/seo/src/metadata.ts
export function buildMetadata(input: PageMeta): Metadata {
	return {
		title: input.title,
		description: input.description,
		alternates: { canonical: input.canonical },
		openGraph: {
			type: input.type ?? "website",
			title: input.title,
			description: input.description,
			url: input.canonical,
			images: input.image
				? [{ url: input.image, width: 1200, height: 630 }]
				: undefined,
		},
		twitter: {
			card: "summary_large_image",
			title: input.title,
			description: input.description,
		},
	};
}
```

---

## 13. 分阶段落地路线

### Phase 0：布局与应用骨架（1–2 天）

- `Container` / `Section` / `Eyebrow` / `PageHeader`；
- `Reveal` / `Stagger`；
- `SiteHeader` / `SiteFooter`；
- `NotFound` / `ErrorBoundary`；
- demo 增加一条营销页路由，验证组合方式。

验收：

- 360/768/1024/1440 无横向滚动；
- light/dark 正常；
- 键盘可完整操作；
- `prefers-reduced-motion` 下无动画。

### Phase 1：核心 blocks + 页面模板（3–5 天）

- `Hero`、`LogosMarquee`、`BentoGrid`、`FeatureShowcase`；
- `TestimonialsCarousel`、`PricingSection`、`ComparisonTable`、`FAQAccordion`；
- `CTASection`、`ContactForm`、`AuthLayout`；
- 首页、Pricing、About、Contact 四个模板。

验收：

- 所有 block 通过 props 注入内容，不写死品牌文案；
- 价格切换、FAQ、Carousel 可交互；
- 表单有 loading/success/error 三态。

### Phase 2：内容层与 SEO（3–5 天）

- MDX loader + frontmatter schema；
- Blog 列表、文章详情、Careers 列表/详情；
- `buildMetadata`、canonical、OG/Twitter、JSON-LD；
- `sitemap.xml`、`robots.txt`、404 元数据；
- 文章分页与分类过滤。

验收：

- 文章页有 Article JSON-LD；
- sitemap 包含所有静态页与文章；
- 每页有唯一 canonical；
- Lighthouse SEO ≥ 95。

### Phase 3：视觉与动效层（2–4 天）

- `DotGrid`、`WavePattern`、`BeamBorder`；
- 可选 `ShaderBackground`（动态 import + fallback）；
- View Transitions 主题切换；
- `BreakpointDebugBar`（仅开发环境）。

验收：

- Shader 不进入主 bundle；
- 首屏无 CLS；
- 移动端短视口下 sticky 段落自动降级；
- 低端设备可关闭视觉层。

### Phase 4：工程化与文档（持续）

- Playwright 视觉回归（light/dark + 移动端）；
- Storybook 或 MDX 文档站；
- block 的 API 文档与示例；
- bundle 预算与 CI 门禁。

---

## 14. 不要照抄的地方

1. **不要把 Three.js 打进组件库主包**。Flux 首页的 Three.js chunk 约 890KB，必须按需加载。
2. **不要复制模板源码、图片、文案**。Flux 是 Cruip 付费模板，只学习结构与交互模式。
3. **不要在 block 里写死路由**。用 `linkComponent` / `siteConfig` 注入，保持 React Router / Next 兼容。
4. **不要把 Next.js 的 `Image` / `Link` 渗入 `packages/ui`**。用适配器或原生元素。
5. **不要伪造表单成功**。没有后端时也要有明确的 `onSubmit` 接口和错误模型。
6. **不要忽略移动端短视口**。200vh sticky 在手机上要降级成普通段落。
7. **不要照抄它的 SEO 缺口**：无 canonical、无 sitemap、无 robots、无 JSON-LD、OG URL 过期。
8. **不要照抄它的图片策略**：大量 `<img>` 无 `srcset`；你的框架应补响应式图片/构建期优化。
9. **不要为了动效牺牲可读性**：文字逐词点亮、模糊入场、玻璃层都要有 reduced-motion 终态。
10. **不要让“营销站”污染“业务组件库”**。业务语义组件、营销 blocks、基础原语要分层。

---

## 15. 验收清单

- [ ] 每个 block 都是纯展示组件，内容通过 props 注入。
- [ ] 所有 block 支持 light/dark。
- [ ] 所有 block 在 360 / 768 / 1024 / 1440 下可用。
- [ ] 所有动效尊重 `prefers-reduced-motion`。
- [ ] 标题层级正确，每页一个 H1。
- [ ] 图标按钮有 `aria-label`，表单错误关联 `FormMessage`。
- [ ] 图片有 `width` / `height`，首屏图 eager + 高优先级。
- [ ] `packages/ui` / `packages/blocks` 不依赖 Next.js。
- [ ] 每页有唯一 title/description/canonical。
- [ ] 有 sitemap、robots、JSON-LD。
- [ ] Shader/视觉层按需加载，可关闭。
- [ ] 有 bundle 预算与视觉回归。
- [ ] 404 页面不是占位文案。

---

## 附录 A：证据与限制

### A.1 可验证的产物特征

| 观察点             | 证据                                                                     |
| ------------------ | ------------------------------------------------------------------------ |
| Next.js App Router | `/_next/static/chunks/turbopack-*`、RSC payload、`x-nextjs-prerender: 1` |
| Tailwind v4        | CSS 中 `--spacing`、`--container-*`、`--color-*` 等 v4 变量              |
| shadcn/Radix       | `data-slot="button                                                       | card | navigation-menu | carousel | accordion | switch | badge"`、`data-radix-collection-item` |
| Motion             | `motion.div`、`whileInView`、`useReducedMotion`、spring 参数             |
| Three.js           | 约 890KB chunk、`WebGLRenderer`、`ShaderMaterial`、`FluxShader`          |
| 字体               | 38 条 `@font-face`，`DM Sans` + `Inter`                                  |
| 主题               | `next-themes` 内联脚本、`localStorage("theme")`、`::view-transition-*`   |
| 内容               | Blog/Careers 详情页、`prose` 排版、MDX 模板说明                          |

### A.2 页面与状态检查

- 首页、About、Pricing、Contact、Blog、Careers、Signin、Signup、Forgot password、Privacy、Terms、404 均可访问；
- `/sitemap.xml`、`/robots.txt`、`/manifest.webmanifest` 返回 404；
- `/blog?page=2` 仍返回同样的 10 篇文章，分页链接指向 `#`；
- 登录/注册/联系表单没有真实后端，属于前端演示；
- 404 页面正文是 Lorem ipsum 占位文案。

### A.3 限制

- 模板源码未公开，以上结构是从线上 HTML/CSS/JS 产物推断；
- 部分组件命名（如 `FluxShader`、`FluxDotGrid`、`FluxWavePattern`）可从 chunk 直接读到，文件路径与目录结构为合理推断；
- 没有 source map，无法确认精确的 props 类型与内部实现；
- 付费模板的代码/资源不可复制，本文只沉淀可迁移的工程模式。

### A.4 与现有文档的关系

- 本文聚焦 Flux 的**视觉、动效、内容与页面区块**；
- `docs/learn-from-mainline-nextjs-template.md` 更偏**应用骨架、Action、SEO、MDX、工程化**；
- 两篇可以合并为下一阶段 `frontend-frame` 0.2.0 的输入：
  - 用 mainline 的“应用层”思路定边界；
  - 用 Flux 的“blocks + 动效 + 视觉层”做体验。
