import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input } from '@angular/core';
import { BrnAccordionContent } from '@spartan-ng/brain/accordion';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-accordion-content',
	template: `
		<div [attr.inert]="_addInert()" [style]="contentStyle()">
			<div class="flex flex-col gap-4 text-balance pb-4 pt-0">
				<ng-content />
			</div>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmAccordionContent extends BrnAccordionContent {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	public readonly contentStyle = input<string>('overflow: hidden');

	protected readonly _computedClass = computed(() => {
		const gridRows = this.state() === 'open' ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]';
		return hlm('grid text-sm transition-all', gridRows, this.userClass());
	});
}
