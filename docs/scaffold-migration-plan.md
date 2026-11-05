# Scaffold-Master 学习成果落地计划（Vue3 → React 重写）

> 来源：`D:\develop\scaffold-master\scaffold-vue`（珍珠玻璃设计系统 + 动效唯一入口）
> 目标：`D:\develop\frontend-frame`（React 19 + Radix + Tailwind v4 + motion v12）
> 原则：**翻译方法论，不照抄代码**；所有动效/令牌/组件落到可复用资产，页面只消费。

## 技术决策

- 动效层沿用现有 `motion`（framer-motion v12），**不新增 GSAP 依赖**。
  - `animate()` 已覆盖 timeline（sequence）、backOut 过冲缓动、`complete/cancel` 控制、多元素阵列动画；
  - 保持仓库现有依赖面与代码风格统一；GSAP 版本可后续按需替换，API 已收敛在 `lib/motion.ts` 唯一入口。
- 迷你仪器组件（Odometer / TickRing / DeltaPill 等）不依赖图表库，与现有 Recharts 共存。

## 里程碑 1 · 动效底座（唯一入口 `lib/motion.ts`）

新增 `packages/ui/src/lib/motion.ts`，移植 scaffold `composables/motion.ts` 的全部能力：

| 能力                                                                   | 说明                                                          | 对应语态 |
| ---------------------------------------------------------------------- | ------------------------------------------------------------- | -------- |
| `EASE` / `DUR`                                                         | 缓动字典（reveal/glide/exit/swap/settle）+ 时长字典，全站共用 | -        |
| `prefersReducedMotion` / `motionSkipped`                               | 尊重系统「减少动态」；页面在后台直接给终态                    | 停摆     |
| `installPressFeedback` / `installHoverLift` / `installRipple`          | 事件委托，新控件命中选择器即获得同一手感                      | 放       |
| `pageEnter` / `pageLeave`                                              | 页面进场/离场：`.reveal` 按阅读序、`.bento` 从中心展开        | 放/停摆  |
| `revealCascade` / `revealRows` / `settlePop`                           | 面板级联浮现、列表行进场、状态确认弹入                        | 结       |
| `drawPath`                                                             | 折线描绘                                                      | 导       |
| `slideThumb` / `trackGlow` / `originAtPointer`                         | 滑块几何换算、指针光、共享元素来处                            | 放       |
| `overlayEnter` / `overlayLeave` / `morphGhost` / `floatBarEnter/Leave` | 弹窗/抽屉/浮条过渡                                            | 放/停摆  |
| `spring` / `springOf` / `bezierAt`                                     | 物理底座（纯函数）                                            | 导       |
| `createFrameLoop`                                                      | 常驻帧循环：隐藏/离屏停帧、dt 限幅、单帧异常不中断            | 导       |
| `typeOut`                                                              | 打字机（返回取消函数）                                        | 结       |
| `firstTimeInSession`                                                   | 开场本会话只播一次                                            | -        |
| `flipLayout`                                                           | FLIP 布局变形（React 版手写 FLIP，替换 GSAP Flip）            | 结       |

配套 React hooks `packages/ui/src/hooks/use-motion.ts`：

- `useMotionEffects()`：顶层调用一次，安装按压/悬停/涟漪委托 + 后台快进兜底；
- `usePageEnter({ key })`：挂到页面根节点，`key` 传入时本会话只播一次；
- `useRevealCascade(ref)`：面板内容级联浮现。

新增 CSS（`packages/ui/src/styles.css`）：`.ripple-clip/.ripple-dot/.morph-ghost` 三类运行时生成的动效元素样式。

### 里程碑 1 验收标准

- [x] `lib/motion.ts` 在 `tsc --noEmit` 严格模式下无类型错误，无新增依赖；
- [x] `motionSkipped()` 在 `prefers-reduced-motion: reduce` 或 `document.hidden` 时为真，组件直进终态；
- [x] `installPressFeedback/installHoverLift/installRipple` 幂等：重复调用只注册一次监听；
- [x] `createFrameLoop`：页面隐藏或元素离屏时停帧；`dt` 限制在 1/30 内；单帧抛错只警告一次不中断循环；
- [x] `spring` 收敛到 target（k=62 时约 0.5s 落定）；`bezierAt` 端点与线性性正确；
- [x] `firstTimeInSession` 同 key 第二次调用返回 false；
- [x] vitest 单测覆盖上述纯函数与幂等性；
- [x] `pnpm --filter @frontend-frame/ui typecheck`、`pnpm test` 通过。

## 里程碑 2 · 珍珠玻璃主题 + 迷你仪器组件

新增主题 `packages/ui/src/styles/themes/pearl-glass.css`：

- 浅/深两态全套 shadcn 令牌（background/foreground/card/popover/primary/…/sidebar/*）；
- 仪器化扩展令牌：`--ink/--ink-muted/--ink-soft/--ink-faint`、`--lime/--lime-text/--red-text`、
  `--plate-bg/--plate-ink/--plate-soft`、`--hatch-ink`、`--tick/--tick-strong`、`--cat-1~5(-bg/-ink)`、
  `--fs-display-xl/l/m`、`--track-eyebrow`、`--e1/e2/e3`、`--line/--line-strong`、材质面（rail/pill/float/surface/groove）；
- 注册进 `active-theme.tsx` 的 `THEMES`（Pearl Glass），`styles.css` 引入。

新增 7 个组件（`packages/ui/src/components/`，全部 export）：

| 组件           | 移植自                | 要点                                                           |
| -------------- | --------------------- | -------------------------------------------------------------- |
| `Odometer`     | `ui/Odometer.vue`     | 逐位滚动，只滚变化的位；位次按右往左 key；后台标签页定时器兜底 |
| `DeltaPill`    | `ui/DeltaPill.vue`    | 上升/下降/持平/新增四态；`fresh` 显示「新增」不显示误导百分比  |
| `Metric`       | `ui/Metric.vue`       | 等宽大数字 + 上标单位，size xl/l/m/s 四档                      |
| `SectionLabel` | `ui/SectionLabel.vue` | 中文区块标题（h2/h3）                                          |
| `Ruler`        | `ui/Ruler.vue`        | 刻度尺 + 当前位置亮刻度                                        |
| `SpecPlate`    | `ui/SpecPlate.vue`    | 深色玻璃规格铭牌（只读）                                       |
| `TickRing`     | `charts/TickRing.vue` | 60 根刻度逐根点亮 + 末端 back.out 过冲 + 中心 Odometer         |

### 里程碑 2 验收标准

- [x] Pearl Glass 出现在主题选择器中，浅/深两态下背景、卡片、主色、字体、阴影全部走令牌；
- [x] `Odometer`：千分位/小数格式正确；位数变化时个位十位不错位；`null/NaN` 显示 `—`；reduced-motion 下直接终值；
- [x] `DeltaPill`：`fresh` → 「新增」；正 → `+12.5%`；负 → `−4%`（U+2212）；0 → `±0%`；
- [x] `TickRing`：渲染 60 根刻度；点亮数 = `round(pct*60)`；中心读数随 `value`；cap 点存在；
- [x] `Metric/SectionLabel/Ruler/SpecPlate` 语义化渲染（label/aria 正确）；
- [x] 新组件在浅色、深色、reduced-motion 下均可读可交互；
- [x] vitest 单测覆盖 DeltaPill 四态、Odometer 格式、TickRing 结构；
- [x] `pnpm -r typecheck`、`pnpm test`、`pnpm build` 通过。

## 里程碑 3 · Dashboard 升级（演示页）

改造 `apps/demo/src/pages/dashboard.tsx`（保持现有内容，做加法）：

- 页面根节点挂 `usePageEnter({ key: "dashboard" })`，开场编排：标题/提示条 `reveal` 按阅读序、卡片组 `bento` 从中心展开；
- 新增「珍珠玻璃仪器」区块：`Metric`（Odometer 滚动读数）+ `TickRing`（成功率）+ `DeltaPill`（环比，含「新增」态）+ `Ruler`（容量区间）+ `SpecPlate`（规格铭牌）+ `SectionLabel` 小标题；
- `useRevealCascade` 驱动仪器区级联浮现；点击/滚轮可快进（默认入场不阻塞交互）。

### 里程碑 3 验收标准

- [x] 会话首次进入 Dashboard 有开场编排，刷新后同会话不再重播；
- [x] `prefers-reduced-motion` 或后台时直接呈现终态，无半路动画；
- [x] 仪器区在浅/深主题下可读，读数为等宽数字；
- [x] `pnpm --filter @frontend-frame/demo build` 通过，页面无控制台报错。

## 执行顺序

1. 里程碑 1（动效底座）→ 2. 里程碑 2（主题 + 组件）→ 3. 里程碑 3（Dashboard）→ 4. 全量 `format` / `lint` / `typecheck` / `test` / `build`。

## 落地记录（2026-11-05）

**已完成全部三个里程碑**，验证结果：

- 里程碑 1：`packages/ui/src/lib/motion.ts`（959 行，唯一入口）+ `packages/ui/src/hooks/use-motion.ts`；
  `installPressFeedback/installHoverLift/installRipple` 幂等、`visibilitychange` 后台快进、`createFrameLoop` 离屏停帧；
  动效层沿用 `motion` v12（零新增依赖），组件统一从 `lib/motion` 取 `animate`。
- 里程碑 2：新增主题 `pearl-glass`（浅/深两态全套令牌 + 仪器化扩展令牌，已注册进主题选择器）；
  新增 7 个组件 `Odometer / DeltaPill / Metric / SectionLabel / Ruler / SpecPlate / TickRing` 并全部导出；
  组件样式沉淀在 `packages/ui/src/styles.css`（含 `.ripple-clip/.ripple-dot/.morph-ghost`）。
- 里程碑 3：`apps/demo/src/pages/dashboard.tsx` 增加开场编排（`usePageEnter({ key: "dashboard" })`，
  `.reveal` 阅读序 + `.bento` 中心展开）、`useRevealCascade` 仪器区级联浮现、
  「珍珠玻璃仪器」区块（Metric 滚动读数 + TickRing + DeltaPill 新增态 + Ruler + SpecPlate）；
  `app-shell.tsx` 顶层调用 `useMotionEffects()` 全局反馈。

验证命令（全部通过）：

```bash
pnpm -r typecheck   # 0 error
pnpm lint           # 0 error（--max-warnings 0）
pnpm test           # 9 files / 61 tests passed
pnpm build          # ui + demo 构建成功
```
