import { Directive, ElementRef, afterNextRender, contentChild } from '@angular/core';
import { BrnCommandSearchInputToken } from '@spartan-ng/brain/command';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmCommandDialog]',
	host: {
		'data-slot': 'command-dialog',
	},
})
export class HlmCommandDialog {
	/** Access the search field */
	private readonly _searchInput = contentChild(BrnCommandSearchInputToken, { read: ElementRef });

	constructor() {
		classes(() => '**:data-[slot=command-search]:h-12 **:data-[slot=command-search-input]:h-12');

		afterNextRender(() => {
			const searchInput = this._searchInput();

			if (searchInput) {
				searchInput.nativeElement.focus();
			}
		});
	}
}
