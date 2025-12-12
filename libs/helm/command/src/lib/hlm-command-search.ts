import { Directive } from '@angular/core';
import { provideHlmIconConfig } from '@spartan-ng/helm/icon';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmCommandSearch],hlm-command-search',
	providers: [provideHlmIconConfig({ size: 'sm' })],
	host: {
		'data-slot': 'command-search',
	},
})
export class HlmCommandSearch {
	constructor() {
		classes(() => 'flex h-9 items-center gap-2 border-b px-3 [&>_ng-icon]:flex-none [&>_ng-icon]:opacity-50');
	}
}
