import { Component, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-calendar-header, brn-calendar-header[hlm]',
	template: '<ng-content/>',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmCalendarHeaderComponent {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => {
		return hlm('flex justify-between pt-1 relative items-center', this.userClass());
	});
}
