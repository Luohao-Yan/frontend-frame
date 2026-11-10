import type { WorkflowEdge, WorkflowNode, WorkflowNodeType } from "../types";

export const WORKFLOW_WIDTH = 600;
export const WORKFLOW_NODE_WIDTH = 136;
export const WORKFLOW_NODE_HEIGHT = 34;

const COLUMN_X: Record<WorkflowNodeType, number> = {
	trigger: 8,
	condition: 232,
	action: 456,
};

const ROW_GAP = 12;
const PADDING = 8;

export interface WorkflowLayoutNode {
	node: WorkflowNode;
	x: number;
	y: number;
	width: number;
	height: number;
}

export interface WorkflowLayoutEdge {
	from: WorkflowLayoutNode;
	to: WorkflowLayoutNode;
	path: string;
	accent: boolean;
}

export interface WorkflowLayout {
	width: number;
	height: number;
	nodes: WorkflowLayoutNode[];
	edges: WorkflowLayoutEdge[];
}

function byId(nodes: readonly WorkflowLayoutNode[]) {
	return new Map(nodes.map((node) => [node.node.id, node]));
}

function connect(
	source: WorkflowLayoutNode,
	target: WorkflowLayoutNode,
	accent: boolean,
): WorkflowLayoutEdge {
	const sx = source.x + source.width;
	const sy = source.y + source.height / 2;
	const tx = target.x;
	const ty = target.y + target.height / 2;
	const midX = (sx + tx) / 2;

	return {
		from: source,
		to: target,
		accent,
		path: `M ${sx} ${sy} C ${midX} ${sy}, ${midX} ${ty}, ${tx} ${ty}`,
	};
}

function autoEdges(nodes: readonly WorkflowLayoutNode[]) {
	const triggers = nodes.filter((node) => node.node.type === "trigger");
	const conditions = nodes.filter((node) => node.node.type === "condition");
	const actions = nodes.filter((node) => node.node.type === "action");
	const edges: WorkflowLayoutEdge[] = [];

	const entries = triggers.length > 0 ? triggers : conditions;
	const entryTargets = conditions.length > 0 ? conditions : actions;

	for (const source of entries) {
		for (const target of entryTargets) {
			edges.push(connect(source, target, edges.length === 0));
		}
	}

	const actionSources = conditions.length > 0 ? conditions : entries;
	for (const source of actionSources) {
		for (const target of actions) {
			edges.push(connect(source, target, false));
		}
	}

	return edges;
}

export function layoutWorkflow(
	nodes: readonly WorkflowNode[],
	edges?: readonly WorkflowEdge[],
): WorkflowLayout {
	const grouped: Record<WorkflowNodeType, WorkflowNode[]> = {
		trigger: [],
		condition: [],
		action: [],
	};

	for (const node of nodes) {
		grouped[node.type].push(node);
	}

	const maxRows = Math.max(
		1,
		grouped.trigger.length,
		grouped.condition.length,
		grouped.action.length,
	);
	const contentHeight =
		maxRows * WORKFLOW_NODE_HEIGHT + Math.max(0, maxRows - 1) * ROW_GAP;
	const height = Math.max(200, contentHeight + PADDING * 2);

	const layoutNodes: WorkflowLayoutNode[] = [];

	for (const type of ["trigger", "condition", "action"] as const) {
		const group = grouped[type];
		const groupHeight =
			group.length * WORKFLOW_NODE_HEIGHT +
			Math.max(0, group.length - 1) * ROW_GAP;
		const startY = (height - groupHeight) / 2;

		group.forEach((node, index) => {
			layoutNodes.push({
				node,
				x: COLUMN_X[type],
				y: startY + index * (WORKFLOW_NODE_HEIGHT + ROW_GAP),
				width: WORKFLOW_NODE_WIDTH,
				height: WORKFLOW_NODE_HEIGHT,
			});
		});
	}

	const nodeMap = byId(layoutNodes);
	const resolvedEdges =
		edges && edges.length > 0
			? edges.flatMap((edge) => {
					const source = nodeMap.get(edge.from);
					const target = nodeMap.get(edge.to);
					return source && target
						? [connect(source, target, Boolean(edge.accent))]
						: [];
				})
			: autoEdges(layoutNodes);

	return {
		width: WORKFLOW_WIDTH,
		height,
		nodes: layoutNodes,
		edges: resolvedEdges,
	};
}
