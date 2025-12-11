import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import {
	computed,
	contentChildren,
	Directive,
	effect,
	inject,
	Injector,
	input,
	output,
	signal,
	untracked,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BrnPopover } from '@spartan-ng/brain/popover';
import type { BrnAutocompleteItem } from './brn-autocomplete-item';
import { BrnAutocompleteItemToken } from './brn-autocomplete-item.token';
import { provideBrnAutocomplete } from './brn-autocomplete.token';

@Directive({
	selector: '[brnAutocomplete]',
	providers: [provideBrnAutocomplete(BrnAutocomplete)],
	host: {
		'[id]': 'id()',
		'(keydown.enter)': 'selectActiveItem()',
	},
})
export class BrnAutocomplete<T> {
	private static _id = 0;

	private readonly _injector = inject(Injector);

	/** The id of the autocomplete */
	public readonly id = input<string>(`brn-autocomplete-${++BrnAutocomplete._id}`);

	/** when the selection has changed */
	public readonly valueChange = output<T>();

	/** when the selection has been cleared */
	public readonly selectionCleared = output<void>();

	/** Access the popover if present */
	private readonly _brnPopover = inject(BrnPopover, { optional: true });

	/** @internal The focus strategy when opening */
	private readonly _focus = signal<'first' | 'last'>('first');

	/** @internal Access all the items within the autocomplete */
	public readonly items = contentChildren<BrnAutocompleteItem<T>>(BrnAutocompleteItemToken, {
		descendants: true,
	});

	/** @internal The key manager for managing active descendant */
	public readonly keyManager = new ActiveDescendantKeyManager(this.items, this._injector);

	/** @internal Whether the autocomplete is expanded */
	public readonly isExpanded = computed(() => this._brnPopover?.stateComputed() === 'open');

	constructor() {
		this.keyManager
			.withVerticalOrientation()
			.withHomeAndEnd()
			.withWrap()
			.skipPredicate((item) => item.disabled);

		effect(() => {
			const items = this.items();
			const focus = this._focus();

			untracked(() => {
				if (!items.length) return;

				const activeItem = this.keyManager.activeItem;

				if (!activeItem || !items.includes(activeItem)) {
					focus === 'first' ? this.keyManager.setFirstItemActive() : this.keyManager.setLastItemActive();
				}
			});
		});

		this.keyManager.change.pipe(takeUntilDestroyed()).subscribe(() => {
			const value = this.keyManager.activeItem?.value();
			if (value) {
				this.valueChange.emit(value);
			}
		});
	}

	protected selectActiveItem(): void {
		if (this._brnPopover?.stateComputed() === 'open') {
			this.keyManager.activeItem?.selected.emit();
		}
	}

	open(focus: 'first' | 'last' = 'first') {
		this._brnPopover?.open();
		this._focus.set(focus);
	}

	close() {
		this._brnPopover?.close();
	}

	toggle() {
		this.isExpanded() ? this.close() : this.open();
	}
}
