import { Link2Icon, SearchIcon, WrenchIcon } from "lucide-react";
import * as React from "react";

import { cn } from "../lib/utils";
import { Badge } from "./badge";

type ToolBadgeProps = Omit<React.ComponentProps<typeof Badge>, "children"> & {
	tool: string;
	children: React.ReactNode;
	icon?: React.ReactNode;
	isLoading?: boolean;
};

const toolIcons: Record<string, React.ReactNode> = {
	search: <SearchIcon />,
	fetch: <Link2Icon />,
};

function ToolBadge({
	tool,
	children,
	icon,
	isLoading = false,
	className,
	variant = "secondary",
	...props
}: ToolBadgeProps) {
	return (
		<Badge
			data-slot="tool-badge"
			variant={variant}
			className={cn(
				"inline-flex max-w-full items-center gap-1",
				isLoading && "animate-pulse",
				className,
			)}
			{...props}
		>
			<span className="shrink-0 [&_svg]:size-3.5">
				{icon ?? toolIcons[tool] ?? <WrenchIcon />}
			</span>
			<span className="truncate">{children}</span>
		</Badge>
	);
}

export { ToolBadge };
