import * as React from "react";

import { cn } from "../lib/utils";

export interface FaviconSource {
	url: string;
}

export function faviconUrl(domain: string, size = 32) {
	return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=${size}`;
}

interface SourceFaviconsProps extends React.ComponentProps<"div"> {
	sources: FaviconSource[];
	maxDisplay?: number;
	size?: number;
}

function SourceFavicons({
	sources,
	maxDisplay = 3,
	size = 16,
	className,
	...props
}: SourceFaviconsProps) {
	const favicons = Array.from(
		new Set(
			sources
				.map((result) => {
					try {
						return new URL(result.url).hostname;
					} catch {
						return null;
					}
				})
				.filter((domain): domain is string => Boolean(domain)),
		),
	)
		.slice(0, maxDisplay)
		.map((domain) => ({ domain, src: faviconUrl(domain, size * 2) }));

	if (!favicons.length) {
		return null;
	}

	return (
		<div
			data-slot="source-favicons"
			className={cn("flex items-center", className)}
			{...props}
		>
			{favicons.map(({ domain, src }, index) => (
				<div
					key={domain}
					title={domain}
					className="border-background bg-background relative overflow-hidden rounded-full border"
					style={{
						marginLeft: index > 0 ? "-6px" : "0",
						zIndex: favicons.length - index,
						width: size,
						height: size,
					}}
				>
					<img
						src={src}
						alt={domain}
						width={size}
						height={size}
						loading="lazy"
						referrerPolicy="no-referrer"
						className="size-full object-cover"
						onError={(event) => {
							event.currentTarget.style.display = "none";
						}}
					/>
				</div>
			))}
		</div>
	);
}

export { SourceFavicons };
