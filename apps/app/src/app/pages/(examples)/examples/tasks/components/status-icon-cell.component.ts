import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
	lucideCircle,
	lucideCircleCheckBig,
	lucideCircleDashed,
	lucideCircleDot,
	lucideCircleHelp,
	lucideCircleOff,
} from '@ng-icons/lucide';
import { Task } from '../services/tasks.models';

import { HlmIconDirective } from '@spartan-ng/helm/icon';
import { CellContext, injectFlexRenderContext } from '@tanstack/angular-table';
import { StatusIconPipe } from '../pipes/status-icon.pipe';

@Component({
	selector: 'spartan-title-tabledata',
	imports: [StatusIconPipe, NgIcon, HlmIconDirective],
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
			<ng-icon hlm class="text-muted-foreground mr-2" size="sm" [name]="element.status | statusIcon" />
			{{ element.status }}
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusIconCellComponent {
	private readonly _context = injectFlexRenderContext<CellContext<Task, unknown>>();
	protected readonly element = this._context.row.original;
}
