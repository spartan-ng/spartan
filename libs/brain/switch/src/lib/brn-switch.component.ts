import { FocusMonitor } from '@angular/cdk/a11y';
import { BooleanInput } from '@angular/cdk/coercion';
import { NgStyle, isPlatformBrowser } from '@angular/common';
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
	ViewEncapsulation,
	booleanAttribute,
	computed,
	effect,
	forwardRef,
	inject,
	input,
	model,
	output,
	signal,
	viewChild,
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

@Component({
	selector: 'brn-switch',
	imports: [NgStyle],
	template: `
		<input
			#checkBox
			type="checkbox"
			[id]="forChild(state().id) ?? ''"
			[name]="forChild(state().name) ?? ''"
			[value]="checked() ? 'on' : 'off'"
			[ngStyle]="inputStyles()"
			[checked]="checked() || null"
			[required]="required() || null"
			[disabled]="state().disabled() || null"
			[attr.aria-label]="ariaLabel()"
			[attr.aria-labelledby]="ariaLabelledby()"
			[attr.aria-describedby]="ariaDescribedby()"
			tabindex="-1"
		/>
		<ng-content select="brn-switch-thumb" />
	`,
	host: {
		role: 'switch',
		'[attr.aria-checked]': 'checked()',
		'[attr.aria-disabled]': 'disabled() || null',
		'[attr.aria-required]': 'required() || null',
		'[attr.data-state]': 'checked() ? "checked" : "unchecked"',
		'[attr.data-focus-visible]': 'focusVisible()',
		'[attr.data-focus]': 'focused()',
		'[attr.data-disabled]': 'state().disabled()',
		'[attr.aria-labelledby]': 'null',
		'[attr.aria-label]': 'null',
		'[attr.aria-describedby]': 'null',
		'[attr.id]': 'state().id',
		'[attr.name]': 'state().name',
		tabindex: '0',
		'(click)': 'toggle()',
		'(keyup.space)': 'toggle()',
		'(keydown.space)': '$event.preventDefault()',
		'(keyup.enter)': 'toggle()',
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

	protected readonly focusVisible = signal(false);
	protected readonly focused = signal(false);

	/**
	 * Whether the switch is checked.
	 * Can be bound with [(checked)]
	 */
	public readonly checked = model<boolean>(false);

	/**
	 * Sets the ID on the switch.
	 * When provided, the inner input gets this ID without the '-switch' suffix.
	 */
	public readonly id = input<string | null>(null);

	/**
	 * Sets the name on the switch.
	 * When provided, the inner input gets this name without a '-switch' suffix.
	 */
	public readonly name = input<string | null>(null);

	/**
	 * Sets the aria-label attribute for accessibility.
	 */
	public readonly ariaLabel = input<string | null>(null, { alias: 'aria-label' });

	/**
	 * Sets the aria-labelledby attribute for accessibility.
	 */
	public readonly ariaLabelledby = input<string | null>(null, { alias: 'aria-labelledby' });

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
	 * Custom styles for the hidden input element.
	 * Usually don't need to change this.
	 */
	public readonly inputStyles = input<{ [p: string]: any } | null | undefined>({
		position: 'absolute',
		width: '1px',
		height: '1px',
		padding: '0',
		margin: '-1px',
		overflow: 'hidden',
		clip: 'rect(0, 0, 0, 0)',
		whiteSpace: 'nowrap',
		borderWidth: '0',
	});

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

	public readonly checkbox = viewChild.required<ElementRef<HTMLInputElement>>('checkBox');

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
			/** search for the label and set the disabled state */
			let parent = this._renderer.parentNode(this._elementRef.nativeElement);
			if (!parent) return;
			// if parent is a HLM-SWITCH, then we need to go up one more level to get the label
			if (parent?.tagName === 'HLM-SWITCH') {
				parent = this._renderer.parentNode(parent);
			}
			if (!parent) return;
			// check if parent is a label and assume it is for this checkbox
			if (parent?.tagName === 'LABEL') {
				this._renderer.setAttribute(parent, 'data-disabled', this.state().disabled() ? 'true' : 'false');
				return;
			}
			if (!this._isBrowser) return;

			const label = parent?.querySelector(`label[for="${this.forChild(this.state().id)}"]`);
			if (!label) return;
			this._renderer.setAttribute(label, 'data-disabled', this.state().disabled() ? 'true' : 'false');
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

		if (!this.checkbox()) return;
		this.checkbox().nativeElement.value = this.checked() ? 'on' : 'off';
		this.checkbox().nativeElement.dispatchEvent(new Event('change'));
	}

	ngOnDestroy() {
		this._focusMonitor.stopMonitoring(this._elementRef);
	}

	protected forChild(parentValue: string | null | undefined): string | null {
		return parentValue ? parentValue.replace(CONTAINER_POST_FIX, '') : null;
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

	/**
	 * If the space key is pressed, prevent the default action to stop the page from scrolling.
	 */
	protected preventScrolling(event: KeyboardEvent): void {
		event.preventDefault();
	}
}
