import { Directive, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { startWith } from 'rxjs/operators';
import { injectBrnAutocomplete } from './brn-autocomplete.token';

@Directive({
	selector: 'input[brnAutocompleteSearchInput]',
	host: {
		role: 'combobox',
		'aria-autocomplete': 'list',
		'[attr.aria-activedescendant]': '_activeDescendant()',
		'[attr.aria-expanded]': '_isExpanded()',
		'(keydown)': 'onKeyDown($event)',
	},
})
export class BrnAutocompleteSearchInput {
	private readonly _autocomplete = injectBrnAutocomplete();

	/** Whether the autocomplete panel is expanded */
	protected readonly _isExpanded = this._autocomplete.isExpanded;

	/** The id of the active option */
	protected readonly _activeDescendant = signal<string | undefined>(undefined);

	constructor() {
		this._autocomplete.keyManager.change
			.pipe(startWith(this._autocomplete.keyManager.activeItemIndex), takeUntilDestroyed())
			.subscribe(() => {
				this._activeDescendant.set(this._autocomplete.keyManager.activeItem?.id());
			});
	}

	/** Listen for keydown events */
	protected onKeyDown(event: KeyboardEvent): void {
		if (event.key === 'Enter') {
			// prevent form submission if inside a form
			event.preventDefault();
		}

		if (!this._isExpanded()) {
			if (event.key === 'ArrowDown') {
				this._autocomplete.open('first');
			}

			if (event.key === 'ArrowUp') {
				this._autocomplete.open('last');
			}

			if (event.key === 'Escape') {
				this._autocomplete.selectionCleared.emit();
			}
		}

		this._autocomplete.keyManager.onKeydown(event);
	}
}
