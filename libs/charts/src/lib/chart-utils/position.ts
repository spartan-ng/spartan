import type * as d3 from 'd3';
import type { DataKey, Scale } from '../types';
import { getValueByDataKey, isBandScale, isLinearScale, isPointScale } from '../types';

/**
 * Utility functions for calculating positions on charts
 * Shared across all chart types to eliminate code duplication
 */

/**
 * Calculates the X position for a data point on any scale type.
 * Handles point, band, linear, and time scales automatically.
 *
 * @param dataPoint - The data item to get position for
 * @param index - Index of the data point (fallback for linear scales)
 * @param xScale - The D3 scale to use
 * @param xDataKey - Optional data key to extract x value
 * @returns X position in pixels
 */
export function getXPosition<T>(dataPoint: T, index: number, xScale: Scale, xDataKey?: DataKey<T>): number {
	// Try to get value from dataKey first
	if (xDataKey) {
		const value = getValueByDataKey(dataPoint, xDataKey);

		if (isPointScale(xScale)) {
			const position = xScale(String(value));
			if (position !== undefined) {
				return position;
			}
		} else if (isBandScale(xScale)) {
			const position = xScale(String(value));
			if (position !== undefined) {
				// Return center of band for line/area charts
				return position + xScale.bandwidth() / 2;
			}
		} else if (isLinearScale(xScale)) {
			const numValue = value as number;
			if (typeof numValue === 'number' && !isNaN(numValue)) {
				return xScale(numValue);
			}
		} else {
			// Time scale or other
			const position = (xScale as d3.ScaleTime<number, number>)(value as Date);
			if (typeof position === 'number' && !isNaN(position)) {
				return position;
			}
		}
	}

	// Fallback to index-based positioning for linear scales
	if (isLinearScale(xScale)) {
		return xScale(index);
	}

	// For point scales without dataKey, use index as string
	if (isPointScale(xScale)) {
		const position = xScale(String(index));
		return position !== undefined ? position : 0;
	}

	return 0;
}

/**
 * Calculates the Y position for a data point.
 *
 * @param dataPoint - The data item to get position for
 * @param yScale - The D3 scale to use (typically linear)
 * @param yDataKey - Data key to extract y value
 * @returns Y position in pixels
 */
export function getYPosition<T>(dataPoint: T, yScale: Scale, yDataKey: DataKey<T>): number {
	const value = getValueByDataKey(dataPoint, yDataKey);

	if (isLinearScale(yScale)) {
		const numValue = value as number;
		if (typeof numValue === 'number' && !isNaN(numValue)) {
			return yScale(numValue);
		}
	}

	return 0;
}

/**
 * Creates an X accessor function for D3 generators (line, area).
 * Returns a function that can be used with .x() in D3 generators.
 *
 * @param xScale - The D3 scale to use
 * @param xDataKey - Optional data key to extract x value
 * @returns Accessor function for D3 generators
 */
export function createXAccessor<T>(xScale: Scale, xDataKey?: DataKey<T>): (d: T, i: number) => number {
	return (d: T, i: number) => getXPosition(d, i, xScale, xDataKey);
}

/**
 * Gets the band position for categorical scales (bar charts).
 * Returns the start position of the band, not the center.
 *
 * @param value - The category value
 * @param bandScale - The D3 band scale
 * @returns Band start position in pixels, or 0 if not found
 */
export function getBandPosition(value: string | number, bandScale: d3.ScaleBand<string>): number {
	const position = bandScale(String(value));
	return position !== undefined ? position : 0;
}
