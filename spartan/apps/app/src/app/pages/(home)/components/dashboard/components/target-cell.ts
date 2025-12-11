import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmInput } from '@spartan-ng/helm/input';
import { type CellContext, injectFlexRenderContext } from '@tanstack/angular-table';
import type { DashboardData } from './dashboard-data.model';

@Component({
	selector: 'spartan-target-cell',
	imports: [HlmInput],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<input
			class="hover:bg-input/30 focus-visible:bg-background dark:hover:bg-input/30 dark:focus-visible:bg-input/30 h-8 w-16 border-transparent bg-transparent text-right shadow-none focus-visible:border dark:bg-transparent"
			id="{{ _element.id }}-target"
			hlmInput
			[value]="_element.target"
		/>
	`,
})
export class TargetCell {
	private readonly _context = injectFlexRenderContext<CellContext<DashboardData, unknown>>();
	protected readonly _element = this._context.row.original;
}
