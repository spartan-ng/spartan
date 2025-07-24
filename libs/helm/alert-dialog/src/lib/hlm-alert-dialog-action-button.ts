import { Directive } from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';

@Directive({
	selector: 'button[hlmAlertDialogAction]',
	hostDirectives: [HlmButton],
})
export class HlmAlertDialogActionButton {}
