import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { type Row } from '@tanstack/angular-table';
import { type DashboardData } from './dashboard-data.model';
import { type DashboardFeatures } from './table-section';

@Component({
	selector: 'spartan-header-cell',
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<span id="{{ _data().id }}-header">
			{{ _data().header }}
		</span>
	`,
})
export class HeaderCell {
	public readonly row = input.required<Row<DashboardFeatures, DashboardData>>();

	protected readonly _data = computed(() => this.row().original);
}
