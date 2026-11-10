import { expect, test } from "@playwright/test";

type Theme = "light" | "dark";

test.use({ viewport: { width: 1600, height: 1600 } });

test.beforeEach(async ({ page }, testInfo) => {
	const theme = testInfo.project.metadata.theme as Theme;

	await page.addInitScript(
		({ theme }) => {
			window.localStorage.setItem("frontend-frame-theme", theme);
			window.localStorage.setItem("frontend-frame-active-theme", "glass");
			window.localStorage.setItem("frontend-frame-shell-variant", "sidebar");
			window.localStorage.setItem("frontend-frame-nav-collapsed", "false");
		},
		{ theme },
	);
	await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
	await page.goto("/", { waitUntil: "networkidle" });
	await page.waitForTimeout(800);
	await page.evaluate(() => document.fonts.ready);
});

test("odometer and tick ring keep their instrument layout", async ({
	page,
}, testInfo) => {
	test.skip(
		!["light-desktop", "dark-desktop"].includes(testInfo.project.name),
		"Instrument baselines are captured once per theme at desktop width.",
	);

	const odometerCard = page
		.locator('[data-slot="card"]')
		.filter({ hasText: "实时脉搏" });
	const tickRingCard = page
		.locator('[data-slot="card"]')
		.filter({ hasText: "操作成功率" });

	await expect(odometerCard).toBeVisible();
	await expect(tickRingCard).toBeVisible();
	await page.evaluate(() => {
		const main = document.querySelector<HTMLElement>(
			'[data-slot="app-shell-main"]',
		);
		if (main) {
			main.scrollTop = 0;
		}
	});
	await page.waitForTimeout(200);

	const stripMetrics = await page
		.locator(".odo-strip")
		.first()
		.evaluate((strip) => {
			const cell = strip.parentElement;
			return {
				stripHeight: strip.getBoundingClientRect().height,
				cellHeight: cell?.getBoundingClientRect().height ?? 0,
			};
		});

	expect(stripMetrics.stripHeight).toBeGreaterThan(stripMetrics.cellHeight * 5);

	await expect(odometerCard).toHaveScreenshot("odometer-card.png", {
		animations: "disabled",
		caret: "hide",
	});
	await expect(tickRingCard).toHaveScreenshot("tick-ring-card.png", {
		animations: "disabled",
		caret: "hide",
	});
});
