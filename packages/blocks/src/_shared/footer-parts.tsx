"use client";

import { useUiAdapters } from "@frontend-frame/app-kit";
import { SparklesIcon } from "lucide-react";

import { cn } from "@frontend-frame/ui";

import type { FooterColumn, SiteConfig } from "../contracts";

export function FooterBrand({
	site,
	inverted = false,
	showDescription = true,
	className,
}: {
	site: SiteConfig;
	inverted?: boolean;
	showDescription?: boolean;
	className?: string;
}) {
	return (
		<div className={cn("max-w-sm", className)}>
			<div className="flex items-center gap-2.5">
				<span
					className={cn(
						"flex size-9 items-center justify-center rounded-lg",
						inverted
							? "bg-white text-neutral-950"
							: "bg-primary text-primary-foreground",
					)}
				>
					<SparklesIcon className="size-4" aria-hidden="true" />
				</span>
				<span className="text-base font-semibold">
					{site.logo?.text ?? site.name}
				</span>
			</div>
			{showDescription && site.description ? (
				<p
					className={cn(
						"mt-4 text-sm leading-6",
						inverted ? "text-neutral-400" : "text-muted-foreground",
					)}
				>
					{site.description}
				</p>
			) : null}
		</div>
	);
}

export function FooterColumns({
	columns,
	inverted = false,
	onNavigate,
}: {
	columns: FooterColumn[];
	inverted?: boolean;
	onNavigate?: (href: string) => void;
}) {
	const { Link } = useUiAdapters();

	return (
		<div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
			{columns.map((column) => (
				<div key={column.title}>
					<h3
						className={cn(
							"text-xs font-medium tracking-[0.14em] uppercase",
							inverted ? "text-neutral-400" : "text-muted-foreground",
						)}
					>
						{column.title}
					</h3>
					<ul className="mt-4 space-y-2.5">
						{column.links.map((link) => (
							<li key={`${column.title}:${link.href}:${link.label}`}>
								<Link
									href={link.href}
									onClick={() => onNavigate?.(link.href)}
									className={cn(
										"text-sm transition-colors",
										inverted
											? "text-neutral-300 hover:text-white"
											: "text-muted-foreground hover:text-foreground",
									)}
								>
									{link.label}
								</Link>
							</li>
						))}
					</ul>
				</div>
			))}
		</div>
	);
}

export function FooterSocial({
	site,
	inverted = false,
}: {
	site: SiteConfig;
	inverted?: boolean;
}) {
	if (!site.social?.length) {
		return null;
	}

	return (
		<div className="flex items-center gap-2">
			{site.social.map((item) => {
				const Icon = item.icon;
				return (
					<a
						key={`${item.label}:${item.href}`}
						href={item.href}
						target="_blank"
						rel="noreferrer"
						aria-label={item.label}
						className={cn(
							"flex size-9 items-center justify-center rounded-full border transition-colors",
							inverted
								? "border-white/15 text-neutral-300 hover:border-white/40 hover:text-white"
								: "text-muted-foreground hover:text-foreground",
						)}
					>
						{Icon ? <Icon className="size-4" /> : item.label.slice(0, 1)}
					</a>
				);
			})}
		</div>
	);
}
