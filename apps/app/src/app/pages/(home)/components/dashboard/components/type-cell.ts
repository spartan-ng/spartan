import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { type Row } from '@tanstack/angular-table';
import { type DashboardData } from './dashboard-data.model';
import { type DashboardFeatures } from './table-section';

@Component({
	selector: 'spartan-type-cell',
	imports: [HlmBadge],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<span
			id="{{ _data().id }}-type"
			hlmBadge
			variant="outline"
			class="text-muted-foreground rounded-full px-1.5 text-xs"
		>
			{{ _data().type }}
		</span>
	`,
})
export class TypeCell {
	public readonly row = input.required<Row<DashboardFeatures, DashboardData>>();

	protected readonly _data = computed(() => this.row().original);
}
