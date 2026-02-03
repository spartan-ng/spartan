import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { HlmAutocompleteImports } from '@spartan-ng/helm/autocomplete';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';

@Component({
	selector: 'spartan-autocomplete-disabled-preview',
	imports: [HlmAutocompleteImports, HlmPopoverImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-autocomplete [(search)]="search" disabled>
			<hlm-autocomplete-input placeholder="Search components" />
			<div *hlmPopoverPortal hlmAutocompleteContent>
				<hlm-autocomplete-empty>No components found.</hlm-autocomplete-empty>
				<div hlmAutocompleteList>
					@for (option of filteredOptions(); track $index) {
						<hlm-autocomplete-item [value]="option">
							{{ option }}
						</hlm-autocomplete-item>
					}
				</div>
			</div>
		</hlm-autocomplete>
	`,
})
export class AutocompleteDisabledPreview {
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
