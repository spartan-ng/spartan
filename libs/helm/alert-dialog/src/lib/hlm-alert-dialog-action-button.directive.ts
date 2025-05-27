import { Directive } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/helm/button';

@Directive({
	selector: 'button[hlmAlertDialogAction]',
	hostDirectives: [HlmButtonDirective],
})
export class HlmAlertDialogActionButtonDirective {}
