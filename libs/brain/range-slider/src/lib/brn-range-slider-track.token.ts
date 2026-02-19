import { type ExistingProvider, inject, InjectionToken, type Type } from '@angular/core';
import type { BrnRangeSliderTrack } from './brn-range-slider-track';

export const BrnRangeSliderTrackToken = new InjectionToken<BrnRangeSliderTrack>('BrnRangeSliderTrackToken');

export function provideBrnRangeSliderTrack(track: Type<BrnRangeSliderTrack>): ExistingProvider {
	return { provide: BrnRangeSliderTrackToken, useExisting: track };
}

export function injectBrnRangeSliderTrack(): BrnRangeSliderTrack {
	return inject(BrnRangeSliderTrackToken);
}
