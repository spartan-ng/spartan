import { HlmTimeInput } from './lib/hlm-time-input';
import { HlmTimeInputSegment } from './lib/hlm-time-input-segment';

export * from './lib/hlm-time-input';
export * from './lib/hlm-time-input-segment';

export const HlmTimeInputImports = [HlmTimeInput, HlmTimeInputSegment] as const;
