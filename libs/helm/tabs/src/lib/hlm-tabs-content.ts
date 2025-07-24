import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import { BrnTabsContent } from '@spartan-ng/brain/tabs';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmTabsContent]',
	hostDirectives: [{ directive: BrnTabsContent, inputs: ['brnTabsContent: hlmTabsContent'] }],
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmTabsContent {
	public readonly contentFor = input.required<string>({ alias: 'hlmTabsContent' });

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
			this.userClass(),
		),
	);
}
