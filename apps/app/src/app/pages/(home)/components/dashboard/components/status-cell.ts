import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { tablerCircleCheck, tablerLoader } from '@ng-icons/tabler-icons';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { type CellContext, injectFlexRenderContext } from '@tanstack/angular-table';
import type { DashboardData } from './dashboard-data.model';

@Component({
	selector: 'spartan-status-cell',
	imports: [HlmBadge, NgIcon, HlmIcon],
	providers: [provideIcons({ tablerCircleCheck, tablerLoader })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<span
			id="{{ _element.id }}-status"
			hlmBadge
			variant="outline"
			class="text-muted-foreground rounded-full px-1.5 text-xs"
		>
			@if (_element.status === 'Done') {
				<ng-icon hlm name="tablerCircleCheck" class="text-green-500 dark:text-green-400" size="xs" />
			} @else {
				<ng-icon hlm name="tablerLoader" size="xs" />
			}
			{{ _element.status }}
		</span>
	`,
})
export class StatusCell {
	private readonly _context = injectFlexRenderContext<CellContext<DashboardData, unknown>>();
	protected readonly _element = this._context.row.original;
}
