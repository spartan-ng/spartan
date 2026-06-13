import type { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, computed, Directive, effect, ElementRef, inject, input } from '@angular/core';
import { injectElementSize } from '@spartan-ng/brain/core';
import { BrnOverlay } from '@spartan-ng/brain/overlay';
import { injectBrnSelectBase } from './brn-select.token';

@Directive({
	selector: 'button[brnSelectTrigger]',
	host: {
		role: 'combobox',
		'aria-haspopup': 'listbox',
		type: 'button',
		'[id]': 'id()',
		'[attr.aria-expanded]': '_isExpanded()',
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

	/** Whether the combobox panel is expanded */
	protected readonly _isExpanded = this._select.isExpanded;

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
		if (event.key === 'Enter') {
			// prevent form submission if inside a form
			event.preventDefault();

			this._select.selectActiveItem();
		}

		if (event.key === 'Tab' && this._isExpanded()) {
			this._select.selectActiveItem();
			return;
		}

		if (this._isExpanded()) {
			if (event.key === 'Tab') {
				this._select.selectActiveItem();
			}
		} else {
			if (event.key === 'Enter' || event.key === 'ArrowDown' || event.key === 'ArrowUp') {
				this._select.open();
			}
		}

		this._select.keyManager.onKeydown(event);
	}
}
