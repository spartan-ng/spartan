import { Component, input } from '@angular/core';
import { HlmTableImports } from '@spartan-ng/helm/table';

type Column = { label: string; key: string; class?: string };

@Component({
	selector: 'spartan-ui-api-docs-table',
	imports: [...HlmTableImports],
	template: `
		<h4 class="mt-6 mb-2">{{ title() }}</h4>
		<div class="no-scrollbar my-6 w-full overflow-y-auto rounded-lg border">
			<table hlmTable class="w-fit min-w-full">
				<thead hlmTHead>
					<tr hlmTr>
						@for (col of columns(); track col.key) {
							<th hlmTh [class]="col.class">{{ col.label }}</th>
						}
					</tr>
				</thead>
				<tbody hlmTBody>
					@for (row of rows(); track row.name + $index) {
						<tr hlmTr>
							@for (col of columns(); track col.key) {
								<td hlmTd [class]="col.class">
									@if (row[col.key]) {
										@if (col.key === 'name') {
											<span [innerHTML]="row[col.key]"></span>
										} @else {
											{{ row[col.key] }}
										}
									} @else {
										<span class="sr-hidden">-</span>
									}
								</td>
							}
						</tr>
					}
				</tbody>
			</table>
		</div>
	`,
})
export class UIApiDocsTable {
	public readonly title = input.required<string>();
	// es-lint-disable-next-line @typescript-eslint/no-explicit-any
	public readonly rows = input.required<any[]>();
	public readonly columns = input.required<Column[]>();
}
