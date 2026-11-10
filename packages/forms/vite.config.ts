import { fileURLToPath, URL } from "node:url";

import { createLibConfig } from "@frontend-frame/build-config";
import { defineConfig } from "vite";

export default defineConfig(
	createLibConfig({
		entry: {
			index: fileURLToPath(new URL("src/index.ts", import.meta.url)),
			"create-action": fileURLToPath(
				new URL("src/create-action.ts", import.meta.url),
			),
			"use-action": fileURLToPath(
				new URL("src/use-action.ts", import.meta.url),
			),
			"apply-field-errors": fileURLToPath(
				new URL("src/apply-field-errors.ts", import.meta.url),
			),
			"create-fetch-action": fileURLToPath(
				new URL("src/create-fetch-action.ts", import.meta.url),
			),
		},
		external: ["react-hook-form", "zod"],
		fileName: (_format, entryName) => `${entryName}.js`,
	}),
);
