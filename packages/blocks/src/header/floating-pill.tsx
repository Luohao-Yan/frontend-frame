"use client";

import { cn } from "@frontend-frame/ui";

import type { SiteHeaderProps } from "../contracts";
import { HeaderActions } from "../_shared/header/actions";
import { HeaderMobileMenu } from "../_shared/header/mobile-menu";
import { HeaderNavLinks } from "../_shared/header/nav-links";
import { HeaderWordmark } from "../_shared/header/wordmark";
import { useHeaderScrollState } from "../_shared/header/use-header-scroll";

export function FloatingPillHeader({
	site,
	activePath,
	actions,
	themeToggle,
	scrollContainer,
	hideOnScroll,
	compactOnScroll,
	onNavigate,
	className,
}: SiteHeaderProps) {
	const { scrolled, hidden } = useHeaderScrollState(scrollContainer, {
		hideOnScroll,
		compactOnScroll,
	});

	return (
		<header
			data-scrolled={scrolled || undefined}
			data-hidden={hidden || undefined}
			className={cn(
				"sticky top-4 z-30 px-4 transition-transform duration-300 ease-out will-change-transform",
				hidden && "-translate-y-[calc(100%+1.5rem)]",
				className,
			)}
		>
			<div
				className={cn(
					"border-border/80 mx-auto flex w-full items-center justify-between gap-3 rounded-full border backdrop-blur-xl transition-[max-width,padding,background-color,box-shadow,transform] duration-300 ease-out",
					scrolled
						? "bg-background/90 max-w-4xl scale-[0.985] px-3 py-1.5 shadow-xl"
						: "bg-background/80 max-w-5xl px-3 py-2 shadow-lg",
				)}
			>
				<HeaderWordmark
					site={site}
					onNavigate={onNavigate}
					className="rounded-full"
					logoClassName="rounded-full"
				/>

				<HeaderNavLinks
					site={site}
					activePath={activePath}
					onNavigate={onNavigate}
					className="hidden lg:flex [&_a]:rounded-full [&_button]:rounded-full"
				/>

				<div className="flex shrink-0 items-center gap-1.5 [&_[data-slot=button]]:rounded-full">
					{themeToggle}
					<HeaderActions
						site={site}
						actions={actions}
						onNavigate={onNavigate}
						className="hidden sm:flex"
					/>
					<HeaderMobileMenu
						site={site}
						activePath={activePath}
						actions={actions}
						themeToggle={themeToggle}
						onNavigate={onNavigate}
						triggerClassName="rounded-full"
						logoClassName="rounded-full"
					/>
				</div>
			</div>
		</header>
	);
}
