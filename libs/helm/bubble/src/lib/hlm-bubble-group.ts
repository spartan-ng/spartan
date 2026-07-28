import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmBubbleGroup],hlm-bubble-group',
	host: { 'data-slot': 'bubble-group' },
})
export class HlmBubbleGroup {
	constructor() {
		classes(() => 'spartan-bubble-group flex min-w-0 flex-col');
	}
}
