import { Directive, computed, input } from '@angular/core';
import { BrnTabsContent } from '@spartan-ng/brain/tabs';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmTabsContent]',
	hostDirectives: [{ directive: BrnTabsContent, inputs: ['brnTabsContent: hlmTabsContent'] }],
	host: {
		'data-slot': 'tabs-content',
		'[class]': '_computedClass()',
	},
})
export class HlmTabsContent {
	public readonly contentFor = input.required<string>({ alias: 'hlmTabsContent' });

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'ring-offset-background focus-visible:ring-ring mt-2 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
			this.userClass(),
		),
	);
}
