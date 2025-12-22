import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMinus } from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { classes } from '@spartan-ng/helm/utils';

@Component({
	selector: 'hlm-input-otp-separator',
	imports: [HlmIcon, NgIcon],
	providers: [provideIcons({ lucideMinus })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		role: 'separator',
		'data-slot': 'input-otp-separator',
	},
	template: `
		<ng-icon hlm name="lucideMinus" />
	`,
})
export class HlmInputOtpSeparator {
	constructor() {
		classes(() => 'inline-flex');
	}
}
