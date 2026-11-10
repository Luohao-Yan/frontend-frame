import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { FlowGridBackground } from "../flow-grid-background";

afterEach(() => {
	vi.restoreAllMocks();
});

describe("FlowGridBackground", () => {
	it("renders a decorative canvas and degrades when WebGL is unavailable", () => {
		const getContext = vi
			.spyOn(HTMLCanvasElement.prototype, "getContext")
			.mockReturnValue(null);

		const { container } = render(
			<FlowGridBackground className="test-background" />,
		);
		const canvas = container.querySelector("canvas");

		expect(canvas).toHaveAttribute("aria-hidden", "true");
		expect(canvas).toHaveClass(
			"pointer-events-none",
			"block",
			"h-full",
			"w-full",
			"test-background",
		);
		expect(getContext).toHaveBeenCalledWith(
			"webgl",
			expect.objectContaining({ alpha: true, antialias: false }),
		);
	});
});
