import { inject, InjectionToken, type ValueProvider } from '@angular/core';
import { type BrnTooltipPosition } from './brn-tooltip-position';

export interface BrnTooltipOptions {
	/** Default delay when the tooltip is shown. */
	showDelay: number;
	/** Default delay when the tooltip is hidden. */
	hideDelay: number;
	/** Default position for tooltips. */
	position?: BrnTooltipPosition;
	/** Additional classes for the SVG element in the tooltip arrow. */
	svgClasses: string;
	/** Additional classes for the tooltip arrow element based on position. */
	arrowClasses: (position: BrnTooltipPosition) => string;
	/** Additional classes for the tooltip content element. */
	tooltipContentClasses: string;
}

export const defaultOptions: BrnTooltipOptions = {
	showDelay: 150,
	hideDelay: 100,
	svgClasses: '',
	arrowClasses: () => '',
	tooltipContentClasses: '',
};

const BRN_TOOLTIP_DEFAULT_OPTIONS = new InjectionToken<BrnTooltipOptions>('brn-tooltip-default-options', {
	providedIn: 'root',
	factory: () => defaultOptions,
});

export function provideBrnTooltipDefaultOptions(options: Partial<BrnTooltipOptions>): ValueProvider {
	return { provide: BRN_TOOLTIP_DEFAULT_OPTIONS, useValue: { ...defaultOptions, ...options } };
}

export function injectBrnTooltipDefaultOptions(): BrnTooltipOptions {
	return inject(BRN_TOOLTIP_DEFAULT_OPTIONS, { optional: true }) ?? defaultOptions;
}
