import { Component, computed, signal } from '@angular/core';
import { BrnPopoverContent } from '@spartan-ng/brain/popover';
import { HlmAutocompleteImports } from '@spartan-ng/helm/autocomplete';

@Component({
	selector: 'spartan-autocomplete-clear-preview',
	imports: [HlmAutocompleteImports, BrnPopoverContent],
	template: `
		<hlm-autocomplete [(search)]="search">
			<hlm-autocomplete-input placeholder="Search components" showClear />
			<div *brnPopoverContent hlmAutocompleteContent>
				<div hlmAutocompleteList>
					<hlm-autocomplete-empty>No components found.</hlm-autocomplete-empty>
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
export class AutocompleteClearPreview {
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
