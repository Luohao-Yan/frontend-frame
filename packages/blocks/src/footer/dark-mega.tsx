"use client";

import { useUiAdapters } from "@frontend-frame/app-kit";
import { ArrowRightIcon } from "lucide-react";

import { Button, cn } from "@frontend-frame/ui";

import type { SiteFooterProps } from "../contracts";
import {
	FooterBrand,
	FooterColumns,
	FooterSocial,
} from "../_shared/footer-parts";

export function DarkMegaFooter({
	site,
	columns,
	legal,
	onNavigate,
	className,
}: SiteFooterProps) {
	const { Link } = useUiAdapters();
	const primaryAction = site.actions?.[0];
	const year = new Date().getFullYear();

	return (
		<footer className={cn("bg-neutral-950 text-neutral-50", className)}>
			<div className="container-page">
				<div className="flex flex-col gap-6 border-b border-white/10 py-12 lg:flex-row lg:items-center lg:justify-between">
					<div className="max-w-2xl">
						<h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
							准备好开始了吗？
						</h2>
						<p className="mt-3 text-sm leading-6 text-neutral-400">
							{site.description ?? "从组件、区块到页面模板，按你的节奏接入。"}
						</p>
					</div>
					{primaryAction ? (
						<Button
							asChild
							size="lg"
							className="bg-white text-neutral-950 hover:bg-white/90"
						>
							<Link
								href={primaryAction.href}
								onClick={() => onNavigate?.(primaryAction.href)}
							>
								{primaryAction.label}
								<ArrowRightIcon />
							</Link>
						</Button>
					) : null}
				</div>

				<div className="grid gap-10 py-12 lg:grid-cols-[1.2fr_2fr]">
					<FooterBrand site={site} inverted />
					<FooterColumns columns={columns} inverted onNavigate={onNavigate} />
				</div>

				<div className="flex flex-col gap-4 border-t border-white/10 py-6 sm:flex-row sm:items-center sm:justify-between">
					<p className="text-xs text-neutral-500">
						{legal ?? `© ${year} ${site.name}. All rights reserved.`}
					</p>
					<FooterSocial site={site} inverted />
				</div>

				<div className="overflow-hidden pb-4" aria-hidden="true">
					<p className="truncate text-[18vw] leading-none font-bold tracking-tighter text-white/5">
						{site.logo?.text ?? site.name}
					</p>
				</div>
			</div>
		</footer>
	);
}
