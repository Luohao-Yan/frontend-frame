# @frontend-frame/product-ui

Data-driven product UI mockups for marketing pages, demos, and product storytelling.

## Included

- `PipelineForecast` — pipeline trend chart with range switch, grid, area/line path, and tooltip.
- `ContactEnrichment` — contact profile with progressive field reveal and AI-enriched state.
- `WorkflowAutomation` — trigger / condition / action canvas with animated connectors.
- `FeatureFrame` — framed surface for screenshots or live mockups.
- Primitive set: `MiniCard`, `MiniHeader`, `MiniBadge`, `MiniAvatar`, `MiniRow`, `MiniSegmented`, `MiniSkeleton`, `MiniDotGrid`, `MiniWavePattern`, `ProductMockupCard`.

## Tailwind

The package ships Tailwind classes, not CSS. Consumers must scan its source:

```css
@source "../../packages/product-ui/src/**/*.{ts,tsx}";
```

## Usage

```tsx
import {
	PipelineForecast,
	ProductMockupCard,
} from "@frontend-frame/product-ui";

<ProductMockupCard
	eyebrow="Analytics"
	title="AI Sales Dashboard"
	description="Pipeline health at a glance."
>
	<PipelineForecast
		data={[
			{ label: "Apr", value: 40 },
			{ label: "May", value: 52 },
			{ label: "Jun", value: 96, accent: true },
		]}
		total="$204,820"
		delta="▲ 84% vs Aug"
		yAxisFormatter={(value) => `$${Math.round(value)}K`}
	/>
</ProductMockupCard>;
```

Direct subpath imports are available for smaller bundles:

```ts
import { PipelineForecast } from "@frontend-frame/product-ui/pipeline-forecast";
import { ContactEnrichment } from "@frontend-frame/product-ui/contact-enrichment";
import { WorkflowAutomation } from "@frontend-frame/product-ui/workflow-automation";
```

## Behavior

- All content is injected through props; no baked-in customer data.
- Colors come from semantic tokens (`--chart-*`, `--background`, `--foreground`, `--muted`, `--border`).
- Motion respects `prefers-reduced-motion`; pass `animated={false}` for static rendering/tests.
- Empty data renders an explicit empty state instead of a broken chart.
- Mockups are non-interactive; only `MiniSegmented` exposes buttons.
- Decorative SVGs are `aria-hidden`; informative surfaces expose `role="img"` / `role="group"` with labels.

## Scripts

```bash
pnpm --filter @frontend-frame/product-ui typecheck
pnpm --filter @frontend-frame/product-ui build
```

## Visual regression

The repository-level Playwright suite covers the three flagship mockups:

```bash
pnpm test:visual         # compare against committed baselines
pnpm test:visual:update  # regenerate baselines after an intentional visual change
```

The matrix is 3 mockups × light/dark × 360/768/1024/1440. Snapshots live in
`tests/visual/product-ui.spec.ts-snapshots/`, and the suite also runs an axe
audit on the desktop light project.
