import {
	Directive,
	effect,
	ElementRef,
	forwardRef,
	Inject,
	input,
	linkedSignal,
	Optional,
	Renderer2,
	signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { COMPOSITION_BUFFER_MODE, DefaultValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { startWith } from 'rxjs/operators';
import { provideBrnAutocompleteSearchInput } from './brn-autocomplete-search-input.token';
import { injectBrnAutocomplete } from './brn-autocomplete.token';

@Directive({
	selector: 'input[brnAutocompleteSearchInput]',
	providers: [
		provideBrnAutocompleteSearchInput(BrnAutocompleteSearchInput),
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => BrnAutocompleteSearchInput),
			multi: true,
		},
	],
	host: {
		role: 'combobox',
		'aria-autocomplete': 'list',
		'[attr.aria-activedescendant]': '_activeDescendant()',
		'[attr.aria-expanded]': '_isExpanded()',
		'(keydown)': 'onKeyDown($event)',
		'(input)': 'onInput()',
	},
})
export class BrnAutocompleteSearchInput extends DefaultValueAccessor {
	private readonly _autocomplete = injectBrnAutocomplete();

	/** The initial value of the search input */
	public readonly value = input<string>('');

	/** @internal The "real" value of the search input */
	public readonly valueState = linkedSignal(() => this.value());

	protected readonly _isExpanded = this._autocomplete.isExpanded;

	/** The id of the active option */
	protected readonly _activeDescendant = signal<string | undefined>(undefined);

	constructor(
		renderer: Renderer2,
		private readonly elementRef: ElementRef,
		@Optional() @Inject(COMPOSITION_BUFFER_MODE) compositionMode: boolean,
	) {
		super(renderer, elementRef, compositionMode);
		this._autocomplete.keyManager.change
			.pipe(startWith(this._autocomplete.keyManager.activeItemIndex), takeUntilDestroyed())
			.subscribe(() => this._activeDescendant.set(this._autocomplete.keyManager.activeItem?.id()));

		effect(() => {
			this.elementRef.nativeElement.value = this.valueState();
		});
	}
	/** Listen for changes to the input value */
	protected onInput(): void {
		this.valueState.set(this.elementRef.nativeElement.value);
	}

	/** Listen for keydown events */
	protected onKeyDown(event: KeyboardEvent): void {
		this._autocomplete.keyManager.onKeydown(event);
	}

	/** CONROL VALUE ACCESSOR */
	override writeValue(value: string | null): void {
		super.writeValue(value);
		if (value) {
			this.valueState.set(value);
		}
	}
}
