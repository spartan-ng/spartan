import { BrnSwitch } from './lib/brn-switch';
import { BrnSwitchThumb } from './lib/brn-switch-thumb';

export * from './lib/brn-switch';
export * from './lib/brn-switch-thumb';

export const BrnSwitchImports = [BrnSwitch, BrnSwitchThumb] as const;
