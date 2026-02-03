import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmComboboxImports } from '@spartan-ng/helm/combobox';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';

@Component({
	selector: 'spartan-combobox-form-multiple-preview',
	imports: [HlmComboboxImports, HlmPopoverImports, ReactiveFormsModule, HlmButton, HlmFieldImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'w-full max-w-xs',
	},
	template: `
		<form [formGroup]="form" (ngSubmit)="submit()">
			<div hlmFieldGroup>
				<div hlmField>
					<label hlmFieldLabel>Select frameworks</label>
					<hlm-combobox-multiple formControlName="framework">
						<hlm-combobox-chips class="max-w-xs">
							<ng-template hlmComboboxValues let-values>
								@for (value of values; track $index) {
									<hlm-combobox-chip [value]="value">{{ value }}</hlm-combobox-chip>
								}
							</ng-template>

							<input hlmComboboxChipInput />
						</hlm-combobox-chips>
						<div *hlmPopoverPortal hlmComboboxContent>
							<hlm-combobox-empty>No items found.</hlm-combobox-empty>
							<div hlmComboboxList>
								@for (framework of frameworks; track $index) {
									<hlm-combobox-item [value]="framework">{{ framework }}</hlm-combobox-item>
								}
							</div>
						</div>
					</hlm-combobox-multiple>
				</div>
				<div hlmField orientation="horizontal">
					<button type="submit" hlmBtn [disabled]="form.invalid">Submit</button>
				</div>
			</div>
		</form>
	`,
})
export class ComboboxFormMultiplePreview {
	private readonly _formBuilder = inject(FormBuilder);

	public form = this._formBuilder.group({
		framework: new FormControl<string[] | null>(['Analog']),
	});

	public frameworks = ['Analog', 'Angular', 'Next.js', 'SvelteKit', 'Nuxt.js', 'Remix', 'Astro'];

	submit() {
		console.log(this.form.value);
	}
}
