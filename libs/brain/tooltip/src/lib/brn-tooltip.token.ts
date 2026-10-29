import { type FactoryProvider, inject, InjectionToken } from '@angular/core';
import { type ClassValue } from 'clsx';
import { type BrnTooltipPosition } from './brn-tooltip-position';

export interface BrnTooltipOptions {
	/** Default delay when the tooltip is shown. */
	showDelay: number;
	/** Default delay when the tooltip is hidden. */
	hideDelay: number;
	/** Default distance in px between the tooltip and its trigger. */
	sideOffset?: number;
	/** Default position for tooltips. */
	position?: BrnTooltipPosition;
	/** Additional classes for the SVG element in the tooltip arrow. */
	svgClasses: ClassValue;
	/** Additional classes for the tooltip arrow element based on position. */
	arrowClasses: (position: BrnTooltipPosition) => ClassValue;
	/** Additional classes for the tooltip content element. */
	tooltipContentClasses: ClassValue;
}

export const defaultOptions: BrnTooltipOptions = {
	showDelay: 0,
	hideDelay: 0,
	sideOffset: 8,
	svgClasses: '',
	arrowClasses: () => '',
	tooltipContentClasses: '',
};

const BRN_TOOLTIP_DEFAULT_OPTIONS = new InjectionToken<BrnTooltipOptions>('brn-tooltip-default-options', {
	providedIn: 'root',
	factory: () => defaultOptions,
});

/**
 * Provides tooltip options on top of the ones already provided above this injector (a parent
 * component, or the application config), so a nested provider such as `HlmTooltip`'s only
 * overrides the options it sets.
 */
export function provideBrnTooltipDefaultOptions(options: Partial<BrnTooltipOptions>): FactoryProvider {
	return {
		provide: BRN_TOOLTIP_DEFAULT_OPTIONS,
		useFactory: () => ({
			...(inject(BRN_TOOLTIP_DEFAULT_OPTIONS, { optional: true, skipSelf: true }) ?? defaultOptions),
			...options,
		}),
	};
}

export function injectBrnTooltipDefaultOptions(): BrnTooltipOptions {
	return inject(BRN_TOOLTIP_DEFAULT_OPTIONS, { optional: true }) ?? defaultOptions;
}
