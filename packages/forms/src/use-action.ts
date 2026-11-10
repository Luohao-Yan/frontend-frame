"use client";

import * as React from "react";

import {
	toActionErrorPayload,
	type ActionErrorPayload,
	type ActionResult,
} from "./types";

export type ActionStatus = "idle" | "pending" | "success" | "error";

type ActionState<TOutput> =
	| { status: "idle" }
	| { status: "pending" }
	| { status: "success"; data: TOutput }
	| { status: "error"; error: ActionErrorPayload };

export interface UseActionReturn<TInput, TOutput> {
	status: ActionStatus;
	data?: TOutput;
	error?: ActionErrorPayload;
	execute: (input: TInput) => Promise<ActionResult<TOutput>>;
	reset: () => void;
	isExecuting: boolean;
	hasSucceeded: boolean;
	hasErrored: boolean;
}

export function useAction<TInput, TOutput>(
	action: (input: TInput) => Promise<ActionResult<TOutput>>,
): UseActionReturn<TInput, TOutput> {
	const [state, setState] = React.useState<ActionState<TOutput>>({
		status: "idle",
	});
	const mountedRef = React.useRef(true);
	const pendingRef = React.useRef<Promise<ActionResult<TOutput>> | null>(null);
	const runIdRef = React.useRef(0);

	React.useEffect(() => {
		mountedRef.current = true;
		return () => {
			mountedRef.current = false;
		};
	}, []);

	const execute = React.useCallback(
		(input: TInput): Promise<ActionResult<TOutput>> => {
			if (pendingRef.current) {
				return pendingRef.current;
			}

			setState({ status: "pending" });
			const runId = ++runIdRef.current;

			const promise = Promise.resolve()
				.then(() => action(input))
				.catch((error: unknown): ActionResult<TOutput> => ({
					ok: false,
					error: toActionErrorPayload(error),
				}))
				.then((result) => {
					if (mountedRef.current && runId === runIdRef.current) {
						setState(
							result.ok
								? { status: "success", data: result.data }
								: { status: "error", error: result.error },
						);
					}
					return result;
				})
				.finally(() => {
					pendingRef.current = null;
				});

			pendingRef.current = promise;
			return promise;
		},
		[action],
	);

	const reset = React.useCallback(() => {
		runIdRef.current += 1;
		pendingRef.current = null;
		setState({ status: "idle" });
	}, []);

	return {
		status: state.status,
		data: state.status === "success" ? state.data : undefined,
		error: state.status === "error" ? state.error : undefined,
		execute,
		reset,
		isExecuting: state.status === "pending",
		hasSucceeded: state.status === "success",
		hasErrored: state.status === "error",
	};
}
