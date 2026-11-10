import type { z } from "zod";

import {
	toActionErrorPayload,
	type ActionContext,
	type ActionResult,
} from "./types";

export type ActionHandler<TInput, TOutput> = (
	input: TInput,
	context: ActionContext,
) => Promise<TOutput> | TOutput;

export function createAction<TSchema extends z.ZodType, TOutput>(
	schema: TSchema,
	handler: ActionHandler<z.infer<TSchema>, TOutput>,
) {
	return async (
		raw: unknown,
		context: ActionContext = {},
	): Promise<ActionResult<TOutput>> => {
		const parsed = schema.safeParse(raw);

		if (!parsed.success) {
			return {
				ok: false,
				error: {
					code: "VALIDATION_ERROR",
					message: "提交内容有误，请检查后重试",
					fieldErrors: parsed.error.flatten().fieldErrors,
				},
			};
		}

		try {
			return {
				ok: true,
				data: await handler(parsed.data, context),
			};
		} catch (error) {
			return {
				ok: false,
				error: toActionErrorPayload(error),
			};
		}
	};
}
