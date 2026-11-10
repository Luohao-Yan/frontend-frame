import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { MiniSegmented } from "../primitives/mini-segmented";
import { ProductMockupCard } from "../primitives/product-mockup-card";

describe("MiniSegmented", () => {
	it("supports uncontrolled selection", async () => {
		const user = userEvent.setup();
		render(
			<MiniSegmented
				label="Range"
				options={[
					{ value: "7D", label: "7D" },
					{ value: "30D", label: "30D" },
				]}
			/>,
		);

		await user.click(screen.getByRole("button", { name: "30D" }));

		expect(screen.getByRole("button", { name: "30D" })).toHaveAttribute(
			"aria-pressed",
			"true",
		);
	});

	it("supports controlled selection", async () => {
		const user = userEvent.setup();
		const onValueChange = vi.fn();
		render(
			<MiniSegmented
				label="Range"
				value="7D"
				onValueChange={onValueChange}
				options={[
					{ value: "7D", label: "7D" },
					{ value: "30D", label: "30D" },
				]}
			/>,
		);

		await user.click(screen.getByRole("button", { name: "30D" }));

		expect(onValueChange).toHaveBeenCalledWith("30D");
		expect(screen.getByRole("button", { name: "7D" })).toHaveAttribute(
			"aria-pressed",
			"true",
		);
	});
});

describe("ProductMockupCard", () => {
	it("renders the mockup, eyebrow, title and description", () => {
		render(
			<ProductMockupCard
				eyebrow="Analytics"
				title="AI Sales Dashboard"
				description="Pipeline health at a glance."
			>
				<div>Mockup content</div>
			</ProductMockupCard>,
		);

		expect(screen.getByText("Mockup content")).toBeInTheDocument();
		expect(screen.getByText("Analytics")).toBeInTheDocument();
		expect(screen.getByText("AI Sales Dashboard")).toBeInTheDocument();
		expect(
			screen.getByText("Pipeline health at a glance."),
		).toBeInTheDocument();
	});
});
