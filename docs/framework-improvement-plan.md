# frontend-frame 框架改进方案（v1）

> 状态：草案，待评审
> 作者：前端框架维护组
> 版本：0.1.0 → 目标 0.2.0

## 1. 背景与目标

### 1.1 现状

`frontend-frame` 是一个 **pnpm workspace 单仓**，包含公共组件库 `@frontend-frame/ui`（65 个组件）与演示应用 `apps/demo`。当前 `typecheck` 与 `build` 均通过，组件覆盖面较广。

### 1.2 问题清单

经评审，框架当前更像"组件库 + 演示站"，而非可对外复用的"框架"。核心问题按严重程度排序：

| 编号 | 问题                     | 严重度 | 说明                                                                       |
| ---- | ------------------------ | ------ | -------------------------------------------------------------------------- |
| P1   | 无任何自动化测试         | 🔴 高  | `*.test.*` / `*.spec.*` 文件数量为 0，无 Vitest/Playwright                 |
| P2   | 无 ESLint，仅有 Prettier | 🔴 高  | 只有格式化，无规则检查，也无 lint 脚本                                     |
| P3   | 许可合规风险             | 🔴 高  | 组件派生自 AGPLv3(llmgateway) / Apache-2.0(Morphic)，仓库标注 `UNLICENSED` |
| P4   | 无 CI                    | 🟠 中  | 无 lint / typecheck / test / build 流水线                                  |
| P5   | 无版本发布与管理         | 🟠 中  | 无 changelog、无 changesets / release 流程                                 |
| P6   | 组件目录分层不清         | 🟡 低  | `primitives / composites / domain` 三类组件混在平级目录                    |
| P7   | 组件重叠边界模糊         | 🟡 低  | `sidebar` 与 `nav-sidebar` 职责未界定                                      |
| P8   | 高频组件缺失             | 🟡 低  | 缺 Pagination、Breadcrumb、Combobox、Resizable、TreeView 等                |
| P9   | 文档形态单一             | 🟡 低  | 仅 README 清单，无 Storybook/文档站，API 无单一事实来源                    |
| P10  | 演示站入口体积偏大       | 🟡 低  | gzip ~293KB，未验证库产物的 tree-shaking 效果                              |

### 1.3 目标

本方案分三期落地，使框架达到"可被多个业务项目安全复用"的标准：

- **一期（工程基建）**：治理 P1~P5，筑牢质量与合规底线。
- **二期（结构治理）**：治理 P6~P7，明确组件分层与职责。
- **三期（能力补齐）**：治理 P8~P10，补齐高频组件与文档体系。

---

## 2. 总体方案设计

### 2.1 技术选型

| 领域             | 选型                                                                                                         | 替代考量                           |
| ---------------- | ------------------------------------------------------------------------------------------------------------ | ---------------------------------- |
| 单元/交互测试    | **Vitest** + **@testing-library/react** + **jsdom**                                                          | 与 Vite 同栈，配置零摩擦，社区标准 |
| 组件交互测试补充 | **@testing-library/user-event**                                                                              | 模拟真实用户交互                   |
| E2E / 视觉回归   | **Playwright**（一期只做 smoke，三期扩展视觉回归）                                                           | 覆盖 light/dark 与移动端断点       |
| 代码规范         | **ESLint 9 flat config** + `typescript-eslint` + `eslint-plugin-react-hooks` + `eslint-plugin-react-refresh` | 与 Vite 生态标准对齐               |
| 提交检查         | **husky + lint-staged**                                                                                      | 提交前自动 lint / format           |
| CI               | **GitHub Actions**（mise 托管 pnpm）                                                                         | 或 Jenkins，二者任选其一           |
| 版本管理         | **changesets**                                                                                               | 生态主流，原子化 changelog + 版本  |
| 文档站           | 二期/三期引入 **Storybook 8**                                                                                | 组件 API 单一事实来源              |

### 2.2 工作区依赖规划

```text
frontend-frame/
├─ docs/                          # 设计文档（本方案）
├─ .github/workflows/ci.yml       # CI 流水线（一期）
├─ .eslint.config.js              # 根级 flat config（一期）
├─ .prettierrc.json               # 已有
├─ vitest.config.ts               # 根级测试配置（一期）
├─ husky/                         # pre-commit / pre-push hooks（一期）
├─ .changeset/                    # changesets 配置（一期）
├─ playwright.config.ts           # E2E 配置（一期 smoke）
├─ apps/
│  └─ demo/
│     ├─ src/
│     │  └─ __tests__/            # 关键页面 smoke 测试（一期）
└─ packages/ui/
   ├─ src/
   │  ├─ primitives/              # 基础控件（二期重构）
   │  ├─ composites/              # 复合组件
   │  ├─ domain/                  # 业务语义组件
   │  └─ __tests__/               # 组件测试（一期）
   └─ src/components/{新组件}      # 三期新增
```

### 2.3 目录分层规则（二期统一）

| 层级          | 定义                                                                     | 约束                                    |
| ------------- | ------------------------------------------------------------------------ | --------------------------------------- |
| `primitives/` | 单一职责的基础控件：Button、Input、Select、Dialog…                       | 不引用其它层组件、不包含领域逻辑        |
| `composites/` | 由多个原语组合而成：DataTable、Chart、Form、Stepper                      | 只依赖 `primitives/` 与第三方           |
| `domain/`     | 业务语义组件：ProcessRail、SourceFavicons、ToolBadge、CollapsibleMessage | 通过 `composites/` 间接复用，或独立实现 |

该分层与 README「开发约定 5」呼应，落地为目录与 `index.ts` 分组导出。

---

## 3. 分期实施明细

### 3.1 一期：工程基建（P1~P5）

#### 3.1.1 测试体系（P1）

- 根级安装 `vitest`、`@testing-library/react`、`@testing-library/user-event`、`@testing-library/jest-dom`、`jsdom`。
- 新增 `vitest.config.ts`，`environment: "jsdom"`，`setupFiles` 引入 `jest-dom`。
- 组件测试范围（优先高风险/交互类）：
  - `Button`（点击、disabled、variant）
  - `Checkbox` / `SelectionCheckbox`（选中态、受控、aria）
  - `DataTable`（列渲染、分页、排序、选择）
  - `Form` / `Field`（校验、错误关联、提交）
  - `Dialog` / `AlertDialog`（开合、焦点、Esc 关闭）
  - `Tabs`、`Accordion`、`DropdownMenu`、`Tooltip`（交互与可访问性）
- Demo 层 smoke 测试：关键路由渲染、导航可用。
- Playwright：`apps/demo` 冒烟，覆盖 light/dark 主题切换与关键页面可达。

#### 3.1.2 ESLint + 提交流程（P2）

- 根级 `.eslint.config.js`（ESLint 9 flat config）：
  - `typescript-eslint` 推荐规则 + `no-unused-vars`（ts 版本）
  - `eslint-plugin-react-hooks`（`rules-of-hooks`、`exhaustive-deps`）
  - `eslint-plugin-react-refresh`（仅 demo 启用手热更新约定）
- 根 `package.json` 新增 `lint` 脚本，`pnpm -r lint`。
- `husky` + `lint-staged`：pre-commit 对暂存文件执行 lint+fix 与 prettier。

#### 3.1.3 许可合规（P3）

- 在根 `LICENSE` 澄清来源与义务：
  - llmgateway 派生部分标注 AGPLv3 来源与署名。
  - Morphic 派生部分标注 Apache-2.0 来源与署名。
- 为每个组件文件头部补充 `@origin` 注释（`AGPLv3 / llmgateway` 或 `Apache-2.0 / morphic`）。
- 明确内部 `UNLICENSED` 使用边界：仅限组织内使用，对外分发前需法务复核。
- 新增 `THIRD_PARTY_NOTICES.md` 汇总逐组件来源。

#### 3.1.4 CI（P4）

- `.github/workflows/ci.yml`（任选 CI 供应商，形如 GitHub Actions）：
  - job1: `lint`（eslint --max-warnings 0）
  - job2: `typecheck`（`pnpm -r typecheck`）
  - job3: `test`（`pnpm vitest run`）
  - job4: `build`（`pnpm -r build`，含 Playwright smoke 可选）
- 设 gate：**任何 job 失败即阻断合并**；lint 不允许 warning。

#### 3.1.5 版本发布（P5）

- 初始化 `changesets`，新增 `.changeset/config.json`。
- 建立发布规范：`pnpm changeset` 生成变更集 → 合并 → release action 自动 bump 版本与生成 changelog。
- 根 README 增加版本与发布说明。

### 3.2 二期：结构治理（P6~P7）

#### 3.2.1 目录分层（P6）

- 将 `packages/ui/src/components` 拆分为 `primitives/`、`composites/`、`domain/` 三个子目录。
- `index.ts` 改为按分组顺序导出，并保持对外 API 不变（不引入 breaking change）。
- 更新 README「组件清单」为分组结构。

#### 3.2.2 侧栏职责界定（P7）

- `sidebar.tsx`（shadcn）定位为**通用底层可折叠侧栏**，可被任何布局复用。
- `nav-sidebar.tsx` 定位为**业务导航侧栏**（分组折叠、搜索、移动端抽屉、路由注入）。
- 在各自文件头部与 README 写明职责边界与选用建议。

### 3.3 三期：能力补齐（P8~P10）

#### 3.3.1 高频组件补齐（P8）

优先级排序（每个均遵循"优先复用 Radix/shadcn 原语"约定）：

| 组件                    | 优先级 | 依据                                           |
| ----------------------- | ------ | ---------------------------------------------- |
| Pagination              | 高     | 列表/表格通用分页                              |
| Breadcrumb              | 高     | 页面导航必备                                   |
| Combobox（搜索选择）    | 高     | 大数据量选择的通用需求                         |
| Resizable（可拖拽分栏） | 中     | 工具/企业类布局                                |
| TreeView（树形）        | 中     | 树形菜单/目录选择，配合 `@tanstack/react-tree` |
| InputOTP                | 低     | 验证码输入，复用 `input-otp`                   |
| DateRangePicker         | 低     | 在 Calendar 基础上扩展范围选择                 |
| JsonView                | 中     | LLM/AI 域强烈建议，对接现有 domain 组件        |

#### 3.3.2 文档站（P9）

- 引入 **Storybook 8**，在 `packages/ui` 下建 stories。
- 目标：每个基础组件至少 1 个 story 覆盖主要变体与可访问性。
- Storybook 与 CI 关联（可选 job：`build-storybook`）。

#### 3.3.3 体积与按需引入（P10）

- 用 `rollup-plugin-visualizer` / 手工检查库产物，确认 tree-shaking 生效。
- README 补充"按需引入最佳实践"（如仅从具名导出引用、避免整体拉入样式导致全量打包）。
- 在 demo 上验证：单页仅引少数组件时，产物显著小于全量。

---

## 4. 验收标准（Acceptance Criteria）

> 说明：所有标准以 **可通过自动化命令/工具验证** 为准。评审通过后逐项勾选。

### 4.1 一期：工程基建

> ⚠️ 实施状态说明：二期/三期尚未启动，以下仅列一期。已落地的用 `[x]` 标注，部分完成/依赖仓库外环境的在括号内注明。

- [x] **A-1 测试体系可用**（部分完成）
  - `pnpm test`（= `vitest run`）已可执行，无环境依赖，jsdom 正常。
  - 已覆盖组件：Button、Checkbox、Badge、Alert、Dialog、Tabs（共 9 个用例，见 `packages/ui/src/components/__tests__/`）。
  - 待补（第三批）：DataTable、Form/Field、Accordion、DropdownMenu、Tooltip 的用例，以及演示站页面 jsdom smoke。
  - 全量测试通过率 100%（`Test Files 2 passed / Tests 9 passed`）。

- [x] **A-2 ESLint 接入**（已完成）
  - `pnpm lint` 可运行，`eslint . --max-warnings 0` 无 error 且无 warning。
  - 采用 ESLint 9 flat config + `typescript-eslint` + `react-hooks`(v5) + `react-refresh`。
  - 提交钩子（husky + lint-staged）已配置，对暂存文件自动执行 lint+fix 与 prettier（`.husky/pre-commit`）。

- [x] **A-3 许可合规**（已完成）
  - 根 `LICENSE` 与 `THIRD_PARTY_NOTICES.md` 已创建，逐组件标注来源与许可。
  - 组件文件头部 `@origin` 注释已抽样标注（≥3 个：Button/AGPLv3、PasswordInput·Spinner/Apache-2.0·morphic、NavSidebar/内部）。
  - "内部 UNLICENSED / 对外需法务复核"边界已写入 README 与 LICENSE。

- [x] **A-4 CI 打通**（流程文件已建，需仓库外验证）
  - `.github/workflows/ci.yml` 已包含 lint、typecheck、test、build 四个 job，任一失败即阻断。
  - ⚠️ 需推送到远端仓库后验证实际执行（本地无法联调 CI runner）。

- [x] **A-5 版本管理**（初始化完成，发布演练待跑）
  - `changesets` 已初始化，`.changeset/config.json` 存在，根 `package.json` 含 `changeset` / `version-packages` 脚本。
  - 首个变更集已完成（`.changeset/phase-1-engineering.md`）。
  - ⚠️ "变更集 → 版本与 changelog"的发布演练（`pnpm version-packages`）尚未执行。

### 4.2 二期：结构治理

- [ ] **A-6 目录分层落地**
  - `packages/ui/src` 下存在 `primitives/`、`composites/`、`domain/` 三个子目录，组件按规则归位。
  - `pnpm typecheck` 与 `pnpm build` 通过，对外导出 API 与分层前完全一致（无 breaking change）。

- [ ] **A-7 侧栏职责清晰**
  - `sidebar` 与 `nav-sidebar` 文件头部说明各自定位；README 增加二者选用指引。
  - Demo 中二者调用点符合新定位（业务导航用 `nav-sidebar`）。

### 4.3 三期：能力补齐

- [ ] **A-8 高频组件补齐**
  - 高优先级组件 Pagination、Breadcrumb、Combobox 已实现并从 `index.ts` 导出。
  - 每个新组件均有：Demo 展示页示例、类型定义、以及至少 1 个测试用例。
  - 中优先级 Resizable、TreeView、JsonView 已实现并导出一并验收。

- [ ] **A-9 文档站**
  - Storybook 可启动（`pnpm storybook`）且构建通过（`build-storybook`）。
  - 每个基础组件至少有 1 个 story，覆盖主要 variant 与关键可访问性。

- [ ] **A-10 体积与按需引入**
  - 通过构建产物分析确认组件库可 tree-shaking（具名导出按需生效）。
  - README 提供按需引入最佳实践，且 Demo 验证单页按需引入时产物显著小于全量引入。

---

## 5. 风险与应对

| 风险                                   | 应对                                                                                   |
| -------------------------------------- | -------------------------------------------------------------------------------------- |
| AGPL 派生代码的对外分发风险            | 一期先内部化并完整标注来源；对外分发前必须法务复核，必要时用 clean-room 重写受影响组件 |
| 目录重构可能引入 breaking change       | 二期保持对外导出 API 不变，用 `pnpm typecheck + build` 双向验证，配合 CI 兜底          |
| Storybook 与 Vite 7 / Tailwind v4 兼容 | 三期按官方 addon 方案接入，若遇阻塞先以轻量文档站替代并记录                            |
| Playwright 在 CI 需浏览器下载          | 使用 CI 官方缓存策略预装浏览器，避免每次构建重复下载                                   |

---

## 6. 里程碑

| 阶段 | 范围                                 | 建议周期 |
| ---- | ------------------------------------ | -------- |
| 一期 | 工程基建（测试/ESLint/许可/CI/版本） | 3~4 周   |
| 二期 | 结构治理（目录分层/侧栏职责）        | 1~2 周   |
| 三期 | 能力补齐（组件/文档站/体积）         | 2~3 周   |

---

## 7. 待确认事项

- [ ] 计划采用哪条 CI 平台与仓库策略（GitHub Actions / 内网 Jenkins）？
- [ ] `UNLICENSED` 对外分发的立场是否维持？是否先做一次法务合规初评？
- [ ] 三期文档站选 Storybook 还是轻量文档站？
- [ ] 组件补齐的三个优先级（高/中）是否本期全部纳入，还是先做高优先级三项？
