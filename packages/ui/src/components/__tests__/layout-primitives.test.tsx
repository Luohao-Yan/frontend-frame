import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Container } from "../container";
import { DashedLine } from "../dashed-line";
import { PageSection } from "../page-section";
import { SectionBackdrop } from "../section-backdrop";

describe("Container", () => {
	it("renders children with the default container class", () => {
		render(<Container data-testid="container">Content</Container>);

		expect(screen.getByTestId("container")).toHaveClass("container-page");
		expect(screen.getByText("Content")).toBeInTheDocument();
	});

	it("supports small and large sizes", () => {
		const { rerender } = render(
			<Container data-testid="container" size="small">
				Content
			</Container>,
		);
		expect(screen.getByTestId("container")).toHaveClass("max-w-[960px]");

		rerender(
			<Container data-testid="container" size="large">
				Content
			</Container>,
		);
		expect(screen.getByTestId("container")).toHaveClass("max-w-[1440px]");
	});
});

describe("PageSection", () => {
	it("renders the configured spacing", () => {
		render(
			<PageSection data-testid="section" spacing="tight">
				Content
			</PageSection>,
		);

		expect(screen.getByTestId("section")).toHaveClass("py-12", "lg:py-16");
	});

	it("can render as another element", () => {
		render(
			<PageSection as="div" data-testid="section">
				Content
			</PageSection>,
		);

		expect(screen.getByTestId("section").tagName).toBe("DIV");
	});
});

describe("SectionBackdrop", () => {
	it("applies the top variant by default", () => {
		render(<SectionBackdrop data-testid="backdrop">Content</SectionBackdrop>);

		expect(screen.getByTestId("backdrop")).toHaveClass(
			"rounded-t-4xl",
			"rounded-b-2xl",
		);
	});

	it("applies the bottom variant", () => {
		render(
			<SectionBackdrop data-testid="backdrop" variant="bottom">
				Content
			</SectionBackdrop>,
		);

		expect(screen.getByTestId("backdrop")).toHaveClass(
			"rounded-t-2xl",
			"rounded-b-4xl",
		);
	});
});

describe("DashedLine", () => {
	it("renders a decorative horizontal line by default", () => {
		const { container } = render(<DashedLine />);
		const root = container.firstElementChild;

		expect(root).toHaveAttribute("aria-hidden", "true");
		expect(root).toHaveClass("h-px", "w-full");
	});

	it("renders a vertical line", () => {
		const { container } = render(<DashedLine orientation="vertical" />);
		const root = container.firstElementChild;

		expect(root).toHaveClass("h-full", "w-px");
	});
});
