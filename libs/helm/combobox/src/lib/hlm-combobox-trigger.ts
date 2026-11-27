import type { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import { BrnComboboxAnchor, BrnComboboxPopoverTrigger, BrnComboboxTrigger } from '@spartan-ng/brain/combobox';
import { BrnFieldControlDescribedBy } from '@spartan-ng/brain/field';
import { HlmButton, provideBrnButtonConfig } from '@spartan-ng/helm/button';
import { classes } from '@spartan-ng/helm/utils';

@Component({
	selector: 'button[hlm-combobox-trigger],button[hlmComboboxTrigger]',
	exportAs: 'hlmComboboxTrigger',
	imports: [NgIcon],
	providers: [provideIcons({ lucideChevronDown }), provideBrnButtonConfig({ variant: 'outline' })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [
		// applied first so the combobox disabled state wins over the button's own disabled bindings
		{ directive: HlmButton, inputs: ['variant'] },
		BrnComboboxAnchor,
		{ directive: BrnComboboxTrigger, inputs: ['forceInvalid'] },
		BrnComboboxPopoverTrigger,
		{ directive: BrnFieldControlDescribedBy, inputs: ['aria-describedby'] },
	],
	host: {
		'data-slot': 'combobox-trigger',
		'[id]': 'id()',
	},
	template: `
		<ng-content />
		@if (!hideIcon()) {
			<ng-icon name="lucideChevronDown" class="spartan-combobox-trigger-icon" />
		}
	`,
})
export class HlmComboboxTrigger {
	private static _id = 0;

	public readonly id = input<string>(`hlm-combobox-trigger-${HlmComboboxTrigger._id++}`);

	public readonly hideIcon = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	constructor() {
		classes(() => 'spartan-combobox-trigger');
	}
}
