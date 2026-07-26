import * as d3 from 'd3';
import type { Scale } from '../types';
import type { SpnXAxis } from '../x-axis/x-axis';
import type { SpnYAxis } from '../y-axis/y-axis';

/**
 * Utility functions for rendering chart axes using D3
 * Shared across all chart types to eliminate code duplication
 */

/**
 * Renders an X-axis using D3 in the specified layer
 */
export function renderXAxis(
	axesLayer: SVGGElement,
	xAxis: SpnXAxis,
	scale: Scale,
	height: number,
	labelOverflow = 0,
): void {
	const g = d3.select(axesLayer).append('g');

	const orientation = xAxis.orientation();
	const axisGenerator =
		orientation === 'top'
			? // eslint-disable-next-line @typescript-eslint/no-explicit-any
				d3.axisTop(scale as any)
			: // eslint-disable-next-line @typescript-eslint/no-explicit-any
				d3.axisBottom(scale as any);

	const ticks = xAxis.ticks();
	if (ticks) {
		axisGenerator.ticks(ticks);
	}

	axisGenerator.tickSize(xAxis.tickSize()).tickPadding(xAxis.tickPadding());

	const formatter = xAxis.tickFormatter();
	if (formatter) {
		axisGenerator.tickFormat((d, i) => formatter(d, i));
	}

	const yPosition = orientation === 'top' ? 0 : height;
	g.attr('transform', `translate(0, ${yPosition})`);
	g.call(axisGenerator);

	// Apply the final font size BEFORE measuring for minTickGap, otherwise getBBox
	// reports widths at D3's default 10px and we under-estimate (keeping too many).
	g.selectAll('text').style('font-size', '12px');

	// recharts minTickGap (preserveEnd): drop labels that crowd their neighbour,
	// keeping the last tick and walking backwards so gaps stay >= minTickGap.
	const minGap = xAxis.minTickGap();
	if (minGap > 0) {
		const tickNodes = g.selectAll<SVGGElement, unknown>('.tick').nodes();
		const info = tickNodes
			.map((el) => {
				const t = /translate\(([-\d.]+)/.exec(el.getAttribute('transform') || '');
				const text = el.querySelector('text') as SVGTextElement | null;
				let w = 0;
				try {
					// Advance width (what recharts measures), not the tight ink bbox.
					w = text ? text.getComputedTextLength() : 0;
				} catch {
					w = 0;
				}
				const x = t ? parseFloat(t[1]) : 0;
				return { el, text, x, cx: x, w };
			})
			.sort((a, b) => a.x - b.x);

		// recharts nudges the end label inward so it doesn't overrun the chart, then
		// anchors the gap walk on that shifted position. `labelOverflow` is how far
		// past the axis end a label may extend (the right margin).
		const rangeEnd = (scale.range && scale.range()[1]) ?? Infinity;
		const last = info[info.length - 1];
		if (last && isFinite(rangeEnd)) {
			const overshoot = last.x + last.w / 2 - (rangeEnd + labelOverflow);
			if (overshoot > 0) {
				last.cx = last.x - overshoot;
				last.text?.setAttribute('dx', String(-overshoot));
			}
		}

		let lastLeft = Infinity;
		for (let i = info.length - 1; i >= 0; i--) {
			const t = info[i];
			const isLast = i === info.length - 1;
			// recharts drops a label whose box would overflow the axis start; the end
			// tick is always preserved (and may overhang into the right margin).
			const fitsStart = t.cx - t.w / 2 >= 0;
			const keep = isLast || (fitsStart && lastLeft - (t.cx + t.w / 2) >= minGap);
			if (keep) {
				lastLeft = t.cx - t.w / 2;
			} else {
				t.el.remove();
			}
		}
	}

	if (!xAxis.axisLine()) g.select('.domain').remove();
	if (!xAxis.tickLine()) g.selectAll('.tick line').remove();

	g.selectAll('path, line').style('stroke', xAxis.stroke());
	// recharts default tick font size is 12px (D3's default of 10px is too small)
	g.selectAll('text').style('fill', xAxis.stroke()).style('font-size', '12px');
}

/**
 * Renders a Y-axis using D3 in the specified layer
 */
export function renderYAxis(
	axesLayer: SVGGElement,
	yAxis: SpnYAxis,
	scale: Scale,
	width: number,
	tickValues?: number[],
): void {
	const g = d3.select(axesLayer).append('g');

	const orientation = yAxis.orientation();
	const axisGenerator =
		orientation === 'right'
			? // eslint-disable-next-line @typescript-eslint/no-explicit-any
				d3.axisRight(scale as any)
			: // eslint-disable-next-line @typescript-eslint/no-explicit-any
				d3.axisLeft(scale as any);

	const ticks = yAxis.ticks();
	if (tickValues) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		axisGenerator.tickValues(tickValues as any);
	} else if (ticks) {
		axisGenerator.ticks(ticks);
	}

	axisGenerator.tickSize(yAxis.tickSize()).tickPadding(yAxis.tickPadding());

	const formatter = yAxis.tickFormatter();
	if (formatter) {
		axisGenerator.tickFormat((d, i) => formatter(d, i));
	}

	const xPosition = orientation === 'right' ? width : 0;
	g.attr('transform', `translate(${xPosition}, 0)`);
	g.call(axisGenerator);

	if (!yAxis.axisLine()) g.select('.domain').remove();
	if (!yAxis.tickLine()) g.selectAll('.tick line').remove();

	g.selectAll('path, line').style('stroke', yAxis.stroke());
	// recharts default tick font size is 12px (D3's default of 10px is too small)
	g.selectAll('text').style('fill', yAxis.stroke()).style('font-size', '12px');
}
