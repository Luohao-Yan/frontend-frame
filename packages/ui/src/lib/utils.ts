import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatCompactNumber(value: number, maximumFractionDigits = 1) {
	return new Intl.NumberFormat("en-US", {
		notation: Math.abs(value) >= 10_000 ? "compact" : "standard",
		maximumFractionDigits,
	}).format(value);
}

export function formatDate(
	date: Date | string | number | undefined,
	opts: Intl.DateTimeFormatOptions = {},
) {
	if (!date) return "";
	try {
		return new Intl.DateTimeFormat("en-US", {
			month: opts.month ?? "long",
			day: opts.day ?? "numeric",
			year: opts.year ?? "numeric",
			...opts,
		}).format(new Date(date));
	} catch {
		return "";
	}
}
