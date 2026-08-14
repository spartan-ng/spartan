import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { HlmInput } from '@spartan-ng/helm/input';
import { type Row } from '@tanstack/angular-table';
import { type DashboardData } from './dashboard-data.model';

@Component({
	selector: 'spartan-limit-cell',
	imports: [HlmInput],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<input
			class="hover:bg-input/30 focus-visible:bg-background dark:hover:bg-input/30 dark:focus-visible:bg-input/30 h-8 w-16 border-transparent bg-transparent text-right shadow-none focus-visible:border dark:bg-transparent"
			id="{{ _data().id }}-limit"
			hlmInput
			[value]="_data().limit"
		/>
	`,
})
export class LimitCell {
	readonly row = input.required<Row<{}, DashboardData>>();

	protected readonly _data = computed(() => this.row().original);
}
