import { Directive } from '@angular/core';
import { provideHlmIconConfig } from '@spartan-ng/helm/icon';

@Directive({
	selector: '[hlmAlertIcon]',
	standalone: true,
	providers: [provideHlmIconConfig({ size: 'sm' })],
})
export class HlmAlertIconDirective {}
