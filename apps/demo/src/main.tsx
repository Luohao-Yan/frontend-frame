import "@fontsource-variable/inter";
import "@fontsource-variable/geist-mono";

import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import {
	ActiveThemeProvider,
	MotionPresetProvider,
	ThemeProvider,
} from "@frontend-frame/ui";

import { DemoUiAdapters } from "./components/ui-adapters";
import { App } from "./app";

import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<ActiveThemeProvider>
			<ThemeProvider>
				<BrowserRouter>
					<DemoUiAdapters>
						<MotionPresetProvider preset="subtle">
							<App />
						</MotionPresetProvider>
					</DemoUiAdapters>
				</BrowserRouter>
			</ThemeProvider>
		</ActiveThemeProvider>
	</React.StrictMode>,
);
