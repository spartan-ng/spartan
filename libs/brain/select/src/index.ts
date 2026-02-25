import { OverlayModule } from '@angular/cdk/overlay';
import {
	BrnCombobox,
	BrnComboboxContent,
	BrnComboboxGroup,
	BrnComboboxItem,
	BrnComboboxLabel,
	BrnComboboxScrollDown,
	BrnComboboxScrollUp,
	BrnComboboxTrigger,
} from '@spartan-ng/brain/combobox';
import { BrnSelect } from './lib/brn-select';

export * from './lib/brn-select';
export * from './lib/brn-select.token';

export const BrnSelectImports = [
	OverlayModule,
	BrnSelect,
	BrnCombobox,
	BrnComboboxContent,
	BrnComboboxTrigger,
	BrnComboboxItem,
	BrnComboboxScrollDown,
	BrnComboboxScrollUp,
	BrnComboboxGroup,
	BrnComboboxLabel,
] as const;
