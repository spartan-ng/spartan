import { Directive } from '@angular/core';
import { BrnComboboxContent } from '@spartan-ng/brain/combobox';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmComboboxContent],hlm-combobox-content',
	hostDirectives: [{ directive: BrnComboboxContent, inputs: ['id'] }],
	host: { slot: 'combobox-content' },
})
export class HlmComboboxContent {
	constructor() {
		classes(() => [
			'spartan-combobox-content group/combobox-content relative flex w-(--brn-combobox-width) flex-col p-0',
		]);
	}
}
