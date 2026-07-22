import type * as d3 from 'd3';
import type { ChartContextService } from '../chart-context.service';
import type { ChartData, DataKey, Scale } from '../types';
import { getValueByDataKey } from '../types';

/**
 * Utility functions for handling mouse interactions and tooltips
 * Shared across all chart types to eliminate code duplication
 */

/**
 * Finds the nearest data point based on mouse position for line/area charts
 */
export function findNearestDataPoint<T>(
	mouseX: number,
	data: ChartData<T>,
	xScale: Scale,
	xAxisDataKey?: DataKey<T>,
): { dataIndex: number; dataPoint: T } {
	let dataIndex = 0;
	let dataPoint = data[0];

	if ('step' in xScale) {
		// Point scale (categorical)
		const pointScale = xScale as d3.ScalePoint<string>;
		const step = pointScale.step();
		dataIndex = Math.round(mouseX / step);
		dataIndex = Math.max(0, Math.min(dataIndex, data.length - 1));
		dataPoint = data[dataIndex];
	} else {
		// Linear/time scale
		const linearScale = xScale as d3.ScaleLinear<number, number>;
		const xValue = linearScale.invert(mouseX);

		// Find closest data point
		let minDistance = Infinity;
		data.forEach((d, i) => {
			if (xAxisDataKey) {
				const pointX = getValueByDataKey(d, xAxisDataKey);
				const distance = Math.abs((pointX as number) - (xValue as number));
				if (distance < minDistance) {
					minDistance = distance;
					dataIndex = i;
					dataPoint = d;
				}
			}
		});
	}

	return { dataIndex, dataPoint };
}

/**
 * Finds the data point for bar charts based on mouse position
 */
export function findBarDataPoint<T>(
	mousePos: number,
	data: ChartData<T>,
	bandScale: d3.ScaleBand<string>,
	categoryDataKey: DataKey<T>,
): { dataIndex: number; dataPoint: T } | null {
	let dataIndex = -1;

	data.forEach((d, i) => {
		const category = String(getValueByDataKey(d, categoryDataKey));
		const pos = bandScale(category);
		if (pos === undefined) return;

		const bandwidth = bandScale.bandwidth();
		if (mousePos >= pos && mousePos <= pos + bandwidth) {
			dataIndex = i;
		}
	});

	if (dataIndex === -1) return null;
	return { dataIndex, dataPoint: data[dataIndex] };
}

/**
 * Calculates the position for a data point on the chart
 */
export function calculateDataPointPosition<T>(
	dataPoint: T,
	dataIndex: number,
	xScale: Scale,
	yScale: Scale,
	xAxisDataKey?: DataKey<T>,
	yDataKey?: DataKey<T>,
): { x: number; y: number } {
	let dotX = 0;
	let dotY = 0;

	// Get x position
	if (xAxisDataKey) {
		const xValue = getValueByDataKey(dataPoint, xAxisDataKey);
		if ('step' in xScale) {
			const pointScale = xScale as d3.ScalePoint<string>;
			const position = pointScale(String(xValue));
			dotX = position !== undefined ? position : 0;
		} else {
			dotX = (xScale as d3.ScaleLinear<number, number>)(xValue as number);
		}
	} else {
		dotX = (xScale as d3.ScaleLinear<number, number>)(dataIndex);
	}

	// Get y position
	if (yDataKey) {
		const yValue = getValueByDataKey(dataPoint, yDataKey);
		dotY = (yScale as d3.ScaleLinear<number, number>)(yValue as number);
	}

	return { x: dotX, y: dotY };
}

/**
 * Updates tooltip data in the chart context
 */
export function updateTooltip<T>(
	chartContext: ChartContextService<T>,
	dataIndex: number,
	position: { x: number; y: number },
	payload: Array<{
		name: string;
		value: unknown;
		dataKey: DataKey<T>;
		color: string;
		payload: T;
	}>,
	label: string,
	marginLeft: number,
	marginTop: number,
	isResponsive: boolean,
	width: number,
	height: number,
	svgElement?: SVGSVGElement,
): void {
	let posX = position.x + marginLeft;
	let posY = position.y + marginTop;
	let scaleX = 1;
	let scaleY = 1;

	// In responsive mode, scale the position from viewBox to actual pixels
	if (isResponsive && svgElement) {
		const rect = svgElement.getBoundingClientRect();
		scaleX = rect.width / width;
		scaleY = rect.height / height;
		posX = posX * scaleX;
		posY = posY * scaleY;
	}

	// Update scale factors in context for responsive tooltip positioning
	chartContext.scaleX.set(scaleX);
	chartContext.scaleY.set(scaleY);

	// Set tooltip data
	chartContext.tooltipData.set({
		active: true,
		position: { x: posX, y: posY },
		payload,
		label,
		activeDataIndex: dataIndex,
	});
}

/**
 * Clears tooltip data
 */
export function clearTooltip<T>(chartContext: ChartContextService<T>): void {
	chartContext.tooltipData.set(null);
}

/**
 * Finds the nearest scatter point based on 2D Euclidean distance from mouse position
 */
export function findNearestScatterPoint<T>(
	mouseX: number,
	mouseY: number,
	data: ChartData<T>,
	xScale: d3.ScaleLinear<number, number>,
	yScale: d3.ScaleLinear<number, number>,
	xDataKey: DataKey<T>,
	yDataKey: DataKey<T>,
	maxDistance = 50,
): { dataIndex: number; dataPoint: T; distance: number } | null {
	let nearestIndex = -1;
	let nearestPoint: T | null = null;
	let minDistance = Infinity;

	data.forEach((d, i) => {
		const xValue = getValueByDataKey(d, xDataKey);
		const yValue = getValueByDataKey(d, yDataKey);

		if (xValue == null || yValue == null) return;

		const pointX = xScale(xValue as number);
		const pointY = yScale(yValue as number);

		if (isNaN(pointX) || isNaN(pointY)) return;

		// Calculate Euclidean distance
		const distance = Math.sqrt(Math.pow(mouseX - pointX, 2) + Math.pow(mouseY - pointY, 2));

		if (distance < minDistance && distance <= maxDistance) {
			minDistance = distance;
			nearestIndex = i;
			nearestPoint = d;
		}
	});

	if (nearestIndex === -1 || nearestPoint === null) {
		return null;
	}

	return {
		dataIndex: nearestIndex,
		dataPoint: nearestPoint,
		distance: minDistance,
	};
}
