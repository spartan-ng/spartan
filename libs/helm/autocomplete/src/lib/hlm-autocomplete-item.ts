import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BrnAutocompleteItem } from '@spartan-ng/brain/autocomplete';
import { hlm } from '@spartan-ng/helm/utils';

@Component({
	selector: 'button[hlm-autocomplete-item]',
	template: `
		<ng-content />
	`,
	hostDirectives: [
		{
			directive: BrnAutocompleteItem,
			inputs: ['value', 'disabled', 'id'],
			outputs: ['selected'],
		},
	],
	host: {
		'[class]': '_computedClass()',
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HlmAutocompleteItem {
	/** The user defined class  */
	public readonly userClass = input<string>('', { alias: 'class' });

	/** The styles to apply  */
	protected readonly _computedClass = computed(() =>
		hlm(
			'data-[selected]:bg-accent data-[selected=true]:text-accent-foreground [&>ng-icon]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-start text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[hidden]:hidden [&>ng-icon]:pointer-events-none [&>ng-icon]:shrink-0 [&>ng-icon]:text-base',
			this.userClass(),
		),
	);
}
