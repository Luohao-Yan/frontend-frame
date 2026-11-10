import * as React from "react";
import { Route, Routes } from "react-router-dom";

import { AppShell } from "@/components/app-shell";
import { NotFoundPage } from "@/pages/not-found";

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
const VariantsPage = React.lazy(() =>
	import("@/pages/variants").then((module) => ({
		default: module.VariantsPage,
	})),
);
const ProductUiPage = React.lazy(() =>
	import("@/pages/product-ui").then((module) => ({
		default: module.ProductUiPage,
	})),
);
const LoginPage = React.lazy(() =>
	import("@/pages/login").then((module) => ({
		default: module.LoginPage,
	})),
);

export function App() {
	return (
		<Routes>
			<Route
				path="login"
				element={
					<React.Suspense fallback={null}>
						<LoginPage />
					</React.Suspense>
				}
			/>
			<Route element={<AppShell />}>
				<Route index element={<DashboardPage />} />
				<Route path="components" element={<ComponentsPage />} />
				<Route path="forms" element={<FormsPage />} />
				<Route path="data" element={<DataPage />} />
				<Route path="ai" element={<AiComponentsPage />} />
				<Route path="tokens" element={<TokensPage />} />
				<Route path="variants" element={<VariantsPage />} />
				<Route path="product-ui" element={<ProductUiPage />} />
				<Route path="docs" element={<DocsPage />} />
				<Route path="*" element={<NotFoundPage />} />
			</Route>
		</Routes>
	);
}
