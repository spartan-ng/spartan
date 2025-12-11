import { BrnRadio } from './lib/brn-radio';
import { BrnRadioGroup } from './lib/brn-radio-group';

export * from './lib/brn-radio';
export * from './lib/brn-radio-group';
export * from './lib/brn-radio-group.token';

export const BrnRadioGroupImports = [BrnRadioGroup, BrnRadio] as const;
