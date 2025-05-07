import { FocusMonitor } from '@angular/cdk/a11y';
import { BooleanInput } from '@angular/cdk/coercion';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
	type AfterContentInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	DestroyRef,
	ElementRef,
	type OnDestroy,
	PLATFORM_ID,
	Renderer2,
	booleanAttribute,
	computed,
	effect,
	forwardRef,
	inject,
	input,
	linkedSignal,
	model,
	output,
	signal,
	viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ChangeFn, TouchFn } from '@spartan-ng/brain/forms';

export const BRN_CHECKBOX_VALUE_ACCESSOR = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => BrnCheckboxComponent),
	multi: true,
};

let uniqueIdCounter = 0;

const CONTAINER_POST_FIX = '-checkbox';

@Component({
	selector: 'brn-checkbox',
	template: `
		<button
			#checkBox
			role="checkbox"
			type="button"
			[id]="getCheckboxButtonId(state().id) ?? ''"
			[name]="getCheckboxButtonId(state().name) ?? ''"
			[class]="class()"
			[attr.aria-checked]="_ariaChecked()"
			[attr.aria-label]="ariaLabel() || null"
			[attr.aria-labelledby]="mutableAriaLabelledby() || null"
			[attr.aria-describedby]="ariaDescribedby() || null"
			[attr.data-state]="_dataState()"
			[attr.data-focus-visible]="focusVisible()"
			[attr.data-focus]="focused()"
			[attr.data-disabled]="state().disabled()"
			[disabled]="state().disabled()"
			[tabIndex]="state().disabled() ? -1 : 0"
			(click)="$event.preventDefault(); toggle()"
		>
			<ng-content />
		</button>
	`,
	host: {
		'[style]': '{display: "contents"}',
		'[attr.id]': 'state().id',
		'[attr.name]': 'state().name',
		'[attr.aria-labelledby]': 'null',
		'[attr.aria-label]': 'null',
		'[attr.aria-describedby]': 'null',
		'[attr.data-state]': '_dataState()',
		'[attr.data-focus-visible]': 'focusVisible()',
		'[attr.data-focus]': 'focused()',
		'[attr.data-disabled]': 'state().disabled()',
	},
	providers: [BRN_CHECKBOX_VALUE_ACCESSOR],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrnCheckboxComponent implements ControlValueAccessor, AfterContentInit, OnDestroy {
	private readonly _destroyRef = inject(DestroyRef);
	private readonly _renderer = inject(Renderer2);
	private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
	private readonly _focusMonitor = inject(FocusMonitor);
	private readonly _cdr = inject(ChangeDetectorRef);
	private readonly _document = inject(DOCUMENT);
	private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

	protected readonly focusVisible = signal(false);
	protected readonly focused = signal(false);

	/**
	 * Current checked state of checkbox.
	 * Can be boolean (true/false) or 'indeterminate'.
	 * Can be bound with [(checked)] for two-way binding.
	 */
	public readonly checked = model<BrnCheckboxValue>(false);

	/**
	 * Read-only signal of current checkbox state.
	 * Use this when you only need to read state without changing it.
	 */
	public readonly isChecked = this.checked.asReadonly();

	/**
	 * Computed data-state attribute value based on checked state.
	 * Returns 'checked', 'unchecked', or 'indeterminate'.
	 */
	protected readonly _dataState = computed(() => {
		const checked = this.checked();
		if (checked === 'indeterminate') return 'indeterminate';
		return checked ? 'checked' : 'unchecked';
	});

	/**
	 * Computed aria-checked attribute value for accessibility.
	 * Returns 'true', 'false', or 'mixed' (for indeterminate).
	 */
	protected readonly _ariaChecked = computed(() => {
		const checked = this.checked();
		if (checked === 'indeterminate') return 'mixed';
		return checked ? 'true' : 'false';
	});

	/**
	 * Unique identifier for checkbox component.
	 * When provided, inner button gets ID without '-checkbox' suffix.
	 * Auto-generates ID if not provided.
	 */
	public readonly id = input<string | null>(uniqueIdCounter++ + '');

	/**
	 * Form control name for checkbox.
	 * When provided, inner button gets name without '-checkbox' suffix.
	 */
	public readonly name = input<string | null>(null);

	/**
	 * CSS classes applied to inner button element.
	 */
	public readonly class = input<string | null>(null);

	/**
	 * Accessibility label for screen readers.
	 * Use when no visible label exists.
	 */
	public readonly ariaLabel = input<string | null>(null, { alias: 'aria-label' });

	/**
	 * ID of element that labels this checkbox for accessibility.
	 * Auto-set when checkbox is inside label element.
	 */
	public readonly ariaLabelledby = input<string | null>(null, { alias: 'aria-labelledby' });
	public readonly mutableAriaLabelledby = linkedSignal(() => this.ariaLabelledby());

	/**
	 * ID of element that describes this checkbox for accessibility.
	 */
	public readonly ariaDescribedby = input<string | null>(null, { alias: 'aria-describedby' });

	/**
	 * Whether checkbox is required in a form.
	 */
	public readonly required = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	/**
	 * Whether checkbox is disabled.
	 * Disabled checkboxes cannot be toggled and indicate disabled state through data-disabled attribute.
	 */
	public readonly disabled = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	/**
	 * Computed state for checkbox container and accessibility.
	 * Manages ID, name, and disabled state.
	 */
	protected readonly state = computed(() => {
		const name = this.name();
		const id = this.id();
		return {
			disabled: signal(this.disabled()),
			name: name ? name + CONTAINER_POST_FIX : null,
			id: id ? id + CONTAINER_POST_FIX : null,
		};
	});

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	protected _onChange: ChangeFn<BrnCheckboxValue> = () => {};
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	private _onTouched: TouchFn = () => {};

	/**
	 * Reference to the checkbox button element in the template.
	 */
	public readonly checkbox = viewChild.required<ElementRef<HTMLButtonElement>>('checkBox');

	/**
	 * Event emitted when checkbox value changes.
	 * Emits new checked state (true/false/'indeterminate').
	 */
	public readonly changed = output<BrnCheckboxValue>();

	/**
	 * Event emitted when checkbox is blurred (loses focus).
	 * Used for form validation.
	 */
	public readonly touched = output<void>();

	constructor() {
		effect(() => {
			const state = this.state();
			const isDisabled = state.disabled();

			if (!this._elementRef.nativeElement || !this._isBrowser) return;

			const newLabelId = state.id + '-label';
			const checkboxButtonId = this.getCheckboxButtonId(state.id);
			const labelElement =
				this._elementRef.nativeElement.closest('label') ??
				this._document.querySelector(`label[for="${checkboxButtonId}"]`);

			if (!labelElement) return;
			const existingLabelId = labelElement.id;

			this._renderer.setAttribute(labelElement, 'data-disabled', isDisabled ? 'true' : 'false');
			this.mutableAriaLabelledby.set(existingLabelId || newLabelId);

			if (!existingLabelId || existingLabelId.length === 0) {
				this._renderer.setAttribute(labelElement, 'id', newLabelId);
			}
		});
	}

	/**
	 * Toggles checkbox between checked/unchecked states.
	 * If checkbox is indeterminate, sets to checked.
	 * Does nothing if checkbox is disabled.
	 */
	toggle() {
		if (this.state().disabled()) return;

		this._onTouched();
		this.touched.emit();

		const previousChecked = this.checked();
		this.checked.set(previousChecked === 'indeterminate' ? true : !previousChecked);
		this._onChange(this.checked());
		this.changed.emit(this.checked());
	}

	ngAfterContentInit() {
		this._focusMonitor
			.monitor(this._elementRef, true)
			.pipe(takeUntilDestroyed(this._destroyRef))
			.subscribe((focusOrigin) => {
				if (focusOrigin) this.focused.set(true);
				if (focusOrigin === 'keyboard' || focusOrigin === 'program') {
					this.focusVisible.set(true);
					this._cdr.markForCheck();
				}
				if (!focusOrigin) {
					// When a focused element becomes disabled, the browser *immediately* fires a blur event.
					// Angular does not expect events to be raised during change detection, so any state
					// change (such as a form control's ng-touched) will cause a changed-after-checked error.
					// See https://github.com/angular/angular/issues/17793. To work around this, we defer
					// telling the form control it has been touched until the next tick.
					Promise.resolve().then(() => {
						this.focusVisible.set(false);
						this.focused.set(false);
						this._onTouched();
						this.touched.emit();
						this._cdr.markForCheck();
					});
				}
			});
	}

	ngOnDestroy() {
		this._focusMonitor.stopMonitoring(this._elementRef);
	}

	/**
	 * Gets proper ID for inner button element.
	 * Removes '-checkbox' suffix if present in container ID.
	 *
	 * @param idPassedToContainer - ID applied to container element
	 * @returns ID to use for inner button or null
	 */
	protected getCheckboxButtonId(idPassedToContainer: string | null | undefined): string | null {
		return idPassedToContainer ? idPassedToContainer.replace(CONTAINER_POST_FIX, '') : null;
	}

	/**
	 * Updates internal state when control value changes from outside.
	 * Handles boolean and 'indeterminate' values.
	 * Part of ControlValueAccessor interface.
	 *
	 * @param value - New checkbox state (true/false/'indeterminate')
	 */
	writeValue(value: BrnCheckboxValue): void {
		if (value === 'indeterminate') {
			this.checked.set('indeterminate');
		} else {
			this.checked.set(value);
		}
	}

	/**
	 * Registers callback for value changes.
	 * Part of ControlValueAccessor interface.
	 *
	 * @param fn - Function to call when value changes
	 */
	registerOnChange(fn: ChangeFn<BrnCheckboxValue>): void {
		this._onChange = fn;
	}

	/**
	 * Registers callback for touched events.
	 * Part of ControlValueAccessor interface.
	 *
	 * @param fn - Function to call when control is touched
	 */
	registerOnTouched(fn: TouchFn): void {
		this._onTouched = fn;
	}

	/**
	 * Updates disabled state from form control.
	 * Part of ControlValueAccessor interface.
	 *
	 * @param isDisabled - Whether checkbox should be disabled
	 */
	setDisabledState(isDisabled: boolean): void {
		this.state().disabled.set(isDisabled);
		this._cdr.markForCheck();
	}
}

type BrnCheckboxValue = boolean | 'indeterminate';
