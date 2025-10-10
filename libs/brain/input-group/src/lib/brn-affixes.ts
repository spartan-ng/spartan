import { NumberInput } from '@angular/cdk/coercion';
import { computed, Directive, ElementRef, inject, input, numberAttribute } from '@angular/core';

@Directive({
	host: {
		'[attr.tabindex]': '_tabindex()',
	},
})
export class BrnAffixes {
	private readonly _el = inject(ElementRef);
	protected readonly _isButton =
		this._el.nativeElement.tagName === 'BUTTON' || this._el.nativeElement.getAttribute('role') === 'button';

	/**
	 * Keyboard tab order for switch.
	 * @default undefined
	 */
	public readonly tabindex = input<number, NumberInput>(undefined, { transform: numberAttribute });
	protected readonly _tabindex = computed(() => {
		const index = this.tabindex();
		if (index !== undefined) return index;
		return this._isButton ? -1 : undefined;
	});
}
