import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input } from '@angular/core';
import { BrnAccordionContent } from '@spartan-ng/brain/accordion';
import { hlm } from '@spartan-ng/brain/core';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-accordion-content',
	template: `
		<div [attr.inert]="_addInert()" style="overflow: hidden">
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
	protected readonly _computedClass = computed(() => {
		const gridRows = this.state() === 'open' ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]';
		return hlm('text-sm transition-all grid', gridRows, this.userClass());
	});
}
