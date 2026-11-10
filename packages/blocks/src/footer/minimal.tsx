"use client";

import { useUiAdapters } from "@frontend-frame/app-kit";

import { cn } from "@frontend-frame/ui";

import type { SiteFooterProps } from "../contracts";
import { FooterBrand, FooterSocial } from "../_shared/footer-parts";

export function MinimalFooter({
	site,
	columns,
	legal,
	onNavigate,
	className,
}: SiteFooterProps) {
	const { Link } = useUiAdapters();
	const year = new Date().getFullYear();
	const navLinks = columns.flatMap((column) => column.links);

	return (
		<footer className={cn("border-t py-8", className)}>
			<div className="container-page flex flex-col gap-6">
				<div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
					<FooterBrand site={site} showDescription={false} />
					<nav
						aria-label="页脚导航"
						className="flex flex-wrap items-center gap-x-5 gap-y-2"
					>
						{navLinks.map((link) => (
							<Link
								key={`${link.href}:${link.label}`}
								href={link.href}
								onClick={() => onNavigate?.(link.href)}
								className="text-muted-foreground hover:text-foreground text-sm transition-colors"
							>
								{link.label}
							</Link>
						))}
					</nav>
				</div>

				<div className="text-muted-foreground flex flex-col gap-3 border-t pt-5 text-xs sm:flex-row sm:items-center sm:justify-between">
					<p>{legal ?? `© ${year} ${site.name}`}</p>
					<FooterSocial site={site} />
				</div>
			</div>
		</footer>
	);
}
