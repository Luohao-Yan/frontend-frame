import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";

const rootDir = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
	build: {
		lib: {
			entry: fileURLToPath(new URL("src/index.ts", import.meta.url)),
			formats: ["es"],
			fileName: "index",
		},
		rollupOptions: {
			onwarn(warning, warn) {
				if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
					return;
				}
				warn(warning);
			},
			external: [
				"react",
				"react-dom",
				"react/jsx-runtime",
				/^@radix-ui\//,
				"@tanstack/react-table",
				"class-variance-authority",
				"clsx",
				"cmdk",
				"date-fns",
				"lucide-react",
				"motion/react",
				"react-day-picker",
				"react-hook-form",
				"recharts",
				"sonner",
				"tailwind-merge",
			],
		},
		sourcemap: false,
	},
	plugins: [
		{
			name: "strip-use-client",
			enforce: "pre",
			transform(code) {
				if (code.startsWith('"use client";')) {
					return { code: code.replace(/^"use client";\s*/, ""), map: null };
				}
				if (code.startsWith("'use client';")) {
					return { code: code.replace(/^'use client';\s*/, ""), map: null };
				}
				return null;
			},
		},
		{
			name: "preserve-use-client",
			generateBundle(_options, bundle) {
				for (const output of Object.values(bundle)) {
					if (output.type === "chunk") {
						output.code = `"use client";\n${output.code}`;
					}
				}
			},
		},
	],
});
