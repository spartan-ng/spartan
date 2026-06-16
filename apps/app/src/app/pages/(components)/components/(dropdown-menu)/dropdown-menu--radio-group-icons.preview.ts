import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBuilding2, lucideCreditCard, lucideWallet } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';

@Component({
	selector: 'spartan-dropdown-radio-group-icons',
	imports: [HlmDropdownMenuImports, HlmButtonImports, NgIcon],
	providers: [provideIcons({ lucideCreditCard, lucideWallet, lucideBuilding2 })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<button hlmBtn variant="outline" [hlmDropdownMenuTrigger]="menu">Payment Method</button>

		<ng-template #menu>
			<hlm-dropdown-menu class="w-56">
				<hlm-dropdown-menu-group>
					<hlm-dropdown-menu-label>Select Payment Method</hlm-dropdown-menu-label>
					@let p = payment();
					<button hlmDropdownMenuRadio [checked]="p === 'card'" (triggered)="payment.set('card')">
						<ng-icon name="lucideCreditCard" />
						Credit Card
						<hlm-dropdown-menu-radio-indicator />
					</button>
					<button hlmDropdownMenuRadio [checked]="p === 'paypal'" (triggered)="payment.set('paypal')">
						<ng-icon name="lucideWallet" />
						PayPal
						<hlm-dropdown-menu-radio-indicator />
					</button>
					<button hlmDropdownMenuRadio [checked]="p === 'bank'" (triggered)="payment.set('bank')">
						<ng-icon name="lucideBuilding2" />
						Bank Transfer
						<hlm-dropdown-menu-radio-indicator />
					</button>
				</hlm-dropdown-menu-group>
			</hlm-dropdown-menu>
		</ng-template>
	`,
})
export class DropdownRadioGroupIcons {
	public readonly payment = signal<'card' | 'paypal' | 'bank'>('card');
}
