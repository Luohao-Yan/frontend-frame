import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from "../dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../tabs";

describe("Dialog", () => {
	it("opens content when trigger is clicked", async () => {
		const user = userEvent.setup();
		render(
			<Dialog>
				<DialogTrigger>Open</DialogTrigger>
				<DialogContent>
					<DialogTitle>Title</DialogTitle>
					<DialogDescription>Description body</DialogDescription>
				</DialogContent>
			</Dialog>,
		);
		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
		await user.click(screen.getByText("Open"));
		expect(screen.getByRole("dialog")).toBeInTheDocument();
		expect(screen.getByText("Description body")).toBeInTheDocument();
	});
});

describe("Tabs", () => {
	it("switches content when trigger is clicked", async () => {
		const user = userEvent.setup();
		render(
			<Tabs defaultValue="one">
				<TabsList>
					<TabsTrigger value="one">One</TabsTrigger>
					<TabsTrigger value="two">Two</TabsTrigger>
				</TabsList>
				<TabsContent value="one">Content one</TabsContent>
				<TabsContent value="two">Content two</TabsContent>
			</Tabs>,
		);
		expect(screen.getByText("Content one")).toBeInTheDocument();
		await user.click(screen.getByRole("tab", { name: "Two" }));
		expect(screen.getByText("Content two")).toBeInTheDocument();
	});
});
