import { afterEach, describe, expect, it, vi } from "vitest";

import { createFetchAction } from "../create-fetch-action";

function jsonResponse(body: unknown, status = 200) {
	return new Response(JSON.stringify(body), {
		status,
		headers: { "Content-Type": "application/json" },
	});
}

afterEach(() => {
	vi.useRealTimers();
});

describe("createFetchAction", () => {
	it("posts JSON and parses the response", async () => {
		const fetchImpl = vi
			.fn()
			.mockResolvedValue(jsonResponse({ ticketId: "FF-1" }));
		const action = createFetchAction<{ email: string }, { ticketId: string }>({
			endpoint: "/api/contact",
			fetchImpl,
		});

		const result = await action({ email: "alice@example.com" });

		expect(result).toEqual({ ok: true, data: { ticketId: "FF-1" } });
		expect(fetchImpl).toHaveBeenCalledTimes(1);
		const [url, init] = fetchImpl.mock.calls[0] as [string, RequestInit];
		expect(url).toBe("/api/contact");
		expect(init.method).toBe("POST");
		expect(init.body).toBe(JSON.stringify({ email: "alice@example.com" }));
		expect(new Headers(init.headers).get("Content-Type")).toBe(
			"application/json",
		);
	});

	it("maps HTTP errors and field errors", async () => {
		const fetchImpl = vi.fn().mockResolvedValue(
			jsonResponse(
				{
					code: "EMAIL_TAKEN",
					message: "邮箱已被使用",
					fieldErrors: { email: ["邮箱已被使用"] },
				},
				422,
			),
		);
		const action = createFetchAction<{ email: string }, unknown>({
			endpoint: "/api/contact",
			fetchImpl,
		});

		const result = await action({ email: "alice@example.com" });

		expect(result).toEqual({
			ok: false,
			error: {
				code: "EMAIL_TAKEN",
				message: "邮箱已被使用",
				fieldErrors: { email: ["邮箱已被使用"] },
			},
		});
	});

	it("returns a transport error for invalid JSON", async () => {
		const fetchImpl = vi
			.fn()
			.mockResolvedValue(new Response("not-json", { status: 200 }));
		const action = createFetchAction<unknown, unknown>({
			endpoint: "/api/contact",
			fetchImpl,
		});

		const result = await action({});

		expect(result.ok).toBe(false);
		if (result.ok) return;
		expect(result.error.code).toBe("INVALID_RESPONSE");
	});

	it("returns a network error when fetch rejects", async () => {
		const fetchImpl = vi.fn().mockRejectedValue(new Error("offline"));
		const action = createFetchAction<unknown, unknown>({
			endpoint: "/api/contact",
			fetchImpl,
		});

		const result = await action({});

		expect(result.ok).toBe(false);
		if (result.ok) return;
		expect(result.error.code).toBe("NETWORK_ERROR");
	});

	it("aborts on timeout", async () => {
		vi.useFakeTimers();
		const fetchImpl = vi.fn(
			(_url: string, init?: RequestInit) =>
				new Promise<Response>((_resolve, reject) => {
					init?.signal?.addEventListener("abort", () => {
						reject(new DOMException("Aborted", "AbortError"));
					});
				}),
		);
		const action = createFetchAction<unknown, unknown>({
			endpoint: "/api/contact",
			timeoutMs: 10,
			fetchImpl: fetchImpl as typeof fetch,
		});

		const promise = action({});
		await vi.advanceTimersByTimeAsync(10);
		const result = await promise;

		expect(result.ok).toBe(false);
		if (result.ok) return;
		expect(result.error.code).toBe("ABORTED");
	});
});
