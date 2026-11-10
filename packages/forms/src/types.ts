export type FieldErrors = Record<string, string[] | undefined>;

export interface ActionErrorPayload {
	code: string;
	message: string;
	fieldErrors?: FieldErrors;
}

export type ActionResult<T> =
	{ ok: true; data: T } | { ok: false; error: ActionErrorPayload };

export interface ActionContext {
	signal?: AbortSignal;
}

export class ActionError extends Error {
	readonly code: string;
	readonly fieldErrors?: FieldErrors;

	constructor(code: string, message: string, fieldErrors?: FieldErrors) {
		super(message);
		this.name = "ActionError";
		this.code = code;
		this.fieldErrors = fieldErrors;
	}
}

export function toActionErrorPayload(error: unknown): ActionErrorPayload {
	if (error instanceof ActionError) {
		return {
			code: error.code,
			message: error.message,
			fieldErrors: error.fieldErrors,
		};
	}

	return {
		code: "INTERNAL_ERROR",
		message: "服务暂时不可用，请稍后重试",
	};
}
