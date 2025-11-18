import { computed, Directive, effect, inject, input } from '@angular/core';
import { HlmTextarea } from '@spartan-ng/helm/textarea';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: 'textarea[hlmInputGroupTextarea]',
	hostDirectives: [HlmTextarea],
	host: {
		'data-slot': 'input-group-control',
		'[class]': '_computedClass()',
	},
})
export class HlmInputGroupTextarea {
	private readonly _hlmInput = inject(HlmTextarea);

	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _computedClass = computed(() =>
		hlm(
			'flex-1 resize-none rounded-none border-0 bg-transparent py-3 shadow-none focus-visible:ring-0 dark:bg-transparent',
			this.userClass(),
		),
	);

	constructor() {
		effect(() => {
			this._hlmInput.setClass(this._computedClass());
		});
	}
}
