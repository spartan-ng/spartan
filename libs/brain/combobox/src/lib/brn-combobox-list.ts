import { afterNextRender, Directive, ElementRef, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { injectBrnComboboxBase } from './brn-combobox.token';

@Directive({
	selector: '[brnComboboxList]',
	host: {
		role: 'listbox',
		tabIndex: '-1',
		'aria-orientation': 'vertical',
		'[id]': 'id()',
		'[attr.data-empty]': '!_visibleItems() ? "" : null',
		'(scroll)': 'handleScroll()',
		'(mouseenter)': 'handleScroll()',
	},
})
export class BrnComboboxList {
	private static _id = 0;

	private readonly _combobox = injectBrnComboboxBase();

	/** Determine if the combobox has any visible items */
	protected readonly _visibleItems = this._combobox.visibleItems;

	/** The id of the combobox list */
	public readonly id = input<string>(`brn-combobox-list-${++BrnComboboxList._id}`);

	private readonly _el = inject(ElementRef);

	public readonly canScrollUp = signal(false);
	public readonly canScrollDown = signal(false);

	constructor() {
		fromEvent<WheelEvent>(document, 'wheel', { passive: false })
			.pipe(takeUntilDestroyed())
			.subscribe((event) => {
				if (this._combobox.isExpanded()) {
					this._el.nativeElement.scrollTop += event.deltaY;
					this.handleScroll();
					event.preventDefault();
				}
			});

		afterNextRender(() => {
			this.handleScroll();
		});
	}

	public handleScroll(): void {
		const { scrollTop, scrollHeight, clientHeight } = this._el.nativeElement;
		this.canScrollUp.set(scrollTop > 0);
		const maxScroll = scrollHeight - clientHeight;
		this.canScrollDown.set(Math.ceil(scrollTop) < maxScroll);
	}

	public moveFocusUp(): void {
		this._el.nativeElement.scrollBy({ top: -100, behavior: 'smooth' });
	}

	public moveFocusDown(): void {
		this._el.nativeElement.scrollBy({ top: 100, behavior: 'smooth' });
	}
}
