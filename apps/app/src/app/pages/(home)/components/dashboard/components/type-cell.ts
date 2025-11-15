import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { type CellContext, injectFlexRenderContext } from '@tanstack/angular-table';
import type { DashboardData } from './dashboard-data.model';

@Component({
	selector: 'spartan-type-cell',
	imports: [HlmBadge],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<span
			id="{{ _element.id }}-type"
			hlmBadge
			variant="outline"
			class="text-muted-foreground rounded-full px-1.5 text-xs"
		>
			{{ _element.type }}
		</span>
	`,
})
export class TypeCell {
	private readonly _context = injectFlexRenderContext<CellContext<DashboardData, unknown>>();
	protected readonly _element = this._context.row.original;
}
