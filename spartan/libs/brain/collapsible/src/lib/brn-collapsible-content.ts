import { Directive, ElementRef, afterNextRender, effect, inject, input, signal, untracked, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { measureDimensions } from '@spartan-ng/brain/core';
import { injectBrnCollapsible, injectBrnCollapsibleConfig } from './brn-collapsible-token';

@Directive({
	selector: '[brnCollapsibleContent],brn-collapsible-content',
	host: {
		'[attr.inert]': "_collapsible?.state() === 'closed' ? true : undefined",
		'[attr.data-state]': '_collapsible?.state()',
		'[id]': '_collapsible?.contentId()',
		'[style.--brn-collapsible-content-width.px]': '_width()',
		'[style.--brn-collapsible-content-height.px]': '_height()',
	},
})
export class BrnCollapsibleContent {
	private readonly _config = injectBrnCollapsibleConfig();
	private readonly _elementRef = inject<ElementRef>(ElementRef);
	private readonly _platformId = inject(PLATFORM_ID);
	protected readonly _collapsible = injectBrnCollapsible();

	protected readonly _width = signal<number | null>(null);
	protected readonly _height = signal<number | null>(null);

	/**
	 * The id of the collapsible content element.
	 */
	public readonly id = input<string | null | undefined>();

	constructor() {
		if (!this._collapsible) {
			throw Error('Collapsible trigger directive can only be used inside a brn-collapsible element.');
		}

		effect(() => {
			const id = this.id();
			const collapsible = this._collapsible;
			if (!id || !collapsible) return;
			untracked(() => collapsible.contentId.set(id));
		});

		// defer DOM reads until after render and only on the browser to avoid SSR/timing issues
		afterNextRender(() => {
			if (!isPlatformBrowser(this._platformId)) return;

			try {
				const hostEl = this._elementRef.nativeElement as HTMLElement | null;
				if (!hostEl) return;

				// prefer the firstElementChild (ignore text/comment nodes), fallback to hostEl
				const contentEl = (hostEl.firstElementChild as HTMLElement | null) ?? hostEl;
				if (!contentEl || !(contentEl instanceof HTMLElement)) return;

				const { width, height } = measureDimensions(contentEl, this._config.measurementDisplay);
				this._width.set(width);
				this._height.set(height);
			} catch {
				// swallow runtime DOM errors to avoid breaking consumers
			}
		});
	}
}
