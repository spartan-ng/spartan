import { CdkListbox, CdkListboxModule, CdkOption } from '@angular/cdk/listbox';
import {
	CdkConnectedOverlay,
	type ConnectedOverlayPositionChange,
	type ConnectedPosition,
	OverlayModule,
} from '@angular/cdk/overlay';
import {
	AfterContentInit,
	ChangeDetectionStrategy,
	Component,
	type DoCheck,
	type Signal,
	computed,
	contentChild,
	contentChildren,
	inject,
	input,
	output,
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
import { ChangeFn, ErrorStateMatcher, ErrorStateTracker, TouchFn } from '@spartan-ng/brain/forms';
import { BrnLabelDirective } from '@spartan-ng/brain/label';
import { Subject, combineLatest, of } from 'rxjs';
import { delay, map, switchMap } from 'rxjs/operators';
import { BrnSelectContentComponent } from './brn-select-content.component';
import { BrnSelectService } from './brn-select.service';

export type BrnReadDirection = 'ltr' | 'rtl';

let nextId = 0;

@Component({
	selector: 'brn-select, hlm-select',
	standalone: true,
	imports: [OverlayModule, CdkListboxModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		BrnSelectService,
		CdkListbox,
		provideExposedSideProviderExisting(() => BrnSelectComponent),
		provideExposesStateProviderExisting(() => BrnSelectComponent),
		{
			provide: BrnFormFieldControl,
			useExisting: BrnSelectComponent,
		},
	],
	template: `
		@if (!labelProvided() && placeholder()) {
			<label class="hidden" [attr.id]="backupLabelId()">{{ placeholder() }}</label>
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
			(backdropClick)="close()"
			(detach)="close()"
			(positionChange)="_positionChanges$.next($event)"
		>
			<ng-content />
		</ng-template>
	`,
})
export class BrnSelectComponent<T = unknown>
	implements ControlValueAccessor, AfterContentInit, DoCheck, ExposesSide, ExposesState, BrnFormFieldControl
{
	private readonly _selectService = inject(BrnSelectService);

	public readonly triggerWidth = this._selectService.triggerWidth;

	public readonly multiple = input<boolean>(false);
	public readonly placeholder = input<string>('');
	public readonly disabled = input<boolean>(false);
	public readonly dir = input<BrnReadDirection>('ltr');
	private readonly _disabledFromSetDisabledState = signal(false);

	protected selectLabel = contentChild(BrnLabelDirective, { descendants: false });
	/** Overlay pane containing the options. */
	protected selectContent = contentChild.required(BrnSelectContentComponent);

	protected options = contentChildren(CdkOption, { descendants: true });
	protected options$ = toObservable(this.options);
	protected optionsAndIndex$ = this.options$.pipe(map((options, index) => [options, index] as const));

	/** Overlay pane containing the options. */
	protected _overlayDir = viewChild(CdkConnectedOverlay);

	public readonly openedChange = output<boolean>();

	public readonly closeDelay = input<number>(100);
	public readonly isExpanded = this._selectService.isExpanded;
	protected readonly _delayedExpanded = toSignal(
		toObservable(this.isExpanded).pipe(
			switchMap((expanded) => (!expanded ? of(expanded).pipe(delay(this.closeDelay())) : of(expanded))),
			takeUntilDestroyed(),
		),
		{ initialValue: false },
	);
	public readonly state = computed(() => (this.isExpanded() ? 'open' : 'closed'));

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

	public readonly backupLabelId = computed(() => this._selectService.labelId());
	public readonly labelProvided = signal(false);

	public readonly ngControl = inject(NgControl, { optional: true, self: true });

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	private _onChange: ChangeFn<T> = () => {};
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	private _onTouched: TouchFn = () => {};

	private readonly _shouldEmitValueChange = signal(false);

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

	private readonly _defaultErrorStateMatcher = inject(ErrorStateMatcher);
	private readonly _parentForm = inject(NgForm, { optional: true });
	private readonly _parentFormGroup = inject(FormGroupDirective, { optional: true });

	public errorState = computed(() => this.errorStateTracker.errorState());

	public writeValue$ = new Subject<T>();

	constructor() {
		this._selectService.state.update((state) => ({
			...state,
			multiple: this.multiple,
			placeholder: this.placeholder,
			disabled: this.disabled,
			disabledBySetDisabled: this._disabledFromSetDisabledState,
			dir: this.dir,
		}));
		this.handleOptionChanges();
		this.handleInitialOptionSelect();

		this._selectService.state.update((state) => ({
			...state,
			id: `brn-select-${nextId++}`,
		}));
		if (this.ngControl !== null) {
			this.ngControl.valueAccessor = this;
		}

		// Watch for Listbox Selection Changes to trigger Collapse and Value Change
		this._selectService.listBoxValueChangeEvent$.pipe(takeUntilDestroyed()).subscribe(() => {
			if (!this.multiple()) {
				this.close();
			}

			// we set shouldEmitValueChange to true because we want to propagate the value change
			// as a result of user interaction
			this._shouldEmitValueChange.set(true);
		});

		/**
		 * Listening to value changes in order to trigger forms api on change
		 * ShouldEmitValueChange simply ensures we only propagate value change when a user makes a selection
		 * we don't propagate changes made from outside the component (ex. patch value or initial value from form control)
		 */
		toObservable(this._selectService.value).subscribe((value) => {
			if (this._shouldEmitValueChange()) {
				this._onChange((value ?? null) as T);
			}
			this._shouldEmitValueChange.set(true);
		});

		this.errorStateTracker = new ErrorStateTracker(
			this._defaultErrorStateMatcher,
			this.ngControl,
			this._parentFormGroup,
			this._parentForm,
		);
	}

	public ngAfterContentInit(): void {
		// Check if Label Directive Provided and pass to service
		const label = this.selectLabel();
		if (label) {
			this.labelProvided.set(true);
			this._selectService.state.update((state) => ({
				...state,
				labelId: label.id(),
			}));
		} else if (this.placeholder()) {
			this._selectService.state.update((state) => ({
				...state,
				labelId: `${state.id}--label`,
			}));
		}
	}

	ngDoCheck() {
		this.errorStateTracker.updateErrorState();
	}

	public toggle(): void {
		if (this.isExpanded()) {
			this.close();
		} else {
			this.open();
		}
	}

	public open(): void {
		if (!this._canOpen()) return;
		this._selectService.state.update((state) => ({
			...state,
			isExpanded: true,
		}));
		this.openedChange.emit(true);
		this._moveFocusToCDKList();
	}

	public close(): void {
		if (!this.isExpanded()) return;

		if (this._selectService.selectTrigger) {
			this._selectService.selectTrigger.focus();
		}

		this.openedChange.emit(false);
		this._selectService.state.update((state) => ({
			...state,
			isExpanded: false,
		}));
		this._onTouched();
	}

	protected _canOpen(): boolean {
		return !this.isExpanded() && !this.disabled() && this.options()?.length > 0;
	}

	private _moveFocusToCDKList(): void {
		setTimeout(() => {
			this.selectContent()?.focusList();
		});
	}

	public writeValue(value: T): void {
		this.writeValue$.next(value);
	}

	public registerOnChange(fn: ChangeFn<T>): void {
		this._onChange = fn;
	}

	public registerOnTouched(fn: TouchFn): void {
		this._onTouched = fn;
	}

	public setDisabledState(isDisabled: boolean) {
		this._disabledFromSetDisabledState.set(isDisabled);
	}

	/**
	 * Once writeValue is called and options are available we can handle setting the initial options
	 * @private
	 */
	private handleInitialOptionSelect() {
		// Write value cannot be handled until options are available, so we wait until both are available with a combineLatest
		combineLatest([this.writeValue$, this.options$])
			.pipe(
				map((values, index) => [...values, index]),
				takeUntilDestroyed(),
			)
			.subscribe(([value, _, index]) => {
				this._shouldEmitValueChange.set(false);
				this._selectService.setInitialSelectedOptions(value);
				// the first time this observable emits a value we are simply setting the initial state
				// this change should not count as changing the state of the select, so we need to mark as pristine
				if (index === 0) {
					this.ngControl?.control?.markAsPristine();
				}
			});
	}

	/**
	 * When options change, our current selected options may become invalid
	 * Here we will automatically update our current selected options so that they are always inline with the possibleOptions
	 * @private
	 */
	private handleOptionChanges() {
		this.optionsAndIndex$.pipe(takeUntilDestroyed()).subscribe(([options, index]) => {
			if (index > 0) {
				this.handleInvalidOptions(options);
			}
			this._selectService.updatePossibleOptions(options);
		});
	}

	/**
	 * Check that our "selectedOptions" are still valid when "possibleOptions" is about to be updated
	 */
	private handleInvalidOptions(options: readonly CdkOption[]) {
		const selectedOptions = this._selectService.selectedOptions();
		const availableOptionSet = new Set<CdkOption | null>(options);
		if (this._selectService.multiple()) {
			const filteredOptions = selectedOptions.filter((o) => availableOptionSet.has(o));
			if (selectedOptions.length !== filteredOptions.length) {
				const value = filteredOptions.map((o) => (o?.value as string) ?? '');
				this._selectService.state.update((state) => ({
					...state,
					selectedOptions: filteredOptions,
					value: value,
				}));
			}
		} else {
			const selectedOption = selectedOptions[0] ?? null;
			if (selectedOption !== null && !availableOptionSet.has(selectedOption)) {
				this._selectService.state.update((state) => ({
					...state,
					selectedOptions: [],
					value: '',
				}));
			}
		}
	}
}
