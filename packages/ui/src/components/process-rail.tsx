import * as React from "react";

import { cn } from "../lib/utils";

interface ProcessRailProps extends React.ComponentProps<"div"> {
	isFirst: boolean;
	isLast: boolean;
	isSubStep?: boolean;
}

function ProcessRail({
	isFirst,
	isLast,
	isSubStep = false,
	className,
	...props
}: ProcessRailProps) {
	return (
		<div
			data-slot="process-rail"
			aria-hidden="true"
			className={cn(
				"relative flex h-full w-5 flex-col items-center",
				className,
			)}
			{...props}
		>
			{!isFirst ? (
				<div className="bg-border/50 absolute -top-full h-full w-px" />
			) : null}
			<div
				className={cn(
					"absolute z-10 rounded-full",
					isSubStep
						? "bg-muted-foreground/50 h-1.5 w-1.5"
						: "bg-muted-foreground h-2 w-2",
				)}
				style={{ top: "0.5rem" }}
			/>
			{!isLast ? (
				<div
					className="bg-border/50 absolute w-px"
					style={{
						top: "1.125rem",
						bottom: "-100%",
						height: "calc(100% + 100%)",
					}}
				/>
			) : null}
		</div>
	);
}

export { ProcessRail };
