import { FocusMonitor } from '@angular/cdk/a11y';
import { NgStyle, isPlatformBrowser } from '@angular/common';
import {
	type AfterContentInit,
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	HostListener,
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
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ChangeFn, TouchFn } from '@spartan-ng/brain/forms';

export const BRN_CHECKBOX_VALUE_ACCESSOR = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => BrnCheckboxComponent),
	multi: true,
};

export function indeterminateBooleanAttribute(value: unknown): boolean | 'indeterminate' {
	if (value === 'indeterminate') return 'indeterminate';
	return booleanAttribute(value);
}

const CONTAINER_POST_FIX = '-checkbox';

@Component({
	selector: 'brn-checkbox',
	imports: [NgStyle],
	template: `
		<input
			#checkBox
			tabindex="-1"
			type="checkbox"
			role="checkbox"
			[ngStyle]="{
				position: 'absolute',
				width: '1px',
				height: '1px',
				padding: '0',
				margin: '-1px',
				overflow: 'hidden',
				clip: 'rect(0, 0, 0, 0)',
				whiteSpace: 'nowrap',
				borderWidth: '0',
			}"
			[id]="id() ?? ''"
			[name]="name() ?? ''"
			[value]="_value()"
			[checked]="isChecked()"
			[required]="required()"
			[attr.aria-label]="ariaLabel()"
			[attr.aria-labelledby]="ariaLabelledby()"
			[attr.aria-describedby]="ariaDescribedby()"
			[attr.aria-required]="required() || null"
			[attr.aria-checked]="_ariaChecked()"
		/>
		<ng-content />
	`,
	host: {
		'[attr.tabindex]': 'state().disabled() ? "-1" : "0"',
		'[attr.data-state]': '_dataState()',
		'[attr.data-focus-visible]': 'focusVisible()',
		'[attr.data-focus]': 'focused()',
		'[attr.data-disabled]': 'state().disabled()',
		'[attr.aria-labelledby]': 'null',
		'[attr.aria-label]': 'null',
		'[attr.aria-describedby]': 'null',
		'[attr.id]': 'hostId()',
		'[attr.name]': 'hostName()',
	},
	providers: [BRN_CHECKBOX_VALUE_ACCESSOR],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
})
export class BrnCheckboxComponent implements AfterContentInit, OnDestroy {
	private readonly _renderer = inject(Renderer2);
	private readonly _elementRef = inject(ElementRef);
	private readonly _focusMonitor = inject(FocusMonitor);
	private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

	private readonly _focusVisible = signal(false);
	public readonly focusVisible = this._focusVisible.asReadonly();
	private readonly _focused = signal(false);
	public readonly focused = this._focused.asReadonly();

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
	protected readonly _value = computed(() => {
		const checked = this.checked();
		if (checked === 'indeterminate') return '';
		return checked ? 'on' : 'off';
	});

	/** Used to set the id on the underlying input element. */
	public readonly id = input<string | null>(null);
	protected readonly hostId = computed(() => (this.id() ? this.id() + CONTAINER_POST_FIX : null));

	/** Used to set the name attribute on the underlying input element. */
	public readonly name = input<string | null>(null);
	protected readonly hostName = computed(() => (this.name() ? this.name() + CONTAINER_POST_FIX : null));

	/** Used to set the aria-label attribute on the underlying input element. */
	public readonly ariaLabel = input<string | null>(null, { alias: 'aria-label' });

	/** Used to set the aria-labelledby attribute on the underlying input element. */
	public readonly ariaLabelledby = input<string | null>(null, { alias: 'aria-labelledby' });

	public readonly ariaDescribedby = input<string | null>(null, { alias: 'aria-describedby' });

	public readonly required = input(false, { transform: booleanAttribute });

	public readonly disabled = input(false, { transform: booleanAttribute });

	protected readonly state = computed(() => ({
		disabled: signal(this.disabled()),
	}));

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	protected _onChange: ChangeFn<BrnCheckboxValue> = () => {};
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	private _onTouched: TouchFn = () => {};

	public readonly checkbox = viewChild.required<ElementRef<HTMLInputElement>>('checkBox');

	public readonly changed = output<BrnCheckboxValue>();

	constructor() {
		effect(() => {
			const parent = this._renderer.parentNode(this._elementRef.nativeElement);
			if (!parent) return;
			// check if parent is a label and assume it is for this checkbox
			if (parent?.tagName === 'LABEL') {
				this._renderer.setAttribute(parent, 'data-disabled', this.state().disabled() ? 'true' : 'false');
				return;
			}
			if (!this._isBrowser) return;

			const label = parent?.querySelector(`label[for="${this.id()}"]`);
			if (!label) return;
			this._renderer.setAttribute(label, 'data-disabled', this.state().disabled() ? 'true' : 'false');
		});
	}

	@HostListener('click', ['$event'])
	@HostListener('keyup.space', ['$event'])
	@HostListener('keyup.enter', ['$event'])
	toggle(event: Event) {
		if (this.state().disabled()) return;
		event.preventDefault();
		const previousChecked = this.checked();
		this.checked.set(previousChecked === 'indeterminate' ? true : !previousChecked);
		this._onChange(!previousChecked);
		this.changed.emit(!previousChecked);
	}

	ngAfterContentInit() {
		this._focusMonitor.monitor(this._elementRef, true).subscribe((focusOrigin) => {
			if (focusOrigin) this._focused.set(true);
			if (focusOrigin === 'keyboard' || focusOrigin === 'program') {
				this._focusVisible.set(true);
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
				});
			}
		});

		this.checkbox().nativeElement.indeterminate = this.checked() === 'indeterminate';
		if (this.checkbox().nativeElement.indeterminate) {
			this.checkbox().nativeElement.value = 'indeterminate';
		} else {
			this.checkbox().nativeElement.value = this.checked() ? 'on' : 'off';
		}
		this.checkbox().nativeElement.dispatchEvent(new Event('change'));
	}

	ngOnDestroy() {
		this._focusMonitor.stopMonitoring(this._elementRef);
	}

	writeValue(value: BrnCheckboxValue): void {
		if (value === 'indeterminate') {
			this.checked.set('indeterminate');
		} else {
			this.checked.set(!!value);
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
	}

	/**
	 * If the space key is pressed, prevent the default action to stop the page from scrolling.
	 */
	@HostListener('keydown.space', ['$event'])
	protected preventScrolling(event: KeyboardEvent): void {
		event.preventDefault();
	}
}

type BrnCheckboxValue = boolean | 'indeterminate';
