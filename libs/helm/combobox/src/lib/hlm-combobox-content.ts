import { Directive } from '@angular/core';
import { BrnComboboxContent } from '@spartan-ng/brain/combobox';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmComboboxContent],hlm-combobox-content',
	hostDirectives: [BrnComboboxContent],
})
export class HlmComboboxContent {
	constructor() {
		classes(() => [
			'spartan-combobox-content group/combobox-content relative flex w-(--brn-combobox-width) origin-(--transform-origin) flex-col p-0 data-[chips=true]:min-w-(--anchor-width)',
		]);
	}
}
