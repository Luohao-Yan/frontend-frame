import type { Theme } from "../components/theme-provider";

export interface ThemeScriptOptions {
	storageKey?: string;
	activeThemeKey?: string;
	defaultTheme?: Theme;
}

const DEFAULT_STORAGE_KEY = "frontend-frame-theme";
const DEFAULT_ACTIVE_THEME_KEY = "frontend-frame-active-theme";

/**
 * Returns a blocking script that applies the persisted theme before React hydrates.
 * Keep it inline in <head> to avoid a light-to-dark flash on first paint.
 */
export function getThemeScript({
	storageKey = DEFAULT_STORAGE_KEY,
	activeThemeKey = DEFAULT_ACTIVE_THEME_KEY,
	defaultTheme = "system",
}: ThemeScriptOptions = {}) {
	const values = JSON.stringify({
		storageKey,
		activeThemeKey,
		defaultTheme,
	});

	return `(function(){try{var o=${values};var root=document.documentElement;var stored=localStorage.getItem(o.storageKey);var theme=stored==="light"||stored==="dark"?stored:o.defaultTheme==="light"||o.defaultTheme==="dark"?o.defaultTheme:(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");root.classList.toggle("dark",theme==="dark");root.style.colorScheme=theme;var active=localStorage.getItem(o.activeThemeKey);if(active){root.setAttribute("data-theme",active);}}catch(e){}})();`;
}
