import { Skeleton } from "@frontend-frame/ui";

export function RouteFallback() {
	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<Skeleton className="h-4 w-24" />
				<Skeleton className="h-9 w-72" />
				<Skeleton className="h-4 w-full max-w-xl" />
			</div>
			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{Array.from({ length: 4 }).map((_, index) => (
					<Skeleton key={index} className="h-32 rounded-xl" />
				))}
			</div>
			<Skeleton className="h-80 rounded-xl" />
		</div>
	);
}
