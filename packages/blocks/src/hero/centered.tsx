"use client";

import { Reveal, cn } from "@frontend-frame/ui";

import type { HeroProps } from "../contracts";
import { HeroActions, HeroMedia, HeroStats } from "../_shared/hero-parts";
import { SectionHeading } from "../_shared/section-heading";

export function CenteredHero({
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
				<Reveal className="mx-auto max-w-4xl text-center">
					<SectionHeading
						as="h1"
						eyebrow={eyebrow}
						title={title}
						description={description}
						align="center"
					/>
					<HeroActions
						actions={actions}
						onNavigate={onNavigate}
						className="mt-8 justify-center"
					/>
					{media ? (
						<HeroMedia media={media} className="mt-12 text-left" />
					) : null}
					<HeroStats stats={stats} className="mt-10 text-left" />
				</Reveal>

				{highlights?.length ? (
					<div className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-3">
						{highlights.map((highlight) => (
							<div
								key={highlight.title}
								className="bg-card rounded-2xl border p-5 text-left"
							>
								{highlight.icon ? (
									<highlight.icon className="text-primary size-5" />
								) : null}
								<h3 className="mt-3 text-sm font-semibold">
									{highlight.title}
								</h3>
								{highlight.description ? (
									<p className="text-muted-foreground mt-1.5 text-sm leading-6">
										{highlight.description}
									</p>
								) : null}
							</div>
						))}
					</div>
				) : null}
			</div>
		</section>
	);
}
