import { BrnProgress } from './lib/brn-progress';
import { BrnProgressIndicator } from './lib/brn-progress-indicator';

export { injectBrnProgress } from './lib/brn-progress.token';

export * from './lib/brn-progress';
export * from './lib/brn-progress-indicator';

export const BrnProgressImports = [BrnProgress, BrnProgressIndicator] as const;
