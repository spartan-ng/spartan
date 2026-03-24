import { ChangeDetectionStrategy, Component } from '@angular/core';

import { HlmSelectImports } from '@spartan-ng/helm/select';
import { type CellContext, injectFlexRenderContext } from '@tanstack/angular-table';
import type { DashboardData } from './dashboard-data.model';

@Component({
	selector: 'spartan-reviewer-cell',
	imports: [HlmSelectImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		@if (_element.reviewer !== 'Assign reviewer') {
			{{ _element.reviewer }}
		} @else {
			<hlm-select id="{{ _element.id }}-reviewer">
				<hlm-select-trigger
					size="sm"
					class="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
				>
					<hlm-select-value placeholder="Assign reviewer" />
				</hlm-select-trigger>
				<hlm-select-content *hlmSelectPortal>
					<hlm-select-group>
						<hlm-select-item value="Eddie Lake">Eddie Lake</hlm-select-item>
						<hlm-select-item value="Jamik Tashpulatov">Jamik Tashpulatov</hlm-select-item>
					</hlm-select-group>
				</hlm-select-content>
			</hlm-select>
		}
	`,
})
export class ReviewerCell {
	private readonly _context = injectFlexRenderContext<CellContext<DashboardData, unknown>>();
	protected readonly _element = this._context.row.original;
}
