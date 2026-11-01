# Third-Party Notices

本组件库 `@frontend-frame/ui` 由多个上游开源项目派生成，以下按来源列出组件与对应许可义务。

## 来源：llmgateway（AGPLv3）

以下组件派生自 `D:/develop/llmgateway/apps/ui/src/lib/components`，按 AGPLv3 使用。相应组件文件头部已标注 `@origin AGPLv3 / llmgateway`。

- accordion, alert, alert-dialog, avatar, badge, button, calendar, card,
  carousel, checkbox, collapsible, command, data-table, dialog, drawer,
  dropdown-menu, empty, field, form, hover-card, input, label,
  navigation-menu, number-ticker, page-header, popover, progress, radio-group,
  scroll-area, select, selection-checkbox, separator, sheet, shimmer-button,
  sidebar, skeleton, slider, sonner, stat-card, status-badge, stepper, switch,
  table, tabs, textarea, theme-provider, toast, toaster, toggle, tooltip,
  use-toast, use-mobile

## 来源：Morphic（Apache-2.0）

以下组件派生自 Morphic 的 `components/ui` 与 `components`，按 Apache-2.0 使用。相应组件文件头部已标注 `@origin Apache-2.0 / morphic`。

- carousel, collapsible-message, drawer, keyboard-shortcut-dialog,
  password-input, process-header, process-rail, source-favicons, spinner,
  status-indicator, theme-menu-items, theme-toggle, tool-badge, tooltip-button

## 来源：fde-workspace（Apache-2.0）

以下主题与组件派生自 `D:/develop/fde-workspace/frontend`（Next.js / Tailwind v4 / Radix，Apache-2.0），按 Apache-2.0 使用。相应文件头部已标注 `@origin Apache-2.0 / fde-workspace`。

- 多主题令牌：`packages/ui/src/styles/themes/*.css`（11 套：astro-vista, claude,
  glass, light-green, mono, neobrutualism, notebook, supabase, vercel,
  whatsapp, zen），抽取自 fde 的 `src/styles/themes/*.css`（仅令牌块，不含
  应用专属布局规则）
- active-theme（ActiveThemeProvider / useActiveTheme / THEMES）
- theme-selector（ThemeSelector）
- 一期组件：breadcrumb, context-menu, date-picker, input-otp, kbd, menubar,
  pagination, resizable, toggle-group, aspect-ratio
- hooks：use-debounce, use-mounted, use-media-query, use-controllable-state,
  use-callback-ref, use-debounced-callback, use-elapsed
- 二期增强件：button-group, input-group, loading（含 loading-bounce 动画）、modal
- 二期表格子件：data-table-column-header, data-table-pagination,
  data-table-skeleton, data-table-toolbar, data-table-view-options,
  data-table-faceted-filter, data-table-date-filter, data-table-slider-filter
- utils：formatDate（取自 fde `lib/format.ts`）

## 来源：llm-gateway v2（内部项目）

以下组件抽取自 llm-gateway v2 的左侧菜单，属内部派生。

- nav-sidebar

## 许可说明

- 当前仓库本项目为内部项目，标注为 `UNLICENSED`，**仅限组织内部使用**。
- **对外发布或分发前，必须经法务复核**，确认 AGPLv3 / Apache-2.0 的署名与传播义务，必要时用 clean-room 方式重写受影响组件。
- AGPLv3 派生代码若对外提供网络服务，需遵循对应开源义务，请勿在未评估前对外分发。

## LICENSES

上游许可全文请参见：

- AGPLv3: https://www.gnu.org/licenses/agpl-3.0.html
- Apache-2.0: https://www.apache.org/licenses/LICENSE-2.0
