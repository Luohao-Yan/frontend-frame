import { defineConfig } from "@playwright/test";

const VIEWPORTS = [
	{ name: "mobile", width: 360, height: 900 },
	{ name: "tablet", width: 768, height: 1024 },
	{ name: "laptop", width: 1024, height: 1024 },
	{ name: "desktop", width: 1440, height: 1200 },
] as const;

const THEMES = ["light", "dark"] as const;

export default defineConfig({
	testDir: "./tests/visual",
	fullyParallel: true,
	forbidOnly: Boolean(process.env.CI),
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: process.env.CI
		? [["github"], ["html", { open: "never" }]]
		: [["list"], ["html", { open: "never" }]],
	outputDir: "test-results",
	snapshotPathTemplate:
		"{testDir}/{testFilePath}-snapshots/{arg}{-projectName}.png",
	expect: {
		toHaveScreenshot: {
			maxDiffPixelRatio: 0.03,
			threshold: 0.2,
		},
	},
	use: {
		baseURL: "http://127.0.0.1:4173",
		browserName: "chromium",
		trace: "on-first-retry",
		screenshot: "only-on-failure",
		video: "retain-on-failure",
	},
	projects: THEMES.flatMap((theme) =>
		VIEWPORTS.map((viewport) => ({
			name: `${theme}-${viewport.name}`,
			metadata: { theme },
			use: {
				viewport: { width: viewport.width, height: viewport.height },
				colorScheme: theme,
			},
		})),
	),
	webServer: {
		command:
			"pnpm --filter @frontend-frame/demo... build && pnpm --filter @frontend-frame/demo preview --host 127.0.0.1 --port 4173",
		url: "http://127.0.0.1:4173",
		reuseExistingServer: !process.env.CI,
		timeout: 120_000,
	},
});
