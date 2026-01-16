import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrnPopoverContent } from '@spartan-ng/brain/popover';
import { HlmAutocompleteImports } from '@spartan-ng/helm/autocomplete';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';

interface SpartanComponent {
	id: string;
	value: string;
}

@Component({
	selector: 'spartan-autocomplete-form-preview',
	imports: [HlmAutocompleteImports, BrnPopoverContent, ReactiveFormsModule, HlmButton, HlmFieldImports],
	host: {
		class: 'w-full max-w-xs',
	},
	template: `
		<form [formGroup]="form" (ngSubmit)="submit()" class="space-y-8">
			<div hlmFieldGroup>
				<div hlmField>
					<label hlmFieldLabel>Select a component</label>
					<hlm-autocomplete formControlName="component" [(search)]="search">
						<hlm-autocomplete-input placeholder="e.g. Accordion" />
						<div *brnPopoverContent hlmAutocompleteContent>
							<div hlmAutocompleteList>
								<hlm-autocomplete-empty>No components found.</hlm-autocomplete-empty>
								@for (component of filteredOptions(); track $index) {
									<hlm-autocomplete-item [value]="component">
										{{ component.value }}
									</hlm-autocomplete-item>
								}
							</div>
						</div>
					</hlm-autocomplete>
				</div>
				<div hlmField orientation="horizontal">
					<button type="submit" hlmBtn [disabled]="form.invalid">Submit</button>
				</div>
			</div>
		</form>
	`,
})
export class AutocompleteFormPreview {
	private readonly _formBuilder = inject(FormBuilder);

	public form = this._formBuilder.group({
		component: new FormControl<SpartanComponent | null>(null, Validators.required),
	});

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

	submit() {
		console.log(this.form.value);
	}
}
