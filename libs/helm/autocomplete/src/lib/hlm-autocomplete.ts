import type { BooleanInput } from '@angular/cdk/coercion';
import { NgTemplateOutlet } from '@angular/common';
import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	computed,
	ElementRef,
	forwardRef,
	inject,
	input,
	linkedSignal,
	output,
	type TemplateRef,
	viewChild,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown, lucideSearch } from '@ng-icons/lucide';
import { BrnAutocomplete, BrnAutocompleteEmpty } from '@spartan-ng/brain/autocomplete';
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

export const HLM_AUTOCOMPLETE_VALUE_ACCESSOR = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => HlmAutocomplete),
	multi: true,
};

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
	providers: [HLM_AUTOCOMPLETE_VALUE_ACCESSOR, provideIcons({ lucideSearch, lucideChevronDown })],
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
					[class]="_computedAutocompleteSearchClass()"
					[disabledTrigger]="!_search()"
				>
					<ng-icon name="lucideSearch" hlm />
					<input
						#input
						type="text"
						autocomplete="off"
						hlm-autocomplete-search-input
						[id]="inputId()"
						[class]="_computedAutocompleteInputClass()"
						[placeholder]="searchPlaceholderText()"
						[disabled]="_disabled()"
						[value]="_search()"
						(valueChange)="_onSearchChanged($event)"
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
								<button
									hlm-autocomplete-item
									[class]="_computedAutocompleteItemClass()"
									[value]="option"
									(selected)="_optionSelected(option)"
								>
									@if (optionTemplate(); as optionTemplate) {
										<ng-container *ngTemplateOutlet="optionTemplate; context: { $implicit: option }" />
									} @else {
										{{ transformOptionToString()(option) }}
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
export class HlmAutocomplete<T> implements ControlValueAccessor {
	private static _id = 0;
	private readonly _config = injectHlmAutocompleteConfig<T>();

	private readonly _brnAutocomplete = viewChild.required(BrnAutocomplete);

	private readonly _inputRef = viewChild.required('input', { read: ElementRef });

	protected readonly _elementRef = inject(ElementRef<HTMLElement>);

	/** The user defined class  */
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm('block w-full', this.userClass()));

	/** Custom class for the autocomplete search container. */
	public readonly autocompleteSearchClass = input<ClassValue>('');
	protected readonly _computedAutocompleteSearchClass = computed(() => hlm('', this.autocompleteSearchClass()));

	/** Custom class for the autocomplete input. */
	public readonly autocompleteInputClass = input<ClassValue>('');
	protected readonly _computedAutocompleteInputClass = computed(() => hlm('', this.autocompleteInputClass()));

	/** Custom class for the autocomplete list. */
	public readonly autocompleteListClass = input<ClassValue>('');
	protected readonly _computedAutocompleteListClass = computed(() => hlm('', this.autocompleteListClass()));

	/** Custom class for each autocomplete item. */
	public readonly autocompleteItemClass = input<ClassValue>('');
	protected readonly _computedAutocompleteItemClass = computed(() => hlm('', this.autocompleteItemClass()));

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
	public readonly transformValueToSearch = input<(option: T) => string>(this._config.transformValueToSearch);

	/** Function to transform an option value to a display string. Defaults to identity function for strings. */
	public readonly transformOptionToString = input<(option: T) => string>(this._config.transformOptionToString);

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
	public readonly disabled = input<boolean, BooleanInput>(false, { transform: booleanAttribute });
	protected readonly _disabled = linkedSignal(() => this.disabled());

	/** Emitted when the selected value changes. */
	public readonly valueChange = output<T | null>();

	/** Emitted when the search query changes. */
	public readonly searchChange = output<string>();

	protected _onChange?: ChangeFn<T | null>;
	protected _onTouched?: TouchFn;

	protected _toggleOptions() {
		if (this._search() || this.filteredOptions().length > 0) {
			// only toggle if there's a search term or options to show
			this._brnAutocomplete().toggle();
		}

		this._inputRef().nativeElement.focus();
	}

	protected _onSearchChanged(value: string) {
		this._search.set(value);
		this.searchChange.emit(value);

		this._clearOption();

		if (!this._brnAutocomplete().isExpanded() && value.length > 0) {
			this._brnAutocomplete().open();
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

		this._brnAutocomplete().close();
	}

	/** CONTROL VALUE ACCESSOR */
	public writeValue(value: T | null): void {
		this._value.set(value ? value : undefined);

		const searchValue = value ? this.transformValueToSearch()(value) : '';
		this._search.set(searchValue);
		this.searchChange.emit(searchValue);
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
}

export interface HlmAutocompleteOption<T> {
	$implicit: T;
}
