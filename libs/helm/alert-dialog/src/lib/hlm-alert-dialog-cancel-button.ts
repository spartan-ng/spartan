import { Directive } from '@angular/core';
import { HlmButton, provideBrnButtonConfig } from '@spartan-ng/helm/button';

@Directive({
	selector: 'button[hlmAlertDialogCancel]',
	providers: [provideBrnButtonConfig({ variant: 'outline' })],
	hostDirectives: [{ directive: HlmButton, inputs: ['variant', 'size'] }],
})
export class HlmAlertDialogCancelButton {}
