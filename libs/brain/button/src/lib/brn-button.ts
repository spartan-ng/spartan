import { booleanAttribute, Directive, ElementRef, inject, input, NgZone, OnDestroy, Renderer2 } from '@angular/core';

@Directive({
	selector: 'a[brnButton], button[brnButton]',
	host: {
		'[attr.tabindex]': 'disabled() ? -1 : undefined',
		'[attr.disabled]': 'disabled() || null',
		'[class.disabled]': 'disabled() || null',
	},
})
export class BrnButton implements OnDestroy {
	public readonly disabled = input(false, { transform: booleanAttribute });

	private readonly _ngZone = inject(NgZone);
	private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
	private readonly _renderer = inject(Renderer2);

	private readonly _cleanupClick: (() => void) | undefined;

	constructor() {
		const element = this._elementRef.nativeElement;
		if (element.tagName === 'A')
			this._cleanupClick = this._ngZone.runOutsideAngular(() =>
				this._renderer.listen(element, 'click', (event: Event) => {
					if (this.disabled()) {
						event.preventDefault();
						event.stopImmediatePropagation();
					}
				}),
			);
	}

	public ngOnDestroy(): void {
		this._cleanupClick?.();
	}
}
