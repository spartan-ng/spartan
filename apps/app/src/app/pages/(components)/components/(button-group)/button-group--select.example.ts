import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowRight } from '@ng-icons/lucide';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmSelectImports } from '@spartan-ng/helm/select';

@Component({
	selector: 'spartan-button-group-select',
	imports: [HlmIcon, NgIcon, HlmInput, HlmButton, BrnSelectImports, HlmSelectImports, HlmButtonGroupImports],
	providers: [
		provideIcons({
			lucideArrowRight,
		}),
	],
	template: `
		<div hlmButtonGroup>
			<div hlmButtonGroup class="[&>brn-select>div>hlm-select-trigger>button]:rounded-r-none">
				<brn-select class="inline-block" placeholder="Select an option" [value]="_currencies[0].value">
					<hlm-select-trigger>
						<hlm-select-value>
							<div *brnSelectValue="let value">
								<span>{{ value }}</span>
							</div>
						</hlm-select-value>
					</hlm-select-trigger>
					<hlm-select-content class="!min-w-40">
						@for (currency of _currencies; track currency.label) {
							<hlm-option [value]="currency.value">
								<span>
									{{ currency.value }}
								</span>
								<span class="text-muted-foreground">{{ currency.label }}</span>
							</hlm-option>
						}
					</hlm-select-content>
				</brn-select>
				<input hlmInput placeholder="10.00" class="z-10" />
			</div>
			<div hlmButtonGroup>
				<button hlmBtn variant="outline" size="icon">
					<ng-icon hlm name="lucideArrowRight" size="sm" />
				</button>
			</div>
		</div>
	`,
})
export class ButtonGroupSelect {
	protected readonly _currencies = [
		{
			value: '$',
			label: 'US Dollar',
		},
		{
			value: '€',
			label: 'Euro',
		},
		{
			value: '£',
			label: 'British Pound',
		},
	];
}
