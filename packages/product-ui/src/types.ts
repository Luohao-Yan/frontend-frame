import type * as React from "react";

export type PipelineRange = "7D" | "30D" | "12M";

export interface PipelinePoint {
	label: string;
	value: number;
	accent?: boolean;
}

export interface PipelineForecastProps {
	title?: string;
	subtitle?: string;
	ranges?: readonly PipelineRange[];
	range?: PipelineRange;
	defaultRange?: PipelineRange;
	onRangeChange?: (range: PipelineRange) => void;
	data: readonly PipelinePoint[];
	total: string;
	delta: string;
	yAxisFormatter?: (value: number) => string;
	animated?: boolean;
	className?: string;
	chartLabel?: string;
}

export interface ContactPerson {
	name: string;
	role: string;
	company: string;
	avatar?: string;
}

export interface ContactField {
	label: string;
	value?: string;
	enriched?: boolean;
}

export interface ContactEnrichmentProps {
	person: ContactPerson;
	fields: readonly ContactField[];
	aiLabel?: string;
	animated?: boolean;
	className?: string;
	cardLabel?: string;
}

export type WorkflowNodeType = "trigger" | "condition" | "action";

export interface WorkflowNode {
	id: string;
	type: WorkflowNodeType;
	title: string;
	icon?: React.ComponentType<{ className?: string }>;
}

export interface WorkflowEdge {
	from: string;
	to: string;
	accent?: boolean;
}

export interface WorkflowAutomationProps {
	nodes: readonly WorkflowNode[];
	edges?: readonly WorkflowEdge[];
	animated?: boolean;
	className?: string;
	canvasLabel?: string;
}

export interface ProductMockupCardProps {
	eyebrow?: string;
	title?: string;
	description?: string;
	pattern?: React.ReactNode;
	className?: string;
	testId?: string;
	children: React.ReactNode;
}

export interface FeatureFrameProps {
	children: React.ReactNode;
	chrome?: "browser" | "app" | "none";
	className?: string;
	label?: string;
}
