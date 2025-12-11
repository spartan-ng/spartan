import { FocusMonitor } from '@angular/cdk/a11y';
import type { BooleanInput } from '@angular/cdk/coercion';
import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	type OnDestroy,
	booleanAttribute,
	computed,
	inject,
	input,
	output,
	viewChild,
} from '@angular/core';
import { injectBrnRadioGroup } from './brn-radio-group.token';

export class BrnRadioChange<T> {
	constructor(
		public source: BrnRadio<T>,
		public value: T,
	) {}
}

const CONTAINER_POST_FIX = '-radio';

@Component({
	selector: 'brn-radio',
	exportAs: 'brnRadio',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'brn-radio',
		'[attr.id]': '_hostId()',
		'[class.brn-radio-checked]': '_checked()',
		'[class.brn-radio-disabled]': '_disabledState()',
		'[attr.data-checked]': '_checked()',
		'[attr.data-disabled]': '_disabledState()',
		'[attr.data-value]': 'value()',
		// Needs to be removed since it causes some a11y issues (see #21266).
		'[attr.tabindex]': 'null',
		'[attr.aria-label]': 'null',
		'[attr.aria-labelledby]': 'null',
		'[attr.aria-describedby]': 'null',
		// Note: under normal conditions focus shouldn't land on this element, however it may be
		// programmatically set, for example inside of a focus trap, in this case we want to forward
		// the focus to the native element.
		'(focus)': '_inputElement().nativeElement.focus()',
	},
	template: `
		<div data-slot="indicator" class="flex h-fit w-fit empty:hidden" (click)="onTouchTargetClick($event)">
			<ng-content select="[target],[indicator]" />
		</div>
		<input
			#input
			style="position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0;"
			type="radio"
			[id]="id()"
			[checked]="_checked()"
			[disabled]="_disabledState()"
			[tabIndex]="_tabIndex()"
			[attr.name]="_radioGroup.name()"
			[attr.value]="value()"
			[required]="required()"
			[attr.aria-checked]="_checked()"
			[attr.aria-label]="ariaLabel()"
			[attr.aria-labelledby]="ariaLabelledby()"
			[attr.aria-describedby]="ariaDescribedby()"
			[attr.aria-disabled]="_disabledState()"
			(change)="onInputInteraction($event)"
			(click)="onInputClick($event)"
		/>
		<ng-content />
	`,
})
export class BrnRadio<T = unknown> implements OnDestroy {
	private static _nextUniqueId = 0;
	private readonly _focusMonitor = inject(FocusMonitor);
	private readonly _elementRef = inject(ElementRef);
	protected readonly _radioGroup = injectBrnRadioGroup<T>();

	/**
	 * Whether the radio button is disabled.
	 */
	public readonly disabled = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	/**
	 * Whether the radio button is disabled or the radio group is disabled.
	 */
	protected readonly _disabledState = computed(() => this.disabled() || this._radioGroup.disabledState());

	/**
	 * Whether the radio button is checked.
	 */
	protected readonly _checked = computed(() => this._radioGroup.value() === this.value());

	protected readonly _tabIndex = computed(() => {
		const disabled = this._disabledState();
		const checked = this._checked();
		const hasSelectedRadio = this._radioGroup.value() !== undefined;
		const isFirstRadio = this._radioGroup.radioButtons()[0] === this;

		if (disabled || (!checked && (hasSelectedRadio || !isFirstRadio))) {
			return -1;
		}
		return 0;
	});

	/**
	 * The unique ID for the radio button input. If none is supplied, it will be auto-generated.
	 */
	public readonly id = input<string | undefined>(undefined);

	public readonly ariaLabel = input<string | undefined>(undefined, { alias: 'aria-label' });

	public readonly ariaLabelledby = input<string | undefined>(undefined, { alias: 'aria-labelledby' });

	public readonly ariaDescribedby = input<string | undefined>(undefined, { alias: 'aria-describedby' });

	/**
	 * The value this radio button represents.
	 */
	public readonly value = input.required<T>();

	/**
	 * Whether the radio button is required.
	 */
	public readonly required = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	/**
	 * Event emitted when the checked state of this radio button changes.
	 */
	public readonly change = output<BrnRadioChange<T>>();

	protected readonly _hostId = computed(() => {
		return this.id() ? this.id() + CONTAINER_POST_FIX : `brn-radio-${++BrnRadio._nextUniqueId}`;
	});

	protected readonly _inputElement = viewChild.required<ElementRef<HTMLInputElement>>('input');

	constructor() {
		this._focusMonitor.monitor(this._elementRef, true);
	}

	ngOnDestroy(): void {
		this._focusMonitor.stopMonitoring(this._elementRef);
	}

	/** Dispatch change event with current value. */
	private emitChangeEvent(): void {
		this.change.emit(new BrnRadioChange(this, this.value()));
	}

	protected onInputClick(event: Event): void {
		// We have to stop propagation for click events on the visual hidden input element.
		// By default, when a user clicks on a label element, a generated click event will be
		// dispatched on the associated input element. Since we are using a label element as our
		// root container, the click event on the `radio-button` will be executed twice.
		// The real click event will bubble up, and the generated click event also tries to bubble up.
		// This will lead to multiple click events.
		// Preventing bubbling for the second event will solve that issue.
		event.stopPropagation();
	}

	protected onInputInteraction(event: Event): void {
		// We always have to stop propagation on the change event.
		// Otherwise the change event, from the input element, will bubble up and
		// emit its event object to the `change` output.
		event.stopPropagation();

		if (!this._checked() && !this._disabledState()) {
			this.emitChangeEvent();
			this._radioGroup.select(this, this.value());
		}
	}

	/** Triggered when the user clicks on the touch target. */
	protected onTouchTargetClick(event: Event): void {
		this.onInputInteraction(event);

		if (!this._disabledState()) {
			// Normally the input should be focused already, but if the click
			// comes from the touch target, then we might have to focus it ourselves.
			this._inputElement().nativeElement.focus();
		}
	}
}
