"use client";

import { motion, useReducedMotion } from "motion/react";
import * as React from "react";

import { buildAreaPath, buildSmoothPath, clamp } from "../lib/chart";
import { cn } from "../lib/cn";
import { MiniHeader } from "../primitives/mini-header";
import { MiniSegmented } from "../primitives/mini-segmented";

import type { PipelineForecastProps, PipelineRange } from "../types";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const DEFAULT_RANGES: readonly PipelineRange[] = ["7D", "30D", "12M"];

const WIDTH = 360;
const HEIGHT = 200;
const PADDING = { top: 28, right: 12, bottom: 26, left: 12 };
const CHART_WIDTH = WIDTH - PADDING.left - PADDING.right;
const CHART_HEIGHT = HEIGHT - PADDING.top - PADDING.bottom;
const BASELINE = PADDING.top + CHART_HEIGHT;
const GRID_LINES = 4;

interface Geometry {
	x: number;
	y: number;
	width: number;
	height: number;
	label: string;
	value: number;
	accent: boolean;
}

function useChartGeometry(data: PipelineForecastProps["data"]) {
	return React.useMemo(() => {
		const count = data.length;
		if (count === 0) {
			return {
				bars: [] as Geometry[],
				linePath: "",
				areaPath: "",
				accentIndex: -1,
				maxValue: 1,
			};
		}

		const maxValue = Math.max(1, ...data.map((point) => point.value));
		const step = CHART_WIDTH / count;
		const barWidth = clamp(step * 0.42, 3, 14);
		const bars = data.map<Geometry>((point, index) => {
			const value = clamp(point.value, 0, maxValue);
			const height = (value / maxValue) * CHART_HEIGHT;
			return {
				x: PADDING.left + step * index + (step - barWidth) / 2,
				y: BASELINE - height,
				width: barWidth,
				height,
				label: point.label,
				value: point.value,
				accent: Boolean(point.accent),
			};
		});

		const linePoints = bars.map((bar) => ({
			x: bar.x + bar.width / 2,
			y: bar.y,
		}));
		const accentIndex = bars.findIndex((bar) => bar.accent);

		return {
			bars,
			linePath: buildSmoothPath(linePoints),
			areaPath: buildAreaPath(linePoints, BASELINE),
			accentIndex: accentIndex >= 0 ? accentIndex : count - 1,
			maxValue,
		};
	}, [data]);
}

export function PipelineForecast({
	title = "Pipeline Forecast",
	subtitle = "Last 12 months",
	ranges = DEFAULT_RANGES,
	range,
	defaultRange = "12M",
	onRangeChange,
	data,
	total,
	delta,
	yAxisFormatter = (value) => `${Math.round(value)}`,
	animated = true,
	className,
	chartLabel,
}: PipelineForecastProps) {
	const reducedMotion = useReducedMotion();
	const shouldAnimate = animated && reducedMotion !== true;
	const [internalRange, setInternalRange] =
		React.useState<PipelineRange>(defaultRange);
	const activeRange = range ?? internalRange;
	const rawId = React.useId();
	const id = rawId.replace(/:/g, "");
	const beamId = `pipeline-beam-${id}`;
	const areaId = `pipeline-area-${id}`;
	const barId = `pipeline-bar-${id}`;

	const geometry = useChartGeometry(data);
	const accentBar = geometry.bars[geometry.accentIndex];
	const labelStep = Math.max(1, Math.ceil(data.length / 8));
	const ariaLabel = chartLabel ?? `Pipeline forecast total ${total}, ${delta}`;

	const handleRangeChange = React.useCallback(
		(next: PipelineRange) => {
			if (range === undefined) {
				setInternalRange(next);
			}
			onRangeChange?.(next);
		},
		[onRangeChange, range],
	);

	return (
		<div
			data-slot="pipeline-forecast"
			className={cn("flex flex-col space-y-4", className)}
		>
			<MiniHeader
				title={title}
				subtitle={subtitle}
				actions={
					<MiniSegmented
						label="Forecast range"
						options={ranges.map((value) => ({ value, label: value }))}
						value={activeRange}
						onValueChange={handleRangeChange}
					/>
				}
			/>

			{data.length === 0 ? (
				<div
					role="img"
					aria-label="Pipeline forecast has no data"
					className="text-muted-foreground border-border flex aspect-[16/9] w-full items-center justify-center rounded-md border border-dashed text-xs"
				>
					No pipeline data
				</div>
			) : (
				<svg
					role="img"
					aria-label={ariaLabel}
					data-testid="pipeline-chart"
					viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
					className="text-foreground h-auto w-full overflow-visible"
				>
					<defs>
						<linearGradient id={beamId} x1="0%" y1="0%" x2="100%" y2="0%">
							<stop offset="0%" stopColor="var(--chart-1)" />
							<stop offset="100%" stopColor="var(--chart-2)" />
						</linearGradient>
						<linearGradient id={barId} x1="0%" y1="100%" x2="0%" y2="0%">
							<stop offset="0%" stopColor="var(--chart-1)" />
							<stop offset="100%" stopColor="var(--chart-2)" />
						</linearGradient>
						<linearGradient id={areaId} x1="0%" y1="0%" x2="0%" y2="100%">
							<stop offset="0%" stopColor="var(--chart-1)" stopOpacity="0.16" />
							<stop offset="100%" stopColor="var(--chart-1)" stopOpacity="0" />
						</linearGradient>
					</defs>

					{Array.from({ length: GRID_LINES + 1 }, (_, index) => {
						const ratio = index / GRID_LINES;
						const y = PADDING.top + CHART_HEIGHT * ratio;
						const value = geometry.maxValue * (1 - ratio);
						return (
							<g key={`grid-${index}`}>
								<line
									x1={PADDING.left}
									x2={WIDTH - PADDING.right}
									y1={y}
									y2={y}
									stroke="currentColor"
									strokeOpacity={index === GRID_LINES ? 0.12 : 0.06}
									strokeDasharray={index === GRID_LINES ? undefined : "2 4"}
								/>
								<text
									x={WIDTH - PADDING.right}
									y={y - 3}
									textAnchor="end"
									fontSize="6"
									fill="currentColor"
									fillOpacity="0.35"
								>
									{yAxisFormatter(value)}
								</text>
							</g>
						);
					})}

					{geometry.bars.map((bar, index) =>
						shouldAnimate ? (
							<motion.rect
								key={`bar-${bar.label}-${index}`}
								x={bar.x}
								y={bar.y}
								width={bar.width}
								height={bar.height}
								rx={2}
								fill={bar.accent ? `url(#${barId})` : "currentColor"}
								fillOpacity={bar.accent ? 1 : 0.1}
								initial={{ opacity: 0, scaleY: 0 }}
								whileInView={{ opacity: 1, scaleY: 1 }}
								viewport={{ once: true, amount: 0.4 }}
								transition={{
									duration: 0.55,
									delay: 0.05 * index,
									ease: EASE_OUT,
								}}
								style={{
									transformBox: "fill-box",
									transformOrigin: "bottom",
								}}
							/>
						) : (
							<rect
								key={`bar-${bar.label}-${index}`}
								x={bar.x}
								y={bar.y}
								width={bar.width}
								height={bar.height}
								rx={2}
								fill={bar.accent ? `url(#${barId})` : "currentColor"}
								fillOpacity={bar.accent ? 1 : 0.1}
							/>
						),
					)}

					{shouldAnimate ? (
						<motion.path
							d={geometry.areaPath}
							fill={`url(#${areaId})`}
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							viewport={{ once: true, amount: 0.4 }}
							transition={{ duration: 0.7, delay: 0.35, ease: EASE_OUT }}
						/>
					) : (
						<path d={geometry.areaPath} fill={`url(#${areaId})`} />
					)}

					{shouldAnimate ? (
						<motion.path
							d={geometry.linePath}
							fill="none"
							stroke={`url(#${beamId})`}
							strokeWidth="1.5"
							strokeLinecap="round"
							initial={{ pathLength: 0 }}
							whileInView={{ pathLength: 1 }}
							viewport={{ once: true, amount: 0.4 }}
							transition={{ duration: 1.1, delay: 0.25, ease: EASE_OUT }}
						/>
					) : (
						<path
							d={geometry.linePath}
							fill="none"
							stroke={`url(#${beamId})`}
							strokeWidth="1.5"
							strokeLinecap="round"
						/>
					)}

					{accentBar ? (
						shouldAnimate ? (
							<motion.g
								initial={{ opacity: 0, y: 5 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, amount: 0.4 }}
								transition={{ duration: 0.35, delay: 0.9, ease: EASE_OUT }}
							>
								<PipelineTooltip bar={accentBar} total={total} delta={delta} />
							</motion.g>
						) : (
							<PipelineTooltip bar={accentBar} total={total} delta={delta} />
						)
					) : null}

					{geometry.bars.map((bar, index) => {
						if (index % labelStep !== 0 && index !== geometry.bars.length - 1) {
							return null;
						}
						return (
							<text
								key={`label-${bar.label}-${index}`}
								x={bar.x + bar.width / 2}
								y={HEIGHT - 8}
								textAnchor="middle"
								fontSize="6"
								fill="currentColor"
								fillOpacity={bar.accent ? 1 : 0.35}
								fontWeight={bar.accent ? 600 : 400}
							>
								{bar.label}
							</text>
						);
					})}
				</svg>
			)}
		</div>
	);
}

function PipelineTooltip({
	bar,
	total,
	delta,
}: {
	bar: Geometry;
	total: string;
	delta: string;
}) {
	const width = 64;
	const x = clamp(bar.x + bar.width / 2 - width / 2, 2, WIDTH - width - 2);
	const y = clamp(bar.y - 38, 4, BASELINE - 30);

	return (
		<>
			<rect
				x={x}
				y={y}
				width={width}
				height={26}
				rx={3}
				fill="currentColor"
				fillOpacity="0.95"
			/>
			<text
				x={x + width / 2}
				y={y + 11}
				textAnchor="middle"
				fontSize="7"
				fontWeight="700"
				fill="var(--background)"
			>
				{total}
			</text>
			<text
				x={x + width / 2}
				y={y + 20}
				textAnchor="middle"
				fontSize="5.5"
				fontWeight="600"
				fill="var(--chart-2)"
			>
				{delta}
			</text>
		</>
	);
}
