import { fileURLToPath, URL } from "node:url";

import { createLibConfig } from "@frontend-frame/build-config";
import { defineConfig } from "vite";

export default defineConfig(
	createLibConfig({
		entry: fileURLToPath(new URL("src/index.ts", import.meta.url)),
		external: [
			"@tanstack/react-table",
			"class-variance-authority",
			"clsx",
			"cmdk",
			"date-fns",
			"lucide-react",
			"motion",
			"motion/react",
			"react-day-picker",
			"react-hook-form",
			"recharts",
			"sonner",
			"tailwind-merge",
		],
	}),
);
