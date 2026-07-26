import type { ChartData, DataKey, Domain } from '../types';
import { getValueByDataKey } from '../types';

/**
 * Utility functions for calculating axis domains from chart data
 * Shared across all chart types to eliminate code duplication
 */

/**
 * Interface for series configuration used in domain calculation
 */
export interface SeriesConfig<T> {
	/** Data key to extract values */
	dataKey: DataKey<T>;
	/** Whether the series is hidden */
	hide: boolean;
	/** Y-axis ID this series belongs to */
	yAxisId: string;
	/** Optional stack ID for stacked series */
	stackId?: string;
}

/**
 * Calculates the Y-axis domain from multiple series.
 * Handles both stacked and non-stacked series.
 *
 * @param data - Chart data array
 * @param series - Array of series configurations
 * @param axisId - Y-axis ID to calculate domain for
 * @param domainInput - User-provided domain (used if not 'auto')
 * @param options - Optional configuration
 * @returns Domain tuple [min, max]
 */
export function calculateSeriesYDomain<T>(
	data: ChartData<T>,
	series: readonly SeriesConfig<T>[],
	axisId: string,
	domainInput: Domain,
	options?: {
		/** Whether to support stacking (default: true) */
		supportStacking?: boolean;
		/** Whether to include zero in domain (default: false for lines, true for bars/areas) */
		includeZero?: boolean;
		/** Padding factor to add to domain (default: 0) */
		padding?: number;
	},
): [number, number] {
	// If domain is explicitly set, use it
	if (domainInput[0] !== 'auto' && domainInput[0] !== 'dataMin') {
		return domainInput as [number, number];
	}

	const opts = {
		supportStacking: true,
		includeZero: false,
		padding: 0,
		...options,
	};

	// Filter series for this axis
	const seriesForAxis = series.filter((s) => !s.hide && s.yAxisId === axisId);

	if (seriesForAxis.length === 0) {
		return [0, 100];
	}

	// Separate stacked and non-stacked series
	const stackGroups = new Map<string, SeriesConfig<T>[]>();
	const nonStackedSeries: SeriesConfig<T>[] = [];

	if (opts.supportStacking) {
		seriesForAxis.forEach((s) => {
			if (s.stackId) {
				const group = stackGroups.get(s.stackId) || [];
				group.push(s);
				stackGroups.set(s.stackId, group);
			} else {
				nonStackedSeries.push(s);
			}
		});
	} else {
		nonStackedSeries.push(...seriesForAxis);
	}

	let minValue = Infinity;
	let maxValue = -Infinity;

	// Calculate domain from stacked series - need to sum values per data point
	stackGroups.forEach((stackedSeries) => {
		data.forEach((d) => {
			let positiveSum = 0;
			let negativeSum = 0;

			stackedSeries.forEach((s) => {
				const value = getValueByDataKey(d, s.dataKey) as number;
				if (value != null && !isNaN(value)) {
					if (value >= 0) {
						positiveSum += value;
					} else {
						negativeSum += value;
					}
				}
			});

			maxValue = Math.max(maxValue, positiveSum);
			minValue = Math.min(minValue, negativeSum);
		});
	});

	// Calculate domain from non-stacked series
	nonStackedSeries.forEach((s) => {
		data.forEach((d) => {
			const value = getValueByDataKey(d, s.dataKey) as number;
			if (value != null && !isNaN(value)) {
				minValue = Math.min(minValue, value);
				maxValue = Math.max(maxValue, value);
			}
		});
	});

	// Handle case where no valid values found
	if (minValue === Infinity || maxValue === -Infinity) {
		return [0, 100];
	}

	// Include zero in domain if requested (common for bar/area charts)
	if (opts.includeZero) {
		minValue = Math.min(0, minValue);
		maxValue = Math.max(0, maxValue);
	}

	// Add padding to domain if requested
	if (opts.padding > 0) {
		const range = maxValue - minValue;
		const paddingAmount = range * opts.padding;
		minValue -= paddingAmount;
		maxValue += paddingAmount;
	}

	return [minValue, maxValue];
}

/**
 * Calculates the X-axis domain for scatter charts from multiple series.
 *
 * @param data - Chart data array
 * @param series - Array of series with xDataKey and xAxisId
 * @param axisId - X-axis ID to calculate domain for
 * @param domainInput - User-provided domain (used if not 'auto')
 * @param options - Optional configuration
 * @returns Domain tuple [min, max]
 */
export function calculateScatterXDomain<T>(
	data: ChartData<T>,
	series: readonly { xDataKey: DataKey<T>; hide: boolean; xAxisId: string; data?: ChartData<T> }[],
	axisId: string,
	domainInput: Domain,
	options?: {
		/** Padding factor to add to domain (default: 0.05) */
		padding?: number;
	},
): [number, number] {
	if (domainInput[0] !== 'auto' && domainInput[0] !== 'dataMin') {
		return domainInput as [number, number];
	}

	const opts = { padding: 0.05, ...options };

	const seriesForAxis = series.filter((s) => !s.hide && s.xAxisId === axisId);

	if (seriesForAxis.length === 0) {
		return [0, 100];
	}

	let minValue = Infinity;
	let maxValue = -Infinity;

	seriesForAxis.forEach((s) => {
		const seriesData = s.data || data;
		seriesData.forEach((d) => {
			const value = getValueByDataKey(d, s.xDataKey) as number;
			if (value != null && !isNaN(value)) {
				minValue = Math.min(minValue, value);
				maxValue = Math.max(maxValue, value);
			}
		});
	});

	if (minValue === Infinity || maxValue === -Infinity) {
		return [0, 100];
	}

	// Add padding
	const range = maxValue - minValue;
	const paddingAmount = range * opts.padding;

	return [minValue - paddingAmount, maxValue + paddingAmount];
}

/**
 * Creates series config from line-like components (Line, Area).
 * Helper to convert component instances to SeriesConfig.
 *
 * @param components - Array of Line/Area components
 * @returns Array of SeriesConfig objects
 */
export function toSeriesConfig<
	T,
	C extends {
		dataKey: () => DataKey<T>;
		hide: () => boolean;
		yAxisId: () => string;
		stackId?: () => string | undefined;
	},
>(components: readonly C[]): SeriesConfig<T>[] {
	return components.map((c) => ({
		dataKey: c.dataKey(),
		hide: c.hide(),
		yAxisId: c.yAxisId(),
		stackId: c.stackId?.(),
	}));
}
