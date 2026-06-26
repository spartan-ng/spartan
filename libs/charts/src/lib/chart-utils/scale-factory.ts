import * as d3 from 'd3';
import type { AxisType, ChartData, DataKey, Domain } from '../types';
import { calculateDomain, getValueByDataKey } from '../types';

/**
 * Utility functions for creating D3 scales
 * Shared across all chart types to eliminate code duplication
 */

/**
 * Creates an X-axis scale based on the specified parameters
 */
export function createXScale<T>(
	data: ChartData<T>,
	domain: [number | string | Date, number | string | Date],
	type: AxisType,
	dataKey: DataKey<T>,
	width: number,
) {
	if (type === 'category') {
		const categories = data.map((d) => String(getValueByDataKey(d, dataKey)));
		return d3.scalePoint().domain(categories).range([0, width]);
	}

	if (type === 'time') {
		return d3
			.scaleTime()
			.domain(domain as [Date, Date])
			.range([0, width]);
	}

	// Default: linear scale
	return d3
		.scaleLinear()
		.domain(domain as [number, number])
		.range([0, width]);
}

/**
 * Creates a Y-axis scale based on the specified parameters
 */
export function createYScale<T>(
	data: ChartData<T>,
	domain: [number | string | Date, number | string | Date],
	type: AxisType,
	dataKey: DataKey<T>,
	height: number,
) {
	if (type === 'category') {
		const categories = data.map((d) => String(getValueByDataKey(d, dataKey)));
		return d3.scaleBand().domain(categories).range([height, 0]).padding(0.1);
	}

	if (type === 'time') {
		return d3
			.scaleTime()
			.domain(domain as [Date, Date])
			.range([height, 0]);
	}

	// Default: linear scale (note: reversed range for Y axis)
	return d3
		.scaleLinear()
		.domain(domain as [number, number])
		.range([height, 0]);
}

/**
 * recharts-compatible "nice" step (allows steps like 80 that d3's 1/2/5 set won't).
 * Mirrors recharts-scale getFormatStep so our default axis domain/ticks match recharts.
 */
export function niceTickStep(roughStep: number): number {
	if (roughStep <= 0) return 0;
	const digitCount = Math.floor(Math.log10(roughStep)) + 1;
	const dcv = Math.pow(10, digitCount);
	const stepRatio = roughStep / dcv;
	const scale = digitCount !== 1 ? 0.05 : 0.1;
	const amended = Math.ceil(stepRatio / scale) * scale;
	return amended * dcv;
}

/**
 * recharts-compatible nice tick values over [min, max] (default 5 ticks).
 * e.g. niceTicks(0, 305) -> [0, 80, 160, 240, 320]
 */
export function niceTicks(min: number, max: number, count = 5): number[] {
	if (!(max > min) || count < 2) return [min, max];
	const step = niceTickStep((max - min) / (count - 1));
	if (step <= 0) return [min, max];
	const niceMin = Math.floor(min / step) * step;
	const niceMax = Math.ceil(max / step) * step;
	const ticks: number[] = [];
	for (let v = niceMin; v <= niceMax + step * 1e-9; v += step) {
		ticks.push(Math.round(v * 1e6) / 1e6);
	}
	return ticks;
}

/**
 * Calculates axis domain from data
 */
export function calculateAxisDomain<T>(
	data: ChartData<T>,
	dataKey: DataKey<T>,
	type: AxisType,
	domainInput: Domain,
): [number | string | Date, number | string | Date] {
	if (domainInput[0] !== 'auto' && domainInput[0] !== 'dataMin') {
		return domainInput as [number | string | Date, number | string | Date];
	}

	if (!dataKey) {
		return type === 'category' ? [0, data.length - 1] : [0, 100];
	}

	return calculateDomain(data, dataKey, type);
}

/**
 * Creates a band scale for bar charts
 */
export function createBandScale<T>(
	data: ChartData<T>,
	dataKey: DataKey<T>,
	size: number,
	reverse = false,
	padding = 0.1,
): d3.ScaleBand<string> {
	const categories = data.map((d) => String(getValueByDataKey(d, dataKey)));

	// recharts splits the category gap: the inner gap between bars is twice the
	// outer gap, so a single bar fills ~(1 - 2*padding) of an evenly divided band
	// (step = range / n). e.g. padding 0.1 -> bars are 80% of the band.
	const scale = d3
		.scaleBand<string>()
		.domain(categories)
		.paddingInner(padding * 2)
		.paddingOuter(padding);

	if (reverse) {
		scale.range([size, 0]);
	} else {
		scale.range([0, size]);
	}

	return scale;
}

/**
 * Creates a linear scale
 */
export function createLinearScale(
	domain: [number, number],
	size: number,
	reverse = true,
): d3.ScaleLinear<number, number> {
	const scale = d3.scaleLinear().domain(domain);

	if (reverse) {
		scale.range([size, 0]);
	} else {
		scale.range([0, size]);
	}

	return scale;
}
