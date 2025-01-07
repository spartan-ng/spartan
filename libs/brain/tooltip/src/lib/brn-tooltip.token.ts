import { inject, InjectionToken, ValueProvider } from '@angular/core';
import { TooltipPosition, TooltipTouchGestures } from './brn-tooltip-trigger.directive';

export interface BrnTooltipOptions {
	/** Default delay when the tooltip is shown. */
	showDelay: number;
	/** Default delay when the tooltip is hidden. */
	hideDelay: number;
	/** Default delay when hiding the tooltip on a touch device. */
	touchendHideDelay: number;
	/** Default exit animation duration for the tooltip. */
	exitAnimationDuration: number;
	/** Default touch gesture handling for tooltips. */
	touchGestures?: TooltipTouchGestures;
	/** Default position for tooltips. */
	position?: TooltipPosition;
	/**
	 * Default value for whether tooltips should be positioned near the click or touch origin
	 * instead of outside the element bounding box.
	 */
	positionAtOrigin?: boolean;
	/** Disables the ability for the user to interact with the tooltip element. */
	disableTooltipInteractivity?: boolean;
	/** Default classes for the tooltip content. */
	tooltipContentClasses?: string;
}

export const defaultOptions: BrnTooltipOptions = {
	showDelay: 0,
	hideDelay: 0,
	exitAnimationDuration: 0,
	touchendHideDelay: 1500,
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
