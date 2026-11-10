import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { WorkflowAutomation } from "../mockups/workflow-automation";

const nodes = [
	{ id: "deal", type: "trigger" as const, title: "New deal created" },
	{ id: "score", type: "condition" as const, title: "AI deal score" },
	{ id: "slack", type: "action" as const, title: "Notify in Slack" },
	{ id: "sequence", type: "action" as const, title: "Add to sequence" },
	{ id: "owner", type: "action" as const, title: "Assign to AE" },
];

describe("WorkflowAutomation", () => {
	it("renders nodes and auto-generated edges", () => {
		render(<WorkflowAutomation nodes={nodes} animated={false} />);

		expect(
			screen.getByRole("group", {
				name: "Workflow automation with 5 nodes",
			}),
		).toBeInTheDocument();
		expect(screen.getByText("New deal created")).toBeInTheDocument();
		expect(screen.getByText("AI deal score")).toBeInTheDocument();
		expect(screen.getByText("Notify in Slack")).toBeInTheDocument();
		expect(screen.getAllByTestId("workflow-node")).toHaveLength(5);
		expect(screen.getAllByTestId("workflow-edge").length).toBeGreaterThan(0);
	});

	it("renders an empty state when there are no nodes", () => {
		render(<WorkflowAutomation nodes={[]} animated={false} />);

		expect(
			screen.getByRole("img", { name: "Workflow has no nodes" }),
		).toBeInTheDocument();
		expect(screen.getByText("No workflow nodes")).toBeInTheDocument();
	});
});
