import {
	type AfterViewChecked,
	ChangeDetectorRef,
	computed,
	Directive,
	effect,
	ElementRef,
	forwardRef,
	inject,
	Inject,
	input,
	linkedSignal,
	type OnInit,
	Optional,
	Renderer2,
	signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
	COMPOSITION_BUFFER_MODE,
	DefaultValueAccessor,
	FormGroupDirective,
	NG_VALUE_ACCESSOR,
	NgControl,
	NgForm,
} from '@angular/forms';
import { BrnFormFieldControl } from '@spartan-ng/brain/form-field';
import { ErrorStateMatcher, ErrorStateTracker } from '@spartan-ng/brain/forms';
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
		{
			provide: BrnFormFieldControl,
			useExisting: forwardRef(() => BrnAutocompleteSearchInput),
		},
	],
	host: {
		role: 'combobox',
		'aria-autocomplete': 'list',
		'[attr.aria-activedescendant]': '_activeDescendant()',
		'[attr.aria-describedby]': 'ariaDescribedBy || null',
		'(keydown)': 'onKeyDown($event)',
		'(input)': 'onInput()',
	},
})
export class BrnAutocompleteSearchInput extends DefaultValueAccessor implements BrnFormFieldControl, OnInit, AfterViewChecked {
	private readonly _cdRef = inject(ChangeDetectorRef);
	private readonly _autocomplete = injectBrnAutocomplete();

	// Form field control implementation
	private readonly _errorStateTracker: ErrorStateTracker;
	private readonly _defaultErrorStateMatcher = inject(ErrorStateMatcher);
	private readonly _parentForm = inject(NgForm, { optional: true });
	private readonly _parentFormGroup = inject(FormGroupDirective, { optional: true });
	public readonly ngControl = inject(NgControl, { optional: true });

	public readonly id = input<string>('');
	public readonly required = computed(() => this.ngControl?.hasError('required') ?? false);
	public readonly disabled = computed(() => this.ngControl?.disabled ?? false);
	public readonly errorState = computed(() => this._errorStateTracker.errorState());

	public ariaDescribedBy = '';

	public setAriaDescribedBy(ids: string) {
		this.ariaDescribedBy = ids;
		this._cdRef.markForCheck();
	}

	/** The initial value of the search input */
	public readonly value = input<string>('');

	/** @internal The "real" value of the search input */
	public readonly valueState = linkedSignal(() => this.value());

	/** The id of the active option */
	protected readonly _activeDescendant = signal<string | undefined>(undefined);

	constructor(
		renderer: Renderer2,
		private readonly elementRef: ElementRef,
		@Optional() @Inject(COMPOSITION_BUFFER_MODE) compositionMode: boolean,
	) {
		super(renderer, elementRef, compositionMode);

		// Initialize error state tracker
		this._errorStateTracker = new ErrorStateTracker(
			this._defaultErrorStateMatcher,
			this.ngControl,
			this._parentFormGroup,
			this._parentForm,
		);

		this._autocomplete.keyManager.change
			.pipe(startWith(this._autocomplete.keyManager.activeItemIndex), takeUntilDestroyed())
			.subscribe(() => this._activeDescendant.set(this._autocomplete.keyManager.activeItem?.id()));

		effect(() => {
			this.elementRef.nativeElement.value = this.valueState();
		});
	}

	ngOnInit() {
		// No subscription needed - AfterViewChecked will handle error state updates
	}

	ngAfterViewChecked() {
		this.updateErrorState();
	}

	/**
	 * Checks and updates the error state of the form control.
	 * This method should be called whenever the error state might have changed.
	 * It's called automatically via ngAfterViewChecked, but can also be called
	 * manually when needed (e.g., from parent components).
	 */
	public updateErrorState(): void {
		const oldState = this._errorStateTracker.errorState();
		this._errorStateTracker.updateErrorState();
		const newState = this._errorStateTracker.errorState();
		
		// Mark for check if error state changed to ensure OnPush components update
		if (oldState !== newState) {
			this._cdRef.markForCheck();
		}
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
