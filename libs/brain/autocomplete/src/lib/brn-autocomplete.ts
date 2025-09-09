import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import {
	computed,
	contentChild,
	contentChildren,
	Directive,
	effect,
	inject,
	Injector,
	input,
	output,
	untracked,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BrnPopover } from '@spartan-ng/brain/popover';
import { BrnAutocompleteItem } from './brn-autocomplete-item';
import { BrnAutocompleteItemToken } from './brn-autocomplete-item.token';
import { BrnAutocompleteSearchInput } from './brn-autocomplete-search-input';
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

	/** @internal The search query */
	public readonly search = computed(() => this._searchInput()?.valueState() ?? '');

	/** Access the popover if present */
	private readonly _brnPopover = inject(BrnPopover, { optional: true });

	/** Access the search input if present */
	private readonly _searchInput = contentChild(BrnAutocompleteSearchInput, {
		descendants: true,
	});

	/** @internal Access all the items within the autocomplete */
	public readonly items = contentChildren<BrnAutocompleteItem<T>>(BrnAutocompleteItemToken, {
		descendants: true,
	});

	/** @internal The key manager for managing active descendant */
	public readonly keyManager = new ActiveDescendantKeyManager(this.items, this._injector);

	constructor() {
		this.keyManager
			.withVerticalOrientation()
			.withHomeAndEnd()
			.withWrap()
			.skipPredicate((item) => item.disabled);

		effect(() => {
			const items = this.items();

			untracked(() => {
				const activeItem = this.keyManager.activeItem;
				if (!activeItem || !items.includes(activeItem) || items[0] !== activeItem) {
					this.keyManager.setFirstItemActive();
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
}
