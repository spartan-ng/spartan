import type { FocusableOption } from '@angular/cdk/a11y';
import { BooleanInput } from '@angular/cdk/coercion';
import { CdkOption } from '@angular/cdk/listbox';
import {
	AfterContentChecked,
	ChangeDetectorRef,
	Directive,
	ElementRef,
	booleanAttribute,
	computed,
	effect,
	inject,
	input,
	signal,
} from '@angular/core';
import { injectBrnSelect } from './brn-select.token';

@Directive({
	selector: '[brnOption]',
	standalone: true,
	host: {
		role: 'option',
		class: 'cdk-option',
		'[id]': 'id',
		'[attr.aria-selected]': 'selected()',
		'[attr.tabindex]': 'getTabIndex()',
		'[attr.aria-disabled]': 'disabledSignal()',
		'(click)': 'select()',
		'(mouseenter)': 'hover()',
		'(blur)': 'blur()',
		'[attr.dir]': '_select.dir()',
		'[attr.data-disabled]': "disabledSignal() ? '' : undefined",
	},
})
export class BrnSelectOptionDirective<T> implements FocusableOption, AfterContentChecked {
	private readonly _option = inject(CdkOption, { host: true });
	private readonly _changeDetector = inject(ChangeDetectorRef);
	protected readonly _select = injectBrnSelect();

	private readonly _focused = signal<boolean>(false);
	public readonly elementRef = inject(ElementRef);

	public readonly selected = computed(() => {
		const value = this.value();
		if (Array.isArray(value)) {
			const itemFound = value.find((val) => val === this._option.value);
			return !!itemFound;
		}
		return this._option.value === this._select.value();
	});
	public readonly focused = computed(() => this._focused());
	public readonly checkedState = computed(() => (this.selected() ? 'checked' : 'unchecked'));
	public readonly dir = computed(() => this._select.dir());

	public value = input.required<T>();

	constructor() {
		effect(() => (this._option.value = this.value()));
		effect(() => (this._option.disabled = this.disabledSignal()));
	}

	ngAfterContentChecked(): void {
		this._option.value = this.value();
	}

	// we use "disabledSignal" here because disabled is already defined in the FocusableOption interface
	public readonly disabledSignal = input<boolean, BooleanInput>(false, {
		alias: 'disabled',
		transform: booleanAttribute,
	});

	protected hover(): void {
		this.focus();
	}

	public focus(): void {
		this._option.focus();
		this._focused.set(true);
	}

	public blur(): void {
		this._focused.set(false);
	}

	public select() {
		this._option.select();
		this._changeDetector.detectChanges();
	}

	/** Get the tabindex for this option. */
	protected getTabIndex() {
		if (this.disabledSignal()) {
			return -1;
		}
		return this.isActive() ? 0 : -1;
	}

	/** Whether this option is active. */
	protected isActive() {
		return this.listbox.isActive(this);
	}

	/** Get the label for this element which is required by the FocusableOption interface. */
	getLabel(): string {
		return this.elementRef.nativeElement.textContent?.trim() ?? '';
	}
}
