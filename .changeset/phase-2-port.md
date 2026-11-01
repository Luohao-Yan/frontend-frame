---
"@frontend-frame/ui": minor
---

二期移植：从 fde-workspace（Apache-2.0）移植通用增强件与表格子件。

- 新组件：button-group, input-group, loading（含双方块交替弹跳动画）、modal。
- 新表格子件：data-table-column-header, data-table-pagination,
  data-table-skeleton, data-table-toolbar, data-table-view-options,
  data-table-faceted-filter, data-table-date-filter, data-table-slider-filter。
- 新增 ColumnMeta 类型增强（data-table-types）与 formatDate 工具。
- 原有 data-table.tsx 内联的 DataTableColumnHeader 已移除，统一改用移植的
  富功能版本；其余 API 保持不变。
- 全部自 `index.ts` 导出；补充 Vitest 用例与 Demo 示例。
