import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
	lucideChevronDown,
	lucideChevronLeft,
	lucideChevronsUp,
	lucideChevronUp,
	lucideCircleHelp,
} from '@ng-icons/lucide';
import { type CellContext, injectFlexRenderContext } from '@tanstack/angular-table';
import { PriorityIconPipe } from '../pipes/priority-icon.pipe';
import type { Task } from '../services/tasks.models';

@Component({
	selector: 'spartan-priority-icon-cell',
	imports: [PriorityIconPipe, NgIcon],
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
			<ng-icon class="text-muted-foreground mr-2" [name]="_element.priority | priorityIcon" />
			{{ _element.priority }}
		</div>
	`,
})
export class PriorityIconCell {
	private readonly _context = injectFlexRenderContext<CellContext<Task, unknown>>();
	protected readonly _element = this._context.row.original;
}
