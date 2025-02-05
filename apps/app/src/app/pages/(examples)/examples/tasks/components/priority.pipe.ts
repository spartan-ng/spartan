import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'priorityIcon',
	standalone: true,
})
export class PriorityPipe implements PipeTransform {
	transform(value: string): string {
		switch (value.toLowerCase()) {
			case 'low':
				return 'lucideChevronsDown';
			case 'medium':
				return 'lucideChevronsLeft';
			case 'high':
				return 'lucideChevronsUp';
			default:
				return 'lucideCircleHelp'; // Default icon if priority is not recognized
		}
	}
}
