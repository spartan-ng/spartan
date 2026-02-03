import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { HlmAutocompleteImports } from '@spartan-ng/helm/autocomplete';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';

interface Tag {
	id: string;
	value: string;
}

@Component({
	selector: 'spartan-autocomplete-search-preview',
	imports: [HlmAutocompleteImports, HlmPopoverImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<p class="mb-4">
			<span class="font-semibold">Tag:</span>
			{{ value() }}
		</p>

		<hlm-autocomplete-search [(value)]="value" [(search)]="search">
			<hlm-autocomplete-input placeholder="Search tags" />
			<div *hlmPopoverPortal hlmAutocompleteContent>
				<hlm-autocomplete-empty>No tags found.</hlm-autocomplete-empty>
				<div hlmAutocompleteList>
					@for (tag of filteredOptions(); track $index) {
						<hlm-autocomplete-item [value]="tag">
							{{ tag.value }}
						</hlm-autocomplete-item>
					}
				</div>
			</div>
		</hlm-autocomplete-search>
	`,
})
export class AutocompleteSearchPreview {
	private readonly _tags: Tag[] = [
		{ id: 't1', value: 'feature' },
		{ id: 't2', value: 'fix' },
		{ id: 't3', value: 'bug' },
		{ id: 't4', value: 'docs' },
		{ id: 't5', value: 'internal' },
		{ id: 't6', value: 'mobile' },
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

	public readonly value = signal<string | null>(null);

	public readonly search = signal('');

	public readonly filteredOptions = computed(() =>
		this._tags.filter((option) => option.value.toLowerCase().includes(this.search().toLowerCase())),
	);
}
