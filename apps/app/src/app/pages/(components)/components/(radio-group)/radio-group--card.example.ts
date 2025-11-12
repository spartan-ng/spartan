import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCreditCard } from '@ng-icons/lucide';
import { remixAppleFill, remixPaypalFill } from '@ng-icons/remixicon';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmRadioGroupImports } from '@spartan-ng/helm/radio-group';
import { hlm } from '@spartan-ng/helm/utils';

@Component({
	selector: 'spartan-radio-card-preview',
	imports: [FormsModule, HlmRadioGroupImports, NgIcon, HlmIconImports],
	providers: [provideIcons({ lucideCreditCard, remixPaypalFill, remixAppleFill })],
	template: `
		<hlm-radio-group class="grid grid-cols-3 gap-4" [(ngModel)]="payment">
			<label class="flex items-center" hlmLabel [class]="cardClass">
				<hlm-radio value="card">
					<ng-icon hlm name="lucideCreditCard" class="mb-3" />
				</hlm-radio>
				Card
			</label>
			<label class="flex items-center" hlmLabel [class]="cardClass">
				<hlm-radio value="paypal">
					<ng-icon hlm name="remixPaypalFill" class="mb-3" />
				</hlm-radio>
				PayPal
			</label>
			<label class="flex items-center" hlmLabel [class]="cardClass">
				<hlm-radio value="apple">
					<ng-icon hlm name="remixAppleFill" class="mb-3" />
				</hlm-radio>
				Apple
			</label>
		</hlm-radio-group>
	`,
})
export class RadioGroupCard {
	public payment = 'card';

	public readonly cardClass = hlm(
		'relative block space-x-0',
		// base card styles
		'border-border flex flex-col items-center justify-center rounded-lg border-2 px-4 py-8',
		// hover and background styles
		'bg-background hover:bg-accent/10 cursor-pointer transition-colors',
		// spacing for the icon and text
		'[&>span]:mt-4',
		// target the checked state properly
		'[&:has([data-checked=true])]:border-primary [&:has([data-checked=true])]:border-2',
	);
}
