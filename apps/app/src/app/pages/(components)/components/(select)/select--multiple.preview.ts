import { Component } from '@angular/core';
import { HlmSelectImports } from '@spartan-ng/helm/select';

@Component({
	selector: 'spartan-select-multiple-preview',
	imports: [HlmSelectImports],
	template: `
		<hlm-select class="inline-block" placeholder="Select some fruit" [multiple]="true">
			<hlm-select-trigger class="w-56">
				<hlm-select-value />
			</hlm-select-trigger>
			<hlm-select-content>
				<hlm-option value="Apples">Apples</hlm-option>
				<hlm-option value="Bananas">Bananas</hlm-option>
				<hlm-option value="Pears">Pears</hlm-option>
				<hlm-option value="Strawberries">Strawberries</hlm-option>
			</hlm-select-content>
		</hlm-select>
	`,
})
export class SelectMultiplePreview {}
