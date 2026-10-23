"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import * as React from "react";

import { Button } from "./button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "./dropdown-menu";
import { ThemeMenuItems } from "./theme-menu-items";
import { cn } from "../lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
	const [mounted, setMounted] = React.useState(false);

	React.useEffect(() => setMounted(true), []);

	if (!mounted) {
		return (
			<Button variant="ghost" size="icon" className={cn("size-9", className)} />
		);
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className={cn("size-9", className)}
					aria-label="切换主题"
				>
					<SunIcon className="size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
					<MoonIcon className="absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
					<span className="sr-only">切换主题</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<ThemeMenuItems />
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
