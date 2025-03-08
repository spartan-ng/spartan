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
			tabindex="-1"
			type="checkbox"
			role="switch"
			[id]="forChild(state().id) ?? ''"
			[name]="forChild(state().name) ?? ''"
			[value]="checked() ? 'on' : 'off'"
			[ngStyle]="{
				position: 'absolute',
				width: '1px',
				height: '1px',
				padding: '0',
				margin: -'1px',
				overflow: 'hidden',
				clip: 'rect(0, 0, 0, 0)',
				whiteSpace: 'nowrap',
				borderWidth: '0',
			}"
			[checked]="checked()"
			[attr.aria-label]="ariaLabel()"
			[attr.aria-labelledby]="ariaLabelledby()"
			[attr.aria-describedby]="ariaDescribedby()"
			[attr.aria-required]="required() || null"
		/>
		<ng-content select="brn-switch-thumb" />
	`,
	host: {
		tabindex: '0',
		'[attr.data-state]': 'checked() ? "checked" : "unchecked"',
		'[attr.data-focus-visible]': 'focusVisible()',
		'[attr.data-focus]': 'focused()',
		'[attr.data-disabled]': 'state().disabled()',
		'[attr.aria-labelledby]': 'null',
		'[attr.aria-label]': 'null',
		'[attr.aria-describedby]': 'null',
		'[attr.id]': 'state().id',
		'[attr.name]': 'state().name',
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

	public readonly checked = model<boolean>(false);

	/** Used to set the id on the underlying input element. */

	public readonly id = input<string | null>(null);

	/** Used to set the name attribute on the underlying input element. */
	public readonly name = input<string | null>(null);

	/** Used to set the aria-label attribute on the underlying input element. */
	public readonly ariaLabel = input<string | null>(null, { alias: 'aria-label' });

	/** Used to set the aria-labelledby attribute on the underlying input element. */
	public readonly ariaLabelledby = input<string | null>(null, { alias: 'aria-labelledby' });

	/** Used to set the aria-describedby attribute on the underlying input element. */
	public readonly ariaDescribedby = input<string | null>(null, { alias: 'aria-describedby' });

	public readonly required = input(false, { transform: booleanAttribute });

	public readonly disabled = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	protected _onChange: ChangeFn<boolean> = () => {};
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	private _onTouched: TouchFn = () => {};

	public readonly checkbox = viewChild.required<ElementRef<HTMLInputElement>>('checkBox');

	public readonly changed = output<boolean>();

	public readonly touched = output<void>();

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

	@HostListener('click', ['$event'])
	@HostListener('keyup.enter', ['$event'])
	@HostListener('keyup.space', ['$event'])
	protected toggle(event: Event): void {
		if (this.state().disabled()) return;
		event.preventDefault();

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
	@HostListener('keydown.space', ['$event'])
	protected preventScrolling(event: KeyboardEvent): void {
		event.preventDefault();
	}
}
