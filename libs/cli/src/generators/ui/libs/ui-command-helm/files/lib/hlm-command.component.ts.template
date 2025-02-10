import { Component, computed, input } from '@angular/core';
import { BrnCommandDirective } from '@spartan-ng/brain/command';
import { hlm } from '@spartan-ng/brain/core';

@Component({
	standalone: true,
	selector: 'hlm-command',
	template: `
		<ng-content />
	`,
	hostDirectives: [BrnCommandDirective],
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmCommandComponent {
	/*** The user defined class */
	public readonly userClass = input<string>('', { alias: 'class' });

	/*** The styles to apply  */
	protected readonly _computedClass = computed(() =>
		hlm(
			'w-96 bg-popover border border-border flex flex-col h-full overflow-hidden rounded-md text-popover-foreground',
			this.userClass(),
		),
	);
}
