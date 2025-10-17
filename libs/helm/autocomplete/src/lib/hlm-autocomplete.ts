import type { BooleanInput } from '@angular/cdk/coercion';
import { NgTemplateOutlet } from '@angular/common';
import {
	booleanAttribute,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	computed,
	effect,
	ElementRef,
	forwardRef,
	inject,
	input,
	linkedSignal,
	output,
	type TemplateRef,
	untracked,
	viewChild,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown, lucideSearch } from '@ng-icons/lucide';
import { BrnAutocomplete, BrnAutocompleteEmpty, BrnAutocompleteSearchInput } from '@spartan-ng/brain/autocomplete';
import { BrnFormFieldControl } from '@spartan-ng/brain/form-field';
import type { ChangeFn, TouchFn } from '@spartan-ng/brain/forms';
import { BrnPopover, BrnPopoverContent } from '@spartan-ng/brain/popover';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmPopoverContent } from '@spartan-ng/helm/popover';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';
import { HlmAutocompleteEmpty } from './hlm-autocomplete-empty';
import { HlmAutocompleteGroup } from './hlm-autocomplete-group';
import { HlmAutocompleteItem } from './hlm-autocomplete-item';
import { HlmAutocompleteList } from './hlm-autocomplete-list';
import { HlmAutocompleteSearch } from './hlm-autocomplete-search';
import { HlmAutocompleteSearchInput } from './hlm-autocomplete-search-input';
import { HlmAutocompleteTrigger } from './hlm-autocomplete-trigger';
import { injectHlmAutocompleteConfig } from './hlm-autocomplete.token';
import { cva, VariantProps } from 'class-variance-authority';

export const inputVariants = cva(
	'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base outline-none transition-[color,box-shadow] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
	{
		variants: {
			error: {
				auto: '[&.ng-invalid.ng-touched]:text-destructive/20 dark:[&.ng-invalid.ng-touched]:text-destructive/40 [&.ng-invalid.ng-touched]:border-destructive [&.ng-invalid.ng-touched]:focus-visible:ring-destructive',
				true: 'text-destructive/20 dark:text-destructive/40 border-destructive focus-visible:ring-destructive',
			},
		},
		defaultVariants: {
			error: 'auto',
		},
	},
);


export const HLM_AUTOCOMPLETE_VALUE_ACCESSOR = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => HlmAutocomplete),
	multi: true,
};

type AutocompleteVariants = VariantProps<typeof inputVariants>;

@Component({
	selector: 'hlm-autocomplete',
	imports: [
		NgTemplateOutlet,

		BrnPopover,
		BrnPopoverContent,
		HlmPopoverContent,

		BrnAutocomplete,
		BrnAutocompleteEmpty,
		HlmAutocompleteEmpty,
		HlmAutocompleteGroup,
		HlmAutocompleteItem,
		HlmAutocompleteList,
		HlmAutocompleteSearch,
		HlmAutocompleteSearchInput,
		HlmAutocompleteTrigger,

		NgIcon,
		HlmIcon,
	],
	providers: [
		HLM_AUTOCOMPLETE_VALUE_ACCESSOR,
		provideIcons({ lucideSearch, lucideChevronDown }),
		{
			provide: BrnFormFieldControl,
			useExisting: forwardRef(() => HlmAutocomplete),
		},
	],
	template: `
		<brn-popover
			#popover
			align="start"
			autoFocus="first-heading"
			sideOffset="5"
			closeDelay="100"
			[closeOnOutsidePointerEvents]="true"
		>
			<div brnAutocomplete>
				<hlm-autocomplete-search
					hlmAutocompleteTrigger
					[disabledTrigger]="!_search()"
					[class]="_computedAutocompleteTriggerClass()"
				>
					<ng-icon name="lucideSearch" hlm />
					<input
						#input
						type="text"
						autocomplete="off"
						hlm-autocomplete-search-input
						[id]="inputId()"
						[placeholder]="searchPlaceholderText()"
						[disabled]="_disabled()"
						[value]="_search()"
						(input)="_onSearchChanged($event)"
						(keydown.arrowDown)="_openPopover()"
					/>

					<button
						class="flex items-center justify-center outline-none disabled:cursor-not-allowed [&>_ng-icon]:opacity-50"
						tabindex="-1"
						type="button"
						[attr.aria-label]="ariaLabelToggleButton()"
						[disabled]="_disabled()"
						(click)="_toggleOptions()"
					>
						<ng-icon name="lucideChevronDown" hlm />
					</button>
				</hlm-autocomplete-search>

				<div
					*brnPopoverContent="let ctx"
					hlmPopoverContent
					class="p-0"
					[style.width.px]="_elementRef.nativeElement.offsetWidth"
				>
					<hlm-autocomplete-list
						[class]="_computedAutocompleteListClass()"
						[class.hidden]="filteredOptions().length === 0"
					>
						<hlm-autocomplete-group>
							@for (option of filteredOptions(); track option) {
								<button hlm-autocomplete-item [value]="option" (selected)="_optionSelected(option)">
									@if (optionTemplate(); as optionTemplate) {
										<ng-container *ngTemplateOutlet="optionTemplate; context: { $implicit: option }" />
									} @else {
										{{ option }}
									}
								</button>
							}
						</hlm-autocomplete-group>
					</hlm-autocomplete-list>

					<div *brnAutocompleteEmpty hlmAutocompleteEmpty [class]="_computedAutocompleteEmptyClass()">
						@if (loading()) {
							<ng-content select="[loading]">{{ loadingText() }}</ng-content>
						} @else {
							<ng-content select="[empty]">{{ emptyText() }}</ng-content>
						}
					</div>
				</div>
			</div>
		</brn-popover>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmAutocomplete<T> implements ControlValueAccessor, BrnFormFieldControl {
	private static _id = 0;
	private readonly _config = injectHlmAutocompleteConfig<T>();

	private readonly _brnPopover = viewChild.required(BrnPopover);
	private readonly _inputRef = viewChild.required('input', { read: ElementRef });
	private readonly _brnAutocompleteSearchInput = viewChild.required(BrnAutocompleteSearchInput);
	public readonly error = input<AutocompleteVariants['error']>('auto');
	protected readonly _elementRef = inject(ElementRef<HTMLElement>);
	protected readonly _state = linkedSignal(() => ({ error: this.error() }));

	protected readonly _computedAutocompleteTriggerClass = computed(() =>
		hlm(inputVariants({ error: this._state().error }), this.userClass()),
	);

	constructor() {
		// Watch the brain input's error state and update our visual state accordingly
		effect(() => {
			console.log('error state changed');
			const hasError = this._brnAutocompleteSearchInput().errorState();
			const currentError = this.error();

			// Only update if we're in 'auto' mode or if the error state has changed
			if (currentError === 'auto') {
				untracked(() => {
					this.setError(hasError ? true : 'auto');
				});
			}
		});
	}

	/** The user defined class  */
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm('block w-full', this.userClass()));

	/** Custom class for the autocomplete list. */
	public readonly autocompleteListClass = input<ClassValue>('');
	protected readonly _computedAutocompleteListClass = computed(() => hlm('', this.autocompleteListClass()));

	/** Custom class for the empty and loading state container. */
	public readonly autocompleteEmptyClass = input<ClassValue>('');
	protected readonly _computedAutocompleteEmptyClass = computed(() => hlm('', this.autocompleteEmptyClass()));

	/** The list of filtered options to display in the autocomplete. */
	public readonly filteredOptions = input<T[]>([]);

	/** The selected value. */
	public readonly value = input<T>();
	protected readonly _value = linkedSignal(() => this.value());

	/** The search query. */
	public readonly search = input<string>();
	protected readonly _search = linkedSignal(() => this.search() || '');

	/** Function to transform an option value to a search string. Defaults to identity function for strings. */
	public readonly transformValueToSearch = input<(value: T) => string>(this._config.transformValueToSearch);

	/** Optional template for rendering each option. */
	public readonly optionTemplate = input<TemplateRef<HlmAutocompleteOption<T>>>();

	/** Whether the autocomplete is in a loading state. */
	public readonly loading = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	/** Placeholder text for the input field. */
	public readonly searchPlaceholderText = input('Select an option');

	/** Text to display when loading options. */
	public readonly loadingText = input('Loading options...');

	/** Text to display when no options are found. */
	public readonly emptyText = input('No options found');

	/** Aria label for the toggle button. */
	public readonly ariaLabelToggleButton = input<string>('Toggle options');

	/** The id of the input field. */
	public readonly inputId = input<string>(`hlm-autocomplete-input-${++HlmAutocomplete._id}`);

	/** Whether the autocomplete is disabled. */
	public readonly isDisabledInput = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
		alias: 'disabled',
	});
	protected readonly _disabled = linkedSignal(() => this.isDisabledInput());

	/** Emitted when the selected value changes. */
	public readonly valueChange = output<T | null>();

	/** Emitted when the search query changes. */
	public readonly searchChange = output<string>();

	protected _onChange?: ChangeFn<T | null>;
	protected _onTouched?: TouchFn;

	protected _setPopoverState(state: 'open' | 'closed') {
		if (state === 'open') {
			this._brnPopover().open();
		} else {
			this._brnPopover().close();
		}
	}

	protected _openPopover() {
		if (this._search() || this.filteredOptions().length > 0) {
			// only open if there's a search term or options to show
			this._brnPopover().open();
		}
	}

	protected _toggleOptions() {
		if (this._search() || this.filteredOptions().length > 0) {
			// only toggle if there's a search term or options to show
			const state = this._brnPopover().stateComputed();
			this._setPopoverState(state === 'open' ? 'closed' : 'open');
		}

		this._inputRef().nativeElement.focus();
	}

	protected _onSearchChanged(event: Event) {
		const input = event.target as HTMLInputElement;
		this._search.set(input.value);
		this.searchChange.emit(input.value);

		this._clearOption();

		if (this._brnPopover().stateComputed() !== 'open' && input.value.length > 0) {
			this._setPopoverState('open');
		}
	}

	protected _clearOption() {
		this._value.set(undefined);
		this._onChange?.(null);
		this.valueChange.emit(null);
	}

	protected _optionSelected(option: T) {
		this._value.set(option);
		this._onChange?.(option);
		this.valueChange.emit(option);

		const searchValue = this.transformValueToSearch()(option);

		this._search.set(searchValue);
		this.searchChange.emit(searchValue);

		this._setPopoverState('closed');
	}

	/** CONTROL VALUE ACCESSOR */
	public writeValue(value: T | null): void {
		this._value.set(value ? value : undefined);
	}

	public registerOnChange(fn: ChangeFn<T | null>): void {
		this._onChange = fn;
	}

	public registerOnTouched(fn: TouchFn): void {
		this._onTouched = fn;
	}

	public setDisabledState(isDisabled: boolean): void {
		this._disabled.set(isDisabled);
	}

	setError(error: AutocompleteVariants['error']) {
		this._state.set({ error });
	}

	// BrnFormFieldControl implementation - delegate to brain directive
	get ngControl() {
		return this._brnAutocompleteSearchInput().ngControl;
	}

	get errorState() {
		return this._brnAutocompleteSearchInput().errorState;
	}

	get required() {
		return this._brnAutocompleteSearchInput().required;
	}

	// Note: This overrides the input property, but the input is still accessible via alias 'disabled'
	get disabled() {
		return this._brnAutocompleteSearchInput().disabled;
	}

	get id() {
		return this._brnAutocompleteSearchInput().id;
	}

	setAriaDescribedBy(ids: string) {
		this._brnAutocompleteSearchInput().setAriaDescribedBy(ids);
	}
}

interface HlmAutocompleteOption<T> {
	$implicit: T;
}
