import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronDown, lucideChevronUp } from '@ng-icons/lucide';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmSelectImports } from '@spartan-ng/helm/select';

@Component({
	selector: 'spartan-select-multiple-preview',
	imports: [BrnSelectImports, HlmSelectImports],
	providers: [provideIcons({ lucideChevronUp, lucideChevronDown })],
	template: `
		<brn-select class="inline-block" placeholder="Select some fruit" [multiple]="true">
			<hlm-select-trigger class="w-56">
				<hlm-select-value />
			</hlm-select-trigger>
			<hlm-select-content>
				<hlm-option value="Apples">Apples</hlm-option>
				<hlm-option value="Bananas">Bananas</hlm-option>
				<hlm-option value="Pears">Pears</hlm-option>
				<hlm-option value="Strawberries">Strawberries</hlm-option>
			</hlm-select-content>
		</brn-select>
	`,
})
export class SelectMultiplePreview {}
