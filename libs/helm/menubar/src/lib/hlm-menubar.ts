import { CdkMenuBar } from '@angular/cdk/menu';
import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmMenubar],hlm-menubar',
	hostDirectives: [CdkMenuBar],
	host: {
		'data-slot': 'menubar',
	},
})
export class HlmMenubar {
	constructor() {
		classes(() => 'bg-background flex h-9 items-center gap-1 rounded-md border p-1 shadow-xs');
	}
}
