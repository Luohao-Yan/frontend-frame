"use client";

import * as React from "react";

import { RouteBoundary } from "./route-boundary";

export interface ErrorBoundaryFallbackState {
	error: Error;
	reset: () => void;
}

export interface ErrorBoundaryProps {
	children: React.ReactNode;
	fallback?:
		React.ReactNode | ((state: ErrorBoundaryFallbackState) => React.ReactNode);
	onError?: (error: Error, info: React.ErrorInfo) => void;
	onReset?: () => void;
}

interface ErrorBoundaryState {
	error: Error | null;
}

export class ErrorBoundary extends React.Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	state: ErrorBoundaryState = { error: null };

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { error };
	}

	componentDidCatch(error: Error, info: React.ErrorInfo) {
		this.props.onError?.(error, info);
	}

	reset = () => {
		this.setState({ error: null });
		this.props.onReset?.();
	};

	render() {
		const { error } = this.state;
		if (!error) {
			return this.props.children;
		}

		const { fallback } = this.props;
		if (typeof fallback === "function") {
			return fallback({ error, reset: this.reset });
		}
		if (fallback) {
			return fallback;
		}

		return <RouteBoundary variant="error" onRetry={this.reset} />;
	}
}
