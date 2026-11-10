import { RouteBoundary } from "@frontend-frame/app-kit";
import { Button } from "@frontend-frame/ui";
import { Link } from "react-router-dom";

export function NotFoundPage() {
	return (
		<RouteBoundary
			variant="not-found"
			action={
				<Button asChild>
					<Link to="/">返回首页</Link>
				</Button>
			}
		/>
	);
}
