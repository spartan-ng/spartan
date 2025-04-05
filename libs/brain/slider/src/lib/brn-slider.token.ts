import { ExistingProvider, inject, InjectionToken, Type } from '@angular/core';
import type { BrnSliderDirective } from './brn-slider.directive';

const BrnSliderToken = new InjectionToken<BrnSliderDirective>('BrnSliderToken');

export function provideBrnSlider(slider: Type<BrnSliderDirective>): ExistingProvider {
	return { provide: BrnSliderToken, useExisting: slider };
}

export function injectBrnSlider(): BrnSliderDirective {
	return inject(BrnSliderToken);
}
