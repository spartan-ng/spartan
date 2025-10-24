import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input } from '@angular/core';
import { BrnAccordionContent } from '@spartan-ng/brain/accordion';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-accordion-content',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	host: {
		'[class]': '_computedClass()',
	},
	hostDirectives: [{ directive: BrnAccordionContent, inputs: ['style'] }],
	template: `
		<div class="flex flex-col gap-4 pt-0 pb-4 text-balance">
			<ng-content />
		</div>
	`,
})
export class HlmAccordionContent {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _computedClass = computed(() => {
		return hlm(
			'text-sm transition-all data-[state=closed]:h-0 data-[state=open]:h-[var(--brn-accordion-content-height)]',
			this.userClass(),
		);
	});
}
