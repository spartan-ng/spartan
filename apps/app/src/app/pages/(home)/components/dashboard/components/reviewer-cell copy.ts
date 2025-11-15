import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { type CellContext, injectFlexRenderContext } from '@tanstack/angular-table';
import type { DashboardData } from './dashboard-data.model';

@Component({
	selector: 'spartan-reviewer-cell',
	imports: [BrnSelectImports, HlmSelectImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		@if (_element.reviewer !== 'Assign reviewer') {
			{{ _element.reviewer }}
		} @else {
			<brn-select id="{{ _element.id }}-reviewer" class="inline-block" placeholder="Assign reviewer">
				<hlm-select-trigger
					size="sm"
					class="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
				>
					<hlm-select-value />
				</hlm-select-trigger>
				<hlm-select-content>
					<hlm-option value="Eddie Lake">Eddie Lake</hlm-option>
					<hlm-option value="Jamik Tashpulatov">Jamik Tashpulatov</hlm-option>
				</hlm-select-content>
			</brn-select>
		}
	`,
})
export class ReviewerCell {
	private readonly _context = injectFlexRenderContext<CellContext<DashboardData, unknown>>();
	protected readonly _element = this._context.row.original;
}
