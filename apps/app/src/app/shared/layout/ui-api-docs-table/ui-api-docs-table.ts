import { Component, input } from '@angular/core';
import { HlmTableImports } from '@spartan-ng/helm/table';

type Column = { label: string; key: string; class?: string };

@Component({
	selector: 'spartan-ui-api-docs-table',
	standalone: true,
	imports: [...HlmTableImports],
	template: `
		<h4 class="mb-2 mt-6">{{ title() }}</h4>
		<div class="w-full overflow-x-auto">
			<table hlmTable class="w-fit min-w-full">
				<tr hlmTr>
					@for (col of columns(); track col.key) {
						<th hlmTh [class]="col.class">{{ col.label }}</th>
					}
				</tr>
				@for (row of rows(); track row.name + $index) {
					<tr hlmTr>
						@for (col of columns(); track col.key) {
							<td hlmTd [class]="col.class">
								@if (row[col.key]) {
									{{ row[col.key] }}
								} @else {
									<span class="sr-hidden">-</span>
								}
							</td>
						}
					</tr>
				}
			</table>
		</div>
	`,
})
export class UIApiDocsTable {
	public title = input.required<string>();
	public rows = input.required<any[]>();
	public columns = input.required<Column[]>();
}
