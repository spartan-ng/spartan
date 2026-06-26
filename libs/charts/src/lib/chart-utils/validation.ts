import type { Signal } from '@angular/core';
import { computed } from '@angular/core';
import type { ChartMargin } from '../types';

/**
 * Utility functions for validating chart dimensions
 * Shared across all chart types to eliminate code duplication
 */

/**
 * Creates validated dimension signals with safe minimum values
 * @param width - Width signal
 * @param height - Height signal
 * @param margin - Margin signal
 * @returns Object with validated computed signals
 */
export function createValidatedDimensions(width: Signal<number>, height: Signal<number>, margin: Signal<ChartMargin>) {
	return {
		validatedWidth: computed(() => Math.max(0, width())),
		validatedHeight: computed(() => Math.max(0, height())),
		validatedMargin: computed(() => ({
			top: Math.max(0, margin().top),
			right: Math.max(0, margin().right),
			bottom: Math.max(0, margin().bottom),
			left: Math.max(0, margin().left),
		})),
	};
}

/**
 * Calculates inner dimensions accounting for margins
 * @param width - Total width
 * @param height - Total height
 * @param margin - Margin object
 * @returns Inner width and height
 */
export function calculateInnerDimensions(
	width: number,
	height: number,
	margin: ChartMargin,
): { innerWidth: number; innerHeight: number } {
	return {
		innerWidth: Math.max(0, width - margin.left - margin.right),
		innerHeight: Math.max(0, height - margin.top - margin.bottom),
	};
}
