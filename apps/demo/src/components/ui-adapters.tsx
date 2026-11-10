"use client";

import {
	UiAdaptersProvider,
	type UiAdapters,
	type UiLinkProps,
} from "@frontend-frame/app-kit";
import * as React from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";

const RouterLinkAdapter = React.forwardRef<HTMLAnchorElement, UiLinkProps>(
	({ href, ...props }, ref) => <RouterLink ref={ref} to={href} {...props} />,
);
RouterLinkAdapter.displayName = "RouterLinkAdapter";

export function DemoUiAdapters({ children }: { children: React.ReactNode }) {
	const location = useLocation();
	const navigate = useNavigate();

	const adapters = React.useMemo<UiAdapters>(
		() => ({
			Link: RouterLinkAdapter,
			usePathname: () => location.pathname,
			navigate: (href) => navigate(href),
		}),
		[location.pathname, navigate],
	);

	return (
		<UiAdaptersProvider adapters={adapters}>{children}</UiAdaptersProvider>
	);
}
