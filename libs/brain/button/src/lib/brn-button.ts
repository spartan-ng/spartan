import type { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, Directive, ElementRef, HOST_TAG_NAME, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';

@Directive({
	selector: 'a[brnButton], button[brnButton]',
	host: {
		'[attr.tabindex]': 'disabled() ? -1 : undefined',
		'[attr.disabled]': '!_isAnchor && disabled() || null',
		'[attr.data-disabled]': 'disabled() || null',
	},
})
export class BrnButton {
	public readonly disabled = input<boolean, BooleanInput>(false, { transform: booleanAttribute });
	protected readonly _isAnchor = inject(HOST_TAG_NAME) === 'a';
	private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

	constructor() {
		if (this._isAnchor) {
			fromEvent(this._elementRef.nativeElement, 'click')
				.pipe(
					filter(() => this.disabled()),
					takeUntilDestroyed(),
				)
				.subscribe((event: Event) => {
					event.preventDefault();
					event.stopImmediatePropagation();
				});
		}
	}
}
