import { FocusMonitor } from '@angular/cdk/a11y';
import { BooleanInput } from '@angular/cdk/coercion';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
	type AfterContentInit,
	booleanAttribute,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	computed,
	DestroyRef,
	effect,
	ElementRef,
	forwardRef,
	inject,
	input,
	linkedSignal,
	model,
	type OnDestroy,
	output,
	PLATFORM_ID,
	Renderer2,
	signal,
	viewChild,
	ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ChangeFn, TouchFn } from '@spartan-ng/brain/forms';

export const BRN_SWITCH_VALUE_ACCESSOR = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => BrnSwitchComponent),
	multi: true,
};

const CONTAINER_POST_FIX = '-switch';

let uniqueIdCounter = 0;

@Component({
	selector: 'brn-switch',
	template: `
		<button
			#switch
			role="switch"
			type="button"
			[class]="class()"
			[id]="getSwitchButtonId(state().id) ?? ''"
			[name]="getSwitchButtonId(state().name) ?? ''"
			[value]="checked() ? 'on' : 'off'"
			[attr.aria-checked]="checked()"
			[attr.aria-label]="ariaLabel() || null"
			[attr.aria-labelledby]="mutableAriaLabelledby() || null"
			[attr.aria-describedby]="ariaDescribedby() || null"
			[attr.data-state]="checked() ? 'checked' : 'unchecked'"
			[attr.data-focus-visible]="focusVisible()"
			[attr.data-focus]="focused()"
			[attr.data-disabled]="state().disabled()"
			[disabled]="state().disabled()"
			[tabIndex]="tabIndex()"
			(click)="$event.preventDefault(); toggle()"
		>
			<ng-content select="brn-switch-thumb" />
		</button>
	`,
	host: {
		'[style]': '{display: "contents"}',
		'[attr.id]': 'state().id',
		'[attr.name]': 'state().name',
		'[attr.aria-labelledby]': 'null',
		'[attr.aria-label]': 'null',
		'[attr.aria-describedby]': 'null',
		'[attr.data-state]': 'checked() ? "checked" : "unchecked"',
		'[attr.data-focus-visible]': 'focusVisible()',
		'[attr.data-focus]': 'focused()',
		'[attr.data-disabled]': 'state().disabled()',
	},
	providers: [BRN_SWITCH_VALUE_ACCESSOR],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
})
export class BrnSwitchComponent implements AfterContentInit, OnDestroy {
	private readonly _destroyRef = inject(DestroyRef);
	private readonly _renderer = inject(Renderer2);
	private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
	private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
	private readonly _focusMonitor = inject(FocusMonitor);
	private readonly _cdr = inject(ChangeDetectorRef);
	private readonly _document = inject(DOCUMENT);

	protected readonly focusVisible = signal(false);
	protected readonly focused = signal(false);

	/**
	 * Whether the switch is checked.
	 * Can be bound with [(checked)]
	 */
	public readonly checked = model<boolean>(false);

	/**
	 * Sets the ID on the switch.
	 * When provided, the inner button gets this ID without the '-switch' suffix.
	 */
	public readonly id = input<string | null>(uniqueIdCounter++ + '');

	/**
	 * Sets the name on the switch.
	 * When provided, the inner button gets this name without a '-switch' suffix.
	 */
	public readonly name = input<string | null>(null);

	/**
	 * Sets class set on the inner button
	 */
	public readonly class = input<string | null>(null);

	/**
	 * Sets the aria-label attribute for accessibility.
	 */
	public readonly ariaLabel = input<string | null>(null, { alias: 'aria-label' });

	/**
	 * Sets the aria-labelledby attribute for accessibility.
	 */
	public readonly ariaLabelledby = input<string | null>(null, { alias: 'aria-labelledby' });
	public readonly mutableAriaLabelledby = linkedSignal(() => this.ariaLabelledby());

	/**
	 * Sets the aria-describedby attribute for accessibility.
	 */
	public readonly ariaDescribedby = input<string | null>(null, { alias: 'aria-describedby' });

	/**
	 * Whether the switch is required in a form.
	 */
	public readonly required = input(false, { transform: booleanAttribute });

	/**
	 * Whether the switch is disabled.
	 */
	public readonly disabled = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	/**
	 * tabIndex of the switch.
	 */
	public readonly tabIndex = input(0);

	/**
	 * Event emitted when the switch value changes.
	 */
	public readonly changed = output<boolean>();

	/**
	 * Event emitted when the switch is blurred (loses focus).
	 */
	public readonly touched = output<void>();

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	protected _onChange: ChangeFn<boolean> = () => {};
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	private _onTouched: TouchFn = () => {};

	public readonly switch = viewChild.required<ElementRef<HTMLInputElement>>('switch');

	protected readonly state = computed(() => {
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
			const state = this.state();
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

	protected toggle(): void {
		if (this.state().disabled()) return;

		this.checked.update((checked) => !checked);
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

		if (!this.switch()) return;
		this.switch().nativeElement.value = this.checked() ? 'on' : 'off';
		this.switch().nativeElement.dispatchEvent(new Event('change'));
	}

	ngOnDestroy() {
		this._focusMonitor.stopMonitoring(this._elementRef);
	}

	/** We intercept the id passed to the wrapper component and pass it to the underlying button switch control **/
	protected getSwitchButtonId(idPassedToContainer: string | null | undefined): string | null {
		return idPassedToContainer ? idPassedToContainer.replace(CONTAINER_POST_FIX, '') : null;
	}

	writeValue(value: boolean): void {
		this.checked.set(Boolean(value));
	}

	registerOnChange(fn: ChangeFn<boolean>): void {
		this._onChange = fn;
	}

	registerOnTouched(fn: TouchFn): void {
		this._onTouched = fn;
	}

	/** Implemented as a part of ControlValueAccessor. */
	setDisabledState(isDisabled: boolean): void {
		this.state().disabled.set(isDisabled);
		this._cdr.markForCheck();
	}
}
