import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: 'p[hlmItemDescription]',
	host: {
		'data-slot': 'item-description',
	},
})
export class HlmItemDescription {
	constructor() {
		classes(() => [
			'text-muted-foreground line-clamp-2 text-sm leading-normal font-normal text-balance',
			'[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4',
		]);
	}
}
