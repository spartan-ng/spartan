import {
	BrnSelect,
	BrnSelectContent,
	BrnSelectPlaceholder,
	BrnSelectValue,
	BrnSelectValueTemplate,
} from '@spartan-ng/brain/select';
import { HlmSelect } from './lib/hlm-select';
import { HlmSelectContent } from './lib/hlm-select-content';
import { HlmSelectGroup } from './lib/hlm-select-group';
import { HlmSelectLabel } from './lib/hlm-select-label';
import { HlmSelectOption } from './lib/hlm-select-option';
import { HlmSelectScrollDown } from './lib/hlm-select-scroll-down';
import { HlmSelectScrollUp } from './lib/hlm-select-scroll-up';
import { HlmSelectTrigger } from './lib/hlm-select-trigger';
import { HlmSelectValue } from './lib/hlm-select-value';

export * from '@spartan-ng/brain/select';
export * from './lib/hlm-select';
export * from './lib/hlm-select-content';
export * from './lib/hlm-select-group';
export * from './lib/hlm-select-label';
export * from './lib/hlm-select-option';
export * from './lib/hlm-select-scroll-down';
export * from './lib/hlm-select-scroll-up';
export * from './lib/hlm-select-trigger';
export * from './lib/hlm-select-value';

export const HlmSelectImports = [
	// BRN pieces — dual-selector auto-applies these when consumer uses hlm-select elements
	BrnSelect, // matches <hlm-select> (selector: 'brn-select, hlm-select')
	BrnSelectContent, // matches <hlm-select-content> (selector: '..., hlm-select-content:not(noHlm)')
	BrnSelectValue, // matches <hlm-select-value> (selector: 'brn-select-value, hlm-select-value')
	BrnSelectValueTemplate, // structural directive: *brnSelectValue="let value"
	BrnSelectPlaceholder, // structural directive: *brnSelectPlaceholder
	// HLM styling components
	HlmSelect,
	HlmSelectContent,
	HlmSelectTrigger,
	HlmSelectOption,
	HlmSelectValue,
	HlmSelectScrollUp,
	HlmSelectScrollDown,
	HlmSelectLabel,
	HlmSelectGroup,
] as const;
