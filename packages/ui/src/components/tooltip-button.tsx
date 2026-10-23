"use client";

import * as React from "react";

import { Button } from "./button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "./tooltip";

interface TooltipButtonProps extends React.ComponentProps<typeof Button> {
	tooltipContent: React.ReactNode;
	tooltipProps?: Omit<React.ComponentProps<typeof TooltipContent>, "children">;
}

function TooltipButton({
	tooltipContent,
	tooltipProps,
	children,
	...buttonProps
}: TooltipButtonProps) {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button {...buttonProps}>{children}</Button>
				</TooltipTrigger>
				<TooltipContent {...tooltipProps}>{tooltipContent}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}

export { TooltipButton };
