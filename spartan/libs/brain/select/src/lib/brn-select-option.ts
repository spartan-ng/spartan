import type { FocusableOption } from '@angular/cdk/a11y';
import type { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, computed, Directive, ElementRef, inject, input, signal } from '@angular/core';
import { injectBrnSelectContent } from './brn-select-content.token';
import { injectBrnSelect } from './brn-select.token';

let nextId = 0;

@Directive({
	selector: '[brnOption]',
	host: {
		role: 'option',
		'[id]': 'id()',
		'[attr.aria-selected]': 'selected()',
		'[attr.aria-disabled]': '_disabled()',
		'(click)': 'select()',
		'[attr.dir]': '_select.dir()',
		'[attr.data-active]': "_active() ? '' : undefined",
		'[attr.data-disabled]': "_disabled() ? '' : undefined",
		'(mouseenter)': 'activate()',
		'(blur)': 'setInactiveStyles()',
		'[tabindex]': '-1',
	},
})
export class BrnSelectOption<T> implements FocusableOption {
	protected readonly _select = injectBrnSelect();
	protected readonly _content = injectBrnSelectContent<T>();
	public readonly elementRef = inject(ElementRef);
	public readonly id = input<string>(`brn-option-${++nextId}`);
	public readonly value = input<T>();

	// we use "_disabled" here because disabled is already defined in the Highlightable interface
	// eslint-disable-next-line @typescript-eslint/naming-convention
	public readonly _disabled = input<boolean, BooleanInput>(false, {
		alias: 'disabled',
		transform: booleanAttribute,
	});

	public get disabled(): boolean {
		return this._disabled();
	}

	public readonly selected = computed(() => this.value() !== undefined && this._select.isSelected(this.value()));
	protected readonly _active = signal(false);
	public readonly checkedState = computed(() => (this.selected() ? 'checked' : 'unchecked'));
	public readonly dir = this._select.dir;

	public select(): void {
		if (this._disabled()) {
			return;
		}

		if (this._select.multiple()) {
			this._select.toggleSelect(this.value());
			return;
		}

		this._select.selectOption(this.value());
	}

	/** Get the label for this element which is required by the FocusableOption interface. */
	getLabel(): string {
		return this.elementRef.nativeElement.textContent?.trim() ?? '';
	}

	setInactiveStyles(): void {
		this._active.set(false);
	}

	protected activate(): void {
		if (this._disabled()) {
			return;
		}
		this._content.setActiveOption(this);
	}

	public focus(): void {
		this.elementRef.nativeElement.focus();
		this._active.set(true);
	}
}
