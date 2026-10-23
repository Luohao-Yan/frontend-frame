import * as React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { AppShell } from "@/components/app-shell";

const DashboardPage = React.lazy(() =>
	import("@/pages/dashboard").then((module) => ({
		default: module.DashboardPage,
	})),
);
const AiComponentsPage = React.lazy(() =>
	import("@/pages/ai-components").then((module) => ({
		default: module.AiComponentsPage,
	})),
);
const ComponentsPage = React.lazy(() =>
	import("@/pages/components").then((module) => ({
		default: module.ComponentsPage,
	})),
);
const FormsPage = React.lazy(() =>
	import("@/pages/forms").then((module) => ({ default: module.FormsPage })),
);
const DataPage = React.lazy(() =>
	import("@/pages/data").then((module) => ({ default: module.DataPage })),
);
const TokensPage = React.lazy(() =>
	import("@/pages/tokens").then((module) => ({ default: module.TokensPage })),
);
const DocsPage = React.lazy(() =>
	import("@/pages/docs").then((module) => ({ default: module.DocsPage })),
);

export function App() {
	return (
		<Routes>
			<Route element={<AppShell />}>
				<Route index element={<DashboardPage />} />
				<Route path="components" element={<ComponentsPage />} />
				<Route path="forms" element={<FormsPage />} />
				<Route path="data" element={<DataPage />} />
				<Route path="ai" element={<AiComponentsPage />} />
				<Route path="tokens" element={<TokensPage />} />
				<Route path="docs" element={<DocsPage />} />
				<Route path="*" element={<Navigate to="/" replace />} />
			</Route>
		</Routes>
	);
}
