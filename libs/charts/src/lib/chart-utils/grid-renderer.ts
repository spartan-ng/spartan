import * as d3 from 'd3';
import type { SpnCartesianGrid } from '../cartesian-grid/cartesian-grid';
import type { Scale } from '../types';

/**
 * Utility functions for rendering chart grids using D3
 * Shared across all chart types to eliminate code duplication
 */

/**
 * Renders a cartesian grid in the specified layer
 */
export function renderGrid(
	gridLayer: SVGGElement,
	grid: SpnCartesianGrid,
	innerWidth: number,
	innerHeight: number,
	xScale: Scale,
	yScale: Scale,
	yTickOverride?: number[],
): void {
	const gridGroup = d3.select(gridLayer);

	// Render horizontal lines
	if (grid.horizontal()) {
		const horizontalPoints = grid.horizontalPoints();
		let yTicks: (number | Date)[];

		if (horizontalPoints) {
			yTicks = horizontalPoints;
		} else if (yTickOverride && yTickOverride.length) {
			// recharts-style nice ticks supplied by the chart (gridlines match the axis)
			yTicks = yTickOverride;
		} else if ('ticks' in yScale && typeof yScale.ticks === 'function') {
			// ponytail: recharts/shadcn default to ~5 gridlines; D3 default (~10) is denser
			yTicks = yScale.ticks(5);
		} else {
			yTicks = yScale.domain() as (number | Date)[];
		}

		gridGroup
			.selectAll('.horizontal-grid')
			.data(yTicks as number[])
			.join('line')
			.attr('class', 'horizontal-grid')
			.attr('x1', 0)
			.attr('x2', innerWidth)
			.attr('y1', (d) => (yScale as d3.ScaleLinear<number, number>)(d))
			.attr('y2', (d) => (yScale as d3.ScaleLinear<number, number>)(d))
			.attr('stroke', grid.stroke())
			.attr('stroke-width', grid.strokeWidth())
			.attr('stroke-dasharray', grid.strokeDasharray());
	}

	// Render vertical lines
	if (grid.vertical()) {
		const verticalPoints = grid.verticalPoints();
		let xTicks: (number | string | Date)[];

		if (verticalPoints) {
			xTicks = verticalPoints;
		} else if ('ticks' in xScale && typeof xScale.ticks === 'function') {
			xTicks = xScale.ticks();
		} else {
			xTicks = xScale.domain() as (number | string | Date)[];
		}

		// Handle different scale types for vertical lines
		if ('bandwidth' in xScale) {
			// Band scale (for bar charts)
			gridGroup
				.selectAll('.vertical-grid')
				.data(xTicks as string[])
				.join('line')
				.attr('class', 'vertical-grid')
				.attr('x1', (d) => {
					const pos = (xScale as d3.ScaleBand<string>)(String(d));
					return pos !== undefined ? pos + (xScale as d3.ScaleBand<string>).bandwidth() / 2 : 0;
				})
				.attr('x2', (d) => {
					const pos = (xScale as d3.ScaleBand<string>)(String(d));
					return pos !== undefined ? pos + (xScale as d3.ScaleBand<string>).bandwidth() / 2 : 0;
				})
				.attr('y1', 0)
				.attr('y2', innerHeight)
				.attr('stroke', grid.stroke())
				.attr('stroke-width', grid.strokeWidth())
				.attr('stroke-dasharray', grid.strokeDasharray());
		} else if ('step' in xScale) {
			// Point scale (for line/area charts)
			gridGroup
				.selectAll('.vertical-grid')
				.data(xTicks as number[])
				.join('line')
				.attr('class', 'vertical-grid')
				.attr('x1', (d) => {
					const pos = (xScale as unknown as d3.ScalePoint<string>)(String(d));
					return pos !== undefined ? pos : 0;
				})
				.attr('x2', (d) => {
					const pos = (xScale as unknown as d3.ScalePoint<string>)(String(d));
					return pos !== undefined ? pos : 0;
				})
				.attr('y1', 0)
				.attr('y2', innerHeight)
				.attr('stroke', grid.stroke())
				.attr('stroke-width', grid.strokeWidth())
				.attr('stroke-dasharray', grid.strokeDasharray());
		} else {
			// Linear scale
			gridGroup
				.selectAll('.vertical-grid')
				.data(xTicks as number[])
				.join('line')
				.attr('class', 'vertical-grid')
				.attr('x1', (d) => (xScale as d3.ScaleLinear<number, number>)(d))
				.attr('x2', (d) => (xScale as d3.ScaleLinear<number, number>)(d))
				.attr('y1', 0)
				.attr('y2', innerHeight)
				.attr('stroke', grid.stroke())
				.attr('stroke-width', grid.strokeWidth())
				.attr('stroke-dasharray', grid.strokeDasharray());
		}
	}
}
