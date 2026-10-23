"use client";

import { LaptopIcon, MoonIcon, SunIcon } from "lucide-react";

import { DropdownMenuItem } from "./dropdown-menu";
import { useTheme } from "./theme-provider";

interface ThemeMenuItemsProps {
	labels?: {
		light?: string;
		dark?: string;
		system?: string;
	};
}

function ThemeMenuItems({ labels }: ThemeMenuItemsProps) {
	const { setTheme } = useTheme();
	const lightLabel = labels?.light ?? "浅色";
	const darkLabel = labels?.dark ?? "深色";
	const systemLabel = labels?.system ?? "跟随系统";

	return (
		<>
			<DropdownMenuItem onSelect={() => setTheme("light")}>
				<SunIcon className="size-4" />
				{lightLabel}
			</DropdownMenuItem>
			<DropdownMenuItem onSelect={() => setTheme("dark")}>
				<MoonIcon className="size-4" />
				{darkLabel}
			</DropdownMenuItem>
			<DropdownMenuItem onSelect={() => setTheme("system")}>
				<LaptopIcon className="size-4" />
				{systemLabel}
			</DropdownMenuItem>
		</>
	);
}

export { ThemeMenuItems };
