import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmFormFieldImports } from '@spartan-ng/helm/form-field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';

@Component({
	selector: 'spartan-form-field-preview',
	imports: [
		HlmInputImports,
		HlmFormFieldImports,
		HlmButtonImports,
		BrnSelectImports,
		HlmSelectImports,
		HlmCheckboxImports,
		HlmTextareaImports,
		ReactiveFormsModule,
	],
	template: `
		<hlm-field-group>
			<fieldset hlmFieldSet>
				<legend hlmFieldLegend>Payment Method</legend>
				<p hlmFieldDescription>All transactions are secure and encrypted</p>

				<hlm-field-group>
					<hlm-field>
						<label hlmFieldLabel for="card-name">Name on Card</label>
						<input hlmInput id="card-name" placeholder="Evil Spartan" required />
					</hlm-field>
					<hlm-field>
						<label hlmFieldLabel for="card-number">Card Number</label>
						<input hlmInput id="card-number" placeholder="1234 5678 9012 3456" required />
						<p hlmFieldDescription>Enter your 16-digit card number</p>
					</hlm-field>
					<div class="grid grid-cols-3 gap-4">
						<hlm-field>
							<!-- TODO improve brn-select id? label for needs --trigger because its the suffix for brn-select id -->
							<label hlmFieldLabel for="exp-month--trigger">Month</label>
							<brn-select id="exp-month" placeholder="MM">
								<hlm-select-trigger class="w-full">
									<hlm-select-value />
								</hlm-select-trigger>
								<hlm-select-content>
									<hlm-option value="01">01</hlm-option>
									<hlm-option value="02">02</hlm-option>
									<hlm-option value="03">03</hlm-option>
									<hlm-option value="04">04</hlm-option>
									<hlm-option value="05">05</hlm-option>
									<hlm-option value="06">06</hlm-option>
									<hlm-option value="07">07</hlm-option>
									<hlm-option value="08">08</hlm-option>
									<hlm-option value="09">09</hlm-option>
									<hlm-option value="10">10</hlm-option>
									<hlm-option value="11">11</hlm-option>
									<hlm-option value="12">12</hlm-option>
								</hlm-select-content>
							</brn-select>
						</hlm-field>
						<hlm-field>
							<label hlmFieldLabel for="exp-year--trigger">Year</label>
							<brn-select id="exp-year" placeholder="YYYY">
								<hlm-select-trigger class="w-full">
									<hlm-select-value />
								</hlm-select-trigger>
								<hlm-select-content>
									<hlm-option value="2025">2025</hlm-option>
									<hlm-option value="2026">2026</hlm-option>
									<hlm-option value="2027">2027</hlm-option>
									<hlm-option value="2028">2028</hlm-option>
									<hlm-option value="2029">2029</hlm-option>
									<hlm-option value="2030">2030</hlm-option>
								</hlm-select-content>
							</brn-select>
						</hlm-field>
						<hlm-field>
							<label hlmFieldLabel for="cvv">CVV</label>
							<input hlmInput id="cvv" placeholder="123" required />
						</hlm-field>
					</div>
				</hlm-field-group>
			</fieldset>

			<hlm-field-separator></hlm-field-separator>

			<fieldset hlmFieldSet>
				<legend hlmFieldLegend>Billing Address</legend>
				<p hlmFieldDescription>The billing address associated with your payment method</p>
				<hlm-field-group>
					<hlm-field orientation="horizontal">
						<hlm-checkbox id="same-as-shipping" [checked]="true" />
						<label hlmFieldLabel for="same-as-shipping">Same as shipping address</label>
					</hlm-field>
				</hlm-field-group>
			</fieldset>

			<fieldset hlmFieldSet>
				<hlm-field-group>
					<hlm-field>
						<label hlmFieldLabel for="optional-comments">Comments</label>
						<textarea
							hlmTextarea
							id="optional-comments"
							placeholder="Add any additional comments"
							class="resize-none"
						></textarea>
					</hlm-field>
				</hlm-field-group>
			</fieldset>

			<hlm-field orientation="horizontal">
				<button hlmBtn type="submit">Submit</button>
				<button hlmBtn variant="outline" type="button">Cancel</button>
			</hlm-field>
		</hlm-field-group>

		<!-- <hlm-form-field>
			<input class="w-80" hlmInput [formControl]="control" type="email" placeholder="Email" />
			<hlm-hint>This is your email address.</hlm-hint>
			<hlm-error>The email is required.</hlm-error>
		</hlm-form-field> -->
	`,
})
export class FormFieldPreview {
	public control = new FormControl('', Validators.required);
}

export const defaultImports = `
import { HlmFormFieldImports } from '@spartan-ng/helm/form-field';
import { HlmInputImports } from '@spartan-ng/helm/input';
`;
export const defaultSkeleton = `
<hlm-form-field>
	<input class="w-80" hlmInput type="email" placeholder="Email" />
	<hlm-hint>This is your email address.</hlm-hint>
</hlm-form-field>
`;
