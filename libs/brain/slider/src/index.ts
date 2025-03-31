import { BrnSliderRangeDirective } from './lib/brn-slider-range.directive';
import { BrnSliderThumbDirective } from './lib/brn-slider-thumb.directive';
import { BrnSliderTrackDirective } from './lib/brn-slider-track.directive';
import { BrnSliderDirective } from './lib/brn-slider.directive';

export * from './lib/brn-slider-range.directive';
export * from './lib/brn-slider-thumb.directive';
export * from './lib/brn-slider-track.directive';
export * from './lib/brn-slider.directive';
export * from './lib/brn-slider.token';

export const BrnSliderImports = [
	BrnSliderDirective,
	BrnSliderTrackDirective,
	BrnSliderThumbDirective,
	BrnSliderRangeDirective,
] as const;
