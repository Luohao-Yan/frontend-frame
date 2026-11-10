"use client";

import * as React from "react";

export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

interface ThemeContextValue {
	theme: Theme;
	resolvedTheme: ResolvedTheme;
	setTheme: (theme: Theme) => void;
}

export const THEME_STORAGE_KEY = "frontend-frame-theme";

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

function getSystemTheme(): ResolvedTheme {
	if (typeof window === "undefined") {
		return "light";
	}
	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

function getStoredTheme(storageKey: string, defaultTheme: Theme): Theme {
	if (typeof window === "undefined") {
		return defaultTheme;
	}
	const stored = window.localStorage.getItem(storageKey);
	return stored === "light" || stored === "dark" || stored === "system"
		? stored
		: defaultTheme;
}

export interface ThemeProviderProps {
	children: React.ReactNode;
	storageKey?: string;
	defaultTheme?: Theme;
	disableTransitionOnChange?: boolean;
}

export function ThemeProvider({
	children,
	storageKey = THEME_STORAGE_KEY,
	defaultTheme = "system",
	disableTransitionOnChange = false,
}: ThemeProviderProps) {
	const [theme, setThemeState] = React.useState<Theme>(() =>
		getStoredTheme(storageKey, defaultTheme),
	);
	const [systemTheme, setSystemTheme] =
		React.useState<ResolvedTheme>(getSystemTheme);

	const resolvedTheme = theme === "system" ? systemTheme : theme;

	React.useEffect(() => {
		const media = window.matchMedia("(prefers-color-scheme: dark)");
		const handleChange = () => setSystemTheme(getSystemTheme());
		media.addEventListener("change", handleChange);
		return () => media.removeEventListener("change", handleChange);
	}, []);

	React.useEffect(() => {
		const root = document.documentElement;
		if (disableTransitionOnChange) {
			root.setAttribute("data-theme-changing", "");
		}
		root.classList.toggle("dark", resolvedTheme === "dark");
		root.style.colorScheme = resolvedTheme;
		if (!disableTransitionOnChange) {
			return;
		}
		const frame = requestAnimationFrame(() => {
			root.removeAttribute("data-theme-changing");
		});
		return () => cancelAnimationFrame(frame);
	}, [disableTransitionOnChange, resolvedTheme]);

	const setTheme = React.useCallback(
		(nextTheme: Theme) => {
			window.localStorage.setItem(storageKey, nextTheme);
			setThemeState(nextTheme);
		},
		[storageKey],
	);

	const value = React.useMemo(
		() => ({ theme, resolvedTheme, setTheme }),
		[theme, resolvedTheme, setTheme],
	);

	return <ThemeContext value={value}>{children}</ThemeContext>;
}

export function useTheme() {
	const context = React.use(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
}
