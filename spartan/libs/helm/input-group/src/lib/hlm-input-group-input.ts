import { computed, Directive, effect, inject, input } from '@angular/core';
import { HlmInput } from '@spartan-ng/helm/input';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: 'input[hlmInputGroupInput]',
	hostDirectives: [HlmInput],
	host: {
		'data-slot': 'input-group-control',
		'[class]': '_computedClass()',
	},
})
export class HlmInputGroupInput {
	private readonly _hlmInput = inject(HlmInput);

	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _computedClass = computed(() =>
		hlm(
			'flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent',
			this.userClass(),
		),
	);

	constructor() {
		effect(() => {
			this._hlmInput.setClass(this._computedClass());
		});
	}
}
