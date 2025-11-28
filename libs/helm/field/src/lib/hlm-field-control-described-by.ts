import { computed, Directive, inject, input } from '@angular/core';
import { HlmFieldA11yService } from './hlm-field-aria.service';

@Directive({
	selector: '[hlmFieldControlDescribedBy]',
	host: {
		'[attr.aria-describedby]': '_computedDescribedBy()',
	},
})
export class HlmFieldControlDescribedBy {
	public readonly describedBy = input<string | null>(null, { alias: 'aria-describedby' });
	private readonly _a11y = inject(HlmFieldA11yService, { optional: true });

	protected readonly _computedDescribedBy = computed(() => {
		const manual = this.describedBy();
		const manualList = manual ? manual.split(/\s+/).filter(Boolean) : [];
		const fieldIds = this._a11y?.describedBy() ?? null;
		const fieldList = fieldIds ? fieldIds.split(/\s+/).filter(Boolean) : [];

		const combined = [...new Set([...manualList, ...fieldList])];
		return combined.length ? combined.join(' ') : null;
	});
}
