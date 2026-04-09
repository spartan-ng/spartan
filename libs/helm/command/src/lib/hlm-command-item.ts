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
				"data-[selected]:bg-accent data-[selected=true]:text-accent-foreground [&>[hlmIcon]:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-hidden:hidden data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>[hlmIcon]]:pointer-events-none [&>[hlmIcon]]:shrink-0 [&>[hlmIcon]:not([class*='text-'])]:text-base",
		);
	}
}
