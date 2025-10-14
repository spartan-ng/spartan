import { isPlatformServer } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	OnInit,
	PLATFORM_ID,
	ViewEncapsulation,
	computed,
	inject,
	input,
	linkedSignal,
	signal,
} from '@angular/core';
import type { CustomElementClassSettable } from '@spartan-ng/brain/core';
import type { ClassValue } from 'clsx';
import { BrnAccordionItem } from './brn-accordion';

@Component({
	selector: 'brn-accordion-content',
	host: {
		'[attr.data-state]': 'state()',
		'[attr.aria-labelledby]': 'ariaLabeledBy',
		role: 'region',
		'[id]': 'id',
		'[style.--brn-accordion-content-width.px]': '_width()',
		'[style.--brn-accordion-content-height.px]': '_height()',
		'[attr.inert]': '_addInert() ? true : undefined',
		'[attr.style]': '_mutableContentStyle() ?? "opacity: 0;"',
	},
	template: `
		<p [class]="_mutableContentClass()">
			<ng-content />
		</p>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
})
export class BrnAccordionContent implements OnInit, CustomElementClassSettable {
	private readonly _item = inject(BrnAccordionItem);
	private readonly _elementRef = inject(ElementRef);
	private readonly _platformId = inject(PLATFORM_ID);

	public readonly state = this._item.state;
	public readonly id = `brn-accordion-content-${this._item.id}`;
	public readonly ariaLabeledBy = `brn-accordion-trigger-${this._item.id}`;
	protected readonly _width = signal<number | null>(null);
	protected readonly _height = signal<number | null>(null);
	protected readonly _dimensionsInitiated = signal(false);

	protected readonly _addInert = computed(() => (this.state() === 'closed' ? true : undefined));
	/**
	 * The class to be applied to the content element.
	 */
	public readonly contentClass = input<ClassValue>('');

	protected readonly _mutableContentClass = linkedSignal(() => this.contentClass());

	/**
	 * The style to be applied to the content element.
	 */
	public readonly contentStyle = input<string>('overflow: hidden;');
	protected readonly _mutableContentStyle = linkedSignal(() =>
		this._dimensionsInitiated() ? this.contentStyle() : undefined,
	);

	constructor() {
		if (!this._item) {
			throw Error('Accordion Content can only be used inside an AccordionItem. Add brnAccordionItem to parent.');
		}
	}

	ngOnInit() {
		if (isPlatformServer(this._platformId)) {
			return;
		}
		const content = this._elementRef.nativeElement.firstChild as HTMLElement | null;
		if (!content) return;
		const { width, height } = content.getBoundingClientRect();
		this._width.set(width);
		this._height.set(height);
		this._dimensionsInitiated.set(true);
	}
	public setClassToCustomElement(classes: ClassValue) {
		this._mutableContentClass.set(classes);
	}
}
