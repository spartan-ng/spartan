import { computed, Directive, inject, input } from '@angular/core';
import { BrnHint } from '@spartan-ng/brain/form-field';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: 'hlm-hint',
	hostDirectives: [BrnHint],
	host: {
		'[class]': '_computedClass()',
		'[attr.disabled]': '!_brnHint.shouldShow()',
	},
})
export class HlmHint {
	private readonly _brnHint = inject(BrnHint);

	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _computedClass = computed(() =>
		hlm('text-muted-foreground block text-sm', this._brnHint.shouldShow() ? '' : 'hidden', this.userClass()),
	);
}
