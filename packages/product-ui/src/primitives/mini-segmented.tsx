"use client";

import * as React from "react";

import { cn } from "../lib/cn";

export interface MiniSegmentedOption<T extends string> {
	value: T;
	label: string;
}

export interface MiniSegmentedProps<T extends string> {
	options: readonly MiniSegmentedOption<T>[];
	value?: T;
	defaultValue?: T;
	onValueChange?: (value: T) => void;
	label: string;
	className?: string;
}

export function MiniSegmented<T extends string>({
	options,
	defaultValue,
	value,
	onValueChange,
	label,
	className,
}: MiniSegmentedProps<T>) {
	const [internalValue, setInternalValue] = React.useState<T | undefined>(
		defaultValue ?? options[0]?.value,
	);
	const activeValue = value ?? internalValue;

	const select = React.useCallback(
		(next: T) => {
			if (value === undefined) {
				setInternalValue(next);
			}
			onValueChange?.(next);
		},
		[onValueChange, value],
	);

	return (
		<div
			role="group"
			aria-label={label}
			data-slot="mini-segmented"
			className={cn(
				"border-border bg-background inline-flex items-center gap-0.5 rounded-md border p-0.5",
				className,
			)}
		>
			{options.map((option) => {
				const active = option.value === activeValue;
				return (
					<button
						key={option.value}
						type="button"
						aria-pressed={active}
						onClick={() => select(option.value)}
						className={cn(
							"rounded px-1.5 py-0.5 text-[10px] leading-none font-semibold transition-colors",
							active
								? "bg-foreground text-background"
								: "text-muted-foreground hover:text-foreground",
						)}
					>
						{option.label}
					</button>
				);
			})}
		</div>
	);
}
