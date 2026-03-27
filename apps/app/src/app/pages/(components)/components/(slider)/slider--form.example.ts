import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmSliderImports } from '@spartan-ng/helm/slider';

@Component({
	selector: 'spartan-slider-form',
	imports: [HlmSliderImports, ReactiveFormsModule, HlmButtonImports, HlmFieldImports],
	styles: `
		:host {
			display: block;
			width: 60%;
		}
	`,
	template: `
		<form class="space-y-6" [formGroup]="form" (ngSubmit)="submit()">
			<hlm-field>
				<label hlmFieldLabel for="volume">Volume</label>
				<hlm-slider id="volume" formControlName="volume" />
				<p hlmFieldDescription>Set your speaker volume.</p>
			</hlm-field>
			<hlm-field orientation="horizontal">
				<button hlmBtn type="submit">Submit</button>
			</hlm-field>
		</form>
	`,
})
export class SliderForm {
	private readonly _formBuilder = inject(FormBuilder);
	public form = this._formBuilder.group({
		volume: [[25], Validators.required],
	});

	submit() {
		console.log(this.form.value);
	}
}
