import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { HlmAutocompleteImports } from '@spartan-ng/helm/autocomplete';
import { HlmFieldImports } from '@spartan-ng/helm/field';

@Component({
	selector: 'spartan-autocomplete-invalid-preview',
	imports: [HlmAutocompleteImports, HlmFieldImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'w-full max-w-xs' },
	template: `
		<hlm-field forceInvalid>
			<label hlmFieldLabel>Component</label>
			<hlm-autocomplete [(search)]="search">
				<hlm-autocomplete-input forceInvalid placeholder="Search components" />
				<hlm-autocomplete-content *hlmAutocompletePortal>
					<hlm-autocomplete-empty>No components found.</hlm-autocomplete-empty>
					<div hlmAutocompleteList>
						@for (option of filteredOptions(); track $index) {
							<hlm-autocomplete-item [value]="option">
								{{ option }}
							</hlm-autocomplete-item>
						}
					</div>
				</hlm-autocomplete-content>
			</hlm-autocomplete>
			<hlm-field-error>Please select a component.</hlm-field-error>
		</hlm-field>
	`,
})
export class AutocompleteInvalidPreview {
	private readonly _options: string[] = [
		'Accordion',
		'Alert dialog',
		'Autocomplete',
		'Avatar',
		'Checkbox',
		'Collapsible',
		'Combobox',
		'Command',
		'Context menu',
		'Data table',
		'Date picker',
		'Dialog',
		'Field',
		'Input',
		'Menubar',
		'Navigation menu',
		'Popover',
		'Progress',
		'Radio',
		'Scroll area',
		'Select',
		'Separator',
		'Skeleton',
		'Slider',
		'Sonner',
		'Spinner',
		'Switch',
		'Table',
		'Tabs',
		'Textarea',
		'Toast',
		'Toggle',
		'Tooltip',
	];

	public readonly search = signal('');

	public readonly filteredOptions = computed(() =>
		this._options.filter((option) => option.toLowerCase().includes(this.search().toLowerCase())),
	);
}
