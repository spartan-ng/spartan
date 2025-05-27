import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BrnCommandSearchInputDirective } from '@spartan-ng/brain/command';
import { hlm } from '@spartan-ng/brain/core';

@Component({
	selector: 'input[hlm-command-search-input]',
	template: '',
	hostDirectives: [{ directive: BrnCommandSearchInputDirective, inputs: ['value'] }],
	host: {
		'[class]': '_computedClass()',
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HlmCommandSearchInputComponent {
	/*** The user defined class  */
	public readonly userClass = input<string>('', { alias: 'class' });

	/*** The styles to apply  */
	protected readonly _computedClass = computed(() =>
		hlm(
			'bg-transparent disabled:cursor-not-allowed disabled:opacity-50 h-11 outline-none placeholder:text-muted-foreground py-3 text-sm w-full',
			this.userClass(),
		),
	);
}
