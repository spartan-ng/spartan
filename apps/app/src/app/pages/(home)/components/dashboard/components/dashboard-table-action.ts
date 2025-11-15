import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { tablerChevronDown, tablerColumns2, tablerPlus } from '@ng-icons/tabler-icons';
import { BrnMenuTrigger } from '@spartan-ng/brain/menu';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmMenuImports } from '@spartan-ng/helm/menu';
import { DashboardTableSection } from './table-section';

@Component({
	selector: 'spartan-dashboard-table-actions',

	imports: [HlmButton, BrnMenuTrigger, NgIcon, HlmIcon, HlmMenuImports],
	providers: [
		provideIcons({
			tablerChevronDown,
			tablerColumns2,
			tablerPlus,
		}),
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'block',
	},
	template: `
		<div class="wip-table-search flex flex-col justify-between gap-2 sm:flex-row">
			<button hlmBtn variant="outline" align="end" size="sm" [brnMenuTriggerFor]="columns">
				<ng-icon hlm name="tablerColumns2" size="sm" />
				Customize Columns
				<ng-icon hlm name="tablerChevronDown" size="sm" />
			</button>
			<button hlmBtn variant="outline" align="end" size="sm">
				<ng-icon hlm name="tablerPlus" size="sm" />
				Add section
			</button>
			<ng-template #columns>
				<hlm-menu class="w-32">
					@for (column of _hidableColumns; track column.id) {
						<button
							hlmMenuItemCheckbox
							class="capitalize"
							[checked]="column.getIsVisible()"
							(triggered)="column.toggleVisibility()"
						>
							<hlm-menu-item-check />
							{{ column.columnDef.id }}
						</button>
					}
				</hlm-menu>
			</ng-template>
		</div>
	`,
})
export class DashboardTableActions {
	private readonly _tableComponent = inject(DashboardTableSection);
	protected readonly _table = this._tableComponent.table;
	protected readonly _hidableColumns = this._table.getAllColumns().filter((column) => column.getCanHide());
}
