import { DestroyRef, Directive, ElementRef, NgZone, afterNextRender, computed, inject, input, signal } from '@angular/core';
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
	private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
	private readonly _destroyRef = inject(DestroyRef);
	private readonly _ngZone = inject(NgZone);
	private _resizeObserver: ResizeObserver | null = null;
	private _mutationObserver: MutationObserver | null = null;
	private readonly _observedElements = new Set<Element>();
	private _measurementFrame = 0;

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
		afterNextRender({
			mixedReadWrite: () => {
				this._measureAndSetDimensions({ allowDisplayFallback: true });
				this._setupResizeObserver();
			},
		});
	}

	private _measureAndSetDimensions(options: { allowDisplayFallback?: boolean } = {}): void {
		const element = this._elementRef.nativeElement;
		let width = element.scrollWidth;
		let height = element.scrollHeight;

		if (width === 0 && height === 0) {
			if (options.allowDisplayFallback) {
				const elementToMeasure = (element.firstElementChild as HTMLElement | null) ?? element;
				({ width, height } = measureDimensions(elementToMeasure, this._config.measurementDisplay));
			} else if (element.getClientRects().length === 0) {
				return;
			}
		}

		if (width !== this._width()) {
			this._width.set(width);
		}
		if (height !== this._height()) {
			this._height.set(height);
		}
	}

	private _setupResizeObserver(): void {
		if (typeof ResizeObserver === 'undefined') return;

		const element = this._elementRef.nativeElement;

		this._ngZone.runOutsideAngular(() => {
			this._resizeObserver = new ResizeObserver(() => this._queueMeasurement());
			this._observeContentElements();

			if (typeof MutationObserver !== 'undefined') {
				this._mutationObserver = new MutationObserver((records) => {
					if (records.some((record) => record.target === element && record.type === 'childList')) {
						this._observeContentElements();
					}
					this._queueMeasurement();
				});
				this._mutationObserver.observe(element, { childList: true, characterData: true, subtree: true });
			}

			this._destroyRef.onDestroy(() => {
				this._resizeObserver?.disconnect();
				this._mutationObserver?.disconnect();
				if (this._measurementFrame) {
					cancelAnimationFrame(this._measurementFrame);
				}
			});
		});
	}

	private _observeContentElements(): void {
		if (!this._resizeObserver) return;

		for (const observedElement of this._observedElements) {
			this._resizeObserver.unobserve(observedElement);
		}
		this._observedElements.clear();

		const element = this._elementRef.nativeElement;
		const elementsToObserve = element.children.length > 0 ? Array.from(element.children) : [element];

		for (const elementToObserve of elementsToObserve) {
			this._resizeObserver.observe(elementToObserve);
			this._observedElements.add(elementToObserve);
		}
	}

	private _queueMeasurement(): void {
		if (this._measurementFrame) return;

		this._measurementFrame = requestAnimationFrame(() => {
			this._measurementFrame = 0;
			this._ngZone.run(() => this._measureAndSetDimensions());
		});
	}
}
