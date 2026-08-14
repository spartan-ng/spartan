import { Component, computed, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
	lucideCircle,
	lucideCircleCheckBig,
	lucideCircleDashed,
	lucideCircleDot,
	lucideCircleHelp,
	lucideCircleOff,
} from '@ng-icons/lucide';
import { type Row } from '@tanstack/angular-table';
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
			<ng-icon class="text-muted-foreground mr-2" [name]="_data().status | statusIcon" />
			{{ _data().status }}
		</div>
	`,
})
export class StatusIconCell {
	readonly row = input.required<Row<{}, Task>>();

	protected readonly _data = computed(() => this.row().original);
}
