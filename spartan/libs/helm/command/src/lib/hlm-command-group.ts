import { computed, Directive, input } from '@angular/core';
import { BrnCommandGroup } from '@spartan-ng/brain/command';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmCommandGroup],hlm-command-group',
	hostDirectives: [
		{
			directive: BrnCommandGroup,
			inputs: ['id'],
		},
	],
	host: {
		'data-slot': 'command-group',
		'[class]': '_computedClass()',
	},
})
export class HlmCommandGroup {
	/** The user defined class  */
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	/** The styles to apply  */
	protected readonly _computedClass = computed(() =>
		hlm('text-foreground block overflow-hidden p-1 data-[hidden]:hidden', this.userClass()),
	);
}
