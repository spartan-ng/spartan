import { FocusMonitor } from '@angular/cdk/a11y';
import { BooleanInput } from '@angular/cdk/coercion';
import { isPlatformBrowser } from '@angular/common';
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
	standalone: true,
	template: `
		<button
			#switch
			role="switch"
			type="button"
			[class]="class()"
			[id]="forChild(state().id) ?? ''"
			[name]="forChild(state().name) ?? ''"
			[value]="checked() ? 'on' : 'off'"
			[attr.aria-checked]="checked()"
			[attr.aria-label]="ariaLabel() || null"
			[attr.aria-labelledby]="mutableAriaLabelledby()() || null"
			[attr.aria-describedby]="ariaDescribedby() || null"
			[attr.data-state]="checked() ? 'checked' : 'unchecked'"
			[attr.data-focus-visible]="focusVisible()"
			[attr.data-focus]="focused()"
			[attr.data-disabled]="state().disabled()"
			[disabled]="disabled()"
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
	public readonly id = input<string | null>(uniqueIdCounter++ + '');

	/**
	 * Sets the name on the switch.
	 * When provided, the inner input gets this name without a '-switch' suffix.
	 */
	public readonly name = input<string | null>(null);

	/**
	 * Sets class set on button
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
	public readonly mutableAriaLabelledby = computed(() => signal(this.ariaLabelledby()));
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
			const isDisabled = this.state().disabled();
			const state = this.state();
			if (!this._elementRef.nativeElement || !this._isBrowser) return;

			const switchElement = this._elementRef.nativeElement;

			const labelElement = this._findLabelForSwitch(switchElement);

			if (!labelElement) return;

			this._renderer.setAttribute(labelElement, 'data-disabled', isDisabled ? 'true' : 'false');
			this._connectLabelId(labelElement, state.id);
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

	private _findLabelForSwitch(element: HTMLElement): HTMLElement | null {
		// 1. Check if parent is label
		let parent = this._renderer.parentNode(element);
		if (!parent) return null;

		// 2. If parent is HLM-SWITCH, go up one more
		if (parent.tagName === 'HLM-SWITCH') {
			parent = this._renderer.parentNode(parent);
			if (!parent) return null;
		}

		// 3. If parent is label, return it
		if (parent.tagName === 'LABEL') {
			return parent;
		}

		// 4. Otherwise look for label with matching "for" attribute
		return parent.querySelector(`label[for="${this.forChild(this.state().id)}"]`);
	}

	private _connectLabelId(label: HTMLElement, id: string | null): void {
		const existingLabelId = label.id;
		const newLabelId = id + '-label';

		this.mutableAriaLabelledby().set(existingLabelId || newLabelId);

		// Only set ID if not already have one
		if (!existingLabelId || existingLabelId.length === 0) {
			this._renderer.setAttribute(label, 'id', newLabelId);
		}
	}
}
