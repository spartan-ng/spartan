import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { type Row } from '@tanstack/angular-table';
import { type DashboardData } from './dashboard-data.model';
import { type DashboardFeatures } from './table-section';

@Component({
	selector: 'spartan-reviewer-cell',
	imports: [HlmSelectImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		@if (_data().reviewer !== 'Assign reviewer') {
			{{ _data().reviewer }}
		} @else {
			<hlm-select id="{{ _data().id }}-reviewer">
				<hlm-select-trigger
					size="sm"
					class="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
				>
					<hlm-select-value placeholder="Assign reviewer" />
				</hlm-select-trigger>
				<hlm-select-content *hlmSelectPortal>
					<hlm-select-group>
						<hlm-select-item value="Eddie Lake">Eddie Lake</hlm-select-item>
						<hlm-select-item value="Jamik Tashpulatov">Jamik Tashpulatov</hlm-select-item>
					</hlm-select-group>
				</hlm-select-content>
			</hlm-select>
		}
	`,
})
export class ReviewerCell {
	public readonly row = input.required<Row<DashboardFeatures, DashboardData>>();

	protected readonly _data = computed(() => this.row().original);
}
