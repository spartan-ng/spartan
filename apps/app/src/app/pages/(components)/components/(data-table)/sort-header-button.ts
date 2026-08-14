import { Component, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUpDown } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { type Column } from '@tanstack/angular-table';
import type { DataTableFeatures, Payment } from './data-table.preview';

@Component({
	imports: [HlmButtonImports, NgIcon],
	providers: [provideIcons({ lucideArrowUpDown })],
	template: `
		<button hlmBtn size="sm" variant="ghost" class="capitalize" (click)="filterClick()">
			{{ column().id }}
			<ng-icon name="lucideArrowUpDown" />
		</button>
	`,
})
export class TableHeadSortButton {
	public readonly column = input.required<Column<DataTableFeatures, Payment, unknown>>();

	protected filterClick() {
		this.column().toggleSorting(this.column().getIsSorted() === 'asc');
	}
}
