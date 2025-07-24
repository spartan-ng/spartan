import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BrnCommandSearchInput } from '@spartan-ng/brain/command';
import { hlm } from '@spartan-ng/brain/core';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'input[hlm-command-search-input]',
	template: '',
	hostDirectives: [{ directive: BrnCommandSearchInput, inputs: ['value'] }],
	host: {
		'[class]': '_computedClass()',
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HlmCommandSearchInput {
	/*** The user defined class  */
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	/*** The styles to apply  */
	protected readonly _computedClass = computed(() =>
		hlm(
			'placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50',
			this.userClass(),
		),
	);
}
