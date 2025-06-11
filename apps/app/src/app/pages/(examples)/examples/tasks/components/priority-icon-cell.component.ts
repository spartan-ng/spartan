import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
	lucideChevronDown,
	lucideChevronLeft,
	lucideChevronsUp,
	lucideChevronUp,
	lucideCircleHelp,
} from '@ng-icons/lucide';
import { Task } from '../services/tasks.models';

import { HlmIconDirective } from '@spartan-ng/helm/icon';
import { CellContext, injectFlexRenderContext } from '@tanstack/angular-table';
import { PriorityIconPipe } from '../pipes/priority-icon.pipe';

@Component({
	selector: 'spartan-priority-icon-cell',
	imports: [PriorityIconPipe, NgIcon, HlmIconDirective],
	providers: [
		provideIcons({
			lucideChevronDown,
			lucideChevronLeft,
			lucideChevronUp,
			lucideChevronsUp,
			lucideCircleHelp, // Default icon if not recognized
		}),
	],
	template: `
		<div class="flex items-center">
			<ng-icon hlm class="text-muted-foreground mr-2" size="sm" [name]="element.priority | priorityIcon" />
			{{ element.priority }}
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PriorityIconCellComponent {
	private readonly _context = injectFlexRenderContext<CellContext<Task, unknown>>();
	protected readonly element = this._context.row.original;
}
