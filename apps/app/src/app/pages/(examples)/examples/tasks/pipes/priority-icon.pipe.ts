import { Pipe, type PipeTransform } from '@angular/core';
import type { TaskPriority } from '../services/tasks.models';

@Pipe({
	name: 'priorityIcon',
})
export class PriorityIconPipe implements PipeTransform {
	transform(value: TaskPriority): string {
		switch (value) {
			case 'Low':
				return 'lucideChevronDown';
			case 'Medium':
				return 'lucideChevronLeft';
			case 'High':
				return 'lucideChevronUp';
			case 'Critical':
				return 'lucideChevronsUp';
			default:
				return 'lucideCircleHelp'; // Default icon if not recognized
		}
	}
}
