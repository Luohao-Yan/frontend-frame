import { fileURLToPath, URL } from "node:url";

import { createLibConfig } from "@frontend-frame/build-config";
import { defineConfig } from "vite";

export default defineConfig(
	createLibConfig({
		entry: {
			index: fileURLToPath(new URL("src/index.ts", import.meta.url)),
			"adapters/ui-adapters": fileURLToPath(
				new URL("src/adapters/ui-adapters.tsx", import.meta.url),
			),
			"shell/index": fileURLToPath(
				new URL("src/shell/index.ts", import.meta.url),
			),
		},
		external: ["@frontend-frame/ui"],
		fileName: (_format, entryName) => `${entryName}.js`,
	}),
);
