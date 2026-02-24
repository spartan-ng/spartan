import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmNativeSelectImports } from '@spartan-ng/helm/native-select';

@Component({
	selector: 'spartan-native-select-form-example',
	imports: [ReactiveFormsModule, HlmNativeSelectImports, HlmFieldImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'w-full max-w-xs',
	},
	template: `
		<form [formGroup]="form" (ngSubmit)="submit()">
			<hlm-field-group>
				<hlm-field>
					<label hlmFieldLabel for="fruit">Favorite Fruit</label>
					<hlm-native-select selectId="fruit" formControlName="fruit">
						<option hlmNativeSelectOption value="">Select a fruit</option>
						<option hlmNativeSelectOption value="apple">Apple</option>
						<option hlmNativeSelectOption value="banana">Banana</option>
						<option hlmNativeSelectOption value="blueberry">Blueberry</option>
					</hlm-native-select>
				</hlm-field>
				<hlm-field orientation="horizontal">
					<button hlmBtn type="submit" [disabled]="form.invalid">Submit</button>
				</hlm-field>
			</hlm-field-group>
		</form>
	`,
})
export class NativeSelectFormExample {
	private readonly _formBuilder = inject(FormBuilder);

	public form = this._formBuilder.group({
		fruit: new FormControl<string | null>('', Validators.required),
	});

	submit() {
		console.log(this.form.value);
	}
}
