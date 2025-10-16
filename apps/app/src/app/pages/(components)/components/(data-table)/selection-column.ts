import { Component } from '@angular/core';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { type CellContext, type HeaderContext, injectFlexRenderContext } from '@tanstack/angular-table';

@Component({
	imports: [HlmCheckboxImports],
	template: `
		<hlm-checkbox
			[checked]="_context.table.getIsAllRowsSelected()"
			(checkedChange)="_context.table.toggleAllRowsSelected()"
			[indeterminate]="_context.table.getIsSomeRowsSelected()"
		/>
	`,
	host: {
		class: 'flex',
		'aria-label': 'Select all',
	},
})
export class TableHeadSelection<T> {
	protected readonly _context = injectFlexRenderContext<HeaderContext<T, unknown>>();
}

@Component({
	imports: [HlmCheckboxImports],
	template: `
		<hlm-checkbox
			[checked]="_context.row.getIsSelected()"
			(checkedChange)="_context.row.getToggleSelectedHandler()($event)"
		/>
	`,
	host: {
		class: 'flex',
		'aria-label': 'Select Row',
	},
})
export class TableRowSelection<T> {
	protected readonly _context = injectFlexRenderContext<CellContext<T, unknown>>();
}
