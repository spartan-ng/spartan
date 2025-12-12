import { Directive } from '@angular/core';
import { provideHlmIconConfig } from '@spartan-ng/helm/icon';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmCommandIcon]',
	providers: [provideHlmIconConfig({ size: 'sm' })],
	host: {
		'data-slot': 'command-icon',
	},
})
export class HlmCommandIcon {
	constructor() {
		classes(() => 'text-muted-foreground pointer-events-none shrink-0');
	}
}
