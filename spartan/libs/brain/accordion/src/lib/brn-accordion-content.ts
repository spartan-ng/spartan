import { Directive, ElementRef, afterNextRender, computed, inject, input, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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
			// avoid DOM access on server and ensure we read an element node (not text/comment)
			if (!isPlatformBrowser(this._platformId)) return;

			const hostEl = this._elementRef.nativeElement as HTMLElement | null;
			if (!hostEl) return;

			// use firstElementChild to avoid text/comment nodes and ensure an HTMLElement
			const content = hostEl.firstElementChild as HTMLElement | null;
			if (!content || !(content instanceof HTMLElement)) return;

			const { width, height } = measureDimensions(content, this._config.measurementDisplay);
			this._width.set(width);
			this._height.set(height);
		});
	}
}
