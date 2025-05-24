import { Directive } from '@angular/core';
import { provideHlmIconConfig } from '@spartan-ng/ui-icon-helm';

@Directive({
	selector: '[hlmAlertIcon]',
	providers: [provideHlmIconConfig({ size: 'sm' })],
})
export class HlmAlertIconDirective {}
