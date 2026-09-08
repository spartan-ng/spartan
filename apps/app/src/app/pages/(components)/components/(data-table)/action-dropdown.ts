import { Component, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEllipsis } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import type { Row } from '@tanstack/angular-table';
import type { DataTableFeatures, Payment } from './data-table.preview';

@Component({
	selector: 'spartan-action-dropdown',
	imports: [HlmButtonImports, NgIcon, HlmDropdownMenuImports],
	providers: [provideIcons({ lucideEllipsis })],
	template: `
		<button hlmBtn size="icon-sm" variant="ghost" [hlmDropdownMenuTrigger]="ActionDropDownMenu">
			<span class="sr-only">Open menu</span>
			<ng-icon name="lucideEllipsis" />
		</button>

		<ng-template #ActionDropDownMenu>
			<hlm-dropdown-menu>
				<hlm-dropdown-menu-label>Actions</hlm-dropdown-menu-label>
				<button hlmDropdownMenuItem (click)="copyPaymentId()">Copy payment ID</button>
				<hlm-dropdown-menu-separator />
				<button hlmDropdownMenuItem>View customer</button>
				<button hlmDropdownMenuItem>View payment details</button>
			</hlm-dropdown-menu>
		</ng-template>
	`,
})
export class ActionDropdown {
	public readonly row = input.required<Row<DataTableFeatures, Payment>>();

	copyPaymentId() {
		const payment = this.row().original;
		navigator.clipboard.writeText(payment.id);
	}
}
