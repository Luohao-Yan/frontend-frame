"use client";

import * as React from "react";

import { useCallbackRef } from "./use-callback-ref";

/**
 * @origin Apache-2.0 / fde-workspace (src/hooks/use-debounced-callback.ts)
 */
export function useDebouncedCallback<T extends (...args: never[]) => unknown>(
	callback: T,
	delay: number,
) {
	const handleCallback = useCallbackRef(callback);
	const debounceTimerRef = React.useRef(0);
	React.useEffect(
		() => () => window.clearTimeout(debounceTimerRef.current),
		[],
	);

	const setValue = React.useCallback(
		(...args: Parameters<T>) => {
			window.clearTimeout(debounceTimerRef.current);
			debounceTimerRef.current = window.setTimeout(
				() => handleCallback(...args),
				delay,
			);
		},
		[handleCallback, delay],
	);

	return setValue;
}
