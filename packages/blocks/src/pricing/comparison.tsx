"use client";

import { CheckIcon, MinusIcon } from "lucide-react";
import * as React from "react";

import { cn } from "@frontend-frame/ui";

import type { BillingCycle, PricingSectionProps } from "../contracts";
import { ActionLink } from "../_shared/action-link";
import { BillingToggle, formatPrice } from "../_shared/pricing-parts";
import { SectionHeading } from "../_shared/section-heading";

export function ComparisonPricing({
	title = "对比所有方案",
	description = "逐项查看功能差异，选择最合适的组合。",
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

	const features = Array.from(new Set(plans.flatMap((plan) => plan.features)));

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

				<div className="mt-10 overflow-x-auto rounded-2xl border">
					<table className="w-full min-w-[720px] border-collapse text-sm">
						<caption className="sr-only">方案功能对比</caption>
						<thead>
							<tr className="bg-muted/40">
								<th
									scope="col"
									className="w-56 px-5 py-5 text-left text-xs font-medium tracking-[0.14em] uppercase"
								>
									功能
								</th>
								{plans.map((plan) => (
									<th
										key={plan.id}
										scope="col"
										className={cn(
											"px-5 py-5 text-left align-top",
											plan.highlighted && "bg-primary/5",
										)}
									>
										<div className="flex items-center gap-2">
											<span className="text-base font-semibold">
												{plan.name}
											</span>
											{plan.badge ? (
												<span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-[10px]">
													{plan.badge}
												</span>
											) : null}
										</div>
										<p className="mt-2 text-xl font-semibold">
											{formatPrice(plan, billing)}
											<span className="text-muted-foreground text-xs font-normal">
												/{billing === "annual" ? "年" : "月"}
											</span>
										</p>
										<ActionLink
											href={plan.cta.href}
											label={plan.cta.label}
											variant={plan.cta.variant ?? "outline"}
											size="sm"
											onNavigate={onNavigate}
											className="mt-3 w-full"
										/>
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{features.map((feature, index) => (
								<tr
									key={feature}
									className={cn("border-t", index % 2 === 1 && "bg-muted/20")}
								>
									<th
										scope="row"
										className="text-muted-foreground px-5 py-3.5 text-left font-normal"
									>
										{feature}
									</th>
									{plans.map((plan) => {
										const included = plan.features.includes(feature);
										return (
											<td
												key={`${plan.id}:${feature}`}
												className={cn(
													"px-5 py-3.5",
													plan.highlighted && "bg-primary/5",
												)}
											>
												{included ? (
													<CheckIcon
														className="text-primary size-4"
														aria-label="包含"
													/>
												) : (
													<MinusIcon
														className="text-muted-foreground/50 size-4"
														aria-label="不包含"
													/>
												)}
											</td>
										);
									})}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</section>
	);
}
