import { Directive, input } from '@angular/core';
import { HlmButton, provideBrnButtonConfig } from '@spartan-ng/helm/button';

@Directive({
	selector: 'button[hlmAttachmentAction]',
	providers: [provideBrnButtonConfig({ variant: 'ghost', size: 'icon-xs' })],
	hostDirectives: [{ directive: HlmButton, inputs: ['variant', 'size'] }],
	host: {
		'data-slot': 'attachment-action',
		'[type]': 'type()',
	},
})
export class HlmAttachmentAction {
	public readonly type = input<'button' | 'submit' | 'reset'>('button');
}
