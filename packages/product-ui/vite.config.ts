import { fileURLToPath, URL } from "node:url";

import { createLibConfig } from "@frontend-frame/build-config";
import { defineConfig } from "vite";

export default defineConfig(
	createLibConfig({
		entry: {
			index: fileURLToPath(new URL("src/index.ts", import.meta.url)),
			"pipeline-forecast": fileURLToPath(
				new URL("src/mockups/pipeline-forecast.tsx", import.meta.url),
			),
			"contact-enrichment": fileURLToPath(
				new URL("src/mockups/contact-enrichment.tsx", import.meta.url),
			),
			"workflow-automation": fileURLToPath(
				new URL("src/mockups/workflow-automation.tsx", import.meta.url),
			),
			"feature-frame": fileURLToPath(
				new URL("src/mockups/feature-frame.tsx", import.meta.url),
			),
		},
		external: ["@frontend-frame/ui", "lucide-react", "motion", "motion/react"],
		fileName: (_format, entryName) => `${entryName}.js`,
	}),
);
