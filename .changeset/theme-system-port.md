---
"@frontend-frame/ui": minor
---

主题系统：从 fde-workspace（Apache-2.0）移植 11 套多主题令牌（astro-vista / claude / glass / light-green / mono / neobrutualism / notebook / supabase / vercel / whatsapp / zen）。

- 新增 `ActiveThemeProvider` / `useActiveTheme` / `THEMES`：通过 `<html data-theme>` 切换 11 套主题，与 `ThemeProvider` 的明暗 `.dark` 类互补。
- 新增 `ThemeSelector`：内置主题选择下拉。
- 主题令牌抽离为 `styles/themes/*.css`，复用现有全局 `@theme inline` 桥接，不重复定义工具类。
