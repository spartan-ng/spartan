import * as d3 from 'd3';

/**
 * Utility functions for managing SVG layers
 * Shared across all chart types to eliminate code duplication
 */

/**
 * Clears all content from the specified SVG layers
 * @param layers - Array of SVG group elements to clear
 */
export function clearLayers(...layers: (SVGGElement | undefined)[]): void {
	layers.forEach((layer) => {
		if (layer) {
			d3.select(layer).selectAll('*').remove();
		}
	});
}

/**
 * Sets up layer references from an SVG element
 * @param svg - The SVG element to query
 * @param selectors - Array of CSS class selectors (without the dot)
 * @returns Map of selector name to SVGGElement
 */
export function setupLayers(svg: SVGSVGElement, selectors: string[]): Map<string, SVGGElement> {
	const layers = new Map<string, SVGGElement>();
	selectors.forEach((sel) => {
		const element = svg.querySelector(`.${sel}`) as SVGGElement;
		if (element) {
			layers.set(sel, element);
		}
	});
	return layers;
}

/**
 * Gets a layer from the layers map, throwing if not found
 * @param layers - The layers map
 * @param name - The layer name to retrieve
 * @returns The SVG group element
 */
export function getLayer(layers: Map<string, SVGGElement>, name: string): SVGGElement {
	const layer = layers.get(name);
	if (!layer) {
		throw new Error(`Layer '${name}' not found`);
	}
	return layer;
}
