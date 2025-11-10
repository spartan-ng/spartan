import {
	Directive,
	ElementRef,
	OnDestroy,
	afterNextRender,
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
		'[hidden]': '_shouldHide()',
		'[attr.data-state]': '_collapsible?.state()',
		'[id]': '_collapsible?.contentId()',
		'[style.--brn-collapsible-content-width.px]': '_width()',
		'[style.--brn-collapsible-content-height.px]': '_height()',
	},
})
export class BrnCollapsibleContent implements OnDestroy {
	protected readonly _collapsible = injectBrnCollapsible();
	private readonly _elementRef = inject<ElementRef>(ElementRef);
	/**
	 * The id of the collapsible content element.
	 */
	public readonly id = input<string | null | undefined>();

	protected readonly _shouldHide = signal<boolean>(true);

	protected readonly _width = signal<number | null>(null);
	protected readonly _height = signal<number | null>(null);

	private _showTimeout?: ReturnType<typeof setTimeout>;
	private _hideTimeout?: ReturnType<typeof setTimeout>;

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

		effect(() => {
			const expanded = this._collapsible?.expanded() ?? false;
			const showDelay = this._collapsible?.showDelay() ?? 0;
			const hideDelay = this._collapsible?.hideDelay() ?? 0;

			if (expanded) {
				this.show(showDelay);
			} else {
				this.hide(hideDelay);
			}
		});

		afterNextRender(() => {
			// ensure the element is not hidden when measuring its size
			this._elementRef.nativeElement.hidden = false;

			const { width, height } = this._elementRef.nativeElement.getBoundingClientRect();
			this._width.set(width);
			this._height.set(height);

			// we force the element to be hidden again if collapsed after measuring its size
			// this is handled by the host binding, but it can cause a flicker if we don't do this here manually
			this._elementRef.nativeElement.hidden = !this._collapsible?.expanded();
		});
	}

	ngOnDestroy(): void {
		if (this._showTimeout) {
			clearTimeout(this._showTimeout);
		}
		if (this._hideTimeout) {
			clearTimeout(this._hideTimeout);
		}
	}

	private show(showDelay: number) {
		if (showDelay === 0) {
			this._shouldHide.set(false);
		} else {
			if (this._hideTimeout) {
				clearTimeout(this._hideTimeout);
			}

			this._showTimeout = setTimeout(() => {
				this._shouldHide.set(false);
			}, showDelay);
		}
	}

	private hide(hideDelay: number) {
		if (hideDelay === 0) {
			this._shouldHide.set(true);
		} else {
			if (this._showTimeout) {
				clearTimeout(this._showTimeout);
			}

			this._hideTimeout = setTimeout(() => {
				this._shouldHide.set(true);
			}, hideDelay);
		}
	}
}
