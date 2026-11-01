"use client";

import { PaletteIcon } from "lucide-react";
import * as React from "react";

import { useActiveTheme, THEMES } from "./active-theme";
import { Label } from "./label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./select";

/**
 * 主题选择器：在 11 套内置主题间切换（通过 ActiveThemeProvider 设置 <html data-theme>）。
 *
 * @origin Apache-2.0 / fde-workspace（src/components/themes/theme-selector.tsx）
 */
function ThemeSelector({ className }: { className?: string }) {
	const { activeTheme, setActiveTheme } = useActiveTheme();

	return (
		<div className="flex items-center gap-2">
			<Label htmlFor="theme-selector" className="sr-only">
				主题
			</Label>
			<Select value={activeTheme} onValueChange={setActiveTheme}>
				<SelectTrigger id="theme-selector" className={className}>
					<PaletteIcon className="size-4 shrink-0 text-muted-foreground" />
					<SelectValue placeholder="选择主题" />
				</SelectTrigger>
				<SelectContent align="end">
					{THEMES.map((theme) => (
						<SelectItem key={theme.value} value={theme.value}>
							{theme.name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}

export { ThemeSelector };
