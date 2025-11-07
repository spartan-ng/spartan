import { computed, Directive, inject, input } from '@angular/core';
import { BrnError } from '@spartan-ng/brain/form-field';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: 'hlm-error',
	standalone: true,
	hostDirectives: [BrnError],
	host: {
		'[class]': '_computedClass()',
		'[attr.disabled]': '!_brnError.shouldShow()',
	},
})
export class HlmError {
	private readonly _brnError = inject(BrnError);

	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _computedClass = computed(() =>
		hlm('text-destructive block text-sm font-medium', this._brnError.shouldShow() ? '' : 'hidden', this.userClass()),
	);
}
