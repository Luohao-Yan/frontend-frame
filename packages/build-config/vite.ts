import type { LibraryOptions, Plugin, UserConfig } from "vite";

const DEFAULT_EXTERNAL: Array<string | RegExp> = [
	"react",
	"react-dom",
	"react/jsx-runtime",
	"react/jsx-dev-runtime",
	/^@radix-ui\//,
];

export interface LibConfigOptions {
	entry: string | Record<string, string>;
	external?: Array<string | RegExp>;
	fileName?: LibraryOptions["fileName"];
	outDir?: string;
}

function stripUseClient(): Plugin {
	return {
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
	};
}

function preserveUseClient(): Plugin {
	return {
		name: "preserve-use-client",
		generateBundle(_options, bundle) {
			for (const output of Object.values(bundle)) {
				if (output.type === "chunk") {
					output.code = `"use client";\n${output.code}`;
				}
			}
		},
	};
}

export function createLibConfig({
	entry,
	external = [],
	fileName = "index",
	outDir = "dist",
}: LibConfigOptions): UserConfig {
	return {
		build: {
			outDir,
			lib: {
				entry,
				formats: ["es"],
				fileName,
			},
			rollupOptions: {
				external: [...DEFAULT_EXTERNAL, ...external],
				onwarn(warning, warn) {
					if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
						return;
					}
					warn(warning);
				},
			},
			sourcemap: false,
		},
		plugins: [stripUseClient(), preserveUseClient()],
	};
}
