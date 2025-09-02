import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BrnCommand, provideBrnCommandConfig } from '@spartan-ng/brain/command';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-autocomplete-command',
	template: `
		<ng-content />
	`,
	hostDirectives: [
		{
			directive: BrnCommand,
			inputs: ['id', 'focusActiveOnEnter'],
			outputs: ['valueChange'],
		},
	],
	host: {
		'[class]': '_computedClass()',
	},
	providers: [
		provideBrnCommandConfig({
			// override default command filter behavior to show all options
			filter: () => true,
		}),
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HlmAutocompleteCommand {
	/** The user defined class */
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	/** The styles to apply  */
	protected readonly _computedClass = computed(() => hlm('', this.userClass()));
}
