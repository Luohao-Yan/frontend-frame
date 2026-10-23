"use client";

import { BotIcon, ChevronDownIcon, UserRoundIcon } from "lucide-react";
import * as React from "react";

import { cn } from "../lib/utils";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "./collapsible";
import { Separator } from "./separator";

export interface CollapsibleMessageProps extends React.ComponentProps<"div"> {
	children: React.ReactNode;
	role?: "user" | "assistant";
	avatar?: React.ReactNode;
	isCollapsible?: boolean;
	isOpen?: boolean;
	defaultOpen?: boolean;
	header?: React.ReactNode;
	onOpenChange?: (open: boolean) => void;
	showBorder?: boolean;
	showIcon?: boolean;
	variant?: "default" | "minimal" | "process" | "process-sub";
	showSeparator?: boolean;
	renderLeft?: React.ReactNode;
	chevronSize?: "sm" | "md";
	headerClickBehavior?: "toggle" | "inspect" | "split";
}

function DefaultAvatar({ role }: { role: "user" | "assistant" }) {
	if (role === "assistant") {
		return (
			<span className="bg-primary text-primary-foreground flex size-5 items-center justify-center rounded-full">
				<BotIcon className="size-3" />
			</span>
		);
	}

	return (
		<span className="bg-muted text-muted-foreground flex size-5 items-center justify-center rounded-full">
			<UserRoundIcon className="size-3" />
		</span>
	);
}

function CollapsibleMessage({
	children,
	role = "assistant",
	avatar,
	isCollapsible = false,
	isOpen,
	defaultOpen = true,
	header,
	onOpenChange,
	showBorder = true,
	showIcon = true,
	variant = "default",
	showSeparator = true,
	renderLeft,
	chevronSize = "md",
	headerClickBehavior = "toggle",
	className,
	...props
}: CollapsibleMessageProps) {
	const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
	const isControlled = isOpen !== undefined;
	const open = isControlled ? isOpen : uncontrolledOpen;
	const handleOpenChange = (nextOpen: boolean) => {
		if (!isControlled) {
			setUncontrolledOpen(nextOpen);
		}
		onOpenChange?.(nextOpen);
	};

	const left =
		renderLeft ?? avatar ?? (showIcon ? <DefaultAvatar role={role} /> : null);

	const content = (
		<div
			className={cn(
				"min-w-0 flex-1",
				!isCollapsible && (role === "assistant" ? "px-0" : "px-3"),
			)}
		>
			{children}
		</div>
	);

	if (!isCollapsible) {
		return (
			<div
				data-slot="collapsible-message"
				className={cn("flex", className)}
				{...props}
			>
				{left ? (
					<div className="flex w-5 shrink-0 justify-center">{left}</div>
				) : null}
				{content}
			</div>
		);
	}

	return (
		<div
			data-slot="collapsible-message"
			className={cn("flex", className)}
			{...props}
		>
			{left ? (
				<div className="flex w-5 shrink-0 justify-center">{left}</div>
			) : null}
			<div
				className={cn(
					"min-w-0 flex-1 overflow-hidden",
					variant === "default" && showBorder && "bg-card rounded-lg border",
					variant === "default" && !showBorder && "bg-card rounded-lg",
					variant === "process" && "bg-card rounded-lg border",
					variant === "process-sub" && "bg-card/50 rounded-md border",
					open && !showBorder && "bg-background",
				)}
			>
				<Collapsible
					open={open}
					onOpenChange={handleOpenChange}
					className="w-full"
				>
					<div
						className={cn(
							"flex w-full items-center gap-2 overflow-hidden",
							variant === "default" && "justify-between px-3 py-2",
							variant === "minimal" && "py-1",
							variant === "process" && "justify-between px-1.5 py-1",
							variant === "process-sub" && "justify-between px-1 py-0.5",
						)}
					>
						{header ? (
							<div
								className={cn(
									"min-w-0 overflow-hidden",
									variant === "default" && "flex-1 text-sm",
									variant === "minimal" &&
										"flex flex-1 items-center gap-1 text-sm",
									(variant === "process" || variant === "process-sub") &&
										"flex-1 text-xs",
								)}
								onClick={
									headerClickBehavior === "toggle"
										? () => handleOpenChange(!open)
										: undefined
								}
							>
								{header}
							</div>
						) : null}
						<CollapsibleTrigger asChild>
							<button
								type="button"
								className={cn(
									"group hover:bg-accent/50 cursor-pointer rounded-md",
									variant === "default" ? "p-1" : "p-0.5",
								)}
								aria-label={open ? "收起" : "展开"}
							>
								<ChevronDownIcon
									className={cn(
										"text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180",
										chevronSize === "sm" ? "size-3" : "size-4",
									)}
								/>
							</button>
						</CollapsibleTrigger>
					</div>
					<CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapse-up data-[state=open]:animate-collapse-down">
						{showSeparator && variant === "default" ? (
							<Separator className="border-border/50 mb-2" />
						) : null}
						<div
							className={cn(
								variant === "default" && "px-3 pb-2",
								variant === "minimal" && "pt-2",
								variant === "process" && "px-1.5 pb-1",
								variant === "process-sub" && "px-1 pb-0.5",
							)}
						>
							{children}
						</div>
					</CollapsibleContent>
				</Collapsible>
			</div>
		</div>
	);
}

export { CollapsibleMessage };
