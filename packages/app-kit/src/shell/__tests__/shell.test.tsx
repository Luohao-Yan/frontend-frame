import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AppShell } from "../app-shell";
import { ErrorBoundary } from "../error-boundary";
import { RouteBoundary } from "../route-boundary";
import { SkipLink } from "../skip-link";

describe("SkipLink", () => {
	it("links to the main content by default", () => {
		render(<SkipLink />);

		expect(screen.getByRole("link", { name: "跳到主要内容" })).toHaveAttribute(
			"href",
			"#main-content",
		);
	});
});

describe("AppShell", () => {
	it("renders all slots and a focusable main region", () => {
		render(
			<AppShell
				sidebar={<aside>Sidebar</aside>}
				header={<header>Header</header>}
				footer={<footer>Footer</footer>}
				overlay={<div>Overlay</div>}
			>
				<p>Content</p>
			</AppShell>,
		);

		expect(screen.getByText("Sidebar")).toBeInTheDocument();
		expect(screen.getByText("Header")).toBeInTheDocument();
		expect(screen.getByText("Footer")).toBeInTheDocument();
		expect(screen.getByText("Overlay")).toBeInTheDocument();
		expect(screen.getByRole("main")).toHaveAttribute("id", "main-content");
		expect(screen.getByRole("main")).toHaveAttribute("tabindex", "-1");
		expect(screen.getByRole("link", { name: "跳到主要内容" })).toHaveAttribute(
			"href",
			"#main-content",
		);
	});

	it("can disable the skip link", () => {
		render(
			<AppShell skipLink={false}>
				<p>Content</p>
			</AppShell>,
		);

		expect(
			screen.queryByRole("link", { name: "跳到主要内容" }),
		).not.toBeInTheDocument();
	});

	it("uses document height by default", () => {
		const { container } = render(
			<AppShell>
				<p>Content</p>
			</AppShell>,
		);
		const shell = container.firstElementChild;

		expect(shell).toHaveAttribute("data-height-mode", "document");
		expect(shell).toHaveClass("min-h-svh");
		expect(screen.getByRole("main")).not.toHaveClass("overflow-auto");
	});

	it("supports a viewport-height shell with an independently scrolling main", () => {
		const { container } = render(
			<AppShell heightMode="viewport">
				<p>Content</p>
			</AppShell>,
		);
		const shell = container.firstElementChild;
		const main = screen.getByRole("main");

		expect(shell).toHaveAttribute("data-height-mode", "viewport");
		expect(shell).toHaveClass("h-svh", "overflow-hidden");
		expect(main).toHaveClass("min-h-0", "flex-1", "overflow-auto");
	});
});

describe("RouteBoundary", () => {
	it("renders the not-found defaults", () => {
		render(<RouteBoundary variant="not-found" />);

		expect(screen.getByText("404")).toBeInTheDocument();
		expect(
			screen.getByRole("heading", { name: "页面不存在" }),
		).toBeInTheDocument();
	});

	it("renders an alert and calls onRetry", () => {
		const onRetry = vi.fn();
		render(<RouteBoundary variant="error" onRetry={onRetry} />);

		expect(screen.getByRole("alert")).toBeInTheDocument();
		fireEvent.click(screen.getByRole("button", { name: "重试" }));
		expect(onRetry).toHaveBeenCalledTimes(1);
	});

	it("renders a loading skeleton with aria-busy", () => {
		const { container } = render(<RouteBoundary variant="loading" />);

		expect(container.firstElementChild).toHaveAttribute("aria-busy", "true");
		expect(screen.getByText("正在加载")).toBeInTheDocument();
	});
});

describe("ErrorBoundary", () => {
	function Boom(): never {
		throw new Error("boom");
	}

	it("catches render errors and reports them", () => {
		const consoleError = vi
			.spyOn(console, "error")
			.mockImplementation(() => undefined);
		const onError = vi.fn();

		render(
			<ErrorBoundary onError={onError}>
				<Boom />
			</ErrorBoundary>,
		);

		expect(screen.getByRole("alert")).toBeInTheDocument();
		expect(screen.getByText("页面出错了")).toBeInTheDocument();
		expect(onError).toHaveBeenCalledTimes(1);

		consoleError.mockRestore();
	});

	it("supports a custom fallback with reset", () => {
		const consoleError = vi
			.spyOn(console, "error")
			.mockImplementation(() => undefined);

		render(
			<ErrorBoundary
				fallback={({ error, reset }) => (
					<div>
						<span>{error.message}</span>
						<button type="button" onClick={reset}>
							reset
						</button>
					</div>
				)}
			>
				<Boom />
			</ErrorBoundary>,
		);

		expect(screen.getByText("boom")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "reset" })).toBeInTheDocument();

		consoleError.mockRestore();
	});
});
