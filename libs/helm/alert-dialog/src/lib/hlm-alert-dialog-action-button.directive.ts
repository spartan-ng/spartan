import { Directive } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/helm/button';

@Directive({
	selector: 'button[hlmAlertDialogAction]',
	standalone: true,
	hostDirectives: [HlmButtonDirective],
})
export class HlmAlertDialogActionButtonDirective {}
