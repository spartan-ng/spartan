import { BrnToggleGroup } from './lib/brn-toggle-group';
import { BrnToggleGroupItem } from './lib/brn-toggle-item';

export * from './lib/brn-toggle-group';
export * from './lib/brn-toggle-group.token';
export * from './lib/brn-toggle-item';

export const BrnToggleGroupImports = [BrnToggleGroup, BrnToggleGroupItem] as const;
