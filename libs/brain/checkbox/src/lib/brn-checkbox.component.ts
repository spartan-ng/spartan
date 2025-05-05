import { FocusMonitor } from '@angular/cdk/a11y';
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
	ViewEncapsulation,
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
			(click)="$event.preventDefault(); toggle($event)"
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
	encapsulation: ViewEncapsulation.None,
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

	public readonly checked = model<BrnCheckboxValue>(false);
	public readonly isChecked = this.checked.asReadonly();

	protected readonly _dataState = computed(() => {
		const checked = this.checked();
		if (checked === 'indeterminate') return 'indeterminate';
		return checked ? 'checked' : 'unchecked';
	});

	protected readonly _ariaChecked = computed(() => {
		const checked = this.checked();
		if (checked === 'indeterminate') return 'mixed';
		return checked ? 'true' : 'false';
	});

	/** Used to set the id on the underlying button element. */
	public readonly id = input<string | null>(uniqueIdCounter++ + '');

	/** Used to set the name attribute on the underlying button element. */
	public readonly name = input<string | null>(null);

	/** Used to set class underlying button element. */
	public readonly class = input<string | null>(null);

	/** Used to set the aria-label attribute on the underlying button element. */
	public readonly ariaLabel = input<string | null>(null, { alias: 'aria-label' });

	/** Used to set the aria-labelledby attribute on the underlying button element. */
	public readonly ariaLabelledby = input<string | null>(null, { alias: 'aria-labelledby' });
	public readonly mutableAriaLabelledby = linkedSignal(() => this.ariaLabelledby());

	public readonly ariaDescribedby = input<string | null>(null, { alias: 'aria-describedby' });

	public readonly required = input(false, { transform: booleanAttribute });

	public readonly disabled = input(false, { transform: booleanAttribute });

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

	public readonly checkbox = viewChild.required<ElementRef<HTMLButtonElement>>('checkBox');

	public readonly changed = output<BrnCheckboxValue>();

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

	toggle(event: Event) {
		if (this.state().disabled()) return;
		event.preventDefault();

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
						this._cdr.markForCheck();
					});
				}
			});
	}

	ngOnDestroy() {
		this._focusMonitor.stopMonitoring(this._elementRef);
	}

	/** We intercept the id passed to the wrapper component and pass it to the underlying button checkbox control **/
	protected getCheckboxButtonId(idPassedToContainer: string | null | undefined): string | null {
		return idPassedToContainer ? idPassedToContainer.replace(CONTAINER_POST_FIX, '') : null;
	}

	writeValue(value: BrnCheckboxValue): void {
		if (value === 'indeterminate') {
			this.checked.set('indeterminate');
		} else {
			this.checked.set(value);
		}
	}

	registerOnChange(fn: ChangeFn<BrnCheckboxValue>): void {
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

type BrnCheckboxValue = boolean | 'indeterminate';
