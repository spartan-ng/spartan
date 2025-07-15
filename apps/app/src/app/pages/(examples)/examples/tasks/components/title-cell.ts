import { ChangeDetectionStrategy, Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideEllipsis } from '@ng-icons/lucide';
import { Task } from '../services/tasks.models';

import { CellContext, injectFlexRenderContext } from '@tanstack/angular-table';

@Component({
	selector: 'spartan-title-cell',
	imports: [],
	providers: [provideIcons({ lucideEllipsis })],
	template: `
		<div class="text-foreground inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold">
			{{ element.type }}
		</div>
		{{ element.title }}
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TitleCell {
	private readonly _context = injectFlexRenderContext<CellContext<Task, unknown>>();
	protected readonly element = this._context.row.original;
}
