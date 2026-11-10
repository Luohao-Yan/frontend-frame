import { describe, expect, it } from "vitest";

import { getThemeScript } from "../theme-script";

describe("getThemeScript", () => {
	it("embeds the storage keys and default theme", () => {
		const script = getThemeScript({
			storageKey: "app-theme",
			activeThemeKey: "app-active-theme",
			defaultTheme: "dark",
		});

		expect(script).toContain('"storageKey":"app-theme"');
		expect(script).toContain('"activeThemeKey":"app-active-theme"');
		expect(script).toContain('"defaultTheme":"dark"');
		expect(script).toContain('classList.toggle("dark"');
	});

	it("uses the framework defaults", () => {
		const script = getThemeScript();

		expect(script).toContain("frontend-frame-theme");
		expect(script).toContain("frontend-frame-active-theme");
	});
});
