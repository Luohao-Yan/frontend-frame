"use client";

import { motion } from "motion/react";
import * as React from "react";

import { cn } from "../lib/utils";

import { useMotionPreset } from "./motion-preset-provider";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export interface StaggerProps {
	children: React.ReactNode;
	className?: string;
	once?: boolean;
	amount?: number;
}

export function Stagger({
	children,
	className,
	once = true,
	amount = 0.2,
}: StaggerProps) {
	const preset = useMotionPreset();

	if (preset === "none") {
		return <div className={cn(className)}>{children}</div>;
	}

	return (
		<motion.div
			className={cn(className)}
			initial="hidden"
			whileInView="visible"
			viewport={{ once, amount }}
			variants={{
				hidden: {},
				visible: {
					transition: {
						staggerChildren: preset === "playful" ? 0.1 : 0.06,
					},
				},
			}}
		>
			{children}
		</motion.div>
	);
}

export interface StaggerItemProps {
	children: React.ReactNode;
	className?: string;
}

export function StaggerItem({ children, className }: StaggerItemProps) {
	const preset = useMotionPreset();

	if (preset === "none") {
		return <div className={cn(className)}>{children}</div>;
	}

	return (
		<motion.div
			className={cn(className)}
			variants={{
				hidden: { opacity: 0, y: 16 },
				visible: {
					opacity: 1,
					y: 0,
					transition: { duration: 0.4, ease: EASE_OUT },
				},
			}}
		>
			{children}
		</motion.div>
	);
}
