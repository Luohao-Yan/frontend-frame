import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DeltaPill } from "../delta-pill";
import { Metric } from "../metric";
import { Odometer } from "../odometer";
import { Ruler } from "../ruler";
import { SectionLabel } from "../section-label";
import { SpecPlate } from "../spec-plate";
import { TickRing } from "../tick-ring";

describe("DeltaPill", () => {
	it("shows 新增 when fresh instead of a misleading +100%", () => {
		render(<DeltaPill value={100} fresh />);
		expect(screen.getByText("新增")).toBeTruthy();
		expect(screen.queryByText("+100%")).toBeNull();
	});

	it("formats positive / negative / zero directions", () => {
		const { unmount } = render(<DeltaPill value={12.5} />);
		expect(screen.getByText("+12.5%")).toBeTruthy();
		unmount();
		render(<DeltaPill value={-4} />);
		expect(screen.getByText("−4%")).toBeTruthy();
		unmount();
		render(<DeltaPill value={0} />);
		expect(screen.getByText("±0%")).toBeTruthy();
	});

	it("respects explicit up flag and exposes label via title", () => {
		render(<DeltaPill value={-8} up label="较上期" />);
		const pill = screen.getByTitle("较上期");
		expect(pill).toBeTruthy();
		expect(screen.getByText("+8%")).toBeTruthy();
	});
});

describe("Odometer", () => {
	it("formats grouped numbers and exposes the full text as aria-label", () => {
		const { container } = render(<Odometer value={12345} />);
		const el = screen.getByRole("img");
		expect(el.getAttribute("aria-label")).toBe("12,345");
		// 逐位滚动条 + 千分位分隔符都在 DOM 里
		expect(container.textContent).toContain(",");
		expect(container.querySelectorAll(".odo-strip")).toHaveLength(5);
	});

	it("respects decimals and grouping=false", () => {
		render(<Odometer value={1234.5} decimals={1} group={false} />);
		expect(screen.getByRole("img").getAttribute("aria-label")).toBe("1234.5");
	});

	it("renders a placeholder for null / NaN", () => {
		const { rerender } = render(<Odometer value={null} />);
		expect(screen.getByText("—")).toBeTruthy();
		rerender(<Odometer value={Number.NaN} />);
		expect(screen.getByText("—")).toBeTruthy();
	});

	it("renders one 0-9 strip per digit with right-to-left keys", () => {
		const { container } = render(<Odometer value={12} />);
		const strips = container.querySelectorAll(".odo-strip");
		// "12" → 个位(2) + 十位(1)
		expect(strips).toHaveLength(2);
		expect(strips[0]?.querySelectorAll("span")).toHaveLength(10);
	});
});

describe("Metric", () => {
	it("renders label, rolling value and unit", () => {
		render(
			<Metric value={96.4} decimals={1} unit="%" size="l" label="成功率" />,
		);
		expect(screen.getByText("成功率")).toBeTruthy();
		expect(screen.getByText("%")).toBeTruthy();
		expect(screen.getByRole("img").getAttribute("aria-label")).toBe("96.4");
	});
});

describe("SectionLabel", () => {
	it("renders the title with the requested heading level", () => {
		const { container } = render(
			<SectionLabel title="近 7 天操作量" as="h3" />,
		);
		expect(container.querySelector("h3")?.textContent).toBe("近 7 天操作量");
	});

	it("renders nothing but the mark when title is omitted", () => {
		const { container } = render(<SectionLabel />);
		expect(container.querySelector("h2")).toBeNull();
		expect(container.querySelector("h3")).toBeNull();
	});
});

describe("Ruler", () => {
	it("renders one label per entry plus a marker at the clamped position", () => {
		const { container } = render(
			<Ruler
				labels={["0", "25", "50", "75", "100"]}
				marker={1.2}
				markerLabel="108%"
			/>,
		);
		expect(container.querySelectorAll(".ruler-labels > span")).toHaveLength(5);
		const marker = container.querySelector(".ruler-marker") as HTMLElement;
		expect(marker.style.left).toBe("100%");
		expect(container.textContent).toContain("108%");
	});

	it("hides the marker when marker is null", () => {
		const { container } = render(<Ruler labels={["a", "b"]} />);
		expect(container.querySelector(".ruler-marker")).toBeNull();
	});
});

describe("SpecPlate", () => {
	it("renders key-value rows and defaults missing values to —", () => {
		render(
			<SpecPlate
				title="规格"
				rows={[
					{ label: "引擎", value: "v8" },
					{ label: "故障", value: null, tone: "red" },
				]}
			/>,
		);
		expect(screen.getByText("规格")).toBeTruthy();
		expect(screen.getByText("v8")).toBeTruthy();
		expect(screen.getByText("—")).toBeTruthy();
		expect(screen.getByText("故障")).toBeTruthy();
	});
});

describe("TickRing", () => {
	it("renders 60 ticks, lights a quarter at 25% and adds a cap", () => {
		const { container } = render(<TickRing value={25} />);
		const ticks = container.querySelectorAll(".ring-tick");
		expect(ticks).toHaveLength(60);
		expect(container.querySelectorAll(".ring-tick.is-on")).toHaveLength(15);
		expect(container.querySelector(".ring-cap")).toBeTruthy();
	});

	it("exposes an accessible label on the svg", () => {
		const { container } = render(<TickRing value={96.4} label="成功" />);
		expect(container.querySelector("svg")?.getAttribute("aria-label")).toBe(
			"成功 96.4%",
		);
	});

	it("renders no cap at 0%", () => {
		const { container } = render(<TickRing value={0} />);
		expect(container.querySelector(".ring-cap")).toBeNull();
		expect(container.querySelectorAll(".ring-tick.is-on")).toHaveLength(0);
	});
});
