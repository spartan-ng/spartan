import { Component, input } from '@angular/core';
import { HlmTableComponent, HlmTdComponent, HlmThComponent, HlmTrowComponent } from '@spartan-ng/helm/table';

type Column = { label: string; key: string; class?: string };

@Component({
	selector: 'spartan-ui-api-docs-table',
	standalone: true,
	imports: [HlmTableComponent, HlmTrowComponent, HlmThComponent, HlmTdComponent],
	template: `
		<h4 class="mb-2 mt-6">{{ title() }}</h4>
		<div class="w-full overflow-x-auto">
			<hlm-table class="w-fit min-w-full">
				<hlm-trow>
					@for (col of columns(); track col.key) {
						<hlm-th [class]="col.class">{{ col.label }}</hlm-th>
					}
				</hlm-trow>
				@for (row of rows(); track row.name + $index) {
					<hlm-trow>
						@for (col of columns(); track col.key) {
							<hlm-td [class]="col.class">
								@if (row[col.key]) {
									{{ row[col.key] }}
								} @else {
									<span class="sr-hidden">-</span>
								}
							</hlm-td>
						}
					</hlm-trow>
				}
			</hlm-table>
		</div>
	`,
})
export class UIApiDocsTableComponent {
	public title = input.required<string>();
	public rows = input.required<any[]>();
	public columns = input.required<Column[]>();
}
