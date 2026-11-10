"use client";

import { cn } from "@frontend-frame/ui";

import type { SiteHeaderProps } from "../contracts";
import { HeaderActions } from "../_shared/header/actions";
import { HeaderMobileMenu } from "../_shared/header/mobile-menu";
import { HeaderWordmark } from "../_shared/header/wordmark";
import { MegaNav } from "../_shared/header/mega-nav";

export function MegaMenuHeader({
	site,
	activePath,
	actions,
	themeToggle,
	onNavigate,
	className,
}: SiteHeaderProps) {
	return (
		<header
			className={cn(
				"bg-background border-border sticky top-0 z-30 border-b",
				className,
			)}
		>
			<div className="container-page flex h-16 items-center justify-between gap-4">
				<HeaderWordmark site={site} onNavigate={onNavigate} />

				<MegaNav
					site={site}
					activePath={activePath}
					onNavigate={onNavigate}
					className="hidden lg:flex"
				/>

				<div className="flex items-center gap-1.5">
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
					/>
				</div>
			</div>
		</header>
	);
}
