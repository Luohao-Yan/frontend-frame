"use client";

import { motion, useReducedMotion } from "motion/react";
import { SparklesIcon } from "lucide-react";
import * as React from "react";

import { cn } from "../lib/cn";
import { MiniAvatar } from "../primitives/mini-avatar";
import { MiniBadge } from "../primitives/mini-badge";
import { MiniRow } from "../primitives/mini-row";

import type { ContactEnrichmentProps } from "../types";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function ContactEnrichment({
	person,
	fields,
	aiLabel = "AI",
	animated = true,
	className,
	cardLabel,
}: ContactEnrichmentProps) {
	const reducedMotion = useReducedMotion();
	const shouldAnimate = animated && reducedMotion !== true;
	const fullName = `${person.name}, ${person.role} at ${person.company}`;

	const header = (
		<div className="flex items-center gap-3">
			<MiniAvatar name={person.name} src={person.avatar} />
			<div className="min-w-0 flex-1">
				<p className="truncate text-[13px] leading-tight font-semibold">
					{person.name}
				</p>
				<p className="text-muted-foreground mt-1 truncate text-[11px] leading-tight">
					{person.role} · {person.company}
				</p>
			</div>
			<MiniBadge tone="accent">
				<SparklesIcon className="size-2.5" aria-hidden="true" />
				{aiLabel}
			</MiniBadge>
		</div>
	);

	return (
		<div
			data-slot="contact-enrichment"
			role="group"
			aria-label={cardLabel ?? fullName}
			className={cn("space-y-4", className)}
		>
			{shouldAnimate ? (
				<>
					<motion.div
						initial={{ opacity: 0, y: 6 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.4 }}
						transition={{ duration: 0.4, ease: EASE_OUT }}
					>
						{header}
					</motion.div>
					<motion.dl
						initial={shouldAnimate ? "hidden" : false}
						whileInView={shouldAnimate ? "visible" : undefined}
						viewport={{ once: true, amount: 0.4 }}
						variants={{
							hidden: {},
							visible: {
								transition: { staggerChildren: 0.08, delayChildren: 0.2 },
							},
						}}
						className="divide-border/60 grid grid-cols-2 gap-x-4 divide-y border-t pt-2 lg:grid-cols-1"
					>
						{fields.map((field, index) => (
							<MiniRow
								key={`${field.label}-${index}`}
								label={field.label}
								value={field.value}
								enriched={field.enriched}
								animated={shouldAnimate}
							/>
						))}
					</motion.dl>
				</>
			) : (
				<>
					{header}
					<dl className="divide-border/60 grid grid-cols-2 gap-x-4 divide-y border-t pt-2 lg:grid-cols-1">
						{fields.map((field, index) => (
							<MiniRow
								key={`${field.label}-${index}`}
								label={field.label}
								value={field.value}
								enriched={field.enriched}
								animated={false}
							/>
						))}
					</dl>
				</>
			)}
		</div>
	);
}
