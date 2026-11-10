import "@testing-library/jest-dom/vitest";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProductUiPage } from "../product-ui";

describe("ProductUiPage", () => {
	it("renders the three product mockups and the feature frame", () => {
		render(<ProductUiPage />);

		expect(
			screen.getByRole("heading", { level: 1, name: "产品 UI 模拟层" }),
		).toBeInTheDocument();
		expect(
			screen.getAllByRole("img", {
				name: /Pipeline forecast total \$204,820/,
			}),
		).toHaveLength(2);
		expect(
			screen.getByRole("group", {
				name: "Maya Chen, VP Sales at Basepoint",
			}),
		).toBeInTheDocument();
		expect(
			screen.getByRole("group", {
				name: "Workflow automation with 5 nodes",
			}),
		).toBeInTheDocument();
		expect(screen.getByText("产品截图容器")).toBeInTheDocument();
	});
});
