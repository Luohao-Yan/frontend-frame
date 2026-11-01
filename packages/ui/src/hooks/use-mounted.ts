"use client";

import { useSyncExternalStore } from "react";

/**
 * @origin Apache-2.0 / fde-workspace (src/hooks/use-mounted.ts)
 */
const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function useMounted() {
	return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}
