---
"@frontend-frame/ui": minor
---

四期移植：从 fde-workspace（Apache-2.0）移植 AI/业务域高级件（已完成去 Next 耦合）。

- 新组件：streaming-text, thinking（reasoning/search/coding/steps 四变体）、
  pixel-grid-loader, approval-card, notification-card, frame。
- Button 增加 isLoading 支持（加载转圈 + aria-busy）。
- 新增 keyframe：fade-up, fade-in, pixel-on, shimmer-text。
- 全部自 `index.ts` 导出；无任何 `next/*` 导入残留；补充 Vitest 用例与
  Demo 示例；纯 token 配色（无硬编码色值）。
