import {
	DestroyRef,
	Directive,
	effect,
	ElementRef,
	forwardRef,
	inject,
	Injector,
	input,
	linkedSignal,
	OnInit,
	signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DefaultValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
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
export class BrnAutocompleteSearchInput extends DefaultValueAccessor implements OnInit {
	private readonly _el = inject(ElementRef<HTMLInputElement>);
	private readonly _destroyRef = inject(DestroyRef);
	private readonly _injector = inject(Injector);
	private readonly _autocomplete = injectBrnAutocomplete();

	/** The initial value of the search input */
	public readonly value = input<string>('');

	/** @internal The "real" value of the search input */
	public readonly valueState = linkedSignal(() => this.value());

	protected readonly _isExpanded = this._autocomplete.isExpanded;

	/** The id of the active option */
	protected readonly _activeDescendant = signal<string | undefined>(undefined);

	ngOnInit(): void {
		this._autocomplete.keyManager.change
			.pipe(startWith(this._autocomplete.keyManager.activeItemIndex), takeUntilDestroyed(this._destroyRef))
			.subscribe(() => this._activeDescendant.set(this._autocomplete.keyManager.activeItem?.id()));

		effect(
			() => {
				this._el.nativeElement.value = this.valueState();
			},
			{ injector: this._injector },
		);
	}

	/** Listen for changes to the input value */
	protected onInput(): void {
		this.valueState.set(this._el.nativeElement.value);
	}

	/** Listen for keydown events */
	protected onKeyDown(event: KeyboardEvent): void {
		if (event.key === 'Enter') {
			// prevent form submission if inside a form
			event.preventDefault();
		}

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
