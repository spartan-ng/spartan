import { BooleanInput } from '@angular/cdk/coercion';
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
	viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown, lucideSearch } from '@ng-icons/lucide';
import { BrnCommandEmpty } from '@spartan-ng/brain/command';
import { hlm } from '@spartan-ng/brain/core';
import { ChangeFn, TouchFn } from '@spartan-ng/brain/forms';
import { BrnPopover, BrnPopoverContent } from '@spartan-ng/brain/popover';
import { HlmCommandEmpty, HlmCommandGroup, HlmCommandItem, HlmCommandList } from '@spartan-ng/helm/command';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmPopoverContent } from '@spartan-ng/helm/popover';
import type { ClassValue } from 'clsx';
import { HlmAutocompleteCommand } from './hlm-autocomplete-command';
import { HlmAutocompleteSearch } from './hlm-autocomplete-search';
import { HlmAutocompleteSearchInput } from './hlm-autocomplete-search-input';
import { HlmAutocompleteTrigger } from './hlm-autocomplete-trigger';

export const HLM_AUTOCOMPLETE_VALUE_ACCESSOR = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => HlmAutocomplete),
	multi: true,
};

let nextId = 0;

@Component({
	selector: 'hlm-autocomplete',
	imports: [
		BrnPopover,
		BrnPopoverContent,
		HlmPopoverContent,

		HlmCommandList,
		HlmCommandGroup,
		HlmCommandItem,
		BrnCommandEmpty,
		HlmCommandEmpty,

		HlmAutocompleteCommand,
		HlmAutocompleteSearch,
		HlmAutocompleteSearchInput,
		HlmAutocompleteTrigger,

		NgIcon,
		HlmIcon,
	],
	providers: [HLM_AUTOCOMPLETE_VALUE_ACCESSOR, provideIcons({ lucideSearch, lucideChevronDown })],
	template: `
		<brn-popover
			align="start"
			autoFocus="first-heading"
			sideOffset="5"
			closeDelay="100"
			[closeOnOutsidePointerEvents]="true"
		>
			<hlm-autocomplete-command>
				<hlm-autocomplete-search hlmAutocompleteTrigger [disabled]="!_search()">
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
						(keydown.arrowDown)="_setPopoverState('open')"
					/>

					<button
						class="flex items-center justify-center outline-none disabled:cursor-not-allowed [&>_ng-icon]:opacity-50"
						tabindex="-1"
						type="button"
						aria-label="Toggle dropdown"
						[disabled]="_disabled()"
						(click)="_toggleOptions()"
					>
						<ng-icon name="lucideChevronDown" hlm />
					</button>
				</hlm-autocomplete-search>

				<div
					*brnPopoverContent="let ctx"
					hlmPopoverContent
					class="max-h-60 overflow-y-auto p-0"
					[style.width.px]="_elementRef.nativeElement.offsetWidth"
				>
					<hlm-command-list>
						<hlm-command-group>
							@for (option of _filteredOptions(); track option) {
								<button hlm-command-item [value]="option" (selected)="_optionSelected(option)">
									{{ option }}
								</button>
							}
						</hlm-command-group>
					</hlm-command-list>

					<div *brnCommandEmpty hlmCommandEmpty>
						@if (loading()) {
							<ng-content select="[loading]">{{ loadingText() }}</ng-content>
						} @else {
							<ng-content select="[empty]">{{ emptyText() }}</ng-content>
						}
					</div>
				</div>
			</hlm-autocomplete-command>
		</brn-popover>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmAutocomplete implements ControlValueAccessor {
	private readonly _brnPopover = viewChild.required(BrnPopover);
	private readonly _inputRef = viewChild.required('input', { read: ElementRef });

	protected readonly _elementRef = inject(ElementRef<HTMLElement>);

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm('block w-full', this.userClass()));

	/** The list of options to display in the autocomplete. */
	public readonly options = input<string[]>([]);

	/** The selected value. */
	public readonly value = input<string>();
	protected readonly _value = linkedSignal(() => this.value());

	/** The search query. */
	public readonly search = input<string>();
	protected readonly _search = linkedSignal(() => this.search() || '');

	protected readonly _filteredOptions = computed(() =>
		this.options().filter((option) => option.toLowerCase().includes(this._search().toLowerCase())),
	);

	/** Whether the autocomplete is in a loading state. */
	public readonly loading = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	/** Placeholder text for the input field. */
	public readonly searchPlaceholderText = input('Select an option');

	/** Text to display when loading options. */
	public readonly loadingText = input('Loading options...');

	/** Text to display when no options are found. */
	public readonly emptyText = input('No options found');

	/** The id of the input field. */
	public readonly inputId = input<string>(`hlm-autocomplete-input-${nextId++}`);

	/** Whether the autocomplete is disabled. */
	public readonly disabled = input<boolean, BooleanInput>(false, { transform: booleanAttribute });
	protected readonly _disabled = linkedSignal(() => this.disabled());

	/** Emitted when the selected value changes. */
	public readonly valueChange = output<string | null>();

	/** Emitted when the search query changes. */
	public readonly searchChange = output<string>();

	protected _onChange?: ChangeFn<string | null>;
	protected _onTouched?: TouchFn;

	protected _setPopoverState(state: 'open' | 'closed') {
		if (state === 'open') {
			this._brnPopover().open();
		} else {
			this._brnPopover().close();
		}
	}

	protected _toggleOptions() {
		const state = this._brnPopover().stateComputed();
		if (state === 'open') {
			this._brnPopover().close();
		} else {
			this._brnPopover().open();
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

	protected _optionSelected(option: string) {
		this._value.set(option);
		this._onChange?.(option);
		this.valueChange.emit(option);
		this._search.set(option);

		this._setPopoverState('closed');
	}

	/** CONTROL VALUE ACCESSOR */
	public writeValue(value: string | null): void {
		this._value.set(value ? value : undefined);
	}

	public registerOnChange(fn: ChangeFn<string | null>): void {
		this._onChange = fn;
	}

	public registerOnTouched(fn: TouchFn): void {
		this._onTouched = fn;
	}

	public setDisabledState(isDisabled: boolean): void {
		this._disabled.set(isDisabled);
	}
}
