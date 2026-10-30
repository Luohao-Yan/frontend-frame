import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [react()],
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: ["./vitest.setup.ts"],
		include: [
			"packages/ui/src/**/*.{test,spec}.{ts,tsx}",
			"apps/demo/src/**/*.{test,spec}.{ts,tsx}",
		],
		css: false,
	},
});
