"use client";

import { Reveal, cn } from "@frontend-frame/ui";

import type { HeroProps } from "../contracts";
import { HeroActions, HeroMedia, HeroStats } from "../_shared/hero-parts";
import { SectionHeading } from "../_shared/section-heading";

export function BentoHero({
	eyebrow,
	title,
	description,
	actions,
	media,
	stats,
	highlights,
	onNavigate,
	className,
}: HeroProps) {
	return (
		<section
			className={cn("relative overflow-hidden py-20 lg:py-28", className)}
		>
			<div className="container-page">
				<div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
					<Reveal className="lg:col-span-5">
						<SectionHeading
							as="h1"
							eyebrow={eyebrow}
							title={title}
							description={description}
						/>
						<HeroActions
							actions={actions}
							onNavigate={onNavigate}
							className="mt-8"
						/>
						<HeroStats stats={stats} className="mt-10" />
					</Reveal>

					<div className="lg:col-span-7">
						<Reveal delay={0.08}>
							<HeroMedia media={media} />
						</Reveal>

						{highlights?.length ? (
							<div className="mt-4 grid gap-3 sm:grid-cols-3">
								{highlights.map((highlight) => (
									<div
										key={highlight.title}
										className="bg-card rounded-2xl border p-4"
									>
										{highlight.icon ? (
											<highlight.icon className="text-primary size-4" />
										) : null}
										<p className="mt-2 text-sm font-semibold">
											{highlight.title}
										</p>
										{highlight.description ? (
											<p className="text-muted-foreground mt-1 text-xs leading-5">
												{highlight.description}
											</p>
										) : null}
									</div>
								))}
							</div>
						) : null}
					</div>
				</div>
			</div>
		</section>
	);
}
