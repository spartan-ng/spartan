import type * as d3 from 'd3';

/**
 * Utility functions for managing hover effects on chart elements
 * Shared across all chart types to eliminate code duplication
 */

/**
 * Configuration for hover effects on chart elements
 */
export interface HoverEffectConfig {
	/** Fill color when hovered (uses base if not provided) */
	hoverFill?: string;
	/** Stroke color when hovered */
	hoverStroke?: string;
	/** Stroke width when hovered */
	hoverStrokeWidth?: number;
	/** Opacity when this element is hovered */
	hoverOpacity: number;
	/** Whether to dim other elements when one is hovered */
	dimOthers: boolean;
	/** Opacity for dimmed elements */
	dimOpacity: number;
	/** Transition duration in milliseconds */
	transitionDuration: number;
}

/**
 * State for determining how to style an element during hover
 */
export type ElementHoverState = 'active' | 'dimmed' | 'normal' | 'reset';

/**
 * Determines the hover state for an element based on active index
 *
 * @param elementIndex - Index of the element being evaluated
 * @param activeIndex - Index of the currently active (hovered) element, -1 if none
 * @param dimOthers - Whether to dim non-active elements
 * @returns The hover state for the element
 */
export function getHoverState(elementIndex: number, activeIndex: number, dimOthers: boolean): ElementHoverState {
	if (activeIndex === -1) {
		return 'reset';
	}
	if (elementIndex === activeIndex) {
		return 'active';
	}
	if (dimOthers) {
		return 'dimmed';
	}
	return 'normal';
}

/**
 * Applies hover effect styling to a single SVG element.
 * Handles transitions and all hover states consistently.
 *
 * @param element - D3 selection of the SVG element
 * @param state - The hover state to apply
 * @param baseFill - The original fill color of the element
 * @param config - Hover effect configuration
 * @param baseStroke - Optional base stroke color
 * @param baseStrokeWidth - Optional base stroke width
 */
export function applyHoverEffect(
	element: d3.Selection<SVGElement, unknown, null, undefined>,
	state: ElementHoverState,
	baseFill: string,
	config: HoverEffectConfig,
	baseStroke?: string,
	baseStrokeWidth?: number,
): void {
	// Interrupt any existing hover transition
	element.interrupt('hover');

	const transition = element.transition('hover').duration(config.transitionDuration);

	switch (state) {
		case 'reset':
			// No hover - restore to base styles
			transition.attr('fill', baseFill).attr('opacity', 1);
			if (baseStroke !== undefined) {
				transition.attr('stroke', baseStroke);
			}
			if (baseStrokeWidth !== undefined) {
				transition.attr('stroke-width', baseStrokeWidth);
			}
			break;

		case 'active':
			// This element is hovered - apply hover styles
			transition.attr('fill', config.hoverFill || baseFill).attr('opacity', config.hoverOpacity);
			if (config.hoverStroke) {
				transition.attr('stroke', config.hoverStroke);
			}
			if (config.hoverStrokeWidth !== undefined) {
				transition.attr('stroke-width', config.hoverStrokeWidth);
			}
			break;

		case 'dimmed':
			// Another element is hovered - dim this one
			transition.attr('opacity', config.dimOpacity);
			break;

		case 'normal':
			// Another element is hovered but dimOthers is false
			transition.attr('opacity', 1);
			break;
	}
}

/**
 * Applies hover effect to a line element (path).
 * Lines use stroke instead of fill for styling.
 *
 * @param element - D3 selection of the path element
 * @param state - The hover state to apply
 * @param baseStroke - The original stroke color
 * @param baseStrokeWidth - The original stroke width
 * @param config - Hover effect configuration (uses hoverStroke/hoverStrokeWidth)
 */
export function applyLineHoverEffect(
	element: d3.Selection<SVGPathElement, unknown, null, undefined>,
	state: ElementHoverState,
	baseStroke: string,
	baseStrokeWidth: number,
	config: HoverEffectConfig,
): void {
	element.interrupt('hover');

	const transition = element.transition('hover').duration(config.transitionDuration);

	switch (state) {
		case 'reset':
			transition.attr('stroke', baseStroke).attr('stroke-width', baseStrokeWidth).attr('opacity', 1);
			break;

		case 'active':
			transition
				.attr('stroke', config.hoverStroke || baseStroke)
				.attr('stroke-width', config.hoverStrokeWidth ?? baseStrokeWidth)
				.attr('opacity', config.hoverOpacity);
			break;

		case 'dimmed':
			transition.attr('opacity', config.dimOpacity);
			break;

		case 'normal':
			transition.attr('opacity', 1);
			break;
	}
}

/**
 * Applies hover effect to a pie slice with optional explode effect.
 *
 * @param element - D3 selection of the path element
 * @param state - The hover state to apply
 * @param baseFill - The original fill color
 * @param config - Hover effect configuration
 * @param baseStroke - Base stroke color
 * @param baseStrokeWidth - Base stroke width
 * @param explodeTransform - Optional transform string for explode effect
 */
export function applyPieHoverEffect(
	element: d3.Selection<SVGPathElement, unknown, null, undefined>,
	state: ElementHoverState,
	baseFill: string,
	config: HoverEffectConfig,
	baseStroke: string,
	baseStrokeWidth: number,
	explodeTransform?: string,
): void {
	element.interrupt('hover');

	const transition = element.transition('hover').duration(config.transitionDuration);

	switch (state) {
		case 'reset':
			transition
				.attr('fill', baseFill)
				.attr('stroke', baseStroke)
				.attr('stroke-width', baseStrokeWidth)
				.attr('transform', '')
				.attr('opacity', 1);
			break;

		case 'active':
			transition
				.attr('fill', config.hoverFill || baseFill)
				.attr('stroke', config.hoverStroke || baseStroke)
				.attr('stroke-width', config.hoverStrokeWidth ?? baseStrokeWidth)
				.attr('transform', explodeTransform || '')
				.attr('opacity', config.hoverOpacity);
			break;

		case 'dimmed':
			transition.attr('transform', '').attr('opacity', config.dimOpacity);
			break;

		case 'normal':
			transition.attr('transform', '').attr('opacity', 1);
			break;
	}
}

/**
 * Configuration interface that matches the common pattern in config components.
 * All properties are optional to support different component types
 * (e.g., lines use hoverStroke, bars/pies use hoverFill).
 */
export interface HoverConfigInputs {
	hoverFill?: () => string | undefined;
	hoverStroke?: () => string | undefined;
	hoverStrokeWidth?: () => number | undefined;
	hoverOpacity: () => number;
	dimOthers: () => boolean;
	dimOpacity: () => number;
	hoverTransitionDuration: () => number;
	// Pie-specific
	hoverExplodeOffset?: () => number;
}

/**
 * Creates a HoverEffectConfig from component inputs.
 * Useful for extracting config from Angular signal inputs.
 *
 * @param inputs - Object with signal accessor functions
 * @returns HoverEffectConfig object
 */
export function createHoverConfig(inputs: HoverConfigInputs): HoverEffectConfig {
	return {
		hoverFill: typeof inputs.hoverFill === 'function' ? inputs.hoverFill() : undefined,
		hoverStroke: typeof inputs.hoverStroke === 'function' ? inputs.hoverStroke() : undefined,
		hoverStrokeWidth: typeof inputs.hoverStrokeWidth === 'function' ? inputs.hoverStrokeWidth() : undefined,
		hoverOpacity: inputs.hoverOpacity(),
		dimOthers: inputs.dimOthers(),
		dimOpacity: inputs.dimOpacity(),
		transitionDuration: inputs.hoverTransitionDuration(),
	};
}

/**
 * Checks if any hover effects are configured on a config component.
 * Used to skip hover processing when not needed.
 *
 * @param inputs - Object with signal accessor functions
 * @returns true if any hover effects are configured
 */
export function hasHoverEffects(inputs: HoverConfigInputs): boolean {
	const hasFill = typeof inputs.hoverFill === 'function' && inputs.hoverFill();
	const hasStroke = typeof inputs.hoverStroke === 'function' && inputs.hoverStroke();
	const hasStrokeWidth = typeof inputs.hoverStrokeWidth === 'function' && inputs.hoverStrokeWidth() !== undefined;
	const hasExplode = typeof inputs.hoverExplodeOffset === 'function' && inputs.hoverExplodeOffset() > 0;

	return !!(hasFill || hasStroke || hasStrokeWidth || inputs.dimOthers() || hasExplode);
}

/**
 * Checks if any element in a collection has hover effects configured.
 *
 * @param elements - Array of config components with hover inputs
 * @param isVisible - Function to check if element is visible
 * @returns true if any visible element has hover effects
 */
export function anyElementHasHoverEffects<T extends HoverConfigInputs>(
	elements: readonly T[],
	isVisible: (el: T) => boolean = () => true,
): boolean {
	return elements.filter(isVisible).some(hasHoverEffects);
}
