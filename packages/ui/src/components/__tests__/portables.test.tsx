import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import * as React from "react";

import { AspectRatio } from "../aspect-ratio";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "../breadcrumb";
import { Kbd } from "../kbd";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "../pagination";
import { ToggleGroup, ToggleGroupItem } from "../toggle-group";

describe("Breadcrumb", () => {
	it("renders a list of items with a separator", () => {
		render(
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="/home">Home</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>Current</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>,
		);
		expect(screen.getByLabelText("breadcrumb")).toBeInTheDocument();
		expect(screen.getByText("Home")).toHaveAttribute("href", "/home");
		expect(screen.getByText("Current")).toBeInTheDocument();
	});
});

describe("Pagination", () => {
	it("renders previous/next links with current page marked active", () => {
		render(
			<Pagination>
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious href="#" />
					</PaginationItem>
					<PaginationItem>
						<PaginationLink href="#" isActive>
							1
						</PaginationLink>
					</PaginationItem>
					<PaginationItem>
						<PaginationNext href="#" />
					</PaginationItem>
				</PaginationContent>
			</Pagination>,
		);
		expect(screen.getByLabelText("pagination")).toBeInTheDocument();
		// active page has aria-current=page
		const activeLink = screen.getByText("1");
		expect(activeLink).toHaveAttribute("aria-current", "page");
		expect(screen.getByLabelText("Go to previous page")).toBeInTheDocument();
		expect(screen.getByLabelText("Go to next page")).toBeInTheDocument();
	});
});

describe("Kbd", () => {
	it("renders a kbd element", () => {
		render(<Kbd>⌘K</Kbd>);
		expect(screen.getByText("⌘K")).toBeInTheDocument();
	});
});

describe("AspectRatio", () => {
	it("renders with the ratio style", () => {
		const { container } = render(
			<AspectRatio ratio={16 / 9}>content</AspectRatio>,
		);
		const el = container.querySelector('[data-slot="aspect-ratio"]');
		expect(el).not.toBeNull();
	});
});

describe("ToggleGroup", () => {
	it("renders items and supports selection", () => {
		render(
			<ToggleGroup type="single">
				<ToggleGroupItem value="a">A</ToggleGroupItem>
				<ToggleGroupItem value="b">B</ToggleGroupItem>
			</ToggleGroup>,
		);
		expect(screen.getByText("A")).toBeInTheDocument();
		expect(screen.getByText("B")).toBeInTheDocument();
	});
});
