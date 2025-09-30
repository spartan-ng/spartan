import { Pipe, type PipeTransform } from '@angular/core';
import type { TaskStatus } from '../services/tasks.models';

@Pipe({
	name: 'statusIcon',
})
export class StatusIconPipe implements PipeTransform {
	transform(value: TaskStatus): string {
		switch (value) {
			case 'Todo':
				return 'lucideCircle';
			case 'In Progress':
				return 'lucideCircleDot';
			case 'Backlog':
				return 'lucideCircleDashed';
			case 'Canceled':
				return 'lucideCircleOff';
			case 'Done':
				return 'lucideCircleCheckBig';
			default:
				return 'lucideCircleHelp'; // Default icon if not recognized
		}
	}
}
