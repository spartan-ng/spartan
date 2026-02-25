import { BrnSelect } from './lib/brn-select';
import { BrnSelectContent, BrnSelectScrollDown, BrnSelectScrollUp } from './lib/brn-select-content';
import { BrnSelectGroup } from './lib/brn-select-group';
import { BrnSelectLabel } from './lib/brn-select-label';
import { BrnSelectOption } from './lib/brn-select-option';
import { BrnSelectTrigger } from './lib/brn-select-trigger';

export * from './lib/brn-select';
export * from './lib/brn-select-content';
export * from './lib/brn-select-content.token';
export * from './lib/brn-select-group';
export * from './lib/brn-select-label';
export * from './lib/brn-select-option';
export * from './lib/brn-select-trigger';
export * from './lib/brn-select.token';

import { OverlayModule } from '@angular/cdk/overlay';

export const BrnSelectImports = [
	OverlayModule,
	BrnSelect,
	BrnSelectContent,
	BrnSelectTrigger,
	BrnSelectOption,
	BrnSelectScrollDown,
	BrnSelectScrollUp,
	BrnSelectGroup,
	BrnSelectLabel,
] as const;
