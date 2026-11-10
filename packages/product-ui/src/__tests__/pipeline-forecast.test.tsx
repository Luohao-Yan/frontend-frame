import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { PipelineForecast } from "../mockups/pipeline-forecast";

const data = [
	{ label: "Apr", value: 40 },
	{ label: "May", value: 52 },
	{ label: "Jun", value: 48 },
	{ label: "Jul", value: 64 },
	{ label: "Aug", value: 58 },
	{ label: "Sep", value: 96, accent: true },
	{ label: "Oct", value: 72 },
	{ label: "Nov", value: 84 },
	{ label: "Dec", value: 78 },
];

describe("PipelineForecast", () => {
	it("renders the chart with an accessible summary", () => {
		render(
			<PipelineForecast
				data={data}
				total="$204,820"
				delta="▲ 84% vs Aug"
				animated={false}
			/>,
		);

		expect(
			screen.getByRole("img", {
				name: "Pipeline forecast total $204,820, ▲ 84% vs Aug",
			}),
		).toBeInTheDocument();
		expect(screen.getByText("Pipeline Forecast")).toBeInTheDocument();
		expect(screen.getByText("Last 12 months")).toBeInTheDocument();
		expect(screen.getByText("$204,820")).toBeInTheDocument();
	});

	it("reports range changes", async () => {
		const user = userEvent.setup();
		const onRangeChange = vi.fn();

		render(
			<PipelineForecast
				data={data}
				total="$204,820"
				delta="▲ 84% vs Aug"
				onRangeChange={onRangeChange}
				animated={false}
			/>,
		);

		await user.click(screen.getByRole("button", { name: "30D" }));

		expect(onRangeChange).toHaveBeenCalledWith("30D");
	});

	it("renders an empty state when there is no data", () => {
		render(
			<PipelineForecast
				data={[]}
				total="$0"
				delta="No change"
				animated={false}
			/>,
		);

		expect(
			screen.getByRole("img", { name: "Pipeline forecast has no data" }),
		).toBeInTheDocument();
		expect(screen.getByText("No pipeline data")).toBeInTheDocument();
	});
});
