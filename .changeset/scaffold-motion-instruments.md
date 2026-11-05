---
"@frontend-frame/ui": minor
---

学习成果移植：从 scaffold-master/scaffold-vue（珍珠玻璃设计系统 + 动效唯一入口）迁移到 React。

- 动效底座 `lib/motion.ts`：EASE/DUR 字典、reduced-motion/后台直进终态、按压/悬停/涟漪事件委托（幂等）、
  页面进场/离场、面板级联、FLIP 布局、阻尼弹簧、离屏停帧帧循环、打字机等；配套 `hooks/use-motion.ts`
  （useMotionEffects / usePageEnter / useRevealCascade）。沿用 motion v12，零新增依赖。
- 新主题 `pearl-glass`：浅/深两态全套令牌 + 仪器化扩展令牌（ink 五档、plate、cat-1~5、tick、fs-display）。
- 新组件：Odometer（逐位滚动）、DeltaPill（fresh 显示「新增」）、Metric、SectionLabel、Ruler、SpecPlate、TickRing。
- Demo：Dashboard 开场编排 + 「珍珠玻璃仪器」区块；AppShell 全局反馈。
