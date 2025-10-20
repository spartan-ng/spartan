import { computed, Directive, input } from '@angular/core';
import { HlmLabel } from '@spartan-ng/helm/label';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmFieldLabel]',
	// TODO only apply HlmLabel styles which are missing here
	hostDirectives: [HlmLabel],
	host: {
		'data-slot': 'field-label',
		'[class]': '_computedClass()',
	},
})
export class HlmFieldLabel {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50',
			'has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border [&>*]:data-[slot=field]:p-4',
			// TODO test has selectors state=checked
			// 'has-data-[state=checked]:bg-primary/5 has-data-[state=checked]:border-primary dark:has-data-[state=checked]:bg-primary/10',
			this.userClass(),
		),
	);
}
