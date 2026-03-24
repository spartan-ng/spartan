import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideArrowRight } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmSelectImports } from '@spartan-ng/helm/select';

@Component({
	selector: 'spartan-button-group-select',
	imports: [HlmIconImports, HlmInputImports, HlmButtonImports, HlmSelectImports, HlmButtonGroupImports],
	providers: [provideIcons({ lucideArrowRight })],
	template: `
		<div hlmButtonGroup>
			<div hlmButtonGroup class="[&>hlm-select>hlm-select-trigger>button]:rounded-r-none">
				<hlm-select class="inline-block" [value]="_currencies[0].value">
					<hlm-select-trigger>
						<hlm-select-value placeholder="Select an option" />
					</hlm-select-trigger>
					<hlm-select-content *hlmSelectPortal class="!min-w-40">
						<hlm-select-group>
							@for (currency of _currencies; track currency.label) {
								<hlm-select-item [value]="currency.value">
									<span>
										{{ currency.value }}
									</span>
									<span class="text-muted-foreground">{{ currency.label }}</span>
								</hlm-select-item>
							}
						</hlm-select-group>
					</hlm-select-content>
				</hlm-select>
				<input hlmInput placeholder="10.00" />
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
