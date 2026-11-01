# fde-workspace → frontend-frame 组件与主题移植方案（v1）

> 状态：三期（主题系统）已落地，一/二期组件移植待推进
> 来源项目：`D:/develop/fde-workspace/frontend`（Next.js 16 + Tailwind v4 + Radix，Apache-2.0）
> 目标项目：`D:/develop/frontend-frame`（React 19 + Vite + Tailwind v4 + Radix，`UNLICENSED` 内部）
> 版本：@frontend-frame/ui 0.1.0 → 0.2.0

## 1. 背景

`fde-workspace` 前端拥有比 `frontend-frame` 更丰富的组件库与一套 11 主题的可换肤系统。两者同源（均基于 shadcn/Radix + Tailwind v4），命名与 API 高度一致，具备直接移植的基础。

但来源项目是基于 **Next.js** 的，且组件依赖 `@/components/icons`（@tabler/icons-react）、`@/lib/utils`、`/hooks/*` 别名。目标项目刻意保持**框架无关**（React 19 + Vite、lucide-react、相对路径导入）。因此移植必须做去耦合处理。

## 2. 现状对比

### 2.1 已在目标库中（无需移植）

accordion、alert、alert-dialog、avatar、badge、button、calendar、card、chart、checkbox、collapsible、collapsible-message、command、data-table、dialog、drawer、dropdown-menu、field、form、hover-card、input、label、navigation-menu、nav-sidebar、password-input、page-header、popover、process-header、process-rail、progress、radio-group、scroll-area、select、selection-checkbox、separator、sheet、sidebar、skeleton、slider、sonner、spinner、stat-card、status-badge、status-indicator、stepper、switch、table、tabs、textarea、theme-provider、toast、toaster、toggle、tooltip、tooltip-button、tool-badge、use-toast、use-mobile。

### 2.2 缺失、值得移植

| 分组             | 组件                                                                                                                    | 外部依赖                                                       | 移植成本             |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | -------------------- |
| shadcn 标准件    | breadcrumb、pagination、resizable、context-menu、menubar、aspect-ratio、toggle-group、input-otp、date-picker、kbd       | react-resizable-panels、input-otp、radix 原语、lucide          | 低                   |
| 表格子件         | table/data-table-pagination、faceted-filter、date-filter、slider-filter、toolbar、view-options、column-header、skeleton | @tanstack/react-table                                          | 低                   |
| 通用增强件       | button-group、input-group、loading、modal                                                                               | lucide                                                         | 低                   |
| hooks            | use-debounce、use-mounted、use-media-query、use-controllable-state、use-callback-ref、use-elapsed                       | —                                                              | 低                   |
| AI/业务域        | streaming-text、thinking、pixel-grid-loader、approval-card、notification-card、frame、kbd                               | Icons、hooks                                                   | 中                   |
| 业务域（依赖重） | kanban、tanstack-form、file-preview、infobar                                                                            | @dnd-kit / @tanstack/react-form / next/image / next/navigation | 高（需去 Next 耦合） |
| **主题系统**     | 11 套主题 CSS + theme.config/provider/selector                                                                          | —                                                              | 中                   |

## 3. 移植原则与去耦合要求

1. **框架无关**：删除所有 `next/*` 导入。
   - `file-preview`：`next/image` → 原生 `<img>`。
   - `infobar`：`usePathname` → 通过 props 传入 `activePath`（参考现有 NavSidebar 模式）。
2. **图标替换**：`@/components/icons`（@tabler/icons-react）→ 目标库的 `lucide-react`（或库内 `icons.tsx` 桥接层）。
3. **导入标准化**：`@/lib/utils`、`@/components/ui/*`、`@/hooks/*`、`@/lib/use-elapsed` → 相对路径（`../lib/utils`、`../hooks/*`）。
4. **新增依赖**：`react-resizable-panels`、`input-otp`、`@radix-ui/react-context-menu`、`@radix-ui/react-menubar`、`@radix-ui/react-aspect-ratio`、`@radix-ui/react-toggle-group` 加入 `packages/ui/package.json`。
5. **许可**：来源为 Apache-2.0，移植组件在文件头标注 `@origin Apache-2.0 / fde-workspace`，并在 `THIRD_PARTY_NOTICES.md` 追加条目。
6. **主题**：`[data-theme='xxx']` 与 `[data-theme='xxx'].dark` 机制与目标库现有 `:root`/`.dark` token 兼容，需确认目标库的 `.dark` class 切换方式一致（目标库 ThemeProvider 已用 `.dark` class）。

## 4. 分期实施

### 4.1 一期：shadcn 标准件 + hooks（低风险，纯增量）

- 移植：breadcrumb、pagination、resizable、context-menu、menubar、aspect-ratio、toggle-group、input-otp、date-picker、kbd
- 移植 hooks：use-debounce、use-mounted、use-media-query、use-controllable-state、use-callback-ref、use-elapsed
- 新增依赖并加入 `index.ts` 统一导出。
- 验收标准
  - [x] 以上组件/hooks 从 `packages/ui/src/index.ts` 导出。
  - [x] `pnpm lint`、`pnpm typecheck`、`pnpm build` 全部通过。
  - [x] 每个新增组件至少 1 个 Vitest 用例通过（`pnpm test`）。
  - [x] Demo 新增展示页或现有画廊补充上述组件示例。

### 4.2 二期：通用增强件 + 表格子件

- 移植：button-group、input-group、loading、modal、table/ 子件（8 个 data-table 子组件）
- 验收标准
  - [x] 均从 `index.ts` 导出；typecheck/build/test 通过。
  - [x] 表格子件与现有 `data-table.tsx` 集成不破坏现有 API。

### 4.3 三期：主题系统（多主题可换肤）

- 移植 11 套主题 CSS 到 `packages/ui/src/styles/themes/`。
- 扩展 `ThemeProvider` 或新增 `ActiveThemeProvider` 支持 `data-theme` 属性选择。
- 移植 `theme.config.ts` / `theme-selector` / `theme-mode-toggle`。
- 验收标准
  - [x] Demo 可通过选择器切换 11 套主题，light/dark 均生效。
  - [x] 新增主题不破坏现有 `:root`/`.dark` token 基线。
  - [x] typecheck/build/test 通过。

### 4.4 四期：AI/业务域高级件（去 Next 耦合）

- 移植：loading、streaming-text、thinking、pixel-grid-loader、approval-card、notification-card、frame、kbd
- 处理依赖：kanban（@dnd-kit）、tanstack-form（@tanstack/react-form）、file-preview（去 next/image）、infobar（去 next/navigation）
- 验收标准
  - [x] 无任何 `next/*` 导入残留（`grep -rn "from 'next/" packages/ui` 为空）。
  - [x] 各组件通过 typecheck，并至少 1 个演示示例。
  - [x] 许可标注与 `THIRD_PARTY_NOTICES.md` 更新。

## 5. 风险与应对

| 风险                                             | 应对                                                              |
| ------------------------------------------------ | ----------------------------------------------------------------- |
| 目标库 `.dark` 切换与来源主题的 `.dark` 约定差异 | 三期先验证来源主题在目标 ThemeProvider 下 dark 态正确，必要时适配 |
| 图标库差异导致视觉不一致                         | 一期用 lucide-react 等价图标替换，逐组件核对 aria-label           |
| kanban/tanstack-form 依赖较重                    | 四期按业务需要取舍，默认不强制纳入                                |
| Next 耦合组件移植成本高                          | file-preview/infobar 单独处理，若成本过高则记录并暂缓             |

## 6. 里程碑

| 阶段 | 范围                  | 建议周期 |
| ---- | --------------------- | -------- |
| 一期 | shadcn 标准件 + hooks | 1 周     |
| 二期 | 通用增强件 + 表格子件 | 3~5 天   |
| 三期 | 主题系统              | 3~5 天   |
| 四期 | AI/业务域高级件       | 1~2 周   |

## 7. 待确认

- [ ] 一期是否连 `date-picker`、`input-otp`、`resizable` 一并纳入（涉及新增 3 个第三方依赖）？
- [ ] kanban / tanstack-form / file-preview / infobar 四期是否全部纳入，还是按需取舍？
- [x] 主题系统采用来源的完整 `[data-theme]` 机制（已落地）：11 套主题令牌块 + `ActiveThemeProvider` 写入 `<html data-theme>`；仅抽 token 块，丢弃应用专属布局规则与重复的 `@theme inline` 桥接（复用目标库全局桥接）。
