"use client";

import { useEffect, useRef, useState } from "react";

import {
	firstTimeInSession,
	installHoverLift,
	installPressFeedback,
	installRipple,
	pageEnter,
	revealCascade,
} from "../lib/motion";

/**
 * 在应用顶层调用一次：安装按压 / 悬停 / 涟漪三类事件委托反馈。
 * 所有实现都做了幂等保护，StrictMode 双挂载安全。
 */
export function useMotionEffects() {
	useEffect(() => {
		installPressFeedback();
		installHoverLift();
		installRipple();
	}, []);
}

/**
 * 页面进场编排：挂到页面根节点，`.reveal` 按阅读序、`.bento` 从中心展开。
 * 传 `key` 时本会话只播一次（`firstTimeInSession`），之后直进终态。
 */
export function usePageEnter<T extends HTMLElement>({
	key,
}: { key?: string } = {}) {
	const ref = useRef<T | null>(null);

	useEffect(() => {
		const page = ref.current;
		if (!page || page.classList.contains("is-entrance-ready")) return;
		if (key && !firstTimeInSession(key)) {
			page.classList.add("is-entrance-ready");
			return;
		}
		pageEnter(page, () => {});
	}, [key]);

	return ref;
}

/**
 * 面板内容级联浮现：容器挂载后（或 enabled 变为 true 时）对直接子元素做一次
 * 阅读序浮现。默认 `:scope > *`，可传自定义 selector 与间隔。
 */
export function useRevealCascade<T extends HTMLElement>(
	enabled = true,
	selector = ":scope > *",
	gap = 0.075,
) {
	const ref = useRef<T | null>(null);
	const [played, setPlayed] = useState(false);

	useEffect(() => {
		if (!enabled || played || !ref.current) return;
		revealCascade(ref.current, selector, gap);
		setPlayed(true);
	}, [enabled, played, selector, gap]);

	return ref;
}
