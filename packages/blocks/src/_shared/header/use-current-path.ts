"use client";

import { useUiAdapters } from "@frontend-frame/app-kit";

export function useCurrentPath(activePath?: string) {
	const { usePathname } = useUiAdapters();
	const pathname = usePathname();
	return activePath ?? pathname;
}

export function isActivePath(currentPath: string, href: string) {
	if (href === "/") {
		return currentPath === "/";
	}
	return currentPath === href || currentPath.startsWith(`${href}/`);
}
