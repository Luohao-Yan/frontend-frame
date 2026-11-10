import { describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { createAction } from "../create-action";
import { ActionError } from "../types";

const schema = z.object({
	name: z.string().trim().min(2, "至少 2 个字符"),
	email: z.string().trim().email("邮箱格式不正确"),
});

describe("createAction", () => {
	it("returns field errors for invalid input", async () => {
		const action = createAction(schema, () => ({ id: "1" }));
		const result = await action({ name: "a", email: "not-an-email" });

		expect(result.ok).toBe(false);
		if (result.ok) return;

		expect(result.error.code).toBe("VALIDATION_ERROR");
		expect(result.error.fieldErrors?.name).toEqual(["至少 2 个字符"]);
		expect(result.error.fieldErrors?.email).toEqual(["邮箱格式不正确"]);
	});

	it("passes parsed input to the handler", async () => {
		const handler = vi.fn((input: z.infer<typeof schema>) => ({
			email: input.email,
		}));
		const action = createAction(schema, handler);
		const result = await action({
			name: "  Alice  ",
			email: "  alice@example.com  ",
		});

		expect(result).toEqual({
			ok: true,
			data: { email: "alice@example.com" },
		});
		expect(handler).toHaveBeenCalledWith(
			{ name: "Alice", email: "alice@example.com" },
			{},
		);
	});

	it("maps ActionError to a typed payload", async () => {
		const action = createAction(schema, () => {
			throw new ActionError("EMAIL_TAKEN", "该邮箱已被使用", {
				email: ["该邮箱已被使用"],
			});
		});
		const result = await action({ name: "Alice", email: "alice@example.com" });

		expect(result.ok).toBe(false);
		if (result.ok) return;
		expect(result.error).toEqual({
			code: "EMAIL_TAKEN",
			message: "该邮箱已被使用",
			fieldErrors: { email: ["该邮箱已被使用"] },
		});
	});

	it("does not leak unknown error details", async () => {
		const action = createAction(schema, () => {
			throw new Error("database password leaked");
		});
		const result = await action({ name: "Alice", email: "alice@example.com" });

		expect(result.ok).toBe(false);
		if (result.ok) return;
		expect(result.error).toEqual({
			code: "INTERNAL_ERROR",
			message: "服务暂时不可用，请稍后重试",
		});
	});

	it("forwards the abort signal to the handler", async () => {
		const controller = new AbortController();
		const action = createAction(schema, (_input, context) => ({
			aborted: context.signal?.aborted ?? false,
		}));
		const result = await action(
			{ name: "Alice", email: "alice@example.com" },
			{ signal: controller.signal },
		);

		expect(result).toEqual({ ok: true, data: { aborted: false } });
	});
});
