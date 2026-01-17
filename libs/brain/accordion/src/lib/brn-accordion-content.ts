import { isPlatformBrowser } from '@angular/common';
import {
	DestroyRef,
	Directive,
	ElementRef,
	NgZone,
	PLATFORM_ID,
	afterNextRender,
	computed,
	inject,
	input,
	signal,
} from '@angular/core';
import { measureDimensions } from '@spartan-ng/brain/core';
import { injectBrnAccordionConfig, injectBrnAccordionItem } from './brn-accordion-token';

@Directive({
	selector: 'brn-accordion-content,[brnAccordionContent]',
	host: {
		'[attr.data-state]': 'state?.()',
		'[attr.aria-labelledby]': 'ariaLabeledBy',
		role: 'region',
		'[id]': 'id',
		'[style.--brn-accordion-content-width.px]': '_width()',
		'[style.--brn-accordion-content-height.px]': '_height()',
		'[attr.inert]': '_inert()',
		'[attr.style]': 'style()',
	},
})
export class BrnAccordionContent {
	private readonly _config = injectBrnAccordionConfig();
	private readonly _item = injectBrnAccordionItem();
	private readonly _elementRef = inject(ElementRef);
	private readonly _destroyRef = inject(DestroyRef);
	private readonly _ngZone = inject(NgZone);
	private readonly _platformId = inject(PLATFORM_ID);

	protected readonly _width = signal<number | null>(null);
	protected readonly _height = signal<number | null>(null);
	protected readonly _inert = computed(() => (this.state?.() === 'closed' ? true : undefined));

	public readonly state = this._item?.state;
	public readonly id = `brn-accordion-content-${this._item?.id}`;
	public readonly ariaLabeledBy = `brn-accordion-trigger-${this._item?.id}`;
	/**
	 * The style to be applied to the host element after the dimensions are calculated.
	 * @default 'overflow: hidden'
	 */
	public readonly style = input<string>('overflow: hidden');

	constructor() {
		if (!this._item) {
			throw Error('Accordion Content can only be used inside an AccordionItem. Add brnAccordionItem to parent.');
		}
		afterNextRender(() => {
			const hasValidDimensions = this._measureAndSetDimensions();
			if (!hasValidDimensions) {
				this._setupVisibilityObserver();
			}
		});
	}

	private _measureAndSetDimensions(): boolean {
		const content = this._elementRef.nativeElement.firstChild as HTMLElement | null;
		if (!content) return false;

		const { width, height } = measureDimensions(content, this._config.measurementDisplay);
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
