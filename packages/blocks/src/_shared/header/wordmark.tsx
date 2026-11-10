"use client";

import { useUiAdapters } from "@frontend-frame/app-kit";
import { SparklesIcon } from "lucide-react";

import { cn } from "@frontend-frame/ui";

import type { SiteConfig } from "../../contracts";

export interface HeaderWordmarkProps {
	site: SiteConfig;
	onNavigate?: (href: string) => void;
	className?: string;
	logoClassName?: string;
}

export function HeaderWordmark({
	site,
	onNavigate,
	className,
	logoClassName,
}: HeaderWordmarkProps) {
	const { Link, Image } = useUiAdapters();
	const logo = site.logo;
	const label = logo?.text ?? site.name;
	const imageAlt = logo?.alt ?? site.name;

	return (
		<Link
			href="/"
			aria-label={`${site.name} 首页`}
			onClick={() => onNavigate?.("/")}
			className={cn(
				"flex min-w-0 shrink-0 items-center gap-2.5 rounded-md",
				className,
			)}
		>
			{logo?.src ? (
				Image ? (
					<Image
						src={logo.src}
						alt={imageAlt}
						width={112}
						height={24}
						className="h-6 w-auto"
					/>
				) : (
					<img
						src={logo.src}
						alt={imageAlt}
						width={112}
						height={24}
						className="h-6 w-auto"
					/>
				)
			) : (
				<>
					<span
						className={cn(
							"bg-primary text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-lg",
							logoClassName,
						)}
					>
						<SparklesIcon className="size-4" aria-hidden="true" />
					</span>
					<span className="truncate text-sm font-semibold">{label}</span>
				</>
			)}
		</Link>
	);
}
