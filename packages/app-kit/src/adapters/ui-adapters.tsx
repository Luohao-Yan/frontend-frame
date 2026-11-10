"use client";

import * as React from "react";

export interface UiLinkProps extends Omit<
	React.ComponentPropsWithoutRef<"a">,
	"href"
> {
	href: string;
}

export interface UiImageProps {
	src: string;
	alt: string;
	width?: number;
	height?: number;
	className?: string;
	loading?: "eager" | "lazy";
}

export interface UiAdapters {
	Link: React.ComponentType<UiLinkProps>;
	Image?: React.ComponentType<UiImageProps>;
	usePathname: () => string;
	navigate?: (href: string) => void;
}

const UiAdaptersContext = React.createContext<UiAdapters | null>(null);

export interface UiAdaptersProviderProps {
	adapters: UiAdapters;
	children: React.ReactNode;
}

export function UiAdaptersProvider({
	adapters,
	children,
}: UiAdaptersProviderProps) {
	return <UiAdaptersContext value={adapters}>{children}</UiAdaptersContext>;
}

export function useUiAdapters(): UiAdapters {
	const context = React.use(UiAdaptersContext);
	if (!context) {
		throw new Error(
			"useUiAdapters must be used within <UiAdaptersProvider>. " +
				"Wrap your application with the provider and pass Link/usePathname adapters.",
		);
	}
	return context;
}
