import { Directive, ElementRef, afterEveryRender, afterNextRender, computed, inject, input, signal } from '@angular/core';
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
		// The fallback mutates display styles to measure hidden content, so keep it out of the recurring read phase.
		afterNextRender({
			mixedReadWrite: () => this._measureAndSetDimensions({ allowDisplayFallback: true }),
		});
		afterEveryRender({
			read: () => this._measureAndSetDimensions(),
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
}
