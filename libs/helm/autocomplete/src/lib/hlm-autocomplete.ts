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
	signal,
	viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown, lucideSearch } from '@ng-icons/lucide';
import { BrnCommandEmpty } from '@spartan-ng/brain/command';
import { hlm } from '@spartan-ng/brain/core';
import { BrnDialogState } from '@spartan-ng/brain/dialog';
import { ChangeFn, TouchFn } from '@spartan-ng/brain/forms';
import { BrnPopover, BrnPopoverContent } from '@spartan-ng/brain/popover';
import {
	HlmCommand,
	HlmCommandEmpty,
	HlmCommandGroup,
	HlmCommandItem,
	HlmCommandList,
	HlmCommandSearch,
	HlmCommandSearchInput,
} from '@spartan-ng/helm/command';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmPopoverContent } from '@spartan-ng/helm/popover';
import type { ClassValue } from 'clsx';
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

		HlmCommand,
		HlmCommandSearch,
		HlmCommandSearchInput,
		HlmCommandList,
		HlmCommandGroup,
		HlmCommandItem,
		BrnCommandEmpty,
		HlmCommandEmpty,

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
			[state]="_popoverState()"
			(stateChanged)="_stateChanged($event)"
		>
			<hlm-command
				class="border-input focus-within:border-ring focus-within:ring-ring/50 h-9 border focus-within:ring-[3px]"
			>
				<hlm-command-search class="border-none" hlmAutocompleteTrigger [disabled]="!_filter()">
					<ng-icon name="lucideSearch" hlm />
					<input
						#input
						class="h-9 rounded-none py-1 text-base md:text-sm"
						type="text"
						autocomplete="off"
						hlm-command-search-input
						[id]="inputId()"
						[placeholder]="placeholderText()"
						[disabled]="_disabled()"
						[value]="_filter()"
						(input)="_onFilterChanged($event)"
						(keydown.arrowDown)="_stateChanged('open')"
					/>

					<!-- TODO _toggleOptions and stateChanged interfere with each other  -->
					<!-- TODO one click sets it popover state to open, second click triggers (stateChanged) with close because click outside and _toggleOptions state is set to open again -->
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
				</hlm-command-search>

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
							<ng-content select="[loading]">Loading...</ng-content>
						} @else {
							<ng-content select="[empty]">No options found</ng-content>
						}
					</div>
				</div>
			</hlm-command>
		</brn-popover>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmAutocomplete implements ControlValueAccessor {
	private readonly _inputRef = viewChild.required('input', { read: ElementRef });

	protected readonly _elementRef = inject(ElementRef<HTMLElement>);
	protected readonly _popoverState = signal<BrnDialogState | null>(null);

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm('block w-full ', this.userClass()));

	/** The list of options to display in the autocomplete. */
	public readonly options = input<string[]>([]);

	/** The selected value. */
	public readonly value = input<string>();
	protected readonly _value = linkedSignal(() => this.value());

	public readonly filter = input<string>('');
	protected readonly _filter = linkedSignal(() => this.filter());

	protected readonly _filteredOptions = computed(() =>
		this.options().filter((option) => option.toLowerCase().includes(this._filter().toLowerCase())),
	);

	/** Whether the autocomplete is in a loading state. */
	public readonly loading = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	public readonly placeholderText = input('Select an option');
	public readonly inputId = input<string>(`hlm-autocomplete-input-${nextId++}`);

	public readonly disabled = input<boolean, BooleanInput>(false, { transform: booleanAttribute });
	protected readonly _disabled = linkedSignal(() => this.disabled());

	/** Emitted when the selected value changes. */
	public readonly valueChange = output<string | null>();

	/** Emitted when the filter text changes for asynchronous options */
	public readonly filterChange = output<string>();

	protected _onChange?: ChangeFn<string | null>;
	protected _onTouched?: TouchFn;

	protected _stateChanged(state: 'open' | 'closed') {
		this._popoverState.set(state);
	}

	protected _toggleOptions() {
		this._popoverState.set(this._popoverState() === 'open' ? 'closed' : 'open');
		this._inputRef().nativeElement.focus();
	}

	protected _onFilterChanged(event: Event) {
		const input = event.target as HTMLInputElement;
		this._filter.set(input.value);
		this.filterChange.emit(input.value);

		this._clearOption();

		if (this._popoverState() !== 'open' && input.value.length > 0) {
			this._stateChanged('open');
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
		this._filter.set(option);

		this._stateChanged('closed');
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
