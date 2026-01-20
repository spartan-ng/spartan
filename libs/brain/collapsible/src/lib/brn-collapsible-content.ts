import { isPlatformBrowser } from '@angular/common';
import {
	DestroyRef,
	Directive,
	ElementRef,
	NgZone,
	PLATFORM_ID,
	afterNextRender,
	effect,
	inject,
	input,
	signal,
	untracked,
} from '@angular/core';
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
	private readonly _destroyRef = inject(DestroyRef);
	private readonly _ngZone = inject(NgZone);
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

		afterNextRender(() => {
			const hasValidDimensions = this._measureAndSetDimensions();
			if (!hasValidDimensions) {
				this._setupVisibilityObserver();
			}
		});
	}

	private _measureAndSetDimensions(): boolean {
		const { width, height } = measureDimensions(this._elementRef.nativeElement, this._config.measurementDisplay);
		this._width.set(width);
		this._height.set(height);

		return width > 0 && height > 0;
	}

	private _setupVisibilityObserver(): void {
		if (!isPlatformBrowser(this._platformId)) return;
		if (typeof IntersectionObserver === 'undefined') return;

		this._ngZone.runOutsideAngular(() => {
			const observer = new IntersectionObserver(
				(entries) => {
					if (entries[0].isIntersecting) {
						this._ngZone.run(() => {
							if (this._measureAndSetDimensions()) {
								observer.disconnect();
							}
						});
					}
				},
				{ root: null, threshold: 0 },
			);

			observer.observe(this._elementRef.nativeElement);
			this._destroyRef.onDestroy(() => observer.disconnect());
		});
	}
}
