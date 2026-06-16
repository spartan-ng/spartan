import { Directive } from '@angular/core';
import { BrnCommandItem } from '@spartan-ng/brain/command';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: 'button[hlmCommandItem],button[hlm-command-item]',
	hostDirectives: [
		{
			directive: BrnCommandItem,
			inputs: ['value', 'disabled', 'id'],
			outputs: ['selected'],
		},
	],
	host: {
		'data-slot': 'command-item',
	},
})
export class HlmCommandItem {
	constructor() {
		classes(
			() =>
				'spartan-command-item group/command-item w-full data-disabled:pointer-events-none data-disabled:opacity-50 data-hidden:hidden [&>ng-icon]:pointer-events-none [&>ng-icon]:shrink-0',
		);
	}
}
