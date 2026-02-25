import { BrnSelectContent } from '@spartan-ng/brain/select';
import { HlmSelect } from './lib/hlm-select';
import { HlmSelectContent } from './lib/hlm-select-content';
import { HlmSelectGroup } from './lib/hlm-select-group';
import { HlmSelectLabel } from './lib/hlm-select-label';
import { HlmSelectOption } from './lib/hlm-select-option';
import { HlmSelectScrollDown } from './lib/hlm-select-scroll-down';
import { HlmSelectScrollUp } from './lib/hlm-select-scroll-up';
import { HlmSelectTrigger } from './lib/hlm-select-trigger';

export * from '@spartan-ng/brain/select';
export * from './lib/hlm-select';
export * from './lib/hlm-select-content';
export * from './lib/hlm-select-group';
export * from './lib/hlm-select-label';
export * from './lib/hlm-select-option';
export * from './lib/hlm-select-scroll-down';
export * from './lib/hlm-select-scroll-up';
export * from './lib/hlm-select-trigger';

export const HlmSelectImports = [
	// BRN pieces — included so consumers using HlmSelectImports can also use <brn-select> directly
	// BrnSelect, // applied to <hlm-select> via hostDirectives inside HlmSelect, not by selector

	// Why BrnSelectContent is exported here:
	// 1. Angular compiler rules strictly forbid Components from being used as `hostDirectives`.
	// 2. We cannot make HlmSelectContent a wrapper component because Angular's Dependency Injection
	//    blocks projected content (e.g. scroll buttons or options) from injecting a parent that
	//    lives inside a wrapper's view template.
	// 3. To solve this, HlmSelectContent is a styling Directive and BrnSelectContent acts as a
	//    sibling passive Component on the exact same DOM node (via `selector: '..., hlm-select-content'`).
	// 4. By exporting BrnSelectContent directly in the `Hlm` array, the developer's application
	//    natively resolves both components simultaneously on the `<hlm-select-content>` tag without
	//    requiring them to manually figure out and import both Brn+Hlm arrays!
	BrnSelectContent,

	// HLM styling components
	HlmSelect,
	HlmSelectContent,
	HlmSelectTrigger,
	HlmSelectOption,
	HlmSelectScrollUp,
	HlmSelectScrollDown,
	HlmSelectLabel,
	HlmSelectGroup,
] as const;
