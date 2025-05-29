import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCreditCard } from '@ng-icons/lucide';
import { remixAppleFill, remixPaypalFill } from '@ng-icons/remixicon';
import { hlm } from '@spartan-ng/brain/core';
import { HlmIconDirective } from '@spartan-ng/helm/icon';
import { HlmRadioComponent, HlmRadioGroupComponent } from '@spartan-ng/helm/radio-group';

@Component({
	selector: 'spartan-radio-card-preview',
	providers: [provideIcons({ lucideCreditCard, remixPaypalFill, remixAppleFill })],
	imports: [FormsModule, HlmRadioComponent, HlmRadioGroupComponent, NgIcon, HlmIconDirective],
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
export class RadioGroupCardComponent {
	public payment = 'card';

	public readonly cardClass = hlm(
		'block space-x-0 relative',
		// base card styles
		'flex flex-col items-center justify-center py-8 px-4 rounded-lg border-2 border-border',
		// hover and background styles
		'bg-background hover:bg-accent/10 cursor-pointer transition-colors',
		// spacing for the icon and text
		'[&>span]:mt-4',
		// target the checked state properly
		'[&:has([data-checked=true])]:border-2 [&:has([data-checked=true])]:border-primary',
	);
}

export const cardCode = `
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCreditCard } from '@ng-icons/lucide';
import { remixAppleFill, remixPaypalFill } from '@ng-icons/remixicon';
import { hlm } from '@spartan-ng/brain/core';
import { HlmIconDirective } from '@spartan-ng/helm/icon';
import { HlmRadioComponent, HlmRadioGroupComponent } from '@spartan-ng/helm/radio-group';

@Component({
	selector: 'spartan-radio-card-preview',
	standalone: true,
	providers: [provideIcons({ lucideCreditCard, remixPaypalFill, remixAppleFill })],
	imports: [FormsModule, HlmRadioComponent, HlmRadioGroupComponent, NgIcon, HlmIconDirective],
	template: \`
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
	\`,
})
export class RadioGroupCardComponent {
	public payment = 'card';

	public readonly cardClass = hlm(
		'block space-x-0 relative',
		// base card styles
		'flex flex-col items-center justify-center py-8 px-4 rounded-lg border-2 border-border',
		// hover and background styles
		'bg-background hover:bg-accent/10 cursor-pointer transition-colors',
		// spacing for the icon and text
		'[&>span]:mt-4',
		// target the checked state properly
		'[&:has([data-checked=true])]:border-2 [&:has([data-checked=true])]:border-primary'
	);
}
`;
