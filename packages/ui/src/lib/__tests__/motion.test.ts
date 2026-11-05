import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
	bezierAt,
	createFrameLoop,
	EASE,
	DUR,
	firstTimeInSession,
	installPressFeedback,
	installRipple,
	motionSkipped,
	prefersReducedMotion,
	spring,
	springOf,
	typeOut,
} from "../motion";

describe("EASE / DUR", () => {
	it("are frozen dictionaries with expected keys", () => {
		expect(Object.isFrozen(EASE)).toBe(true);
		expect(Object.isFrozen(DUR)).toBe(true);
		expect(DUR.pageIn).toBe(0.62);
		expect(DUR.press).toBe(0.14);
		expect(EASE.settle).toHaveLength(4);
	});
});

describe("reduced motion", () => {
	it("returns booleans without throwing", () => {
		expect(typeof prefersReducedMotion()).toBe("boolean");
		expect(typeof motionSkipped()).toBe("boolean");
	});

	it("returns true when document is hidden", () => {
		const original = Object.getOwnPropertyDescriptor(document, "hidden");
		Object.defineProperty(document, "hidden", {
			configurable: true,
			value: true,
		});
		expect(motionSkipped()).toBe(true);
		if (original) {
			Object.defineProperty(document, "hidden", original);
		} else {
			// jsdom 上 hidden 通常来自原型 getter，还原为 false
			Object.defineProperty(document, "hidden", {
				configurable: true,
				value: false,
			});
		}
	});
});

describe("spring", () => {
	it("converges to the target", () => {
		const state = springOf(0);
		for (let i = 0; i < 600; i += 1) {
			spring(state, 100, 1 / 60, 62);
		}
		expect(state.x).toBeCloseTo(100, 1);
	});
});

describe("bezierAt", () => {
	it("hits endpoints and midpoint of (0,1,1,1)", () => {
		expect(bezierAt(0, 1, 1, 1, 0)).toBe(0);
		expect(bezierAt(0, 1, 1, 1, 1)).toBe(1);
		expect(bezierAt(0, 1, 1, 1, 0.5)).toBeCloseTo(0.875);
	});
});

describe("firstTimeInSession", () => {
	beforeEach(() => {
		sessionStorage.clear();
	});

	it("returns true once per key", () => {
		expect(firstTimeInSession("a")).toBe(true);
		expect(firstTimeInSession("a")).toBe(false);
		expect(firstTimeInSession("b")).toBe(true);
	});
});

describe("installers", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("installPressFeedback registers pointerdown only once", () => {
		const addSpy = vi.spyOn(document, "addEventListener");
		installPressFeedback();
		const afterFirst = addSpy.mock.calls.filter(
			([name]) => name === "pointerdown",
		).length;
		installPressFeedback();
		const afterSecond = addSpy.mock.calls.filter(
			([name]) => name === "pointerdown",
		).length;
		expect(afterSecond).toBe(afterFirst);
		expect(afterFirst).toBeGreaterThan(0);
	});

	it("installRipple registers keydown only once", () => {
		const addSpy = vi.spyOn(document, "addEventListener");
		installRipple();
		const afterFirst = addSpy.mock.calls.filter(
			([name]) => name === "keydown",
		).length;
		installRipple();
		const afterSecond = addSpy.mock.calls.filter(
			([name]) => name === "keydown",
		).length;
		expect(afterSecond).toBe(afterFirst);
		expect(afterFirst).toBeGreaterThan(0);
	});
});

describe("createFrameLoop", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});
	afterEach(() => {
		vi.useRealTimers();
	});

	it("calls step while started and stops when stopped", () => {
		const step = vi.fn();
		const loop = createFrameLoop(step);
		loop.start();
		vi.advanceTimersByTime(500);
		expect(step).toHaveBeenCalled();
		loop.stop();
		const count = step.mock.calls.length;
		vi.advanceTimersByTime(500);
		expect(step.mock.calls.length).toBe(count);
	});

	it("flush runs one frame without starting", () => {
		const step = vi.fn();
		const loop = createFrameLoop(step);
		loop.flush();
		expect(step).toHaveBeenCalledTimes(1);
	});
});

describe("typeOut", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});
	afterEach(() => {
		vi.useRealTimers();
	});

	it("writes the full text and calls done", () => {
		const write = vi.fn();
		const done = vi.fn();
		const cancel = typeOut("abc", write, done, 42);
		vi.advanceTimersByTime(200);
		expect(write).toHaveBeenLastCalledWith("abc");
		vi.advanceTimersByTime(300);
		expect(done).toHaveBeenCalledTimes(1);
		cancel();
	});

	it("returned cancel prevents further writes", () => {
		const write = vi.fn();
		const cancel = typeOut("abcd", write, undefined, 42);
		cancel();
		vi.advanceTimersByTime(500);
		expect(write).toHaveBeenLastCalledWith("");
	});
});
