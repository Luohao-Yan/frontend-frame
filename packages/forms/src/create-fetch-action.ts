import {
	toActionErrorPayload,
	type ActionContext,
	type ActionErrorPayload,
	type ActionResult,
	type FieldErrors,
} from "./types";

export interface FetchActionOptions<TInput, TOutput> {
	endpoint: string;
	method?: "POST" | "PUT" | "PATCH" | "DELETE";
	headers?: HeadersInit;
	credentials?: RequestCredentials;
	timeoutMs?: number;
	fetchImpl?: typeof fetch;
	mapInput?: (input: TInput) => unknown;
	parseOutput?: (payload: unknown) => TOutput;
}

function isAbortError(error: unknown) {
	return (
		(typeof DOMException !== "undefined" &&
			error instanceof DOMException &&
			error.name === "AbortError") ||
		(error instanceof Error && error.name === "AbortError")
	);
}

function combineSignals(signals: AbortSignal[]): AbortSignal {
	if (signals.length === 1) {
		return signals[0];
	}

	if (typeof AbortSignal.any === "function") {
		return AbortSignal.any(signals);
	}

	const controller = new AbortController();
	const abort = () => controller.abort();
	for (const signal of signals) {
		if (signal.aborted) {
			abort();
			break;
		}
		signal.addEventListener("abort", abort, { once: true });
	}
	return controller.signal;
}

function readFieldErrors(value: unknown): FieldErrors | undefined {
	if (!value || typeof value !== "object" || Array.isArray(value)) {
		return undefined;
	}

	const entries = Object.entries(value).filter(([, messages]) => {
		return (
			Array.isArray(messages) &&
			messages.every((message) => typeof message === "string")
		);
	});

	if (entries.length === 0) {
		return undefined;
	}

	return Object.fromEntries(entries) as FieldErrors;
}

function readErrorPayload(payload: unknown): ActionErrorPayload | null {
	if (!payload || typeof payload !== "object") {
		return null;
	}

	const record = payload as Record<string, unknown>;
	const code = typeof record.code === "string" ? record.code : undefined;
	const message =
		typeof record.message === "string" ? record.message : undefined;
	const fieldErrors =
		readFieldErrors(record.fieldErrors) ?? readFieldErrors(record.errors);

	if (!code && !message && !fieldErrors) {
		return null;
	}

	return {
		code: code ?? "REQUEST_FAILED",
		message: message ?? "请求失败",
		fieldErrors,
	};
}

export function createFetchAction<TInput, TOutput>({
	endpoint,
	method = "POST",
	headers,
	credentials,
	timeoutMs = 15_000,
	fetchImpl = globalThis.fetch,
	mapInput = (input) => input,
	parseOutput,
}: FetchActionOptions<TInput, TOutput>) {
	return async (
		input: TInput,
		context: ActionContext = {},
	): Promise<ActionResult<TOutput>> => {
		if (!fetchImpl) {
			return {
				ok: false,
				error: {
					code: "FETCH_UNAVAILABLE",
					message: "当前环境不支持网络请求",
				},
			};
		}

		const controller = new AbortController();
		const timeout =
			timeoutMs > 0
				? setTimeout(() => controller.abort(), timeoutMs)
				: undefined;
		const signal = context.signal
			? combineSignals([context.signal, controller.signal])
			: controller.signal;

		try {
			const requestHeaders = new Headers(headers);
			if (!requestHeaders.has("Content-Type")) {
				requestHeaders.set("Content-Type", "application/json");
			}

			const response = await fetchImpl(endpoint, {
				method,
				headers: requestHeaders,
				credentials,
				body: JSON.stringify(mapInput(input)),
				signal,
			});

			const text = await response.text();
			let payload: unknown = null;

			if (text) {
				try {
					payload = JSON.parse(text);
				} catch {
					return {
						ok: false,
						error: {
							code: "INVALID_RESPONSE",
							message: "服务返回了无法解析的数据",
						},
					};
				}
			}

			if (!response.ok) {
				return {
					ok: false,
					error: readErrorPayload(payload) ?? {
						code: `HTTP_${response.status}`,
						message: response.statusText || "请求失败",
					},
				};
			}

			try {
				return {
					ok: true,
					data: parseOutput ? parseOutput(payload) : (payload as TOutput),
				};
			} catch (error) {
				return { ok: false, error: toActionErrorPayload(error) };
			}
		} catch (error) {
			if (isAbortError(error)) {
				return {
					ok: false,
					error: {
						code: "ABORTED",
						message: "请求已取消或超时",
					},
				};
			}

			return {
				ok: false,
				error: {
					code: "NETWORK_ERROR",
					message: "网络请求失败，请检查连接后重试",
				},
			};
		} finally {
			if (timeout) {
				clearTimeout(timeout);
			}
		}
	};
}
