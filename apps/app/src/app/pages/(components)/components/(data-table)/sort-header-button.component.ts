import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUpDown } from '@ng-icons/lucide';
import { HlmButtonDirective } from '@spartan-ng/helm/button';
import { HlmIconDirective } from '@spartan-ng/helm/icon';
import { HeaderContext, injectFlexRenderContext } from '@tanstack/angular-table';

@Component({
	imports: [HlmButtonDirective, NgIcon, HlmIconDirective],
	providers: [provideIcons({ lucideArrowUpDown })],
	template: `
		<button hlmBtn size="sm" variant="ghost" (click)="filterClick()" [class.capitalize]="header() === ''">
			{{ _header() }}
			<ng-icon hlm class="ml-3" size="sm" name="lucideArrowUpDown" />
		</button>
	`,
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableHeadSortButtonComponent<T> {
	protected readonly _context = injectFlexRenderContext<HeaderContext<T, unknown>>();
	protected filterClick() {
		this._context.column.toggleSorting(this._context.column.getIsSorted() === 'asc');
	}
	protected readonly header = input('');
	protected readonly _header = computed(() => {
		return this.header() === '' ? this._context.column.id : this.header();
	});
}
