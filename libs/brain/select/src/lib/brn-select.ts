import { Directionality } from '@angular/cdk/bidi';
import type { BooleanInput, NumberInput } from '@angular/cdk/coercion';
import { type ConnectedOverlayPositionChange, type ConnectedPosition } from '@angular/cdk/overlay';
import {
	booleanAttribute,
	computed,
	contentChild,
	Directive,
	type DoCheck,
	forwardRef,
	inject,
	Injector,
	input,
	model,
	numberAttribute,
	output,
	type Signal,
	signal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { type ControlValueAccessor, FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import {
	type ExposesSide,
	type ExposesState,
	provideExposedSideProviderExisting,
	provideExposesStateProviderExisting,
} from '@spartan-ng/brain/core';
import { BrnFormFieldControl } from '@spartan-ng/brain/form-field';
import { type ChangeFn, ErrorStateMatcher, ErrorStateTracker, type TouchFn } from '@spartan-ng/brain/forms';
import { BrnLabel } from '@spartan-ng/brain/label';
import { of, Subject } from 'rxjs';
import { delay, map, switchMap } from 'rxjs/operators';
import type { BrnSelectOption } from './brn-select-option';
import type { BrnSelectTrigger } from './brn-select-trigger';
import { provideBrnSelect } from './brn-select.token';

export type BrnReadDirection = 'ltr' | 'rtl';

let nextId = 0;

@Directive({
	selector: 'brn-select, [brnSelect]',
	exportAs: 'brnSelect',
	standalone: true,
	providers: [
		provideExposedSideProviderExisting(() => BrnSelect),
		provideExposesStateProviderExisting(() => BrnSelect),
		provideBrnSelect(BrnSelect),
		{
			provide: BrnFormFieldControl,
			useExisting: forwardRef(() => BrnSelect),
		},
	],
})
export class BrnSelect<T = unknown>
	implements ControlValueAccessor, DoCheck, ExposesSide, ExposesState, BrnFormFieldControl
{
	private readonly _defaultErrorStateMatcher = inject(ErrorStateMatcher);
	private readonly _parentForm = inject(NgForm, { optional: true });
	private readonly _dir = inject(Directionality);
	private readonly _injector = inject(Injector);
	private readonly _parentFormGroup = inject(FormGroupDirective, { optional: true });
	public readonly ngControl = inject(NgControl, { optional: true, self: true });

	public readonly id = input<string>(`brn-select-${++nextId}`);
	public readonly multiple = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});
	public readonly placeholder = input<string>('');
	public readonly disabled = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	/** internal **/
	public readonly direction = this._dir.valueSignal;

	public readonly closeDelay = input<number, NumberInput>(100, {
		transform: numberAttribute,
	});

	public readonly open = model<boolean>(false);
	public readonly value = model<T | T[]>();
	public readonly valueChange = output<T | T[]>();
	public readonly compareWith = input<(o1: T, o2: T) => boolean>((o1, o2) => o1 === o2);

	/** Whether the trigger input is read-only. Defaults to true (select pattern). */
	public readonly readonly = input(true, { transform: booleanAttribute });

	/**
	 * Optional function to convert a value to its display string.
	 * Use this when your values are objects (e.g. { id, label }) so the trigger
	 * input shows the human-readable label from page load without requiring the
	 * dropdown to have been opened first.
	 *
	 * @example
	 * [displayWith]="(fruit) => fruit.label"
	 */
	public readonly displayWith = input<((value: T) => string) | null>(null);

	/**
	 * Tracks whether the user (or an external form reset) has made an explicit selection.
	 * Required to distinguish "value is undefined because nothing was selected yet" from
	 * "value is undefined because the user explicitly selected an option whose value is undefined".
	 * @internal
	 */
	private readonly _selectionMade = signal(false);

	/**
	 * The string displayed in the trigger input.
	 * Resolution order:
	 *   1. displayWith function applied to value (works before first open)
	 *   2. Option labels found by searching registered options with compareWith
	 *      (mirrors the old BrnSelectValue approach; supports null/undefined option values)
	 *   3. Raw value toString() fallback
	 */
	public readonly displayValue = computed<string>(() => {
		const fn = this.displayWith();
		const value = this.value();

		if (fn) {
			if (value === null || value === undefined) return '';
			if (Array.isArray(value) && value.length === 0) return '';
			return Array.isArray(value) ? value.map((v) => fn(v)).join(', ') : fn(value as T);
		}

		const allOptions = this.options();
		const compareWith = this.compareWith();

		if (allOptions.length) {
			if (Array.isArray(value)) {
				if (value.length === 0) return '';
				const labels = (value as T[])
					.map((v) => allOptions.find((o) => compareWith(o.value() as T, v))?.getLabel() ?? '')
					.filter(Boolean);
				return labels.length ? labels.join(', ') : '';
			} else if (value !== null && value !== undefined) {
				const match = allOptions.find((o) => compareWith(o.value() as T, value as T));
				return match ? match.getLabel() : String(value);
			} else if (this._selectionMade()) {
				// null/undefined value: only show option label when explicitly selected
				const match = allOptions.find((o) => compareWith(o.value() as T, value as T));
				return match ? match.getLabel() : '';
			}
			return '';
		}

		// Before first open (options not yet registered): fall back to selectedOptions labels
		const labels = this.selectedOptions()
			.map((o) => o.getLabel())
			.filter(Boolean);
		if (labels.length) return labels.join(', ');

		if (value === null || value === undefined) return '';
		if (Array.isArray(value) && value.length === 0) return '';
		return Array.isArray(value) ? (value as T[]).join(', ') : String(value ?? '');
	});

	public readonly formDisabled = signal(false);

	/** Label provided by the consumer. */
	public readonly _selectLabel = contentChild(BrnLabel, { descendants: false });

	/**
	 * @internal
	 * Options are registered by BrnSelectContent after it initializes its own contentChildren.
	 * We use a writable signal here because as a directive, contentChildren cannot traverse
	 * CDK overlay portals where the options are actually rendered.
	 */
	private readonly _options = signal<readonly BrnSelectOption<T>[]>([]);
	public readonly options: Signal<readonly BrnSelectOption<T>[]> = this._options.asReadonly();

	/** Register options from BrnSelectContent. Called by BrnSelectContent via effect. */
	public registerOptions(options: readonly BrnSelectOption<T>[]): void {
		this._options.set(options);
	}

	/** @internal Derive the selected options to filter out the unselected options */
	public readonly selectedOptions = computed(() => this.options().filter((option) => option.selected()));

	public readonly trigger = signal<BrnSelectTrigger<T> | null>(null);
	public readonly triggerWidth = signal<number>(0);

	public readonly _delayedExpanded = toSignal(
		toObservable(this.open).pipe(
			switchMap((expanded) => (!expanded ? of(expanded).pipe(delay(this.closeDelay())) : of(expanded))),
			takeUntilDestroyed(),
		),
		{ initialValue: false },
	);

	public readonly state = computed(() => (this.open() ? 'open' : 'closed'));

	public readonly _positionChanges$ = new Subject<ConnectedOverlayPositionChange>();

	public readonly side: Signal<'top' | 'bottom' | 'left' | 'right'> = toSignal(
		this._positionChanges$.pipe(
			map<ConnectedOverlayPositionChange, 'top' | 'bottom' | 'left' | 'right'>((change) =>
				// todo: better translation or adjusting hlm to take that into account
				change.connectionPair.originY === 'center'
					? change.connectionPair.originX === 'start'
						? 'left'
						: 'right'
					: change.connectionPair.originY,
			),
		),
		{ initialValue: 'bottom' },
	);

	public readonly labelId = computed(() => this._selectLabel()?.id ?? `${this.id()}--label`);

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	private _onChange: ChangeFn<T | T[]> = () => {};
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	private _onTouched: TouchFn = () => {};

	/*
	 * This position config ensures that the top "start" corner of the overlay
	 * is aligned with with the top "start" of the origin by default (overlapping
	 * the trigger completely). If the panel cannot fit below the trigger, it
	 * will fall back to a position above the trigger.
	 */
	public _positions: ConnectedPosition[] = [
		{
			originX: 'start',
			originY: 'bottom',
			overlayX: 'start',
			overlayY: 'top',
		},
		{
			originX: 'end',
			originY: 'bottom',
			overlayX: 'end',
			overlayY: 'top',
		},
		{
			originX: 'start',
			originY: 'top',
			overlayX: 'start',
			overlayY: 'bottom',
		},
		{
			originX: 'end',
			originY: 'top',
			overlayX: 'end',
			overlayY: 'bottom',
		},
	];

	public errorStateTracker: ErrorStateTracker;

	public readonly errorState = computed(() => this.errorStateTracker.errorState());

	constructor() {
		if (this.ngControl !== null) {
			this.ngControl.valueAccessor = this;
		}

		this.errorStateTracker = new ErrorStateTracker(
			this._defaultErrorStateMatcher,
			this.ngControl,
			this._parentFormGroup,
			this._parentForm,
		);
	}

	ngDoCheck() {
		this.errorStateTracker.updateErrorState();
	}

	public toggle(): void {
		if (this.open()) {
			this.hide();
		} else {
			this.show();
		}
	}

	public show(): void {
		if (this.open() || this.disabled() || this.formDisabled()) {
			return;
		}

		this.open.set(true);
	}

	public hide(): void {
		if (!this.open()) return;

		this.open.set(false);
		this._onTouched();

		// restore focus to the trigger
		this.trigger()?.focus();
	}

	public writeValue(value: T): void {
		this.value.set(value);
		// An external form reset (null/undefined/empty array) clears the selection state so
		// the trigger shows the placeholder instead of a stale label.
		const isEmpty = value === null || value === undefined || (Array.isArray(value) && (value as T[]).length === 0);
		this._selectionMade.set(!isEmpty);
	}

	public registerOnChange(fn: ChangeFn<T | T[]>): void {
		this._onChange = fn;
	}

	public registerOnTouched(fn: TouchFn): void {
		this._onTouched = fn;
	}

	public setDisabledState(isDisabled: boolean) {
		this.formDisabled.set(isDisabled);
	}

	selectOption(value: T): void {
		// if this is a multiple select we need to add the value to the array
		if (this.multiple()) {
			const currentValue = this.value() as T[];
			const newValue = currentValue ? [...currentValue, value] : [value];
			this.value.set(newValue);
			this.valueChange.emit(newValue);
		} else {
			this.value.set(value);
			this.valueChange.emit(value);
		}

		this._selectionMade.set(true);
		this._onChange?.(this.value() as T | T[]);

		// if this is single select close the dropdown
		if (!this.multiple()) {
			this.hide();
		}
	}

	deselectOption(value: T): void {
		if (this.multiple()) {
			const currentValue = this.value() as T[];
			const newValue = currentValue.filter((val) => !this.compareWith()(val, value));
			this.value.set(newValue);
			this.valueChange.emit(newValue);
			this._selectionMade.set(newValue.length > 0);
		} else {
			this.value.set(null as T);
			this.valueChange.emit(null as T);
			this._selectionMade.set(false);
		}

		this._onChange?.(this.value() as T | T[]);
	}

	toggleSelect(value: T): void {
		if (this.isSelected(value)) {
			this.deselectOption(value);
		} else {
			this.selectOption(value);
		}
	}

	isSelected(value: T): boolean {
		const selection = this.value();

		if (Array.isArray(selection)) {
			return selection.some((val) => this.compareWith()(val, value));
		} else if (value !== undefined && value !== null) {
			return this.compareWith()(selection as T, value);
		}

		return false;
	}
}
