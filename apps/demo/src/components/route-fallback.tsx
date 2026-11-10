import { RouteBoundary } from "@frontend-frame/app-kit";

export function RouteFallback() {
	return <RouteBoundary variant="loading" />;
}
