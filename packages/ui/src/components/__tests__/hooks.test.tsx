import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useControllableState } from "../../hooks/use-controllable-state";
import { useDebounce } from "../../hooks/use-debounce";
import { useElapsed } from "../../hooks/use-elapsed";
import { useMounted } from "../../hooks/use-mounted";

describe("useDebounce", () => {
	it("updates value after the delay", () => {
		vi.useFakeTimers();
		const { result, rerender } = renderHook(
			({ value }) => useDebounce(value, 100),
			{ initialProps: { value: "a" } },
		);
		expect(result.current).toBe("a");

		rerender({ value: "b" });
		// still debounced value before timer fires
		expect(result.current).toBe("a");

		act(() => {
			vi.advanceTimersByTime(100);
		});
		expect(result.current).toBe("b");
		vi.useRealTimers();
	});
});

describe("useMounted", () => {
	it("returns true on the client", () => {
		const { result } = renderHook(() => useMounted());
		expect(result.current).toBe(true);
	});
});

describe("useElapsed", () => {
	it("returns a frozen value when inactive", () => {
		const { result } = renderHook(() => useElapsed(false));
		expect(result.current.label).toBe("0.0秒");
		expect(result.current.seconds).toBe(0);
	});
});

describe("useControllableState", () => {
	it("uses the controlled prop when provided", () => {
		const { result } = renderHook(() =>
			useControllableState<string>({ prop: "x" }),
		);
		expect(result.current[0]).toBe("x");
	});

	it("uses the default prop when uncontrolled", () => {
		const { result } = renderHook(() =>
			useControllableState<string>({ defaultProp: "y" }),
		);
		expect(result.current[0]).toBe("y");
	});
});
