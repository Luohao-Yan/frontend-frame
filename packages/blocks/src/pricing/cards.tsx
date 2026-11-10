"use client";

import { CheckIcon } from "lucide-react";
import * as React from "react";

import { Badge, cn } from "@frontend-frame/ui";

import type { BillingCycle, PricingSectionProps } from "../contracts";
import { ActionLink } from "../_shared/action-link";
import { BillingToggle, formatPrice } from "../_shared/pricing-parts";
import { SectionHeading } from "../_shared/section-heading";

export function CardsPricing({
	title = "选择适合你的方案",
	description = "按月或按年付费，随时升级。",
	plans,
	defaultBilling = "monthly",
	billing: billingProp,
	onBillingChange,
	annualHint,
	onNavigate,
	className,
}: PricingSectionProps) {
	const [internalBilling, setInternalBilling] =
		React.useState<BillingCycle>(defaultBilling);
	const billing = billingProp ?? internalBilling;

	const changeBilling = (next: BillingCycle) => {
		if (billingProp === undefined) {
			setInternalBilling(next);
		}
		onBillingChange?.(next);
	};

	return (
		<section className={cn("py-20 lg:py-28", className)}>
			<div className="container-page">
				<SectionHeading
					align="center"
					eyebrow="Pricing"
					title={title}
					description={description}
				/>
				<BillingToggle
					billing={billing}
					onChange={changeBilling}
					annualHint={annualHint}
					className="mt-8"
				/>

				<div className="mt-10 grid gap-5 lg:grid-cols-2">
					{plans.map((plan) => (
						<div
							key={plan.id}
							className={cn(
								"bg-card relative flex flex-col rounded-3xl border p-6",
								plan.highlighted && "border-primary shadow-lg",
							)}
						>
							<div className="flex items-start justify-between gap-3">
								<div>
									<h3 className="text-lg font-semibold">{plan.name}</h3>
									{plan.description ? (
										<p className="text-muted-foreground mt-1.5 text-sm leading-6">
											{plan.description}
										</p>
									) : null}
								</div>
								{plan.badge ? (
									<Badge variant={plan.highlighted ? "default" : "secondary"}>
										{plan.badge}
									</Badge>
								) : null}
							</div>

							<div className="mt-6 flex items-end gap-1">
								<span className="text-4xl font-semibold tracking-tight">
									{formatPrice(plan, billing)}
								</span>
								<span className="text-muted-foreground pb-1 text-sm">
									/{billing === "annual" ? "年" : "月"}
								</span>
							</div>

							<ul className="mt-6 flex-1 space-y-3">
								{plan.features.map((feature) => (
									<li key={feature} className="flex items-start gap-2.5">
										<CheckIcon className="text-primary mt-0.5 size-4 shrink-0" />
										<span className="text-sm leading-6">{feature}</span>
									</li>
								))}
							</ul>

							<ActionLink
								href={plan.cta.href}
								label={plan.cta.label}
								variant={
									plan.cta.variant ?? (plan.highlighted ? "default" : "outline")
								}
								onNavigate={onNavigate}
								className="mt-8 w-full"
							/>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
