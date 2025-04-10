import { Component, computed, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideDot } from '@ng-icons/lucide';
import { hlm } from '@spartan-ng/brain/core';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { type ClassValue } from 'clsx';

@Component({
	selector: 'hlm-input-otp-separator',
	standalone: true,
	imports: [HlmIconDirective, NgIcon],
	providers: [provideIcons({ lucideDot })],
	template: `
		<ng-icon hlm name="lucideDot" />
	`,
	host: {
		role: 'separator',
		'[class]': '_computedClass()',
	},
})
export class HlmInputOtpSeparatorComponent {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _computedClass = computed(() => hlm(this.userClass()));
}
