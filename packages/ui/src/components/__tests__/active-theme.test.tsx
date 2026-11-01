import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";

import {
	ActiveThemeProvider,
	ThemeSelector,
	useActiveTheme,
} from "../../index";

function Probe() {
	const { activeTheme } = useActiveTheme();
	return <span data-testid="active-theme">{activeTheme}</span>;
}

describe("ActiveThemeProvider", () => {
	it("sets a default active theme on the document root", async () => {
		render(
			<ActiveThemeProvider>
				<Probe />
			</ActiveThemeProvider>,
		);

		expect(screen.getByTestId("active-theme")).toHaveTextContent("glass");

		await waitFor(() => {
			expect(document.documentElement.getAttribute("data-theme")).toBe("glass");
		});
	});

	it("switches active theme and reflects on the document root", async () => {
		render(
			<ActiveThemeProvider>
				<Probe />
				<ThemeSelector />
			</ActiveThemeProvider>,
		);

		// open the selector
		fireEvent.click(screen.getByRole("combobox"));
		await screen.findByText("Claude");
		fireEvent.click(screen.getByText("Claude"));

		await waitFor(() => {
			expect(screen.getByTestId("active-theme")).toHaveTextContent("claude");
		});
		expect(document.documentElement.getAttribute("data-theme")).toBe("claude");
	});
});
