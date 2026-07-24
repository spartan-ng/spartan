import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
	lucideCircle,
	lucideCircleCheckBig,
	lucideCircleDashed,
	lucideCircleDot,
	lucideCircleHelp,
	lucideCircleOff,
} from '@ng-icons/lucide';
import { type CellContext, injectFlexRenderContext } from '@tanstack/angular-table';
import { StatusIconPipe } from '../pipes/status-icon.pipe';
import type { Task } from '../services/tasks.models';

@Component({
	selector: 'spartan-status-icon-cell',
	imports: [StatusIconPipe, NgIcon],
	providers: [
		provideIcons({
			lucideCircle,
			lucideCircleDot,
			lucideCircleDashed,
			lucideCircleOff,
			lucideCircleCheckBig,
			lucideCircleHelp, // Default icon if not recognized
		}),
	],
	template: `
		<div class="flex items-center">
			<ng-icon class="text-muted-foreground mr-2" [name]="_element.status | statusIcon" />
			{{ _element.status }}
		</div>
	`,
})
export class StatusIconCell {
	private readonly _context = injectFlexRenderContext<CellContext<Task, unknown>>();
	protected readonly _element = this._context.row.original;
}
