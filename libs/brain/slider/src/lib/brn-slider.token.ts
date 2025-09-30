import { type ExistingProvider, inject, InjectionToken, type Type } from '@angular/core';
import type { BrnSlider } from './brn-slider';

const BrnSliderToken = new InjectionToken<BrnSlider>('BrnSliderToken');

export function provideBrnSlider(slider: Type<BrnSlider>): ExistingProvider {
	return { provide: BrnSliderToken, useExisting: slider };
}

export function injectBrnSlider(): BrnSlider {
	return inject(BrnSliderToken);
}
