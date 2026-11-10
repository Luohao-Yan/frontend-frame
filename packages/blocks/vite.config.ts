import { fileURLToPath, URL } from "node:url";

import { createLibConfig } from "@frontend-frame/build-config";
import { defineConfig } from "vite";

export default defineConfig(
	createLibConfig({
		entry: {
			index: fileURLToPath(new URL("src/index.ts", import.meta.url)),
			catalog: fileURLToPath(new URL("src/catalog.ts", import.meta.url)),
			"header/floating-pill": fileURLToPath(
				new URL("src/header/floating-pill.tsx", import.meta.url),
			),
			"header/minimal": fileURLToPath(
				new URL("src/header/minimal.tsx", import.meta.url),
			),
			"header/mega-menu": fileURLToPath(
				new URL("src/header/mega-menu.tsx", import.meta.url),
			),
			"hero/centered": fileURLToPath(
				new URL("src/hero/centered.tsx", import.meta.url),
			),
			"hero/split": fileURLToPath(
				new URL("src/hero/split.tsx", import.meta.url),
			),
			"hero/bento": fileURLToPath(
				new URL("src/hero/bento.tsx", import.meta.url),
			),
			"footer/dark-mega": fileURLToPath(
				new URL("src/footer/dark-mega.tsx", import.meta.url),
			),
			"footer/minimal": fileURLToPath(
				new URL("src/footer/minimal.tsx", import.meta.url),
			),
			"pricing/cards": fileURLToPath(
				new URL("src/pricing/cards.tsx", import.meta.url),
			),
			"pricing/comparison": fileURLToPath(
				new URL("src/pricing/comparison.tsx", import.meta.url),
			),
		},
		external: ["@frontend-frame/app-kit", "@frontend-frame/ui", "lucide-react"],
		fileName: (_format, entryName) => `${entryName}.js`,
	}),
);
