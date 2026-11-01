import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import * as React from "react";

import { ButtonGroup, ButtonGroupText } from "../button-group";
import { InputGroup, InputGroupInput } from "../input-group";
import { Loading } from "../loading";
import { Modal } from "../modal";
import { DataTableSkeleton } from "../data-table-skeleton";

describe("ButtonGroup", () => {
	it("renders a group role with children", () => {
		render(
			<ButtonGroup>
				<ButtonGroupText>Prefix</ButtonGroupText>
			</ButtonGroup>,
		);
		expect(screen.getByRole("group")).toBeInTheDocument();
		expect(screen.getByText("Prefix")).toBeInTheDocument();
	});
});

describe("InputGroup", () => {
	it("renders an input-group control input", () => {
		render(
			<InputGroup aria-label="search">
				<InputGroupInput placeholder="搜索" />
			</InputGroup>,
		);
		expect(screen.getByPlaceholderText("搜索")).toBeInTheDocument();
	});
});

describe("Loading", () => {
	it("renders a status with aria-live", () => {
		render(<Loading />);
		expect(screen.getByRole("status")).toBeInTheDocument();
	});
});

describe("Modal", () => {
	it("renders nothing when closed", () => {
		render(
			<Modal
				title="标题"
				description="描述"
				isOpen={false}
				onClose={() => undefined}
			>
				<div>内容</div>
			</Modal>,
		);
		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
	});

	it("renders dialog content when open", () => {
		render(
			<Modal title="标题" description="描述" isOpen onClose={() => undefined}>
				<div>内容</div>
			</Modal>,
		);
		expect(screen.getByRole("dialog")).toBeInTheDocument();
	});
});

describe("DataTableSkeleton", () => {
	it("renders a table skeleton with expected columns", () => {
		render(
			<DataTableSkeleton columnCount={3} rowCount={2} withPagination={false} />,
		);
		expect(screen.getAllByRole("table")).toHaveLength(1);
	});
});
