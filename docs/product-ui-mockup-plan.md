# Flux 最关键的 UI：产品模拟层拆解与落地方案

> 结论：Flux 最关键的 UI 不是导航栏、页脚或价格卡，而是嵌在营销页里的“产品 UI 模拟层”——Pipeline 图表、Contact 资料卡、Workflow 自动化画布。它们让营销页看起来像真实产品，而不是一堆文案和截图。
> 依据：`docs/learn-from-flux-nextjs-template.md` + 线上 HTML/CSS/JS 产物。
> 日期：2026-11-10
> 状态：专项开发 plan，可作为 `docs/pluggable-variants-plan.md` 的内容层补充。

> 实现状态（2026-11-10）：Phase A–D 已落地。`packages/product-ui` 已包含三个旗舰 mockup、原语、Vitest 测试；demo 新增 `/product-ui`；Playwright 视觉矩阵覆盖 3 mockup × light/dark × 360/768/1024/1440，并包含 axe 可访问性检查。

---

## 1. 为什么这是最关键的 UI

SaaS 营销页的转化逻辑是：**先让用户相信产品真的能工作，再让用户读功能文案**。

Flux 的做法不是“写四段功能描述”，而是每一段都配一个“产品画面”：

- Hero 放一张完整的 CRM Dashboard 大图；
- Bento 卡片里放三个实时 SVG 微界面；
- Feature Showcase 放四张产品截图；
- About 放团队/人物卡；
- Testimonials 放真人头像与证言卡。

其中最有价值的是 Bento 里的三个 **live SVG 微界面**：

| 卡片       | 展示的产品 UI                     | 作用                     |
| ---------- | --------------------------------- | ------------------------ |
| Analytics  | Pipeline Forecast 图表            | 证明“AI 能看懂 pipeline” |
| Enrichment | Contact 资料卡 + AI 补全字段      | 证明“联系人会自动丰富”   |
| Workflows  | Trigger → Condition → Action 画布 | 证明“自动化真的能跑”     |

这三张卡承担了 **功能解释 + 视觉可信度 + 动效展示** 三个职责，是 Flux 页面里信息密度最高、最值得学的 UI。

当前 `frontend-frame` 的 demo 更偏“组件陈列”：有真实表格、表单、图表组件，但缺少这种“用一个微型产品界面讲一个功能故事”的 mockup 层。

---

## 2. Flux 实际做了什么（可验证证据）

### 2.1 Hero

- 主视觉是 `/images/hero.webp`，尺寸 `1682 × 1122`；
- 外层有圆角、深阴影、底部渐隐；
- 背景是 Three.js Shader + 点阵 + 渐变遮罩；
- Hero 图本身是静态图片，不是实时 DOM。

结论：Flux 的 Hero 用“高保真截图”建立第一印象；真正展示交互细节的是下面的 Bento 卡片。

### 2.2 Analytics 卡片

从 HTML/SVG 可读到：

- 卡片 `lg:col-span-4`，内边距 `p-8`；
- 图表容器 `aspect-[16/9]`，SVG `viewBox="20 22 360 202"`；
- 标题：`Pipeline Forecast`，副标题：`Last 12 months`；
- 右上角分段控件：`7D` / `30D` / `12M`，当前项高亮；
- 横向虚线网格 + 底部实线；
- 柱状图 + 面积折线 + 渐变描边；
- 关键数据气泡：`$204,820`、`▲ 84% vs Aug`；
- 颜色全部来自 `--chart-1..3`；
- 动画：柱子 `d` morph、折线 `pathLength 0→1`、圆点 `offsetDistance 0→100%`、气泡延迟出现。

### 2.3 Contact 卡片

- 桌面 `lg:aspect-[8/9]`，移动 `aspect-[318/108]`；
- 桌面 SVG `viewBox="22 32 156 175"`，移动 SVG `viewBox="22 32 318 108"`；
- 头像用 `<image>` + `<clipPath>` 裁圆；
- 姓名 `Maya Chen`，职位 `VP Sales · Basepoint`；
- 右上角 `AI` 小徽标；
- 字段行：Email / Phone / Company / Industry / Headcount / Region；
- 默认字段是骨架条，随后逐行显现；
- `Industry` 被 AI 补全为 `Software (B2B)`，带高亮边框/底色；
- 动画：头像/姓名先出现，字段逐行延迟 `0.09s`，AI 徽标约 `1.4s` 后弹出。

### 2.4 Workflow 卡片

- `aspect-[3/1]`，SVG `viewBox="0 0 600 200"`；
- 节点尺寸 `104 × 28`，圆角 `rx=3`；
- 节点结构：图标 + 标题 + 类型标签；
- 节点类型：`TRIGGER` / `CONDITION` / `ACTION`；
- 实际节点：
  - `New deal created`（Trigger）
  - `AI deal score`（Condition）
  - `Notify in Slack`（Action）
  - `Add to sequence`（Action）
  - `Assign to AE`（Action）
- 连接线为虚线 `stroke-dasharray="1 3"`；
- 主路径用渐变描边 + `pathLength 0→1` 绘制；
- 一个小圆点沿路径 `offsetDistance 0→100%` 移动；
- 节点按 `stagger 0.12s` 依次进入；
- 约 `3.25s` 时最后一个节点出现脉冲高亮。

### 2.5 其他产品 UI

- Feature Showcase：`/images/features-showcase/1.webp` ~ `4.webp`，四张产品截图；
- About：团队网格、人物头像、证言卡；
- Testimonials：方形人物图 + 大引号 + 姓名/职位；
- Pricing：价格卡 + 功能对比表；
- Footer：黑底 + 巨型品牌字 + 波浪纹理。

---

## 3. 组件化拆解

不要直接复制 Flux 的 SVG。把它拆成可复用的“产品模拟层”组件族：

```text
packages/product-ui/
├─ primitives/
│  ├─ mini-card.tsx             # 微型产品卡外壳
│  ├─ mini-header.tsx           # 标题 + 副标题 + 操作
│  ├─ mini-segmented.tsx        # 7D/30D/12M 分段控件
│  ├─ mini-badge.tsx            # AI / New / Beta 徽标
│  ├─ mini-avatar.tsx           # 头像 + 状态点
│  ├─ mini-row.tsx              # 字段行 / 列表行
│  ├─ mini-skeleton.tsx         # 骨架条
│  ├─ mini-chart.tsx            # 柱状/面积/折线
│  ├─ mini-node.tsx             # Workflow 节点
│  └─ mini-connector.tsx        # 虚线/光束连接线
├─ mockups/
│  ├─ pipeline-forecast.tsx
│  ├─ contact-enrichment.tsx
│  ├─ workflow-automation.tsx
│  ├─ feature-frame.tsx
│  └─ dashboard-preview.tsx
├─ types.ts
└─ index.ts
```

### 3.1 数据契约

所有 mockup 必须是数据驱动的，不能把文案写死在组件里：

```ts
export interface PipelinePoint {
	label: string;
	value: number;
	accent?: boolean;
}

export interface PipelineForecastProps {
	title?: string;
	subtitle?: string;
	ranges?: Array<"7D" | "30D" | "12M">;
	activeRange?: "7D" | "30D" | "12M";
	onRangeChange?: (range: "7D" | "30D" | "12M") => void;
	data: PipelinePoint[];
	total: string;
	delta: string;
	className?: string;
}

export interface ContactField {
	label: string;
	value?: string;
	enriched?: boolean;
}

export interface ContactEnrichmentProps {
	person: {
		name: string;
		role: string;
		company: string;
		avatar?: string;
	};
	fields: ContactField[];
	aiLabel?: string;
	className?: string;
}

export interface WorkflowNode {
	id: string;
	type: "trigger" | "condition" | "action";
	title: string;
	icon?: React.ReactNode;
}

export interface WorkflowAutomationProps {
	nodes: WorkflowNode[];
	edges: Array<{ from: string; to: string; accent?: boolean }>;
	className?: string;
}
```

### 3.2 三个旗舰 Mockup

#### `PipelineForecast`

结构：

```text
MiniCard
├─ MiniHeader: title / subtitle / MiniSegmented
├─ MiniChart
│  ├─ grid lines
│  ├─ bars
│  ├─ area path
│  ├─ line path
│  ├─ moving dot
│  └─ tooltip bubble
└─ axis labels
```

要求：

- 颜色只消费 `--chart-*` 与 `currentColor`；
- 支持 `data` 驱动，不写死 12 个月；
- 支持 `accent` 点高亮；
- 支持 `prefers-reduced-motion` 直接显示终态；
- 移动端保持 `aspect-[16/9]`，不横向溢出。

#### `ContactEnrichment`

结构：

```text
MiniCard
├─ 头像 + 姓名 + 职位/公司 + AI Badge
├─ Divider
└─ 字段列表
   ├─ Label
   ├─ Value / Skeleton
   └─ Enriched 高亮
```

要求：

- 桌面纵向布局（`aspect-[8/9]`），移动横向两列（`aspect-[318/108]`）；
- 字段可以缺失，缺失时显示骨架条；
- `enriched` 字段有边框/底色/图标，不只靠颜色表达；
- 头像失败时有 fallback（首字母/渐变块）。

#### `WorkflowAutomation`

结构：

```text
MiniCard
└─ Workflow Canvas
   ├─ Connectors（虚线 + 光束）
   ├─ Nodes（Trigger / Condition / Action）
   └─ Moving Dot
```

要求：

- 节点位置由布局算法或 `edges` 推导，不能硬编码每个像素；
- 支持 3–7 个节点，超出时横向滚动或缩放；
- 节点进入用 stagger，连接线用 `pathLength`，移动点用 `offsetDistance`；
- 节点标题过长时截断，不撑破卡片；
- 所有节点不可聚焦，仅作装饰/说明。

### 3.3 `FeatureFrame`

用于包装产品截图：

```text
FeatureFrame
├─ 顶部浏览器/窗口栏（可选）
├─ 截图/实时 mockup
├─ 底部渐隐
└─ 阴影/圆角
```

要求：

- 支持 `image`、`mockup`、`children` 三种内容；
- 支持 `chrome="browser" | "app" | "none"`；
- 图片必须有宽高，避免 CLS；
- 圆角/阴影只消费 token。

---

## 4. 视觉规范

### 4.1 卡片

| 项       | 值                                                  |
| -------- | --------------------------------------------------- |
| 圆角     | `rounded-xl`（12px）                                |
| 边框     | `ring-1 ring-foreground/10`                         |
| 内边距   | `p-8`（32px）                                       |
| 顶部高光 | 1px 渐变线：`chart-1/40 → chart-2/20 → transparent` |
| 背景纹理 | 点阵/波浪，`inset-4`，`opacity 0.05`，hover `0.09`  |
| Hover    | `border-foreground/15` + `shadow-md`                |
| 内容顺序 | 图表/插画在上，Eyebrow/标题/描述在下                |

### 4.2 字体层级（微型 UI 内）

| 元素       | 字号          | 字重          |
| ---------- | ------------- | ------------- |
| 卡片标题   | 16px          | 600           |
| 卡片描述   | 14px          | 400           |
| 图表标题   | 9px（SVG）    | 600           |
| 图表副标题 | 6px（SVG）    | 400           |
| 轴标签     | 5.5px（SVG）  | 400/600       |
| 数据气泡   | 6.5px / 5.5px | 700 / 600     |
| 字段 Label | 7px（SVG）    | 500           |
| 节点标题   | 7.5px（SVG）  | 600           |
| 节点类型   | 5.5px（SVG）  | 600，字距 0.6 |

> 这些是 SVG viewBox 内的相对字号；在 React 实现中可改为 `text-[9px]` 等真实 CSS 字号，按容器缩放。

### 4.3 颜色

- 图表主色：`--chart-1`
- 图表辅色：`--chart-2` / `--chart-3`
- 高亮底：`--chart-5` + 低透明度
- 网格/轴线：`currentColor` + `opacity 0.05–0.12`
- 文本：`currentColor` + `opacity 0.35–0.88`
- 禁止写死 hex；主题切换后必须自动跟随。

---

## 5. 动效规范

### 5.1 时间线

| 阶段 | 时间       | 内容                                              |
| ---- | ---------- | ------------------------------------------------- |
| 0    | 0ms        | 卡片进入视口，`opacity 0→1`、`y 28→0`、`blur 3→0` |
| 1    | 100ms      | 标题/副标题出现                                   |
| 2    | 150–600ms  | 字段/节点逐个 stagger，间隔 `0.09–0.12s`          |
| 3    | 500–1300ms | 图表折线/柱状图生长                               |
| 4    | 700–3300ms | Workflow 光束沿路径移动                           |
| 5    | 1400ms     | AI 补全字段/徽标弹出                              |
| 6    | 3250ms     | 最后一个节点脉冲高亮                              |

### 5.2 预设

| 动效           | 参数                                                  |
| -------------- | ----------------------------------------------------- |
| 卡片入场       | spring `stiffness 90 / damping 20 / mass 1`           |
| 子元素 stagger | `staggerChildren 0.12`，`delayChildren 0.1`           |
| 图表折线       | `pathLength 0→1`，`1.3s`，ease-out                    |
| 柱状图         | `d` morph，`0.7s`，逐柱延迟 `0.05s`                   |
| 移动点         | `offsetDistance 0%→100%`，与折线同长                  |
| Workflow 光束  | `pathLength 0→1`，`2.6s`                              |
| 节点脉冲       | `opacity [0,0.5,0]`，`scale [0.98,1.04,1.08]`，`0.9s` |

### 5.3 降级

- `prefers-reduced-motion: reduce`：直接显示终态，不播放 stagger/路径动画；
- 卡片在 JS 失败时也必须可见；
- 动效不能阻塞阅读，不能自动循环播放；
- 同一视口内多个 mockup 不要同时播放复杂动画，必要时用 `whileInView` 控制。

---

## 6. 可访问性

Flux 的 SVG 微界面大多 `aria-hidden="true"`，这是合理的装饰处理，但会丢失信息。我们的 mockup 要分两类：

| 类型                        | 处理                                                   |
| --------------------------- | ------------------------------------------------------ |
| 纯装饰（重复文案已说明）    | `aria-hidden="true"`，不进入可访问性树                 |
| 承载信息（图表数据/字段值） | `role="img"` + `aria-label`，或提供 `sr-only` 文本摘要 |

要求：

- mockup 内部不出现可聚焦元素；
- 不用颜色作为唯一状态表达（AI 补全字段要有文字/图标）；
- 文本对比度满足 WCAG AA；
- 图表提供 `aria-label`，例如 “Pipeline forecast: $204,820, up 84% vs August”；
- 动画不强制，用户可用 `prefers-reduced-motion` 关闭。

---

## 7. 与现有框架的接入

### 7.1 包边界

新增 `packages/product-ui`，不要塞进 `packages/ui`：

- `packages/ui` 继续做通用控件；
- `packages/product-ui` 做“产品故事型” mockup；
- `packages/blocks` 负责把 mockup 放进 Hero/Bento/Feature；
- `apps/demo` 负责展示与变体切换。

### 7.2 Slot 设计

在 `packages/pluggable-variants` 的 Slot 体系里新增：

```ts
export type ProductMockupVariant =
	"pipeline" | "contact" | "workflow" | "dashboard" | "feature-frame";

export interface ProductMockupProps {
	variant: ProductMockupVariant;
	data: unknown; // 由具体 mockup 的类型收窄
	className?: string;
}
```

`BentoGrid` 的 item 增加：

```ts
{
  id: "analytics",
  eyebrow: "Analytics",
  title: "AI Sales Dashboard",
  description: "...",
  mockup: {
    variant: "pipeline",
    data: { ... },
  },
  className: "lg:col-span-4",
}
```

### 7.3 Demo 接入

- `/variants` 页面增加 “Product Mockup” 分组；
- 可切换 `pipeline` / `contact` / `workflow`；
- 可切换 `motion` 预设；
- 可切换 light/dark 与 11 套主题；
- 可复制 `ProductMockup` 的配置。

---

## 8. 分阶段任务

### Phase A：基础原语（2 天）

1. 新建 `packages/product-ui`。
2. 实现 `MiniCard`、`MiniHeader`、`MiniSegmented`、`MiniBadge`、`MiniAvatar`、`MiniRow`、`MiniSkeleton`。
3. 定义 `types.ts`，补单元测试。

验收：

- 原语只消费语义 token；
- 不依赖具体业务数据；
- light/dark/11 套主题下颜色正确；
- 每个原语有 Vitest 渲染测试。

### Phase B：三个旗舰 Mockup（3–4 天）

1. `PipelineForecast`：图表 + 分段控件 + 数据气泡。
2. `ContactEnrichment`：头像 + 字段 + AI 补全高亮 + 双布局。
3. `WorkflowAutomation`：节点 + 连接线 + 光束 + 脉冲。
4. 每个 mockup 提供 `default` / `compact` 两种尺寸。

验收：

- 数据完全由 props 注入；
- 移动/桌面布局切换正确；
- 动效时间线与本文一致；
- `prefers-reduced-motion` 下直接显示终态；
- light/dark/360/768/1024/1440 截图通过。

### Phase C：接入 Blocks 与 Playground（2–3 天）

1. `BentoGrid` 支持 `mockup` item。
2. `Hero` 支持 `media` 为 `ProductMockup` 或图片。
3. `FeatureShowcase` 支持 `FeatureFrame`。
4. `/variants` 增加 mockup 选择器与实时预览。

验收：

- 不改 block 调用方代码即可替换 mockup；
- mockup 不溢出卡片；
- 卡片 hover/入场/主题切换一致；
- Playground 可复制配置。

### Phase D：质量与文档（2 天）

1. Playwright 视觉矩阵：3 个 mockup × light/dark × 4 断点。
2. 可访问性检查：`role="img"` / `aria-label` / 对比度。
3. 文档：API、数据契约、动效时间线、最佳实践。
4. changeset + 版本发布。

验收：

- 视觉回归无未审核 diff；
- axe 无 critical/serious；
- 文档代码片段可运行；
- `pnpm lint/typecheck/test/build` 全绿。

---

## 9. 验收标准

### 9.1 数据与内容

- [ ] 所有 mockup 通过 props 注入数据，不写死业务文案。
- [ ] 支持空数据/缺失字段/超长文本。
- [ ] 不伪造真实客户数据；示例数据明确标注为 demo。

### 9.2 视觉

- [ ] 卡片圆角、边框、内边距、顶部高光与规范一致。
- [ ] 图表颜色来自 `--chart-*`，不写死 hex。
- [ ] light/dark/11 套主题下可读。
- [ ] 360 / 768 / 1024 / 1440 无溢出。
- [ ] 文字层级与微型 UI 字号规范一致。

### 9.3 动效

- [ ] 卡片入场 spring `90/20`。
- [ ] 子元素 stagger `0.12s`。
- [ ] 图表折线 `pathLength` 1.3s。
- [ ] Workflow 光束 2.6s。
- [ ] AI 补全约 1.4s 出现。
- [ ] `prefers-reduced-motion` 下无动画、内容可见。
- [ ] 首帧可见，JS 失败不消失。

### 9.4 可访问性

- [ ] 纯装饰 mockup `aria-hidden`。
- [ ] 信息型 mockup `role="img"` + `aria-label` 或 `sr-only` 摘要。
- [ ] 内部无可聚焦元素。
- [ ] AI 补全状态不只靠颜色。
- [ ] 对比度 AA。

### 9.5 工程

- [ ] `packages/product-ui` 不依赖 React Router / Next.js。
- [ ] 不引入 Three.js；纯 SVG/CSS。
- [ ] 单 mockup 可 tree-shake。
- [ ] Vitest 覆盖原语与三个 mockup。
- [ ] Playwright 覆盖 3 × 2 × 4 视觉矩阵。
- [ ] `pnpm lint/typecheck/test/build` 全绿。

---

## 10. 不要照抄的地方

1. **不要复制 Flux 的 SVG 路径、图片、文案**。Flux 是付费模板，只学习结构与比例。
2. **不要把 mockup 做成不可维护的巨型 SVG**。拆成原语 + 数据驱动组件。
3. **不要只做静态图**。至少让图表、字段、节点有可配置的动效。
4. **不要为了炫技引入 Three.js**。这层 UI 用 SVG/CSS 足够。
5. **不要伪造真实数据**。示例数据要标注 demo，避免误导。
6. **不要忽略移动端**。Contact 卡需要双布局，Workflow 需要缩放/滚动。
7. **不要把 mockup 做成可交互表单**。它是“产品故事”，不是真实业务界面。

---

## 11. 与现有计划的关系

| 文档                                      | 负责范围                                             |
| ----------------------------------------- | ---------------------------------------------------- |
| `docs/learn-from-flux-nextjs-template.md` | Flux 整体页面、block、动效、SEO 调研                 |
| `docs/pluggable-variants-plan.md`         | Slot/Variant/Registry，解决“导航/动效可替换”         |
| `docs/product-ui-mockup-plan.md`          | 本文，解决“产品 UI 模拟层”这一最关键的内容 UI        |
| `docs/app-layer-development-plan.md`      | 应用层总计划（app-kit / blocks / forms / templates） |

建议排期顺序：

```text
pluggable-variants Phase 0–1（导航壳）
  → product-ui Phase A–B（三个旗舰 mockup）
    → product-ui Phase C（接入 Bento/Hero/Playground）
      → pluggable-variants Phase 2–3（动效/主题扩展）
```

这样用户先能换“壳”，再能换“产品画面”，最后再统一动效与主题。
