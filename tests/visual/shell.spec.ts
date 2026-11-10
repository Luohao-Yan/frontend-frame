import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
	await page.addInitScript(() => {
		window.localStorage.setItem("frontend-frame-theme", "light");
		window.localStorage.setItem("frontend-frame-active-theme", "glass");
		window.localStorage.setItem("frontend-frame-shell-variant", "sidebar");
		window.localStorage.setItem(
			"frontend-frame-header-variant",
			"floating-pill",
		);
		window.localStorage.setItem("frontend-frame-nav-collapsed", "false");
	});
	await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
});

test("shell switches between sidebar and topbar without document overflow", async ({
	page,
}, testInfo) => {
	test.skip(
		!["light-desktop", "light-mobile"].includes(testInfo.project.name),
		"Shell layout is verified once per desktop/mobile breakpoint.",
	);

	await page.goto("/", { waitUntil: "networkidle" });
	await page.waitForTimeout(400);

	const metrics = await page.evaluate(() => {
		const main = document.querySelector<HTMLElement>(
			'[data-slot="app-shell-main"]',
		);
		return {
			documentScrollHeight: document.documentElement.scrollHeight,
			viewportHeight: window.innerHeight,
			mainClientHeight: main?.clientHeight ?? 0,
			mainScrollHeight: main?.scrollHeight ?? 0,
		};
	});

	expect(metrics.documentScrollHeight).toBeLessThanOrEqual(
		metrics.viewportHeight + 1,
	);
	expect(metrics.mainScrollHeight).toBeGreaterThan(metrics.mainClientHeight);

	await page.getByTestId("layout-menu-trigger").click();
	await expect(page.getByTestId("shell-variant-sidebar")).toBeVisible();
	await page.getByTestId("shell-variant-topbar").click();
	await page.waitForTimeout(500);

	await expect(page.locator("header.fixed")).toBeVisible();
	await expect(page).toHaveURL(/shell=topbar/);

	const topbarMetrics = await page.evaluate(() => ({
		documentScrollWidth: document.documentElement.scrollWidth,
		viewportWidth: window.innerWidth,
		documentScrollHeight: document.documentElement.scrollHeight,
		viewportHeight: window.innerHeight,
	}));

	expect(topbarMetrics.documentScrollWidth).toBeLessThanOrEqual(
		topbarMetrics.viewportWidth,
	);
	expect(topbarMetrics.documentScrollHeight).toBeLessThanOrEqual(
		topbarMetrics.viewportHeight + 1,
	);

	await page.locator('[data-slot="app-shell-main"]').evaluate((main) => {
		main.scrollTop = 600;
	});
	await page.waitForTimeout(350);
	await expect(page.locator("header.fixed")).toHaveAttribute(
		"data-scrolled",
		"true",
	);
	await expect(page.locator("header.fixed")).toHaveAttribute(
		"data-hidden",
		"true",
	);

	await page.locator('[data-slot="app-shell-main"]').evaluate((main) => {
		main.scrollTop = 500;
	});
	await page.waitForTimeout(350);
	await expect(page.locator("header.fixed")).not.toHaveAttribute(
		"data-hidden",
		"true",
	);

	await page.locator('[data-slot="app-shell-main"]').evaluate((main) => {
		main.scrollTop = 0;
	});
	await page.waitForTimeout(350);
	await expect(page.locator("header.fixed")).not.toHaveAttribute(
		"data-hidden",
		"true",
	);

	if (testInfo.project.name === "light-desktop") {
		await page.getByTestId("layout-menu-trigger").click();
		await page.getByTestId("header-variant-minimal").click();
		await expect(page).toHaveURL(/header=minimal/);
		await expect(page.locator("header.fixed")).toBeVisible();
	}

	if (testInfo.project.name === "light-mobile") {
		await page.getByRole("button", { name: "打开菜单" }).click();
		const dialog = page.getByRole("dialog");
		await expect(dialog).toBeVisible();
		await dialog.getByTestId("layout-menu-trigger").click();
		await page.getByTestId("shell-variant-sidebar").click();
	} else {
		await page.getByTestId("layout-menu-trigger").click();
		await page.getByTestId("shell-variant-sidebar").click();
	}

	await page.waitForTimeout(400);
	await expect(page.locator("header.fixed")).toHaveCount(0);
	await expect(page).toHaveURL(/shell=sidebar/);
});
