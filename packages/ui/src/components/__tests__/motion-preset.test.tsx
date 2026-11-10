import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
	MotionPresetProvider,
	useMotionPreset,
} from "../motion-preset-provider";
import { Reveal } from "../reveal";
import { Stagger, StaggerItem } from "../stagger";

function PresetProbe() {
	return <span data-testid="preset">{useMotionPreset()}</span>;
}

describe("MotionPresetProvider", () => {
	it("exposes the configured preset", () => {
		render(
			<MotionPresetProvider preset="playful">
				<PresetProbe />
			</MotionPresetProvider>,
		);

		expect(screen.getByTestId("preset")).toHaveTextContent("playful");
	});

	it("defaults to subtle", () => {
		render(
			<MotionPresetProvider>
				<PresetProbe />
			</MotionPresetProvider>,
		);

		expect(screen.getByTestId("preset")).toHaveTextContent("subtle");
	});
});

describe("Reveal", () => {
	it("renders children without animation when motion is disabled", () => {
		render(
			<MotionPresetProvider preset="none">
				<Reveal>
					<span>Hello</span>
				</Reveal>
			</MotionPresetProvider>,
		);

		expect(screen.getByText("Hello")).toBeInTheDocument();
	});
});

describe("Stagger", () => {
	it("renders items without animation when motion is disabled", () => {
		render(
			<MotionPresetProvider preset="none">
				<Stagger>
					<StaggerItem>
						<span>One</span>
					</StaggerItem>
					<StaggerItem>
						<span>Two</span>
					</StaggerItem>
				</Stagger>
			</MotionPresetProvider>,
		);

		expect(screen.getByText("One")).toBeInTheDocument();
		expect(screen.getByText("Two")).toBeInTheDocument();
	});
});
