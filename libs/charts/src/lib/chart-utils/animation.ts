import * as d3 from 'd3';

/**
 * Animation utility functions and constants
 * Shared across all chart types for consistent animation behavior
 */

/**
 * Maps CSS easing names to D3 easing functions
 */
export const ANIMATION_EASINGS: Record<string, (t: number) => number> = {
	linear: d3.easeLinear,
	ease: d3.easeCubicInOut,
	'ease-in': d3.easeCubicIn,
	'ease-out': d3.easeCubicOut,
	'ease-in-out': d3.easeCubicInOut,
	'quad-in': d3.easeQuadIn,
	'quad-out': d3.easeQuadOut,
	'quad-in-out': d3.easeQuadInOut,
	'cubic-in': d3.easeCubicIn,
	'cubic-out': d3.easeCubicOut,
	'cubic-in-out': d3.easeCubicInOut,
	'elastic-out': d3.easeElasticOut,
	'bounce-out': d3.easeBounceOut,
	'back-out': d3.easeBackOut,
};

/**
 * Gets the D3 easing function for a given easing name
 * @param easing - The easing name (CSS-style or custom)
 * @returns D3 easing function, defaults to easeCubicOut if not found
 */
export function getEasingFunction(easing: string): (t: number) => number {
	return ANIMATION_EASINGS[easing] ?? d3.easeCubicOut;
}

/**
 * Default animation configuration values
 */
export const DEFAULT_ANIMATION = {
	duration: 400,
	easing: 'ease-in-out',
	staggerDelay: 50,
} as const;

/**
 * Creates a staggered animation delay based on index
 * @param index - The item index
 * @param staggerMs - Milliseconds between each item
 * @returns Delay in milliseconds
 */
export function getStaggerDelay(index: number, staggerMs: number = DEFAULT_ANIMATION.staggerDelay): number {
	return index * staggerMs;
}

/**
 * Applies a staggered fade-in animation to a D3 selection
 * @param selection - D3 selection to animate
 * @param duration - Animation duration in ms
 * @param staggerMs - Stagger delay between items in ms
 * @param easing - Easing function name
 */
export function applyStaggeredFadeIn<T extends d3.BaseType, U, P extends d3.BaseType, PU>(
	selection: d3.Selection<T, U, P, PU>,
	duration: number = DEFAULT_ANIMATION.duration,
	staggerMs: number = DEFAULT_ANIMATION.staggerDelay,
	easing: string = DEFAULT_ANIMATION.easing,
): void {
	selection
		.attr('opacity', 0)
		.transition()
		.duration(duration)
		.delay((_d, i) => getStaggerDelay(i, staggerMs))
		.ease(getEasingFunction(easing))
		.attr('opacity', 1);
}
