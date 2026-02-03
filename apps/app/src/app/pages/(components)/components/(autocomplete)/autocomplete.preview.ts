import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { HlmAutocompleteImports } from '@spartan-ng/helm/autocomplete';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';

interface SpartanComponent {
	id: string;
	value: string;
}

@Component({
	selector: 'spartan-autocomplete-preview',
	imports: [HlmAutocompleteImports, HlmPopoverImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-autocomplete [(search)]="search">
			<hlm-autocomplete-input placeholder="Search components" />
			<div *hlmPopoverPortal hlmAutocompleteContent>
				<hlm-autocomplete-empty>No components found.</hlm-autocomplete-empty>
				<div hlmAutocompleteList>
					@for (component of filteredOptions(); track $index) {
						<hlm-autocomplete-item [value]="component.value">
							{{ component.value }}
						</hlm-autocomplete-item>
					}
				</div>
			</div>
		</hlm-autocomplete>
	`,
})
export class AutocompletePreview {
	private readonly _components: SpartanComponent[] = [
		{ id: 'accordion', value: 'Accordion' },
		{ id: 'alert-dialog', value: 'Alert dialog' },
		{ id: 'autocomplete', value: 'Autocomplete' },
		{ id: 'avatar', value: 'Avatar' },
		{ id: 'checkbox', value: 'Checkbox' },
		{ id: 'collapsible', value: 'Collapsible' },
		{ id: 'combobox', value: 'Combobox' },
		{ id: 'command', value: 'Command' },
		{ id: 'context-menu', value: 'Context menu' },
		{ id: 'data-table', value: 'Data table' },
		{ id: 'date-picker', value: 'Date picker' },
		{ id: 'dialog', value: 'Dialog' },
		{ id: 'field', value: 'Field' },
		{ id: 'input', value: 'Input' },
		{ id: 'menubar', value: 'Menubar' },
		{ id: 'navigation-menu', value: 'Navigation menu' },
		{ id: 'popover', value: 'Popover' },
		{ id: 'progress', value: 'Progress' },
		{ id: 'radio', value: 'Radio' },
		{ id: 'scroll-area', value: 'Scroll area' },
		{ id: 'select', value: 'Select' },
		{ id: 'separator', value: 'Separator' },
		{ id: 'skeleton', value: 'Skeleton' },
		{ id: 'slider', value: 'Slider' },
		{ id: 'sonner', value: 'Sonner' },
		{ id: 'spinner', value: 'Spinner' },
		{ id: 'switch', value: 'Switch' },
		{ id: 'table', value: 'Table' },
		{ id: 'tabs', value: 'Tabs' },
		{ id: 'textarea', value: 'Textarea' },
		{ id: 'toggle', value: 'Toggle' },
		{ id: 'toggle-group', value: 'Toggle group' },
		{ id: 'tooltip', value: 'Tooltip' },
	];

	public readonly search = signal('');

	public readonly filteredOptions = computed(() =>
		this._components.filter((component) => component.value.toLowerCase().includes(this.search().toLowerCase())),
	);
}

export const defaultImports = `
import { BrnPopoverContent } from '@spartan-ng/brain/popover';
import { HlmAutocompleteImports } from '@spartan-ng/helm/autocomplete';
`;

export const defaultSkeleton = `
<hlm-autocomplete [(search)]="search">
  <hlm-autocomplete-input placeholder="Search tags" />
  <div *hlmPopoverPortal hlmAutocompleteContent>
  	<hlm-autocomplete-empty>No tags found.</hlm-autocomplete-empty>
    <div hlmAutocompleteList>
      @for (option of filteredOptions(); track $index) {
      	<hlm-autocomplete-item [value]="option"> {{ option }} </hlm-autocomplete-item>
      }
    </div>
  </div>
</hlm-autocomplete>
`;

export const autocompleteDefaultConfig = `
import { provideBrnAutocompleteConfig } from '@spartan-ng/brain/autocomplete';

provideBrnAutocompleteConfig({
	isItemEqualToValue: (itemValue: T, selectedValue: T | null) => Object.is(itemValue, selectedValue),
	itemToString: undefined,
});
`;
