import * as d3 from 'd3';
import type { ChartContextService } from '../chart-context.service';
import type { SpnReferenceLine } from '../reference-line/reference-line';

/**
 * Utility functions for rendering reference lines using D3
 * Shared across all chart types to eliminate code duplication
 */

/**
 * Renders reference lines in the specified layer
 */
export function renderReferenceLines(
	layer: SVGGElement,
	referenceLines: readonly SpnReferenceLine[],
	innerWidth: number,
	innerHeight: number,
	chartContext: ChartContextService,
	isFront: boolean,
): void {
	const filteredLines = referenceLines.filter((line) => line.isFront() === isFront);

	if (filteredLines.length === 0) return;

	filteredLines.forEach((referenceLine) => {
		const g = d3.select(layer).append('g');

		// Render vertical line (x value)
		const xValue = referenceLine.x();
		if (xValue !== undefined) {
			const xScale = chartContext.getXScale(referenceLine.xAxisId());
			if (xScale) {
				let xPos: number;

				if ('bandwidth' in xScale) {
					// Band scale
					const pos = (xScale as d3.ScaleBand<string>)(String(xValue));
					xPos = pos !== undefined ? pos + (xScale as d3.ScaleBand<string>).bandwidth() / 2 : 0;
				} else if ('step' in xScale) {
					// Point scale
					const pos = (xScale as unknown as d3.ScalePoint<string>)(String(xValue));
					xPos = pos !== undefined ? pos : 0;
				} else {
					// Linear scale
					xPos = (xScale as d3.ScaleLinear<number, number>)(xValue as number);
				}

				g.append('line')
					.attr('x1', xPos)
					.attr('x2', xPos)
					.attr('y1', 0)
					.attr('y2', innerHeight)
					.attr('stroke', referenceLine.stroke())
					.attr('stroke-width', referenceLine.strokeWidth())
					.attr('stroke-dasharray', referenceLine.strokeDasharray() || 'none');

				// Add label if specified
				const label = referenceLine.label();
				if (label) {
					g.append('text')
						.attr('x', xPos + 5)
						.attr('y', 15)
						.attr('fill', referenceLine.stroke())
						.attr('font-size', '12px')
						.text(label);
				}
			}
		}

		// Render horizontal line (y value)
		const yValue = referenceLine.y();
		if (yValue !== undefined) {
			const yScale = chartContext.getYScale(referenceLine.yAxisId());
			if (yScale) {
				const yPos = (yScale as d3.ScaleLinear<number, number>)(yValue as number);

				g.append('line')
					.attr('x1', 0)
					.attr('x2', innerWidth)
					.attr('y1', yPos)
					.attr('y2', yPos)
					.attr('stroke', referenceLine.stroke())
					.attr('stroke-width', referenceLine.strokeWidth())
					.attr('stroke-dasharray', referenceLine.strokeDasharray() || 'none');

				// Add label if specified
				const label = referenceLine.label();
				if (label) {
					g.append('text')
						.attr('x', innerWidth - 5)
						.attr('y', yPos - 5)
						.attr('fill', referenceLine.stroke())
						.attr('font-size', '12px')
						.attr('text-anchor', 'end')
						.text(label);
				}
			}
		}
	});
}
