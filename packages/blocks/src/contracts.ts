import type * as React from "react";

export interface NavLink {
	label: string;
	href: string;
	description?: string;
	children?: NavLink[];
}

export type ActionVariant =
	"default" | "outline" | "secondary" | "ghost" | "link";

export interface SiteAction {
	label: string;
	href: string;
	variant?: ActionVariant;
}

export interface SiteSocialLink {
	label: string;
	href: string;
	icon?: React.ComponentType<{ className?: string }>;
}

export interface SiteConfig {
	name: string;
	description?: string;
	logo?: {
		src?: string;
		alt?: string;
		text?: string;
	};
	nav: NavLink[];
	actions?: SiteAction[];
	social?: SiteSocialLink[];
}

export interface SiteHeaderProps {
	site: SiteConfig;
	activePath?: string;
	actions?: React.ReactNode;
	themeToggle?: React.ReactNode;
	scrollContainer?: React.RefObject<HTMLElement | null>;
	hideOnScroll?: boolean;
	compactOnScroll?: boolean;
	onNavigate?: (href: string) => void;
	className?: string;
}

export type HeaderVariant = "floating-pill" | "minimal" | "mega-menu";

export interface SiteHeaderVariantProps extends SiteHeaderProps {
	variant?: HeaderVariant;
}

export interface HeroAction {
	label: string;
	href: string;
	variant?: ActionVariant;
}

export interface HeroStat {
	value: string;
	label: string;
}

export interface HeroHighlight {
	title: string;
	description?: string;
	icon?: React.ComponentType<{ className?: string }>;
}

export interface HeroProps {
	eyebrow?: string;
	title: React.ReactNode;
	description?: React.ReactNode;
	actions?: HeroAction[];
	media?: React.ReactNode;
	stats?: HeroStat[];
	highlights?: HeroHighlight[];
	onNavigate?: (href: string) => void;
	className?: string;
}

export type HeroVariant = "centered" | "split" | "bento";

export interface HeroVariantProps extends HeroProps {
	variant?: HeroVariant;
}

export interface FooterColumn {
	title: string;
	links: Array<{ label: string; href: string }>;
}

export interface SiteFooterProps {
	site: SiteConfig;
	columns: FooterColumn[];
	legal?: string;
	onNavigate?: (href: string) => void;
	className?: string;
}

export type FooterVariant = "dark-mega" | "minimal";

export interface SiteFooterVariantProps extends SiteFooterProps {
	variant?: FooterVariant;
}

export type BillingCycle = "monthly" | "annual";

export interface PricingPlan {
	id: string;
	name: string;
	description?: string;
	monthlyPrice: number;
	annualPrice: number;
	currency?: string;
	features: string[];
	highlighted?: boolean;
	badge?: string;
	cta: {
		label: string;
		href: string;
		variant?: ActionVariant;
	};
}

export interface PricingSectionProps {
	title?: string;
	description?: string;
	plans: PricingPlan[];
	defaultBilling?: BillingCycle;
	billing?: BillingCycle;
	onBillingChange?: (billing: BillingCycle) => void;
	annualHint?: string;
	onNavigate?: (href: string) => void;
	className?: string;
}

export type PricingVariant = "cards" | "comparison";

export interface PricingVariantProps extends PricingSectionProps {
	variant?: PricingVariant;
}
