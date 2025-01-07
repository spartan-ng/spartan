import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import type { ClassValue } from 'clsx';

@Directive({
	selector: 'brn-cmd-group[hlm],cmdk-group[hlm]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmCommandGroupDirective {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() =>
		hlm(
			'block [&[cmdk-hidden="true"]]:hidden\n' +
				'[&_.cmdk-group-label]:px-2 [&_.cmdk-group-label]:py-1.5 [&_.cmdk-group-label]:text-xs [&_.cmdk-group-label]:font-medium [&_.cmdk-group-label]:text-muted-foreground\n' +
				'[&_.cmdk-group-content]:flex [&_.cmdk-group-content]:flex-col [&_.cmdk-group-content]:flex-col overflow-hidden p-1 text-foreground',
			this.userClass(),
		),
	);
}
