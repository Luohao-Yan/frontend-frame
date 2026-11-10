"use client";

import { useReducedMotion } from "motion/react";
import * as React from "react";

export type MotionPreset = "none" | "subtle" | "playful" | "cinematic";

const MotionPresetContext = React.createContext<MotionPreset>("subtle");

export interface MotionPresetProviderProps {
	preset?: MotionPreset;
	children: React.ReactNode;
}

export function MotionPresetProvider({
	preset = "subtle",
	children,
}: MotionPresetProviderProps) {
	const reducedMotion = useReducedMotion();
	const value = reducedMotion ? "none" : preset;

	return <MotionPresetContext value={value}>{children}</MotionPresetContext>;
}

export function useMotionPreset(): MotionPreset {
	return React.use(MotionPresetContext);
}
