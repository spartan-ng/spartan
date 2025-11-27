import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
	lucideChevronDown,
	lucideChevronLeft,
	lucideChevronsUp,
	lucideChevronUp,
	lucideCircleHelp,
} from '@ng-icons/lucide';
import type { Task } from '../services/tasks.models';

import { HlmIcon } from '@spartan-ng/helm/icon';
import { type CellContext, injectFlexRenderContext } from '@tanstack/angular-table';
import { PriorityIconPipe } from '../pipes/priority-icon.pipe';

@Component({
	selector: 'spartan-priority-icon-cell',
	imports: [PriorityIconPipe, NgIcon, HlmIcon],
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
			<ng-icon hlm class="text-muted-foreground mr-2" size="sm" [name]="_element.priority | priorityIcon" />
			{{ _element.priority }}
		</div>
	`,
})
export class PriorityIconCell {
	private readonly _context = injectFlexRenderContext<CellContext<Task, unknown>>();
	protected readonly _element = this._context.row.original;
}
