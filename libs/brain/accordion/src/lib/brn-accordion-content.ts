import { Directive, ElementRef, afterNextRender, computed, inject, input, linkedSignal, signal } from '@angular/core';
import { BrnAccordionItem } from './brn-accordion';

@Directive({
	selector: 'brn-accordion-content,[brnAccordionContent]',
	host: {
		'[attr.data-state]': 'state()',
		'[attr.aria-labelledby]': 'ariaLabeledBy',
		role: 'region',
		'[id]': 'id',
		'[style.--brn-accordion-content-width.px]': '_width()',
		'[style.--brn-accordion-content-height.px]': '_height()',
		'[attr.inert]': '_inert()',
		'[attr.style]': '_mutableStyle()',
	},
})
export class BrnAccordionContent {
	private readonly _item = inject(BrnAccordionItem);
	private readonly _elementRef = inject(ElementRef);

	protected readonly _width = signal<number | null>(null);
	protected readonly _height = signal<number | null>(null);
	protected readonly _dimensionsInitiated = signal(false);
	protected readonly _inert = computed(() => (this.state() === 'closed' ? true : undefined));

	public readonly state = this._item.state;
	public readonly id = `brn-accordion-content-${this._item.id}`;
	public readonly ariaLabeledBy = `brn-accordion-trigger-${this._item.id}`;
	/**
	 * The style to be applied to the host element after the dimensions are calculated.
	 * @default 'overflow: hidden'
	 */
	public readonly style = input<string>('overflow: hidden');
	/**
	 * The style to be applied to the host element while the dimensions are being calculated.
	 * @default 'opacity: 0'
	 */
	public readonly styleWhileDimensionsAreInitiating = input<string>('overflow: hidden');
	protected readonly _mutableStyle = linkedSignal(() =>
		this._dimensionsInitiated() ? this.style() : this.styleWhileDimensionsAreInitiating(),
	);

	constructor() {
		if (!this._item) {
			throw Error('Accordion Content can only be used inside an AccordionItem. Add brnAccordionItem to parent.');
		}
		afterNextRender(() => {
			const content = this._elementRef.nativeElement.firstChild as HTMLElement | null;
			if (!content) return;
			const { width, height } = content.getBoundingClientRect();
			this._width.set(width);
			this._height.set(height);
			this._dimensionsInitiated.set(true);
		});
	}
}
