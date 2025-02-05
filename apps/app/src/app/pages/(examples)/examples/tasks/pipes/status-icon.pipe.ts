import { Pipe, PipeTransform } from '@angular/core';
import { TaskStatus } from '../services/tasks.service';

@Pipe({
	name: 'statusIcon',
	standalone: true,
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
