import { Directive, computed, input } from '@angular/core';
import { BrnCalendarCellDirective } from '@spartan-ng/ui-calendar-brain';
import { hlm } from '@spartan-ng/ui-core';
import type { ClassValue } from 'clsx';

@Directive({
	selector: 'button[hlmCalendarDayCell]',
	standalone: true,
	hostDirectives: [
		{
			directive: BrnCalendarCellDirective,
			inputs: ['value: value'],
		},
	],
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmCalendarDayCellDirective {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => {
		return hlm(
			'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9 p-0 font-normal aria-selected:opacity-100 aria-selected:bg-primary aria-selected:text-primary-foreground',
			this.userClass(),
		);
	});
}
