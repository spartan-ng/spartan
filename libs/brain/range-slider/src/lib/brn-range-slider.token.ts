import { type ExistingProvider, inject, InjectionToken, type Type } from '@angular/core';
import type { BrnRangeSlider } from './brn-range-slider';

const BrnRangeSliderToken = new InjectionToken<BrnRangeSlider>('BrnRangeSliderToken');

export function provideBrnRangeSlider(slider: Type<BrnRangeSlider>): ExistingProvider {
	return { provide: BrnRangeSliderToken, useExisting: slider };
}

export function injectBrnRangeSlider(): BrnRangeSlider {
	return inject(BrnRangeSliderToken);
}
