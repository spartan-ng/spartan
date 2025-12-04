import { Directive, input } from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';

@Directive({
	selector: 'button[hlmAlertDialogAction]',
	hostDirectives: [{ directive: HlmButton, inputs: ['variant', 'size'] }],
	host: {
		'[type]': 'type()',
	},
})
export class HlmAlertDialogAction {
	public readonly type = input<'button' | 'submit' | 'reset'>('button');
}
