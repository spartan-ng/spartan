import { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, Component, computed, input, output } from '@angular/core';
import { BrnCommandItemDirective } from '@spartan-ng/brain/command';
import { hlm } from '@spartan-ng/brain/core';

@Component({
	standalone: true,
	selector: 'button[hlm-command-item]',
	template: `
		<ng-content />
	`,
	hostDirectives: [
		{
			directive: BrnCommandItemDirective,
			inputs: ['value', 'disabled'],
			outputs: ['selected'],
		},
	],
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmCommandItemComponent {
	/** The value this item represents. */
	public readonly value = input<string>();

	/** Whether the item is disabled. */
	public readonly disabled = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	/** Emits when the item is selected. */
	public readonly selected = output<void>();

	/*** The user defined class  */
	public readonly userClass = input<string>('', { alias: 'class' });

	/*** The styles to apply  */
	protected readonly _computedClass = computed(() =>
		hlm(
			'text-start aria-selected:bg-accent aria-selected:text-accent-foreground cursor-default disabled:opacity-50 disabled:pointer-events-none hover:bg-accent/50 items-center outline-none px-2 py-1.5 relative flex rounded-sm select-none text-sm data-[hidden]:hidden',
			this.userClass(),
		),
	);
}
