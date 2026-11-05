"use client";

import * as React from "react";

/**
 * 多主题选择 Provider（11 套主题，来自 fde-workspace，见 styles/themes/*.css）。
 *
 * 与 ThemeProvider（light/dark/system 明暗切换，作用于 `.dark` class）互补：
 * - ActiveThemeProvider 负责把 `data-theme="glass"` 等属性写到 <html> 上，
 *   驱动 `[data-theme='glass']` / `[data-theme='glass'].dark` 令牌块。
 * - 明暗 `.dark` class 仍由 ThemeProvider 切换，两者可叠加使用。
 *
 * @origin Apache-2.0 / fde-workspace（src/components/themes/active-theme.tsx）
 */

export const DEFAULT_THEME = "glass";

export const THEMES = [
	{ name: "Glass", value: "glass" },
	{ name: "Pearl Glass", value: "pearl-glass" },
	{ name: "Claude", value: "claude" },
	{ name: "Neobrutualism", value: "neobrutualism" },
	{ name: "Supabase", value: "supabase" },
	{ name: "Vercel", value: "vercel" },
	{ name: "Mono", value: "mono" },
	{ name: "Notebook", value: "notebook" },
	{ name: "Light Green", value: "light-green" },
	{ name: "Zen", value: "zen" },
	{ name: "Astro Vista", value: "astro-vista" },
	{ name: "WhatsApp", value: "whatsapp" },
] as const;

export type ActiveTheme = (typeof THEMES)[number]["value"];

const STORAGE_KEY = "frontend-frame-active-theme";
const ATTRIBUTE = "data-theme";

interface ActiveThemeContextValue {
	activeTheme: string;
	setActiveTheme: (theme: string) => void;
}

const ActiveThemeContext = React.createContext<ActiveThemeContextValue | null>(
	null,
);

function getStoredTheme(): string {
	if (typeof window === "undefined") {
		return DEFAULT_THEME;
	}
	const current = document.documentElement.getAttribute(ATTRIBUTE);
	if (current) {
		return current;
	}
	const stored = window.localStorage.getItem(STORAGE_KEY);
	return stored ?? DEFAULT_THEME;
}

function isValidTheme(theme: string): boolean {
	return THEMES.some((t) => t.value === theme);
}

export function ActiveThemeProvider({
	children,
	initialTheme,
}: {
	children: React.ReactNode;
	initialTheme?: string;
}) {
	const [activeTheme, setActiveThemeState] = React.useState<string>(() =>
		isValidTheme(initialTheme ?? "") ? initialTheme! : getStoredTheme(),
	);

	React.useEffect(() => {
		const root = document.documentElement;
		if (root.getAttribute(ATTRIBUTE) !== activeTheme) {
			root.setAttribute(ATTRIBUTE, activeTheme);
			window.localStorage.setItem(STORAGE_KEY, activeTheme);
		}
	}, [activeTheme]);

	const value = React.useMemo<ActiveThemeContextValue>(
		() => ({
			activeTheme,
			setActiveTheme: (next: string) => {
				if (isValidTheme(next)) {
					setActiveThemeState(next);
				}
			},
		}),
		[activeTheme],
	);

	return <ActiveThemeContext value={value}>{children}</ActiveThemeContext>;
}

export function useActiveTheme() {
	const context = React.use(ActiveThemeContext);
	if (!context) {
		throw new Error(
			"useActiveTheme must be used within an ActiveThemeProvider",
		);
	}
	return context;
}
