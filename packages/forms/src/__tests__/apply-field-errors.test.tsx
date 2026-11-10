import { act, renderHook } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";

import { applyFieldErrors } from "../apply-field-errors";

describe("applyFieldErrors", () => {
	it("applies the first server message to each field", () => {
		const { result } = renderHook(() =>
			useForm<{ email: string; name: string }>({
				defaultValues: { email: "", name: "" },
			}),
		);

		act(() => {
			const applied = applyFieldErrors(result.current, {
				email: ["邮箱已被使用", "请更换邮箱"],
				name: ["姓名不可用"],
			});
			expect(applied).toBe(2);
		});

		expect(result.current.getFieldState("email").error?.message).toBe(
			"邮箱已被使用",
		);
		expect(result.current.getFieldState("name").error?.message).toBe(
			"姓名不可用",
		);
	});

	it("ignores empty message lists", () => {
		const { result } = renderHook(() =>
			useForm<{ email: string }>({
				defaultValues: { email: "" },
			}),
		);

		act(() => {
			const applied = applyFieldErrors(result.current, {
				email: [],
				missing: undefined,
			});
			expect(applied).toBe(0);
		});
	});
});
