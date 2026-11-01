"use client";

import { useSyncExternalStore } from "react";

/**
 * 响应式媒体查询：判断视口是否 <= 768px（移动端）。
 *
 * @origin Apache-2.0 / fde-workspace (src/hooks/use-media-query.ts)
 */
export function useMediaQuery(query = "(max-width: 768px)") {
	const isOpen = useSyncExternalStore(
		(onStoreChange) => {
			const mediaQuery = window.matchMedia(query);
			mediaQuery.addEventListener("change", onStoreChange);
			return () => mediaQuery.removeEventListener("change", onStoreChange);
		},
		() => window.matchMedia(query).matches,
		() => false,
	);
	return { isOpen };
}
