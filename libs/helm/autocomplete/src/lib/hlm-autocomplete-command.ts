import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BrnAutocomplete } from '@spartan-ng/brain/autocomplete';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

// TODO rename selector and class - remove comand
@Component({
	selector: 'hlm-autocomplete-command',
	template: `
		<ng-content />
	`,
	hostDirectives: [
		{
			directive: BrnAutocomplete,
			inputs: ['id'],
			outputs: ['valueChange'],
		},
	],
	host: {
		'[class]': '_computedClass()',
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HlmAutocompleteCommand {
	/** The user defined class */
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	/** The styles to apply  */
	protected readonly _computedClass = computed(() => hlm('', this.userClass()));
}
