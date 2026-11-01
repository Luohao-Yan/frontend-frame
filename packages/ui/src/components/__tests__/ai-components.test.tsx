import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ApprovalCard } from "../approval-card";
import { NotificationCard } from "../notification-card";
import { StreamingText } from "../streaming-text";

describe("ApprovalCard", () => {
	it("renders the first question with its options", () => {
		render(
			<ApprovalCard
				questions={[
					{ q: "是否允许？", type: "radio", options: ["允许", "拒绝"] },
				]}
			/>,
		);
		expect(screen.getByText("是否允许？")).toBeInTheDocument();
		expect(screen.getByText("允许")).toBeInTheDocument();
		expect(screen.getByText("拒绝")).toBeInTheDocument();
	});

	it("shows submitted state when sent", () => {
		render(
			<ApprovalCard
				sent
				questions={[
					{ q: "是否允许？", type: "radio", options: ["允许", "拒绝"] },
				]}
			/>,
		);
		expect(screen.getByText("已提交")).toBeInTheDocument();
	});
});

describe("NotificationCard", () => {
	it("renders title and body", () => {
		render(
			<NotificationCard id="1" title="新评论" body="有人回复了你的评论" />,
		);
		expect(screen.getByText("新评论")).toBeInTheDocument();
		expect(screen.getByText("有人回复了你的评论")).toBeInTheDocument();
	});
});

describe("StreamingText", () => {
	it("renders streamed text with a cursor while streaming", () => {
		render(<StreamingText text="你好" phase="streaming" />);
		expect(screen.getByText("你好")).toBeInTheDocument();
	});

	it("returns null in idle with no text", () => {
		const { container } = render(<StreamingText text="" phase="idle" />);
		expect(container.firstChild).toBeNull();
	});

	it("shows error message when error is set", () => {
		render(<StreamingText text="部分内容" phase="done" error="连接中断" />);
		expect(screen.getByText("连接中断")).toBeInTheDocument();
	});
});
