"use client";

import { Skeleton } from "@frontend-frame/ui";
import * as React from "react";

import {
	DEFAULT_FOOTER_VARIANT,
	DEFAULT_HEADER_VARIANT,
	DEFAULT_HERO_VARIANT,
	DEFAULT_PRICING_VARIANT,
	footerVariants,
	headerVariants,
	heroVariants,
	pricingVariants,
} from "./catalog";
import type {
	FooterVariant,
	HeaderVariant,
	HeroProps,
	HeroVariant,
	PricingSectionProps,
	PricingVariant,
	SiteFooterProps,
	SiteFooterVariantProps,
	SiteHeaderProps,
	SiteHeaderVariantProps,
} from "./contracts";

type VariantComponent<TProps extends object> = React.LazyExoticComponent<
	React.ComponentType<TProps>
>;

type VariantRegistry<TProps extends object> = Record<
	string,
	VariantComponent<TProps>
>;

interface VariantRendererProps<TProps extends object> {
	registry: VariantRegistry<TProps>;
	variant: string;
	defaultVariant: string;
	available: string;
	label: string;
	props: TProps;
	fallback: React.ReactNode;
}

function VariantRenderer<TProps extends object>({
	registry,
	variant,
	defaultVariant,
	available,
	label,
	props,
	fallback,
}: VariantRendererProps<TProps>) {
	const Component = (
		registry as Record<string, VariantComponent<TProps> | undefined>
	)[variant];

	if (!Component) {
		const message = `Unknown ${label} variant "${variant}". Available variants: ${available}`;
		if (import.meta.env.DEV) {
			throw new Error(message);
		}
		console.warn(message);
		const Fallback = registry[defaultVariant];
		return (
			<React.Suspense fallback={fallback}>
				<Fallback {...props} />
			</React.Suspense>
		);
	}

	return (
		<React.Suspense fallback={fallback}>
			<Component {...props} />
		</React.Suspense>
	);
}

const headerRegistry: VariantRegistry<SiteHeaderProps> = {
	"floating-pill": React.lazy(() =>
		import("./header/floating-pill").then((module) => ({
			default: module.FloatingPillHeader,
		})),
	),
	minimal: React.lazy(() =>
		import("./header/minimal").then((module) => ({
			default: module.MinimalHeader,
		})),
	),
	"mega-menu": React.lazy(() =>
		import("./header/mega-menu").then((module) => ({
			default: module.MegaMenuHeader,
		})),
	),
};

const heroRegistry: VariantRegistry<HeroProps> = {
	centered: React.lazy(() =>
		import("./hero/centered").then((module) => ({
			default: module.CenteredHero,
		})),
	),
	split: React.lazy(() =>
		import("./hero/split").then((module) => ({
			default: module.SplitHero,
		})),
	),
	bento: React.lazy(() =>
		import("./hero/bento").then((module) => ({
			default: module.BentoHero,
		})),
	),
};

const footerRegistry: VariantRegistry<SiteFooterProps> = {
	"dark-mega": React.lazy(() =>
		import("./footer/dark-mega").then((module) => ({
			default: module.DarkMegaFooter,
		})),
	),
	minimal: React.lazy(() =>
		import("./footer/minimal").then((module) => ({
			default: module.MinimalFooter,
		})),
	),
};

const pricingRegistry: VariantRegistry<PricingSectionProps> = {
	cards: React.lazy(() =>
		import("./pricing/cards").then((module) => ({
			default: module.CardsPricing,
		})),
	),
	comparison: React.lazy(() =>
		import("./pricing/comparison").then((module) => ({
			default: module.ComparisonPricing,
		})),
	),
};

const available = (variants: Array<{ id: string }>) =>
	variants.map((variant) => variant.id).join(", ");

export function SiteHeader({
	variant = DEFAULT_HEADER_VARIANT,
	...props
}: SiteHeaderVariantProps) {
	return (
		<VariantRenderer
			registry={headerRegistry}
			variant={variant as HeaderVariant}
			defaultVariant={DEFAULT_HEADER_VARIANT}
			available={available(headerVariants)}
			label="header"
			props={props}
			fallback={
				<div className="container-page py-4">
					<Skeleton className="h-10 w-full rounded-full" />
				</div>
			}
		/>
	);
}

export function Hero({
	variant = DEFAULT_HERO_VARIANT,
	...props
}: HeroProps & { variant?: HeroVariant }) {
	return (
		<VariantRenderer
			registry={heroRegistry}
			variant={variant}
			defaultVariant={DEFAULT_HERO_VARIANT}
			available={available(heroVariants)}
			label="hero"
			props={props}
			fallback={
				<div className="container-page py-20">
					<Skeleton className="h-96 w-full rounded-3xl" />
				</div>
			}
		/>
	);
}

export function SiteFooter({
	variant = DEFAULT_FOOTER_VARIANT,
	...props
}: SiteFooterVariantProps) {
	return (
		<VariantRenderer
			registry={footerRegistry}
			variant={variant as FooterVariant}
			defaultVariant={DEFAULT_FOOTER_VARIANT}
			available={available(footerVariants)}
			label="footer"
			props={props}
			fallback={
				<div className="container-page py-12">
					<Skeleton className="h-48 w-full rounded-3xl" />
				</div>
			}
		/>
	);
}

export function PricingSection({
	variant = DEFAULT_PRICING_VARIANT,
	...props
}: PricingSectionProps & { variant?: PricingVariant }) {
	return (
		<VariantRenderer
			registry={pricingRegistry}
			variant={variant}
			defaultVariant={DEFAULT_PRICING_VARIANT}
			available={available(pricingVariants)}
			label="pricing"
			props={props}
			fallback={
				<div className="container-page py-20">
					<Skeleton className="h-96 w-full rounded-3xl" />
				</div>
			}
		/>
	);
}
