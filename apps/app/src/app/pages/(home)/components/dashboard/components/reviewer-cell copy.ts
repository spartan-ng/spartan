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
			<hlm-select id="{{ _element.id }}-reviewer" class="inline-block" placeholder="Assign reviewer">
				<hlm-select-trigger />
				<hlm-select-content>
					<hlm-option value="Eddie Lake">Eddie Lake</hlm-option>
					<hlm-option value="Jamik Tashpulatov">Jamik Tashpulatov</hlm-option>
				</hlm-select-content>
			</hlm-select>
		}
	`,
})
export class ReviewerCell {
	private readonly _context = injectFlexRenderContext<CellContext<DashboardData, unknown>>();
	protected readonly _element = this._context.row.original;
}
