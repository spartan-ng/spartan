import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmHint } from '@spartan-ng/helm/form-field';
import { HlmSliderImports } from '@spartan-ng/helm/slider';

@Component({
	selector: 'spartan-slider-form',
	imports: [HlmSliderImports, ReactiveFormsModule, HlmButton, HlmHint],
	styles: `
		:host {
			display: block;
			width: 60%;
		}
	`,
	template: `
		<form class="space-y-6" [formGroup]="form" (ngSubmit)="submit()">
			<div class="grid w-full max-w-sm items-center gap-2">
				<label hlmLabel for="volume">Volume</label>
				<hlm-slider id="volume" formControlName="volume" />
				<hlm-hint>Set your speaker volume.</hlm-hint>
			</div>
			<button hlmBtn type="submit">Submit</button>
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
