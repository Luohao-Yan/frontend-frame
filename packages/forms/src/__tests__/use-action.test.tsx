import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useAction } from "../use-action";

describe("useAction", () => {
	it("transitions from idle to success", async () => {
		const action = vi.fn().mockResolvedValue({
			ok: true,
			data: { ticketId: "FF-1" },
		});
		const { result } = renderHook(() => useAction(action));

		expect(result.current.status).toBe("idle");

		await act(async () => {
			const response = await result.current.execute({ email: "a@b.com" });
			expect(response).toEqual({ ok: true, data: { ticketId: "FF-1" } });
		});

		expect(result.current.status).toBe("success");
		expect(result.current.hasSucceeded).toBe(true);
		expect(result.current.data).toEqual({ ticketId: "FF-1" });
	});

	it("transitions to error for a failed action result", async () => {
		const action = vi.fn().mockResolvedValue({
			ok: false,
			error: { code: "EMAIL_TAKEN", message: "邮箱已被使用" },
		});
		const { result } = renderHook(() => useAction(action));

		await act(async () => {
			await result.current.execute({ email: "a@b.com" });
		});

		expect(result.current.status).toBe("error");
		expect(result.current.hasErrored).toBe(true);
		expect(result.current.error).toEqual({
			code: "EMAIL_TAKEN",
			message: "邮箱已被使用",
		});
	});

	it("converts thrown errors to an internal error", async () => {
		const action = vi.fn().mockRejectedValue(new Error("boom"));
		const { result } = renderHook(() => useAction(action));

		await act(async () => {
			await result.current.execute({});
		});

		expect(result.current.error).toEqual({
			code: "INTERNAL_ERROR",
			message: "服务暂时不可用，请稍后重试",
		});
	});

	it("deduplicates concurrent executions", async () => {
		let resolveAction: (value: { ok: true; data: string }) => void;
		const action = vi.fn(
			() =>
				new Promise<{ ok: true; data: string }>((resolve) => {
					resolveAction = resolve;
				}),
		);
		const { result } = renderHook(() => useAction(action));

		let first: Promise<unknown>;
		act(() => {
			first = result.current.execute({});
			void result.current.execute({});
		});

		await vi.waitFor(() => expect(action).toHaveBeenCalledTimes(1));

		await act(async () => {
			resolveAction!({ ok: true, data: "done" });
			await first;
		});

		expect(result.current.data).toBe("done");
	});

	it("resets state and allows a new execution", async () => {
		const action = vi.fn().mockResolvedValue({ ok: true, data: "done" });
		const { result } = renderHook(() => useAction(action));

		await act(async () => {
			await result.current.execute({});
		});
		expect(result.current.hasSucceeded).toBe(true);

		act(() => {
			result.current.reset();
		});
		expect(result.current.status).toBe("idle");

		await act(async () => {
			await result.current.execute({});
		});
		expect(result.current.hasSucceeded).toBe(true);
	});

	it("ignores late results after reset", async () => {
		let resolveAction: (value: { ok: true; data: string }) => void;
		const action = vi.fn(
			() =>
				new Promise<{ ok: true; data: string }>((resolve) => {
					resolveAction = resolve;
				}),
		);
		const { result } = renderHook(() => useAction(action));

		let pending: Promise<unknown>;
		await act(async () => {
			pending = result.current.execute({});
			await Promise.resolve();
		});
		act(() => {
			result.current.reset();
		});

		await act(async () => {
			resolveAction!({ ok: true, data: "late" });
			await pending!;
		});

		expect(result.current.status).toBe("idle");
	});
});
