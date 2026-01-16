import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrnPopoverContent } from '@spartan-ng/brain/popover';
import { HlmAutocompleteImports } from '@spartan-ng/helm/autocomplete';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';

interface Tag {
	id: string;
	value: string;
}

@Component({
	selector: 'spartan-autocomplete-search-form-preview',
	imports: [HlmAutocompleteImports, BrnPopoverContent, ReactiveFormsModule, HlmButton, HlmFieldImports],
	host: {
		class: 'w-full max-w-xs',
	},
	template: `
		<form [formGroup]="form" (ngSubmit)="submit()">
			<div hlmFieldGroup>
				<div hlmField>
					<label hlmFieldLabel>Create or select a tag</label>
					<hlm-autocomplete-search formControlName="tag" [(search)]="search">
						<hlm-autocomplete-input placeholder="e.g. feature" />
						<div *brnPopoverContent hlmAutocompleteContent>
							<div hlmAutocompleteList>
								<hlm-autocomplete-empty>No tags found.</hlm-autocomplete-empty>
								@for (tag of filteredOptions(); track $index) {
									<hlm-autocomplete-item [value]="tag">
										{{ tag.value }}
									</hlm-autocomplete-item>
								}
							</div>
						</div>
					</hlm-autocomplete-search>
					<div hlmFieldDescription>Create a new tag if it doesn't exist.</div>
				</div>
				<div hlmField orientation="horizontal">
					<button type="submit" hlmBtn [disabled]="form.invalid">Submit</button>
				</div>
			</div>
		</form>
	`,
})
export class AutocompleteSearchFormPreview {
	private readonly _formBuilder = inject(FormBuilder);

	public form = this._formBuilder.group({
		tag: new FormControl<string | null>(null, Validators.required),
	});

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

	public readonly search = signal('');

	public readonly filteredOptions = computed(() =>
		this._tags.filter((tag) => tag.value.toLowerCase().includes(this.search().toLowerCase())),
	);

	submit() {
		console.log(this.form.value);
	}
}
