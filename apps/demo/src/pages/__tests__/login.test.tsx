import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import { LoginPage } from "../login";

afterEach(() => {
	vi.restoreAllMocks();
});

describe("LoginPage", () => {
	it("renders the login form over the flow grid background", () => {
		vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);

		const { container } = render(
			<MemoryRouter>
				<LoginPage />
			</MemoryRouter>,
		);

		expect(screen.getByText("登录工作台")).toBeInTheDocument();
		expect(screen.getByLabelText("邮箱")).toBeInTheDocument();
		expect(screen.getByLabelText("密码")).toBeInTheDocument();
		expect(container.querySelector("canvas")).toHaveAttribute(
			"aria-hidden",
			"true",
		);
	});

	it("submits through the real action contract and reports missing auth", async () => {
		vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
		const user = userEvent.setup();

		render(
			<MemoryRouter>
				<LoginPage />
			</MemoryRouter>,
		);

		await user.type(screen.getByLabelText("邮箱"), "alice@example.com");
		await user.type(screen.getByLabelText("密码"), "password123");
		await user.click(screen.getByRole("button", { name: "登录" }));

		expect(await screen.findByText(/认证服务尚未接入/)).toBeInTheDocument();
	});
});
