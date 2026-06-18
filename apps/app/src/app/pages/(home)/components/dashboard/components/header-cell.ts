import { ChangeDetectionStrategy, Component } from '@angular/core';
import { type CellContext, injectFlexRenderContext } from '@tanstack/angular-table';
import type { DashboardData } from './dashboard-data.model';

@Component({
	selector: 'spartan-header-cell',
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<span id="{{ _element.id }}-header">
			{{ _element.header }}
		</span>
	`,
})
export class HeaderCell {
	private readonly _context = injectFlexRenderContext<CellContext<DashboardData, unknown>>();
	protected readonly _element = this._context.row.original;
}
