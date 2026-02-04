import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmComboboxImports } from '@spartan-ng/helm/combobox';
import { HlmFieldImports } from '@spartan-ng/helm/field';

@Component({
	selector: 'spartan-combobox-form-preview',
	imports: [HlmComboboxImports, ReactiveFormsModule, HlmButton, HlmFieldImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'w-full max-w-xs',
	},
	template: `
		<form [formGroup]="form" (ngSubmit)="submit()">
			<div hlmFieldGroup>
				<div hlmField>
					<label hlmFieldLabel>Select a framework</label>
					<hlm-combobox formControlName="framework">
						<hlm-combobox-input placeholder="e.g. Analog" />
						<hlm-combobox-content *hlmComboboxPortal>
							<hlm-combobox-empty>No items found.</hlm-combobox-empty>
							<div hlmComboboxList>
								@for (framework of frameworks; track $index) {
									<hlm-combobox-item [value]="framework">{{ framework }}</hlm-combobox-item>
								}
							</div>
						</hlm-combobox-content>
					</hlm-combobox>
				</div>
				<div hlmField orientation="horizontal">
					<button type="submit" hlmBtn [disabled]="form.invalid">Submit</button>
				</div>
			</div>
		</form>
	`,
})
export class ComboboxFormPreview {
	private readonly _formBuilder = inject(FormBuilder);

	public form = this._formBuilder.group({
		framework: new FormControl<string | null>(null),
	});

	public frameworks = ['Analog', 'Angular', 'Next.js', 'SvelteKit', 'Nuxt.js', 'Remix', 'Astro'];

	submit() {
		console.log(this.form.value);
	}
}
