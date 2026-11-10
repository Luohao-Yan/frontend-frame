import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

import type { FieldErrors } from "./types";

export function applyFieldErrors<TFieldValues extends FieldValues>(
	form: UseFormReturn<TFieldValues>,
	fieldErrors?: FieldErrors,
) {
	if (!fieldErrors) {
		return 0;
	}

	let applied = 0;
	for (const [name, messages] of Object.entries(fieldErrors)) {
		const message = messages?.[0];
		if (!message) {
			continue;
		}

		form.setError(name as Path<TFieldValues>, {
			type: "server",
			message,
		});
		applied += 1;
	}

	return applied;
}
