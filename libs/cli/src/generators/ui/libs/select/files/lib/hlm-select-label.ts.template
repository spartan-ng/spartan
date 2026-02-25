import { computed, Directive, inject } from '@angular/core';
import { BrnComboboxLabel } from '@spartan-ng/brain/combobox';
import { classes } from '@spartan-ng/helm/utils';
// Note: HlmSelectContent needs `stickyLabels()` still, so I will ensure my HlmSelectContent still has it.
import { HlmSelectContent } from './hlm-select-content';

@Directive({
	selector: '[hlmSelectLabel], hlm-select-label',
	hostDirectives: [BrnComboboxLabel],
})
export class HlmSelectLabel {
	private readonly _selectContent = inject(HlmSelectContent);
	private readonly _stickyLabels = computed(() => this._selectContent.stickyLabels());

	constructor() {
		classes(() => [
			'text-muted-foreground px-2 py-1.5 text-xs',
			this._stickyLabels() ? 'bg-popover sticky top-0 z-[2] block' : '',
		]);
	}
}
