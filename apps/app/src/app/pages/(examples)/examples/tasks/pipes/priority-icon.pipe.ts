import { Pipe, PipeTransform } from '@angular/core';
import { TaskPriority } from '../services/tasks.service';

@Pipe({
	name: 'priorityIcon',
	standalone: true,
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
