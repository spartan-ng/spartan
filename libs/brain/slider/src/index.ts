import { BrnSlider } from './lib/brn-slider';
import { BrnSliderRange } from './lib/brn-slider-range';
import { BrnSliderThumb } from './lib/brn-slider-thumb';
import { BrnSliderTick } from './lib/brn-slider-tick';
import { BrnSliderTrack } from './lib/brn-slider-track';

export * from './lib/brn-slider';
export * from './lib/brn-slider-range';
export * from './lib/brn-slider-thumb';
export * from './lib/brn-slider-tick';
export * from './lib/brn-slider-track';
export * from './lib/brn-slider.token';

export const BrnSliderImports = [BrnSlider, BrnSliderTrack, BrnSliderThumb, BrnSliderRange, BrnSliderTick] as const;
