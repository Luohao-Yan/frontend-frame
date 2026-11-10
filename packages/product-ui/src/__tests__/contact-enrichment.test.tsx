import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ContactEnrichment } from "../mockups/contact-enrichment";

const person = {
	name: "Maya Chen",
	role: "VP Sales",
	company: "Basepoint",
};

const fields = [
	{ label: "Email", value: "maya@basepoint.io" },
	{ label: "Phone", value: "+1 415 555 0100" },
	{ label: "Company", value: "Basepoint" },
	{ label: "Industry", value: "Software (B2B)", enriched: true },
	{ label: "Headcount" },
	{ label: "Region", value: "North America" },
];

describe("ContactEnrichment", () => {
	it("renders the person, fields and enriched state", () => {
		render(
			<ContactEnrichment person={person} fields={fields} animated={false} />,
		);

		expect(
			screen.getByRole("group", {
				name: "Maya Chen, VP Sales at Basepoint",
			}),
		).toBeInTheDocument();
		expect(screen.getByText("Maya Chen")).toBeInTheDocument();
		expect(screen.getByText("VP Sales · Basepoint")).toBeInTheDocument();
		expect(screen.getByText("Software (B2B)")).toBeInTheDocument();
		expect(screen.getByText(/AI enriched/)).toBeInTheDocument();
	});

	it("renders a skeleton and accessible fallback for missing values", () => {
		render(
			<ContactEnrichment person={person} fields={fields} animated={false} />,
		);

		expect(screen.getByText("Not provided")).toBeInTheDocument();
		expect(screen.getAllByText("Headcount").length).toBeGreaterThan(0);
	});
});
