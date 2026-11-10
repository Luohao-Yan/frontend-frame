"use client";

import * as React from "react";

import { cn } from "@frontend-frame/ui";

import { SkipLink } from "./skip-link";

export type AppShellHeightMode = "document" | "viewport";

export interface AppShellProps extends React.ComponentProps<"div"> {
	sidebar?: React.ReactNode;
	header?: React.ReactNode;
	footer?: React.ReactNode;
	overlay?: React.ReactNode;
	children: React.ReactNode;
	heightMode?: AppShellHeightMode;
	contentRef?: React.Ref<HTMLElement>;
	contentId?: string;
	contentClassName?: string;
	sidebarClassName?: string;
	footerClassName?: string;
	skipLink?: boolean;
}

export function AppShell({
	sidebar,
	header,
	footer,
	overlay,
	children,
	heightMode = "document",
	contentRef,
	contentId = "main-content",
	contentClassName,
	sidebarClassName,
	footerClassName,
	skipLink = true,
	className,
	...props
}: AppShellProps) {
	return (
		<div
			data-slot="app-shell"
			data-height-mode={heightMode}
			className={cn(
				"bg-background flex w-full",
				heightMode === "viewport" ? "h-svh overflow-hidden" : "min-h-svh",
				className,
			)}
			{...props}
		>
			{skipLink ? <SkipLink href={`#${contentId}`} /> : null}

			{sidebar ? (
				<div
					className={cn(
						"shrink-0",
						heightMode === "viewport" && "h-full min-h-0",
						sidebarClassName,
					)}
				>
					{sidebar}
				</div>
			) : null}

			<div
				data-slot="app-shell-content"
				className={cn(
					"flex min-w-0 flex-1 flex-col",
					heightMode === "viewport" && "min-h-0",
				)}
			>
				{header}

				<main
					ref={contentRef}
					id={contentId}
					tabIndex={-1}
					data-slot="app-shell-main"
					className={cn(
						"relative focus:outline-none",
						heightMode === "viewport"
							? "min-h-0 flex-1 overflow-auto overscroll-contain [scrollbar-gutter:stable]"
							: "flex-1",
						contentClassName,
					)}
				>
					{children}
				</main>

				{footer ? (
					<div className={cn("shrink-0", footerClassName)}>{footer}</div>
				) : null}
			</div>

			{overlay}
		</div>
	);
}
