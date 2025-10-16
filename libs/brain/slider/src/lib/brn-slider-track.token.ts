import { type ExistingProvider, inject, InjectionToken, type Type } from '@angular/core';
import type { BrnSliderTrack } from './brn-slider-track';

export const BrnSliderTrackToken = new InjectionToken<BrnSliderTrack>('BrnSliderTrackToken');

export function provideBrnSliderTrack(slider: Type<BrnSliderTrack>): ExistingProvider {
	return { provide: BrnSliderTrackToken, useExisting: slider };
}

export function injectBrnSliderTrack(): BrnSliderTrack {
	return inject(BrnSliderTrackToken);
}
