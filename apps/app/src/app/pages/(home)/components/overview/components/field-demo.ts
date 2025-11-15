import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmCheckbox } from '@spartan-ng/helm/checkbox';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmTextarea } from '@spartan-ng/helm/textarea';

@Component({
	selector: 'spartan-field-demo',
	imports: [HlmFieldImports, BrnSelectImports, HlmSelectImports, HlmInput, HlmTextarea, HlmButton, HlmCheckbox],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'w-full max-w-md rounded-lg border p-6 h-full',
	},
	template: `
		<form>
			<div hlmFieldGroup>
				<fieldset hlmFieldSet>
					<legend hlmFieldLegend>Payment Method</legend>
					<p hlmFieldDescription>All transactions are secure and encrypted</p>

					<div hlmFieldGroup>
						<div hlmField>
							<label hlmFieldLabel for="field-preview-name-on-card">Name on card</label>
							<input hlmInput placeholder="John Doe" id="field-preview-name-on-card" />
						</div>
						<div class="grid grid-cols-3 gap-4">
							<div hlmField class="col-span-2">
								<label hlmFieldLabel for="field-preview-card-number">Card number</label>
								<input hlmInput placeholder="1234 1234 1234 1234" id="field-preview-card-number" />
								<p hlmFieldDescription>Enter your 16-digit card number.</p>
							</div>
							<div hlmField>
								<label hlmFieldLabel for="field-preview-cvv">CVV</label>
								<input hlmInput placeholder="123" id="field-preview-cvv" />
							</div>
						</div>
						<div class="grid grid-cols-2 gap-4">
							<div hlmField>
								<label hlmFieldLabel for="field-exp-month--trigger">Month</label>
								<brn-select id="field-exp-month" class="inline-block" placeholder="MM">
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
							</div>
							<div hlmField>
								<label hlmFieldLabel for="field-exp-year--trigger">Year</label>
								<brn-select id="field-exp-year" class="inline-block" placeholder="YYYY">
									<hlm-select-trigger class="w-full">
										<hlm-select-value />
									</hlm-select-trigger>
									<hlm-select-content>
										<hlm-option value="2024">2024</hlm-option>
										<hlm-option value="2025">2025</hlm-option>
										<hlm-option value="2026">2026</hlm-option>
										<hlm-option value="2027">2027</hlm-option>
										<hlm-option value="2028">2028</hlm-option>
										<hlm-option value="2029">2029</hlm-option>
									</hlm-select-content>
								</brn-select>
							</div>
						</div>
					</div>
				</fieldset>
				<hlm-field-separator />
				<fieldset hlmFieldSet>
					<legend hlmFieldLegend>Billing Address</legend>
					<p hlmFieldDescription>The billing address associated with your payment method</p>
					<div hlmFieldGroup>
						<div hlmField orientation="horizontal">
							<hlm-checkbox id="field-preview-billing-address" [checked]="true" />
							<label hlmFieldLabel for="field-preview-billing-address">Same as shipping address.</label>
						</div>
					</div>
				</fieldset>
				<fieldset hlmFieldSet>
					<div hlmFieldGroup>
						<div hlmField>
							<label hlmFieldLabel for="field-preview-comments">Comments</label>
							<textarea hlmTextarea id="field-preview-comments"></textarea>
						</div>
					</div>
				</fieldset>
				<div hlmField orientation="horizontal">
					<button hlmBtn>Submit</button>
					<button hlmBtn variant="outline">Cancel</button>
				</div>
			</div>
		</form>
	`,
})
export class FieldDemo {}
