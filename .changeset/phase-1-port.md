---
"@frontend-frame/ui": minor
---

一期移植：从 fde-workspace（Apache-2.0）移植 shadcn 标准件与 hooks。

- 新组件：breadcrumb, context-menu, date-picker, input-otp, kbd, menubar,
  pagination, resizable, toggle-group, aspect-ratio。
- 新 hooks：use-debounce, use-mounted, use-media-query, use-controllable-state,
  use-callback-ref, use-debounced-callback, use-elapsed。
- 新增依赖：react-resizable-panels（^2.1.9，保持标准 API）、input-otp、
  @radix-ui/react-context-menu、@radix-ui/react-menubar、
  @radix-ui/react-aspect-ratio、@radix-ui/react-toggle-group。
- 全部自 `index.ts` 导出；补充 Vitest 用例与 Demo 示例。
