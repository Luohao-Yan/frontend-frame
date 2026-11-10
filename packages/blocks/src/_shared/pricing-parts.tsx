"use client";

import * as React from "react";

import { cn } from "@frontend-frame/ui";

import type { BillingCycle, PricingPlan } from "../contracts";

export function formatPrice(plan: PricingPlan, billing: BillingCycle) {
	const amount = billing === "annual" ? plan.annualPrice : plan.monthlyPrice;
	const currency = plan.currency ?? "CNY";

	return new Intl.NumberFormat("zh-CN", {
		style: "currency",
		currency,
		maximumFractionDigits: 0,
	}).format(amount);
}

export function BillingToggle({
	billing,
	onChange,
	annualHint,
	className,
}: {
	billing: BillingCycle;
	onChange: (billing: BillingCycle) => void;
	annualHint?: string;
	className?: string;
}) {
	return (
		<div className={cn("flex flex-col items-center gap-2", className)}>
			<div
				className="bg-muted inline-flex rounded-full p-1"
				role="group"
				aria-label="计费周期"
			>
				{(
					[
						["monthly", "月付"],
						["annual", "年付"],
					] as const
				).map(([value, label]) => (
					<button
						key={value}
						type="button"
						aria-pressed={billing === value}
						onClick={() => onChange(value)}
						className={cn(
							"focus-visible:ring-ring rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none",
							billing === value
								? "bg-background text-foreground shadow-sm"
								: "text-muted-foreground hover:text-foreground",
						)}
					>
						{label}
					</button>
				))}
			</div>
			{annualHint ? (
				<p className="text-muted-foreground text-xs">{annualHint}</p>
			) : null}
		</div>
	);
}
