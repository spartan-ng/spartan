import { Directive, input } from '@angular/core';
import { HlmButton, provideBrnButtonConfig } from '@spartan-ng/helm/button';

@Directive({
	selector: 'button[hlmAlertDialogCancel]',
	providers: [provideBrnButtonConfig({ variant: 'outline' })],
	hostDirectives: [{ directive: HlmButton, inputs: ['variant', 'size'] }],
	host: {
		'[type]': 'type()',
	},
})
export class HlmAlertDialogCancel {
	public readonly type = input<'button' | 'submit' | 'reset'>('button');
}
