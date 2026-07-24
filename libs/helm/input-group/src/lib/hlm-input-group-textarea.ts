import { Directive } from '@angular/core';
import { HlmTextarea } from '@spartan-ng/helm/textarea';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: 'textarea[hlmInputGroupTextarea]',
	hostDirectives: [HlmTextarea],
	host: { 'data-slot': 'input-group-control' },
})
export class HlmInputGroupTextarea {
	constructor() {
		classes(() => 'spartan-input-group-textarea flex-1 resize-none');
	}
}
