import { expect, test } from "@playwright/test";

type Theme = "light" | "dark";

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
	await page.goto("/variants", { waitUntil: "networkidle" });
	await page.waitForTimeout(500);
	await page.evaluate(() => document.fonts.ready);
});

test("floating pill uses pill-shaped inner controls", async ({
	page,
}, testInfo) => {
	test.skip(
		!["light-desktop", "light-mobile"].includes(testInfo.project.name) &&
			!["dark-desktop", "dark-mobile"].includes(testInfo.project.name),
		"Floating pill is verified at desktop and mobile breakpoints.",
	);

	const pill = page
		.locator("header")
		.filter({ hasText: "Frontend Frame" })
		.first();

	await expect(pill).toBeVisible();

	const logoRadius = await pill
		.locator('a[aria-label$="首页"] span.bg-primary')
		.first()
		.evaluate((logo) => Number.parseFloat(getComputedStyle(logo).borderRadius));
	expect(logoRadius).toBeGreaterThanOrEqual(999);

	const radii = await pill.evaluate((header) =>
		Array.from(header.querySelectorAll<HTMLElement>("[data-slot=button]")).map(
			(button) => Number.parseFloat(getComputedStyle(button).borderRadius),
		),
	);

	expect(radii.length).toBeGreaterThan(0);
	expect(radii.every((radius) => radius >= 999)).toBe(true);

	await expect(pill).toHaveScreenshot("floating-pill.png", {
		animations: "disabled",
		caret: "hide",
	});
});
