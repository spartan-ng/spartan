import { FocusMonitor } from '@angular/cdk/a11y';
import type { BooleanInput, NumberInput } from '@angular/cdk/coercion';
import { isPlatformBrowser } from '@angular/common';
import {
	type AfterContentInit,
	booleanAttribute,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	computed,
	DestroyRef,
	DOCUMENT,
	effect,
	ElementRef,
	forwardRef,
	inject,
	input,
	linkedSignal,
	model,
	numberAttribute,
	type OnDestroy,
	output,
	PLATFORM_ID,
	Renderer2,
	signal,
	viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { ChangeFn, TouchFn } from '@spartan-ng/brain/forms';

export const BRN_SWITCH_VALUE_ACCESSOR = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => BrnSwitch),
	multi: true,
};

const CONTAINER_POST_FIX = '-switch';

let uniqueIdCounter = 0;

@Component({
	selector: 'brn-switch',
	providers: [BRN_SWITCH_VALUE_ACCESSOR],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'[style]': '{display: "contents"}',
		'[attr.id]': '_state().id',
		'[attr.name]': '_state().name',
		'[attr.aria-labelledby]': 'null',
		'[attr.aria-label]': 'null',
		'[attr.aria-describedby]': 'null',
		'[attr.data-state]': 'checked() ? "checked" : "unchecked"',
		'[attr.data-focus-visible]': '_focusVisible()',
		'[attr.data-focus]': '_focused()',
		'[attr.data-disabled]': '_state().disabled()',
	},
	template: `
		<button
			#switch
			role="switch"
			type="button"
			[class]="class()"
			[id]="getSwitchButtonId(_state().id) ?? ''"
			[name]="getSwitchButtonId(_state().name) ?? ''"
			[value]="checked() ? 'on' : 'off'"
			[attr.aria-checked]="checked()"
			[attr.aria-label]="ariaLabel() || null"
			[attr.aria-labelledby]="mutableAriaLabelledby() || null"
			[attr.aria-describedby]="ariaDescribedby() || null"
			[attr.data-state]="checked() ? 'checked' : 'unchecked'"
			[attr.data-focus-visible]="_focusVisible()"
			[attr.data-focus]="_focused()"
			[attr.data-disabled]="_state().disabled()"
			[disabled]="_state().disabled()"
			[tabIndex]="tabIndex()"
			(click)="$event.preventDefault(); toggle()"
		>
			<ng-content select="brn-switch-thumb" />
		</button>
	`,
})
export class BrnSwitch implements AfterContentInit, OnDestroy, ControlValueAccessor {
	private readonly _destroyRef = inject(DestroyRef);
	private readonly _renderer = inject(Renderer2);
	private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
	private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
	private readonly _focusMonitor = inject(FocusMonitor);
	private readonly _cdr = inject(ChangeDetectorRef);
	private readonly _document = inject(DOCUMENT);

	protected readonly _focusVisible = signal(false);
	protected readonly _focused = signal(false);

	/**
	 * Whether switch is checked/toggled on.
	 * Can be bound with [(checked)] for two-way binding.
	 */
	public readonly checked = model<boolean>(false);

	/** Emits when checked state changes. */
	public readonly checkedChange = output<boolean>();

	/**
	 * Unique identifier for switch component.
	 * When provided, inner button gets ID without '-switch' suffix.
	 * Auto-generates ID if not provided.
	 */
	public readonly id = input<string | null>(++uniqueIdCounter + '');

	/**
	 * Form control name for switch.
	 * When provided, inner button gets name without '-switch' suffix.
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
	 * ID of element that labels this switch for accessibility.
	 * Auto-set when switch is inside label element.
	 */
	public readonly ariaLabelledby = input<string | null>(null, { alias: 'aria-labelledby' });
	public readonly mutableAriaLabelledby = linkedSignal(() => this.ariaLabelledby());

	/**
	 * ID of element that describes this switch for accessibility.
	 */
	public readonly ariaDescribedby = input<string | null>(null, { alias: 'aria-describedby' });

	/**
	 * Whether switch is required in a form.
	 */
	public readonly required = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	/**
	 * Whether switch is disabled.
	 * Disabled switches cannot be toggled and indicate disabled state with data attribute.
	 */
	public readonly disabled = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	/**
	 * Keyboard tab order for switch.
	 * @default 0
	 */
	public readonly tabIndex = input<number, NumberInput>(0, { transform: numberAttribute });

	/**
	 * Event emitted when switch is blurred (loses focus).
	 * Used for form validation.
	 */
	public readonly touched = output<void>();

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	protected _onChange: ChangeFn<boolean> = () => {};
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	private _onTouched: TouchFn = () => {};

	public readonly switch = viewChild.required<ElementRef<HTMLInputElement>>('switch');

	protected readonly _state = computed(() => {
		const name = this.name();
		const id = this.id();
		return {
			disabled: signal(this.disabled()),
			name: name ? name + CONTAINER_POST_FIX : null,
			id: id ? id + CONTAINER_POST_FIX : null,
		};
	});

	constructor() {
		effect(() => {
			const state = this._state();
			const isDisabled = state.disabled();

			if (!this._elementRef.nativeElement || !this._isBrowser) return;

			const newLabelId = state.id + '-label';
			const switchButtonId = this.getSwitchButtonId(state.id);
			const labelElement =
				this._elementRef.nativeElement.closest('label') ??
				this._document.querySelector(`label[for="${switchButtonId}"]`);

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
	 * Toggles switch between checked/unchecked states.
	 * Does nothing if switch is disabled.
	 */
	protected toggle(): void {
		if (this._state().disabled()) return;

		this._onTouched();
		this.touched.emit();

		this.checked.update((checked) => !checked);
		this._onChange(this.checked());
		this.checkedChange.emit(this.checked());
	}

	public ngAfterContentInit(): void {
		this._focusMonitor
			.monitor(this._elementRef, true)
			.pipe(takeUntilDestroyed(this._destroyRef))
			.subscribe((focusOrigin) => {
				if (focusOrigin) this._focused.set(true);
				if (focusOrigin === 'keyboard' || focusOrigin === 'program') {
					this._focusVisible.set(true);
					this._cdr.markForCheck();
				}
				if (!focusOrigin) {
					// When a focused element becomes disabled, the browser *immediately* fires a blur event.
					// Angular does not expect events to be raised during change detection, so any state
					// change (such as a form control's ng-touched) will cause a changed-after-checked error.
					// See https://github.com/angular/angular/issues/17793. To work around this, we defer
					// telling the form control it has been touched until the next tick.
					Promise.resolve().then(() => {
						this._focusVisible.set(false);
						this._focused.set(false);
						this._onTouched();
						this.touched.emit();
						this._cdr.markForCheck();
					});
				}
			});

		if (!this.switch()) return;
		this.switch().nativeElement.value = this.checked() ? 'on' : 'off';
		this.switch().nativeElement.dispatchEvent(new Event('change'));
	}

	public ngOnDestroy() {
		this._focusMonitor.stopMonitoring(this._elementRef);
	}

	/**
	 * Gets proper ID for inner button element.
	 * Removes '-switch' suffix if present in container ID.
	 *
	 * @param idPassedToContainer - ID applied to container element
	 * @returns ID to use for inner button or null
	 */
	protected getSwitchButtonId(idPassedToContainer: string | null | undefined): string | null {
		return idPassedToContainer ? idPassedToContainer.replace(CONTAINER_POST_FIX, '') : null;
	}

	/**
	 * Updates internal state when control value changes from outside.
	 * Part of ControlValueAccessor interface.
	 *
	 * @param value - New checked state
	 */
	public writeValue(value: boolean): void {
		this.checked.set(Boolean(value));
	}

	/**
	 * Registers callback for value changes.
	 * Part of ControlValueAccessor interface.
	 *
	 * @param fn - Function to call when value changes
	 */
	public registerOnChange(fn: ChangeFn<boolean>): void {
		this._onChange = fn;
	}

	/**
	 * Registers callback for touched events.
	 * Part of ControlValueAccessor interface.
	 *
	 * @param fn - Function to call when control is touched
	 */
	public registerOnTouched(fn: TouchFn): void {
		this._onTouched = fn;
	}

	/**
	 * Updates disabled state from form control.
	 * Part of ControlValueAccessor interface.
	 *
	 * @param isDisabled - Whether switch should be disabled
	 */
	public setDisabledState(isDisabled: boolean): void {
		this._state().disabled.set(isDisabled);
		this._cdr.markForCheck();
	}
}
