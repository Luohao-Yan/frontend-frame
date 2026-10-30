import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Alert, AlertDescription, AlertTitle } from "../alert";
import { Badge } from "../badge";
import { Button } from "../button";
import { Checkbox } from "../checkbox";

describe("Button", () => {
	it("renders its children", () => {
		render(<Button>Save</Button>);
		expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
	});

	it("is disabled when disabled prop is set", () => {
		render(<Button disabled>Save</Button>);
		expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
	});

	it("fires onClick when clicked", () => {
		const onClick = vi.fn();
		render(<Button onClick={onClick}>Save</Button>);
		fireEvent.click(screen.getByRole("button", { name: "Save" }));
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it("renders as a link via asChild", () => {
		render(
			<Button asChild>
				<a href="/x">Go</a>
			</Button>,
		);
		expect(screen.getByRole("link", { name: "Go" })).toBeInTheDocument();
	});
});

describe("Checkbox", () => {
	it("toggles checked state on click", () => {
		const onCheckedChange = vi.fn();
		render(<Checkbox onCheckedChange={onCheckedChange} />);
		const checkbox = screen.getByRole("checkbox");
		fireEvent.click(checkbox);
		expect(onCheckedChange).toHaveBeenCalledWith(true);
	});
});

describe("Badge", () => {
	it("renders its content", () => {
		render(<Badge>New</Badge>);
		expect(screen.getByText("New")).toBeInTheDocument();
	});
});

describe("Alert", () => {
	it("renders title and description with role=alert", () => {
		render(
			<Alert>
				<AlertTitle>Heads up</AlertTitle>
				<AlertDescription>Something happened.</AlertDescription>
			</Alert>,
		);
		const alert = screen.getByRole("alert");
		expect(alert).toBeInTheDocument();
		expect(screen.getByText("Heads up")).toBeInTheDocument();
		expect(screen.getByText("Something happened.")).toBeInTheDocument();
	});
});
