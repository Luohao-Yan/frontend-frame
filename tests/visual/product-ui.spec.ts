import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

type Theme = "light" | "dark";

const MOCKUPS = [
	{ id: "pipeline", name: "pipeline-forecast" },
	{ id: "contact", name: "contact-enrichment" },
	{ id: "workflow", name: "workflow-automation" },
] as const;

const THEME_STORAGE_KEY = "frontend-frame-theme";
const ACTIVE_THEME_STORAGE_KEY = "frontend-frame-active-theme";

test.beforeEach(async ({ page }, testInfo) => {
	const theme = testInfo.project.metadata.theme as Theme;

	await page.addInitScript(
		({ theme, themeKey, activeThemeKey }) => {
			try {
				window.localStorage.setItem(themeKey, theme);
				window.localStorage.setItem(activeThemeKey, "glass");
			} catch {
				// Storage can be unavailable in hardened browser contexts.
			}
		},
		{
			theme,
			themeKey: THEME_STORAGE_KEY,
			activeThemeKey: ACTIVE_THEME_STORAGE_KEY,
		},
	);

	await page.emulateMedia({
		colorScheme: theme,
		reducedMotion: "reduce",
	});
	await page.goto("/product-ui", { waitUntil: "networkidle" });
	await page.waitForFunction(
		({ isDark }) =>
			document.documentElement.classList.contains("dark") === isDark,
		{ isDark: theme === "dark" },
	);
	await page.waitForFunction(
		(activeTheme) =>
			document.documentElement.getAttribute("data-theme") === activeTheme,
		"glass",
	);
	await page.evaluate(() => document.fonts.ready);

	await expect(page.getByTestId("product-ui-showcase")).toBeVisible();
});

for (const mockup of MOCKUPS) {
	test(`${mockup.name} matches the visual baseline`, async ({ page }) => {
		const card = page.getByTestId(`mockup-${mockup.id}`);

		await expect(card).toBeVisible();
		await expect(card).toHaveScreenshot(`${mockup.name}.png`, {
			animations: "disabled",
			caret: "hide",
		});
	});
}

test("the three-card showcase keeps its layout", async ({ page }) => {
	await expect(page.getByTestId("product-ui-showcase")).toHaveScreenshot(
		"showcase.png",
		{
			animations: "disabled",
			caret: "hide",
		},
	);
});

test("product UI has no critical or serious accessibility violations", async ({
	page,
}, testInfo) => {
	test.skip(
		testInfo.project.name !== "light-desktop",
		"Run the accessibility audit once on the desktop light project.",
	);

	const results = await new AxeBuilder({ page })
		.include('[data-testid="product-ui-showcase"]')
		.analyze();
	const blocking = results.violations.filter((violation) =>
		["critical", "serious"].includes(violation.impact ?? ""),
	);

	expect(
		blocking,
		blocking
			.map(
				(violation) =>
					`${violation.id}: ${violation.help} (${violation.nodes.length} nodes)`,
			)
			.join("\n"),
	).toEqual([]);
});
