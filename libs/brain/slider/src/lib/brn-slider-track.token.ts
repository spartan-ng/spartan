import { ExistingProvider, inject, InjectionToken, Type } from '@angular/core';
import type { BrnSliderTrackDirective } from './brn-slider-track.directive';

export const BrnSliderTrackToken = new InjectionToken<BrnSliderTrackDirective>('BrnSliderTrackToken');

export function provideBrnSliderTrack(slider: Type<BrnSliderTrackDirective>): ExistingProvider {
	return { provide: BrnSliderTrackToken, useExisting: slider };
}

export function injectBrnSliderTrack(): BrnSliderTrackDirective {
	return inject(BrnSliderTrackToken);
}
