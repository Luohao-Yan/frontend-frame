"use client";

import * as React from "react";

export interface HeaderScrollState {
	scrolled: boolean;
	hidden: boolean;
}

export interface HeaderScrollOptions {
	hideOnScroll?: boolean;
	compactOnScroll?: boolean;
}

/**
 * Tracks the active scroll container (window by default) and returns:
 * - scrolled: the header should switch to its compact state
 * - hidden: scrolling down past the threshold, so the header can tuck away
 */
export function useHeaderScrollState(
	scrollContainer?: React.RefObject<HTMLElement | null>,
	{ hideOnScroll = true, compactOnScroll = true }: HeaderScrollOptions = {},
): HeaderScrollState {
	const [state, setState] = React.useState<HeaderScrollState>({
		scrolled: false,
		hidden: false,
	});

	React.useEffect(() => {
		const target = scrollContainer?.current ?? null;
		const readTop = () => (target ? target.scrollTop : window.scrollY);
		let lastTop = readTop();
		let hidden = false;
		let frame = 0;

		const update = () => {
			frame = 0;
			const top = readTop();
			const delta = top - lastTop;
			const nextHidden = hideOnScroll
				? top > 96 && delta > 4
					? true
					: top < 48 || delta < -4
						? false
						: hidden
				: false;
			const nextScrolled = compactOnScroll && top > 8;

			hidden = nextHidden;
			lastTop = top;
			setState((current) =>
				current.scrolled === nextScrolled && current.hidden === nextHidden
					? current
					: { scrolled: nextScrolled, hidden: nextHidden },
			);
		};

		const onScroll = () => {
			if (!frame) {
				frame = window.requestAnimationFrame(update);
			}
		};

		update();
		const eventTarget: HTMLElement | Window = target ?? window;
		eventTarget.addEventListener("scroll", onScroll, { passive: true });

		return () => {
			eventTarget.removeEventListener("scroll", onScroll);
			if (frame) {
				window.cancelAnimationFrame(frame);
			}
		};
	}, [scrollContainer, hideOnScroll, compactOnScroll]);

	return state;
}
