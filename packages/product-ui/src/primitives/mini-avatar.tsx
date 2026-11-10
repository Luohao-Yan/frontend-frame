import * as React from "react";

import { cn } from "../lib/cn";

export interface MiniAvatarProps {
	name: string;
	src?: string;
	className?: string;
}

function initialsOf(name: string) {
	return name
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((part) => part.charAt(0).toUpperCase())
		.join("");
}

export function MiniAvatar({ name, src, className }: MiniAvatarProps) {
	const [failed, setFailed] = React.useState(false);
	const initials = initialsOf(name);
	const showImage = Boolean(src) && !failed;

	return (
		<span
			data-slot="mini-avatar"
			className={cn(
				"bg-muted text-foreground/80 ring-foreground/10 relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full text-[11px] font-semibold ring-1",
				className,
			)}
		>
			{showImage ? (
				<img
					src={src}
					alt=""
					className="size-full object-cover"
					loading="lazy"
					onError={() => setFailed(true)}
				/>
			) : (
				<span aria-hidden="true">{initials}</span>
			)}
		</span>
	);
}
