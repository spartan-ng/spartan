import type { BooleanInput, NumberInput } from '@angular/cdk/coercion';
import { CdkListboxModule } from '@angular/cdk/listbox';
import {
	CdkConnectedOverlay,
	type ConnectedOverlayPositionChange,
	type ConnectedPosition,
	OverlayModule,
} from '@angular/cdk/overlay';
import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	computed,
	contentChild,
	contentChildren,
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
	viewChild,
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
import { BrnSelectContent } from './brn-select-content';
import { BrnSelectOption } from './brn-select-option';
import type { BrnSelectTrigger } from './brn-select-trigger';
import { provideBrnSelect } from './brn-select.token';

export type BrnReadDirection = 'ltr' | 'rtl';

let nextId = 0;

@Component({
	selector: 'brn-select, hlm-select',
	imports: [OverlayModule, CdkListboxModule],
	providers: [
		provideExposedSideProviderExisting(() => BrnSelect),
		provideExposesStateProviderExisting(() => BrnSelect),
		provideBrnSelect(BrnSelect),
		{
			provide: BrnFormFieldControl,
			useExisting: forwardRef(() => BrnSelect),
		},
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		@if (!_selectLabel() && placeholder()) {
			<label style="display: none;" [attr.id]="labelId()">{{ placeholder() }}</label>
		} @else {
			<ng-content select="label[hlmLabel],label[brnLabel]" />
		}

		<div cdk-overlay-origin (click)="toggle()" #trigger="cdkOverlayOrigin">
			<ng-content select="hlm-select-trigger,[brnSelectTrigger]" />
		</div>

		<ng-template
			cdk-connected-overlay
			cdkConnectedOverlayLockPosition
			cdkConnectedOverlayHasBackdrop
			cdkConnectedOverlayBackdropClass="cdk-overlay-transparent-backdrop"
			[cdkConnectedOverlayOrigin]="trigger"
			[cdkConnectedOverlayOpen]="_delayedExpanded()"
			[cdkConnectedOverlayPositions]="_positions"
			[cdkConnectedOverlayWidth]="triggerWidth() > 0 ? triggerWidth() : 'auto'"
			(backdropClick)="hide()"
			(detach)="hide()"
			(positionChange)="_positionChanges$.next($event)"
		>
			<ng-content />
		</ng-template>
	`,
})
export class BrnSelect<T = unknown>
	implements ControlValueAccessor, DoCheck, ExposesSide, ExposesState, BrnFormFieldControl
{
	private readonly _defaultErrorStateMatcher = inject(ErrorStateMatcher);
	private readonly _parentForm = inject(NgForm, { optional: true });
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
	public readonly dir = input<BrnReadDirection>('ltr');
	public readonly closeDelay = input<number, NumberInput>(100, {
		transform: numberAttribute,
	});

	public readonly open = model<boolean>(false);
	public readonly value = model<T | T[]>();
	public readonly valueChange = output<T | T[]>();
	public readonly compareWith = input<(o1: T, o2: T) => boolean>((o1, o2) => o1 === o2);
	public readonly formDisabled = signal(false);

	/** Label provided by the consumer. */
	protected readonly _selectLabel = contentChild(BrnLabel, { descendants: false });

	/** Overlay pane containing the options. */
	protected readonly _selectContent = contentChild.required(BrnSelectContent);

	/** @internal */
	public readonly options = contentChildren(BrnSelectOption, { descendants: true });

	/** @internal Derive the selected options to filter out the unselected options */
	public readonly selectedOptions = computed(() => this.options().filter((option) => option.selected()));

	/** Overlay pane containing the options. */
	protected readonly _overlayDir = viewChild.required(CdkConnectedOverlay);
	public readonly trigger = signal<BrnSelectTrigger<T> | null>(null);
	public readonly triggerWidth = signal<number>(0);

	protected readonly _delayedExpanded = toSignal(
		toObservable(this.open).pipe(
			switchMap((expanded) => (!expanded ? of(expanded).pipe(delay(this.closeDelay())) : of(expanded))),
			takeUntilDestroyed(),
		),
		{ initialValue: false },
	);

	public readonly state = computed(() => (this.open() ? 'open' : 'closed'));

	protected readonly _positionChanges$ = new Subject<ConnectedOverlayPositionChange>();

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
	protected _positions: ConnectedPosition[] = [
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
		if (this.open() || this.disabled() || this.formDisabled() || this.options()?.length == 0) {
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
		} else {
			this.value.set(null as T);
			this.valueChange.emit(null as T);
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
		} else if (value !== undefined) {
			return this.compareWith()(selection as T, value);
		}

		return false;
	}
}
