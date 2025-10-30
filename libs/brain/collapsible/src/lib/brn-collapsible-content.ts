import { isPlatformServer } from '@angular/common';
import {
	Directive,
	ElementRef,
	type OnInit,
	PLATFORM_ID,
	effect,
	inject,
	input,
	signal,
	untracked,
} from '@angular/core';
import { injectBrnCollapsible } from './brn-collapsible-token';

@Directive({
	selector: '[brnCollapsibleContent],brn-collapsible-content',
	host: {
		'[hidden]': '!_collapsible?.expanded()',
		'[attr.data-state]': '_collapsible?.expanded() ? "open" : "closed"',
		'[id]': '_collapsible?.contentId()',
		'[style.--brn-collapsible-content-width.px]': '_width()',
		'[style.--brn-collapsible-content-height.px]': '_height()',
	},
})
export class BrnCollapsibleContent implements OnInit {
	protected readonly _collapsible = injectBrnCollapsible();
	private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
	private readonly _platformId = inject(PLATFORM_ID);
	/**
	 * The id of the collapsible content element.
	 */
	public readonly id = input<string | null | undefined>();
	protected readonly _width = signal<number | null>(null);
	protected readonly _height = signal<number | null>(null);

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
	}

	ngOnInit(): void {
		if (isPlatformServer(this._platformId)) {
			return;
		}

		// ensure the element is not hidden when measuring its size
		this._elementRef.nativeElement.hidden = false;

		const { width, height } = this._elementRef.nativeElement.getBoundingClientRect();
		this._width.set(width);
		this._height.set(height);

		// we force the element to be hidden again if collapsed after measuring its size
		// this is handled by the host binding, but it can cause a flicker if we don't do this here manually
		this._elementRef.nativeElement.hidden = this._collapsible?.expanded() ?? false;
	}
}
