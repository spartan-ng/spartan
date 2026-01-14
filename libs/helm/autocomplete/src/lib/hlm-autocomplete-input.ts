import { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch, lucideX } from '@ng-icons/lucide';
import {
	BrnAutocompleteAnchor,
	BrnAutocompleteClear,
	BrnAutocompleteInput,
	BrnAutocompleteInputWrapper,
} from '@spartan-ng/brain/autocomplete';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';

@Component({
	selector: 'hlm-autocomplete-input',
	imports: [HlmInputGroupImports, NgIcon, BrnAutocompleteAnchor, BrnAutocompleteClear, BrnAutocompleteInput],
	providers: [provideIcons({ lucideSearch, lucideX })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [BrnAutocompleteInputWrapper],
	template: `
		<hlm-input-group brnAutocompleteAnchor class="w-auto">
			<input
				brnAutocompleteInput
				#autocompleteInput="brnAutocompleteInput"
				hlmInputGroupInput
				[placeholder]="placeholder()"
				[attr.aria-invalid]="ariaInvalid() ? 'true' : null"
			/>

			@if (showSearch()) {
				<hlm-input-group-addon>
					<ng-icon name="lucideSearch" [class.opacity-50]="autocompleteInput.disabled()" />
				</hlm-input-group-addon>
			}

			@if (showClear()) {
				<hlm-input-group-addon align="inline-end">
					<button
						*brnAutocompleteClear
						hlmInputGroupButton
						data-slot="autocomplete-clear"
						[disabled]="autocompleteInput.disabled()"
						size="icon-xs"
						variant="ghost"
					>
						<ng-icon name="lucideX" />
					</button>
				</hlm-input-group-addon>
			}
			<ng-content />
		</hlm-input-group>
	`,
})
export class HlmAutocompleteInput {
	public readonly placeholder = input<string>('');

	public readonly showSearch = input<boolean, BooleanInput>(true, { transform: booleanAttribute });
	public readonly showClear = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	// TODO input and input-group styles need to support aria-invalid directly
	public readonly ariaInvalid = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
		alias: 'aria-invalid',
	});
}
