import type { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, computed, Directive, effect, ElementRef, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { injectElementSize } from '@spartan-ng/brain/core';
import { BrnOverlay } from '@spartan-ng/brain/overlay';
import { startWith } from 'rxjs/operators';
import { injectBrnSelectBase } from './brn-select.token';

@Directive({
	selector: 'button[brnSelectTrigger]',
	host: {
		role: 'combobox',
		'aria-haspopup': 'listbox',
		type: 'button',
		'[id]': 'id()',
		'[attr.aria-expanded]': '_isExpanded()',
		'[attr.aria-controls]': '_isExpanded() ? _listId() : null',
		'[attr.aria-activedescendant]': '_isExpanded() ? _activeDescendant() : null',
		'[attr.data-placeholder]': '_isPlaceholder() ? "" : null',
		'[disabled]': '_disabled()',
		'[attr.aria-invalid]': '_invalid?.() ? "true" : null',
		'[attr.data-dirty]': '_dirty?.() ? "true": null',
		'[attr.data-touched]': '_touched?.() ? "true" : null',
		'[attr.data-matches-spartan-invalid]': '_spartanInvalid?.() ? "true" : null',
		'(click)': 'toggle()',
		'(keydown)': 'onKeyDown($event)',
	},
})
export class BrnSelectTrigger {
	private static _id = 0;

	private readonly _host = inject(ElementRef, { host: true });
	private readonly _brnOverlay = inject(BrnOverlay, { optional: true });

	private readonly _select = injectBrnSelectBase();

	private readonly _elementSize = injectElementSize();

	public readonly id = input<string>(`brn-select-trigger-${++BrnSelectTrigger._id}`);

	/** Whether to force the trigger into an invalid state. */
	public readonly forceInvalid = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	protected readonly _activeDescendant = signal<string | undefined>(undefined);

	/** Whether the combobox panel is expanded */
	protected readonly _isExpanded = this._select.isExpanded;

	/** The id of the select list, used for aria-controls. */
	protected readonly _listId = this._select.listId;

	protected readonly _disabled = this._select.disabledState;

	protected readonly _isPlaceholder = computed(() => !this._select.hasValue());

	protected readonly _invalid = computed(() => this._select?.controlState?.()?.invalid);
	protected readonly _touched = computed(() => this._select?.controlState?.()?.touched);
	protected readonly _dirty = computed(() => this._select?.controlState?.()?.dirty);
	protected readonly _spartanInvalid = computed(
		() => this.forceInvalid() || this._select?.controlState?.()?.spartanInvalid,
	);

	constructor() {
		this._select.registerSelectTrigger(this);

		this._brnOverlay?.setOrigin(this._host.nativeElement);

		this._select.keyManager.change
			.pipe(startWith(this._select.keyManager.activeItemIndex), takeUntilDestroyed())
			.subscribe(() => {
				this._activeDescendant.set(this._select.keyManager.activeItem?.id());
			});

		effect(() => {
			const size = this._elementSize();
			if (!size) return;

			this._select.updateTriggerWidth(size.width);
			this._brnOverlay?.updatePosition();
		});
	}

	protected toggle() {
		this._select.toggle();
	}

	protected open() {
		this._brnOverlay?.open();
	}

	/** Listen for keydown events */
	protected onKeyDown(event: KeyboardEvent): void {
		// Capture the expansion state up-front. Committing a value (Enter/Space while open)
		// closes the panel synchronously, so re-reading the state afterwards would report
		// the panel as closed and re-open it on the same keypress.
		const isExpanded = this._isExpanded();

		if (isExpanded && (event.key === 'Enter' || event.key === ' ')) {
			// Enter would submit an enclosing form and Space would trigger the native button
			// activation on keyup (click -> toggle()), undoing the commit that happens below.
			event.preventDefault();

			this._select.selectActiveItem();
			return;
		}

		if (isExpanded && event.key === 'Tab') {
			// Tab moves focus to the next control. Dismiss the panel without committing so it
			// is not left open with nothing focused inside it; the browser performs the focus
			// move, so the default action must not be prevented.
			this._select.close();
			return;
		}

		if (!isExpanded && (event.key === 'Enter' || event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
			// prevent form submission if inside a form
			if (event.key === 'Enter') {
				event.preventDefault();
			}

			this._select.open();
		}

		this._select.keyManager.onKeydown(event);
	}
}
