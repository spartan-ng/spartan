import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEllipsis } from '@ng-icons/lucide';
import { BrnMenuTriggerDirective } from '@spartan-ng/brain/menu';
import { HlmButtonDirective } from '@spartan-ng/helm/button';
import { HlmIconDirective } from '@spartan-ng/helm/icon';
import {
	HlmMenuComponent,
	HlmMenuItemDirective,
	HlmMenuLabelComponent,
	HlmMenuSeparatorComponent,
} from '@spartan-ng/helm/menu';
import { CellContext, injectFlexRenderContext } from '@tanstack/angular-table';
import { Payment } from './data-table.preview';

@Component({
	selector: 'spartan-action-dropdown',
	imports: [
		HlmButtonDirective,
		NgIcon,
		HlmIconDirective,

		BrnMenuTriggerDirective,
		HlmMenuComponent,
		HlmMenuLabelComponent,
		HlmMenuItemDirective,
		HlmMenuSeparatorComponent,
	],
	providers: [provideIcons({ lucideEllipsis })],
	template: `
		<button hlmBtn variant="ghost" class="h-8 w-8 p-0" [brnMenuTriggerFor]="menu">
			<span class="sr-only">Open menu</span>
			<ng-icon hlm size="sm" name="lucideEllipsis" />
		</button>

		<ng-template #menu>
			<hlm-menu>
				<hlm-menu-label>Actions</hlm-menu-label>
				<button hlmMenuItem (click)="copyPaymentId()">Copy payment ID</button>
				<hlm-menu-separator />
				<button hlmMenuItem>View customer</button>
				<button hlmMenuItem>View payment details</button>
			</hlm-menu>
		</ng-template>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionDropdownComponent {
	private readonly _context = injectFlexRenderContext<CellContext<Payment, unknown>>();

	copyPaymentId() {
		const payment = this._context.row.original;
		navigator.clipboard.writeText(payment.id);
	}
}
