import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEllipsis } from '@ng-icons/lucide';
import { BrnMenuTrigger } from '@spartan-ng/brain/menu';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmMenu, HlmMenuItem, HlmMenuLabel, HlmMenuSeparator } from '@spartan-ng/helm/menu';
import { CellContext, injectFlexRenderContext } from '@tanstack/angular-table';
import { Payment } from './data-table.preview';

@Component({
	selector: 'spartan-action-dropdown',
	imports: [HlmButton, NgIcon, HlmIcon, BrnMenuTrigger, HlmMenu, HlmMenuLabel, HlmMenuItem, HlmMenuSeparator],
	providers: [provideIcons({ lucideEllipsis })],
	template: `
		<button hlmBtn variant="ghost" class="h-8 w-8 p-0" [brnMenuTriggerFor]="ActionDropDownMenu">
			<span class="sr-only">Open menu</span>
			<ng-icon hlm size="sm" name="lucideEllipsis" />
		</button>

		<ng-template #ActionDropDownMenu>
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
export class ActionDropdown {
	private readonly _context = injectFlexRenderContext<CellContext<Payment, unknown>>();

	copyPaymentId() {
		const payment = this._context.row.original;
		navigator.clipboard.writeText(payment.id);
	}
}
