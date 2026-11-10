import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
	UiAdaptersProvider,
	useUiAdapters,
	type UiAdapters,
} from "../ui-adapters";

function Probe() {
	const { usePathname } = useUiAdapters();
	return <span>{usePathname()}</span>;
}

const adapters: UiAdapters = {
	Link: ({ href, children, ...props }) => (
		<a href={href} {...props}>
			{children}
		</a>
	),
	usePathname: () => "/dashboard",
};

describe("UiAdaptersProvider", () => {
	it("exposes adapters to descendants", () => {
		render(
			<UiAdaptersProvider adapters={adapters}>
				<Probe />
			</UiAdaptersProvider>,
		);

		expect(screen.getByText("/dashboard")).toBeInTheDocument();
	});

	it("throws an actionable error when the provider is missing", () => {
		const consoleError = vi
			.spyOn(console, "error")
			.mockImplementation(() => undefined);

		expect(() => render(<Probe />)).toThrow(/UiAdaptersProvider/);

		consoleError.mockRestore();
	});
});
