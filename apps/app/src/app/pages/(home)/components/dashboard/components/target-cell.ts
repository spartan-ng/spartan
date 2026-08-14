import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { HlmInput } from '@spartan-ng/helm/input';
import { type Row } from '@tanstack/angular-table';
import { type DashboardData } from './dashboard-data.model';
import { type DashboardFeatures } from './table-section';

@Component({
	selector: 'spartan-target-cell',
	imports: [HlmInput],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<input
			class="hover:bg-input/30 focus-visible:bg-background dark:hover:bg-input/30 dark:focus-visible:bg-input/30 h-8 w-16 border-transparent bg-transparent text-right shadow-none focus-visible:border dark:bg-transparent"
			id="{{ _data().id }}-target"
			hlmInput
			[value]="_data().target"
		/>
	`,
})
export class TargetCell {
	public readonly row = input.required<Row<DashboardFeatures, DashboardData>>();

	protected readonly _data = computed(() => this.row().original);
}
