import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCreditCard } from '@ng-icons/lucide';
import { remixAppleFill, remixPaypalFill } from '@ng-icons/remixicon';
import { hlm } from '@spartan-ng/brain/core';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { HlmRadioComponent, HlmRadioGroupComponent } from '@spartan-ng/ui-radiogroup-helm';

@Component({
	selector: 'spartan-radio-card-preview',
	standalone: true,
	providers: [provideIcons({ lucideCreditCard, remixPaypalFill, remixAppleFill })],
	imports: [FormsModule, HlmRadioComponent, HlmRadioGroupComponent, NgIcon, HlmIconDirective],
	template: `
		<hlm-radio-group class="grid grid-cols-3 gap-4" [(ngModel)]="payment">
			<hlm-radio value="card" [class]="cardClass">
				<ng-icon hlm name="lucideCreditCard" class="mb-3" />
				Card
			</hlm-radio>
			<hlm-radio value="paypal" [class]="cardClass">
				<ng-icon hlm name="remixPaypalFill" class="mb-3" />
				PayPal
			</hlm-radio>
			<hlm-radio value="apple" [class]="cardClass">
				<ng-icon hlm name="remixAppleFill" class="mb-3" />
				Apple
			</hlm-radio>
		</hlm-radio-group>
	`,
})
export class RadioGroupCardComponent {
	public payment = 'card';

	public readonly cardClass = hlm(
		'block space-x-0',
		// base card styles for the label
		'[&>[data-slot=label]]:flex [&>[data-slot=label]]:flex-col [&>[data-slot=label]]:items-center [&>[data-slot=label]]:justify-between [&>[data-slot=label]]:bg-popover [&>[data-slot=label]]:rounded-md [&>[data-slot=label]]:border-2 [&>[data-slot=label]]:border-muted [&>[data-slot=label]]:p-4',
		// hover styles
		'[&>[data-slot=label]]:hover:bg-accent [&>[data-slot=label]]:hover:text-accent-foreground',
		// highlight checked radio
		'[&>[data-slot=label]]:data-[checked=true]:border-primary',
	);
}

export const cardCode = `
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCreditCard } from '@ng-icons/lucide';
import { remixAppleFill, remixPaypalFill } from '@ng-icons/remixicon';
import { hlm } from '@spartan-ng/brain/core';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { HlmRadioComponent, HlmRadioGroupComponent } from '@spartan-ng/ui-radiogroup-helm';

@Component({
	selector: 'spartan-radio-card-preview',
	standalone: true,
	providers: [provideIcons({ lucideCreditCard, remixPaypalFill, remixAppleFill })],
	imports: [FormsModule, HlmRadioComponent, HlmRadioGroupComponent, NgIcon, HlmIconDirective],
	template: \`
		<hlm-radio-group class="grid grid-cols-3 gap-4" [(ngModel)]="payment">
			<hlm-radio value="card" [class]="cardClass">
				<ng-icon hlm name="lucideCreditCard" class="mb-3" />
				Card
			</hlm-radio>
			<hlm-radio value="paypal" [class]="cardClass">
				<ng-icon hlm name="remixPaypalFill" class="mb-3" />
				PayPal
			</hlm-radio>
			<hlm-radio value="apple" [class]="cardClass">
				<ng-icon hlm name="remixAppleFill" class="mb-3" />
				Apple
			</hlm-radio>
		</hlm-radio-group>
	\`,
})
export class RadioGroupCardComponent {
	public payment = 'card';

	public readonly cardClass = hlm(
		'block space-x-0',
		// base card styles for the label
		'[&>[data-slot=label]]:flex [&>[data-slot=label]]:flex-col [&>[data-slot=label]]:items-center [&>[data-slot=label]]:justify-between [&>[data-slot=label]]:bg-popover [&>[data-slot=label]]:rounded-md [&>[data-slot=label]]:border-2 [&>[data-slot=label]]:border-muted [&>[data-slot=label]]:p-4',
		// hover styles
		'[&>[data-slot=label]]:hover:bg-accent [&>[data-slot=label]]:hover:text-accent-foreground',
		// highlight checked radio
		'[&>[data-slot=label]]:data-[checked=true]:border-primary',
	);
}
`;
