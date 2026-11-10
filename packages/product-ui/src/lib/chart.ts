export interface ChartPoint {
	x: number;
	y: number;
}

export function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max);
}

/**
 * Catmull-Rom 到三次贝塞尔的转换，保证折线在数据点处平滑过渡。
 */
export function buildSmoothPath(points: readonly ChartPoint[]) {
	if (points.length === 0) {
		return "";
	}

	const first = points[0];
	if (!first) {
		return "";
	}

	if (points.length === 1) {
		return `M ${first.x} ${first.y}`;
	}

	let path = `M ${first.x} ${first.y}`;

	for (let index = 0; index < points.length - 1; index += 1) {
		const p0 = points[index - 1] ?? points[index];
		const p1 = points[index];
		const p2 = points[index + 1];
		const p3 = points[index + 2] ?? p2;

		if (!p0 || !p1 || !p2 || !p3) {
			continue;
		}

		const cp1x = p1.x + (p2.x - p0.x) / 6;
		const cp1y = p1.y + (p2.y - p0.y) / 6;
		const cp2x = p2.x - (p3.x - p1.x) / 6;
		const cp2y = p2.y - (p3.y - p1.y) / 6;

		path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
	}

	return path;
}

export function buildAreaPath(points: readonly ChartPoint[], baseline: number) {
	const line = buildSmoothPath(points);
	const first = points[0];
	const last = points[points.length - 1];

	if (!line || !first || !last) {
		return "";
	}

	return `${line} L ${last.x} ${baseline} L ${first.x} ${baseline} Z`;
}
