"use client";

import { Reveal, cn } from "@frontend-frame/ui";

import type { HeroProps } from "../contracts";
import { HeroActions, HeroMedia, HeroStats } from "../_shared/hero-parts";
import { SectionHeading } from "../_shared/section-heading";

export function SplitHero({
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
				<div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
					<Reveal>
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

						{highlights?.length ? (
							<ul className="mt-8 space-y-3">
								{highlights.map((highlight) => (
									<li key={highlight.title} className="flex items-start gap-3">
										{highlight.icon ? (
											<highlight.icon className="text-primary mt-0.5 size-4 shrink-0" />
										) : (
											<span className="bg-primary mt-1.5 size-1.5 shrink-0 rounded-full" />
										)}
										<div>
											<p className="text-sm font-medium">{highlight.title}</p>
											{highlight.description ? (
												<p className="text-muted-foreground mt-0.5 text-sm leading-6">
													{highlight.description}
												</p>
											) : null}
										</div>
									</li>
								))}
							</ul>
						) : null}
					</Reveal>

					<Reveal delay={0.08}>
						<HeroMedia media={media} />
					</Reveal>
				</div>
			</div>
		</section>
	);
}
