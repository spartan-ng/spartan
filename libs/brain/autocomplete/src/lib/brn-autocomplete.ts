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
	PLATFORM_ID,
	untracked,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BrnPopover } from '@spartan-ng/brain/popover';
import { BrnAutocompleteItem } from './brn-autocomplete-item';
import { BrnAutocompleteItemToken } from './brn-autocomplete-item.token';
import { BrnAutocompleteSearchInput } from './brn-autocomplete-search-input';
import { injectBrnAutocompleteConfig, provideBrnAutocomplete } from './brn-autocomplete.token';

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

	private readonly _platform = inject(PLATFORM_ID);

	private readonly _injector = inject(Injector);

	// TODO remove not used
	private readonly _config = injectBrnAutocompleteConfig();

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

		// TODO change active to first when searchInput changes
		// When clearing the search input we also want to reset the active item to the first one
		effect(() => {
			const searchInput = this.search();
			untracked(() => {
				if (searchInput !== undefined && searchInput.length === 0) {
					this.keyManager.setFirstItemActive();
				}
			});
		});

		effect(() => {
			const state = this._brnPopover?.stateComputed();

			if (this.keyManager.activeItem === null && state === 'open') {
				// When opening the popover we want to set the active item to the first one
				this.keyManager.setFirstItemActive();
			}

			if (this.keyManager.activeItem !== null && state === 'closed') {
				this.keyManager.setActiveItem(-1);
			}
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
