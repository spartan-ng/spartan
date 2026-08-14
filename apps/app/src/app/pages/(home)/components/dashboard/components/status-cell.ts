import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { tablerCircleCheck, tablerLoader } from '@ng-icons/tabler-icons';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { type Row } from '@tanstack/angular-table';
import { type DashboardData } from './dashboard-data.model';

@Component({
	selector: 'spartan-status-cell',
	imports: [HlmBadge, NgIcon],
	providers: [provideIcons({ tablerCircleCheck, tablerLoader })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<span
			id="{{ _data().id }}-status"
			hlmBadge
			variant="outline"
			class="text-muted-foreground rounded-full px-1.5 text-xs"
		>
			@if (_data().status === 'Done') {
				<ng-icon name="tablerCircleCheck" class="text-green-500 dark:text-green-400" />
			} @else {
				<ng-icon name="tablerLoader" />
			}
			{{ _data().status }}
		</span>
	`,
})
export class StatusCell {
	readonly row = input.required<Row<{}, DashboardData>>();

	protected readonly _data = computed(() => this.row().original);
}
