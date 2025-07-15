import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmCheckbox } from '@spartan-ng/helm/checkbox';
import { CellContext, HeaderContext, injectFlexRenderContext } from '@tanstack/angular-table';

@Component({
	imports: [HlmCheckbox],
	template: `
		<hlm-checkbox [checked]="_checkedState()" (changed)="_context.table.toggleAllRowsSelected()" />
	`,
	host: {
		class: 'px-1 block',
	},
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableHeadSelection<T> {
	protected readonly _context = injectFlexRenderContext<HeaderContext<T, unknown>>();
	protected _checkedState(): boolean | 'indeterminate' {
		if (this._context.table.getIsAllRowsSelected()) {
			return true;
		}
		if (this._context.table.getIsSomeRowsSelected()) {
			return 'indeterminate';
		}
		return false;
	}
}

@Component({
	imports: [HlmCheckbox],
	template: `
		<hlm-checkbox
			type="checkbox"
			[checked]="_context.row.getIsSelected()"
			(changed)="_context.row.getToggleSelectedHandler()($event)"
		/>
	`,
	host: {
		class: 'px-1 block',
	},
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableRowSelection<T> {
	protected readonly _context = injectFlexRenderContext<CellContext<T, unknown>>();
}
