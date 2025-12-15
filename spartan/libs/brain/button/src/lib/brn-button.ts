import type { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, Directive, ElementRef, HOST_TAG_NAME, inject, input, afterNextRender, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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
	private readonly _platformId = inject(PLATFORM_ID);

	constructor() {
		// Only wire up anchor click prevention in the browser and after render to avoid direct DOM access during SSR/module init.
		if (this._isAnchor && isPlatformBrowser(this._platformId)) {
			afterNextRender(() => {
				try {
					fromEvent(this._elementRef.nativeElement, 'click')
						.pipe(
							filter(() => this.disabled()),
							takeUntilDestroyed(),
						)
						.subscribe((event: Event) => {
							event.preventDefault();
							event.stopImmediatePropagation();
						});
				} catch {
					// swallow runtime DOM errors to avoid breaking consumers (keeps behavior safe)
				}
			});
		}
	}
}
