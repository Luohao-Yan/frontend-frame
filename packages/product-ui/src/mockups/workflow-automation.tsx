"use client";

import { motion, useReducedMotion } from "motion/react";
import * as React from "react";

import { cn } from "../lib/cn";
import { layoutWorkflow } from "../lib/workflow-layout";

import type { WorkflowAutomationProps, WorkflowNodeType } from "../types";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

const NODE_TONE: Record<
	WorkflowNodeType,
	{ dot: string; icon: string; ring: string }
> = {
	trigger: {
		dot: "bg-chart-1",
		icon: "bg-chart-1/10 text-chart-1",
		ring: "ring-chart-1/25",
	},
	condition: {
		dot: "bg-chart-2",
		icon: "bg-chart-2/10 text-chart-2",
		ring: "ring-chart-2/25",
	},
	action: {
		dot: "bg-chart-3",
		icon: "bg-chart-3/10 text-chart-3",
		ring: "ring-chart-3/25",
	},
};

export function WorkflowAutomation({
	nodes,
	edges,
	animated = true,
	className,
	canvasLabel,
}: WorkflowAutomationProps) {
	const reducedMotion = useReducedMotion();
	const shouldAnimate = animated && reducedMotion !== true;
	const layout = React.useMemo(
		() => layoutWorkflow(nodes, edges),
		[edges, nodes],
	);
	const rawId = React.useId();
	const gradientId = `workflow-beam-${rawId.replace(/:/g, "")}`;
	const label = canvasLabel ?? `Workflow automation with ${nodes.length} nodes`;

	if (nodes.length === 0) {
		return (
			<div
				role="img"
				aria-label="Workflow has no nodes"
				className={cn(
					"text-muted-foreground border-border flex aspect-[3/1] w-full items-center justify-center rounded-md border border-dashed text-xs",
					className,
				)}
			>
				No workflow nodes
			</div>
		);
	}

	return (
		<div
			data-slot="workflow-automation"
			role="group"
			aria-label={label}
			className={cn("w-full overflow-x-auto", className)}
		>
			<div
				data-testid="workflow-canvas"
				className="relative min-w-[560px]"
				style={{ aspectRatio: `${layout.width} / ${layout.height}` }}
			>
				<svg
					aria-hidden="true"
					viewBox={`0 0 ${layout.width} ${layout.height}`}
					className="absolute inset-0 h-full w-full overflow-visible"
				>
					<defs>
						<linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
							<stop offset="0%" stopColor="var(--chart-1)" />
							<stop offset="100%" stopColor="var(--chart-3)" />
						</linearGradient>
					</defs>
					{layout.edges.map((edge, index) =>
						shouldAnimate ? (
							<motion.path
								key={`edge-${edge.from.node.id}-${edge.to.node.id}-${index}`}
								d={edge.path}
								fill="none"
								stroke={edge.accent ? `url(#${gradientId})` : "currentColor"}
								strokeOpacity={edge.accent ? 0.9 : 0.24}
								strokeWidth={edge.accent ? 1.25 : 1}
								strokeLinecap="round"
								strokeDasharray={edge.accent ? undefined : "3 4"}
								initial={{ pathLength: 0 }}
								whileInView={{ pathLength: 1 }}
								viewport={{ once: true, amount: 0.3 }}
								transition={{
									duration: edge.accent ? 1.4 : 0.8,
									delay: 0.15 + index * 0.08,
									ease: EASE_OUT,
								}}
								data-testid="workflow-edge"
							/>
						) : (
							<path
								key={`edge-${edge.from.node.id}-${edge.to.node.id}-${index}`}
								d={edge.path}
								fill="none"
								stroke={edge.accent ? `url(#${gradientId})` : "currentColor"}
								strokeOpacity={edge.accent ? 0.9 : 0.24}
								strokeWidth={edge.accent ? 1.25 : 1}
								strokeLinecap="round"
								strokeDasharray={edge.accent ? undefined : "3 4"}
								data-testid="workflow-edge"
							/>
						),
					)}
				</svg>

				{layout.nodes.map((layoutNode, index) => {
					const node = layoutNode.node;
					const Icon = node.icon;
					const tone = NODE_TONE[node.type];
					const nodeStyle = {
						left: `${(layoutNode.x / layout.width) * 100}%`,
						top: `${(layoutNode.y / layout.height) * 100}%`,
						width: `${(layoutNode.width / layout.width) * 100}%`,
						height: `${(layoutNode.height / layout.height) * 100}%`,
					} as React.CSSProperties;

					const content = (
						<div
							data-slot="workflow-node"
							data-node-type={node.type}
							className={cn(
								"bg-background flex h-full w-full items-center gap-1.5 overflow-hidden rounded-[3px] px-2 shadow-sm ring-1",
								tone.ring,
							)}
						>
							<span
								className={cn(
									"flex size-4 shrink-0 items-center justify-center rounded-sm",
									tone.icon,
								)}
							>
								{Icon ? (
									<Icon className="size-3" />
								) : (
									<span
										aria-hidden="true"
										className={cn("size-1.5 rounded-full", tone.dot)}
									/>
								)}
							</span>
							<span className="min-w-0">
								<span
									className="block truncate text-[9px] leading-none font-semibold"
									title={node.title}
								>
									{node.title}
								</span>
								<span className="text-muted-foreground mt-0.5 block text-[6px] leading-none font-semibold tracking-[0.12em] uppercase">
									{node.type}
								</span>
							</span>
						</div>
					);

					if (!shouldAnimate) {
						return (
							<div
								key={node.id}
								className="absolute"
								style={nodeStyle}
								data-testid="workflow-node"
							>
								{content}
							</div>
						);
					}

					return (
						<motion.div
							key={node.id}
							className="absolute"
							style={nodeStyle}
							initial={{ opacity: 0, y: 5 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.3 }}
							transition={{
								duration: 0.35,
								delay: 0.1 + index * 0.12,
								ease: EASE_OUT,
							}}
							data-testid="workflow-node"
						>
							{content}
						</motion.div>
					);
				})}
			</div>
		</div>
	);
}
