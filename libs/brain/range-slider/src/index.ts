import { BrnRangeSlider } from './lib/brn-range-slider';
import { BrnRangeSliderRange } from './lib/brn-range-slider-range';
import { BrnRangeSliderThumb } from './lib/brn-range-slider-thumb';
import { BrnRangeSliderTrack } from './lib/brn-range-slider-track';

export * from './lib/brn-range-slider';
export * from './lib/brn-range-slider-range';
export * from './lib/brn-range-slider-thumb';
export * from './lib/brn-range-slider-track';
export * from './lib/brn-range-slider.token';
export * from './lib/brn-range-slider-track.token';

export const BrnRangeSliderImports = [
	BrnRangeSlider,
	BrnRangeSliderTrack,
	BrnRangeSliderThumb,
	BrnRangeSliderRange,
] as const;
