"use client";

import { motion, type Transition } from "motion/react";
import * as React from "react";

import { cn } from "../lib/utils";

import { useMotionPreset, type MotionPreset } from "./motion-preset-provider";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

const presetConfig: Record<
	Exclude<MotionPreset, "none">,
	{ distance: number; transition: Omit<Transition, "delay"> }
> = {
	subtle: {
		distance: 12,
		transition: { duration: 0.35, ease: EASE_OUT },
	},
	playful: {
		distance: 24,
		transition: { type: "spring", stiffness: 220, damping: 26 },
	},
	cinematic: {
		distance: 40,
		transition: { duration: 0.8, ease: EASE_OUT },
	},
};

export interface RevealProps {
	children: React.ReactNode;
	delay?: number;
	once?: boolean;
	amount?: number;
	className?: string;
	preset?: MotionPreset;
}

export function Reveal({
	children,
	delay = 0,
	once = true,
	amount = 0.2,
	className,
	preset,
}: RevealProps) {
	const contextPreset = useMotionPreset();
	const activePreset = preset ?? contextPreset;

	if (activePreset === "none") {
		return <div className={cn(className)}>{children}</div>;
	}

	const config = presetConfig[activePreset];

	return (
		<motion.div
			className={cn(className)}
			initial={{ opacity: 0, y: config.distance }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once, amount }}
			transition={{ ...config.transition, delay }}
		>
			{children}
		</motion.div>
	);
}
