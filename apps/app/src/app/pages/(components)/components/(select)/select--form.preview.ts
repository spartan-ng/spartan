import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmSelectImports } from '@spartan-ng/helm/select';

@Component({
	selector: 'spartan-select-form-preview',
	imports: [HlmFieldImports, HlmSelectImports, HlmButtonImports, ReactiveFormsModule],
	host: {
		class: 'w-full max-w-xs',
	},
	template: `
		<form [formGroup]="form" (ngSubmit)="submit()">
			<hlm-field-group>
				<hlm-field>
					<label hlmFieldLabel for="fruit">Fruit</label>
					<hlm-select formControlName="fruit" [itemToString]="itemToString">
						<hlm-select-trigger buttonId="fruit" class="w-56">
							<hlm-select-value placeholder="Select a fruit" />
						</hlm-select-trigger>
						<hlm-select-content *hlmSelectPortal>
							<hlm-select-group>
								<hlm-select-label>Fruits</hlm-select-label>
								@for (item of items; track item.value) {
									<hlm-select-item [value]="item.value">{{ item.label }}</hlm-select-item>
								}
							</hlm-select-group>
						</hlm-select-content>
					</hlm-select>
				</hlm-field>
				<hlm-field orientation="horizontal">
					<button type="submit" hlmBtn>Submit</button>
				</hlm-field>
			</hlm-field-group>
		</form>
	`,
})
export class SelectFormPreview {
	private readonly _formBuilder = inject(FormBuilder);

	public form = this._formBuilder.group({
		fruit: new FormControl<string | null>(null),
	});

	public readonly items = [
		{ label: 'Apple', value: 'apple' },
		{ label: 'Banana', value: 'banana' },
		{ label: 'Blueberry', value: 'blueberry' },
		{ label: 'Grapes', value: 'grapes' },
		{ label: 'Pineapple', value: 'pineapple' },
	];
	public readonly itemToString = (value: string) => this.items.find((item) => item.value === value)?.label || '';

	public submit() {
		console.log(this.form.value);
	}
}
