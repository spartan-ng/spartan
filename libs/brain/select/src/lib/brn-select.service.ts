import type { CdkOption, ListboxValueChangeEvent } from '@angular/cdk/listbox';
import { isPlatformBrowser } from '@angular/common';
import {
	type AfterViewInit,
	Directive,
	ElementRef,
	Injectable,
	OnDestroy,
	PLATFORM_ID,
	Signal,
	computed,
	inject,
	signal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { NgControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { skip } from 'rxjs/operators';

@Directive({
	selector: '[brnSelectTrigger]',
	standalone: true,
	host: {
		role: 'combobox',
		'[attr.id]': 'selectTriggerId()',
		'[disabled]': 'selectDisable()',
		'[attr.aria-expanded]': 'isExpanded()',
		'[attr.aria-controls]': "selectContentId() + ''",
		'[attr.aria-labelledBy]': 'selectTriggerLabelledBy()',
		'aria-autocomplete': 'none',
		'[attr.dir]': '_selectService.dir()',
		'[class.ng-invalid]': 'this._ngControl?.invalid || null',
		'[class.ng-dirty]': 'this._ngControl?.dirty || null',
		'[class.ng-valid]': 'this._ngControl?.valid || null',
		'[class.ng-touched]': 'this._ngControl?.touched || null',
		'[class.ng-untouched]': 'this._ngControl?.untouched || null',
		'[class.ng-pristine]': 'this._ngControl?.pristine || null',
		type: 'button',
	},
})
export class BrnSelectTriggerDirective implements AfterViewInit, OnDestroy {
	private readonly _el = inject(ElementRef);
	protected readonly _selectService = inject(BrnSelectService);
	protected readonly _ngControl = inject(NgControl, { optional: true });
	private readonly _platform = inject(PLATFORM_ID);
	public readonly isExpanded = this._selectService.isExpanded;
	public readonly selectTriggerId = computed(() => `${this._selectService.id()}--trigger`);
	public readonly selectContentId = computed(() => `${this._selectService.id()}--content`);
	public readonly selectDisable = computed(() => this._selectService.disabled());
	public readonly selectTriggerLabelledBy = computed(() => {
		if (this._selectService.value() && this._selectService.value().length > 0) {
			return `${this._selectService.labelId()} ${this._selectService.id()}--value`;
		}
		return this._selectService.labelId();
	});

	private _resizeObserver?: ResizeObserver;

	constructor() {
		if (!this._selectService) return;
		this._selectService._setSelectTrigger(this);
	}

	ngAfterViewInit() {
		this._selectService.setTriggerWidth(this._el.nativeElement.offsetWidth);

		// if we are on the client, listen for element resize events
		if (isPlatformBrowser(this._platform)) {
			this._resizeObserver = new ResizeObserver(() =>
				this._selectService.setTriggerWidth(this._el.nativeElement.offsetWidth),
			);

			this._resizeObserver.observe(this._el.nativeElement);
		}
	}

	ngOnDestroy(): void {
		this._resizeObserver?.disconnect();
	}

	public focus() {
		this._el.nativeElement.focus();
	}
}

type BrnReadDirection = 'ltr' | 'rtl';

@Injectable()
export class BrnSelectService {
	public readonly state = signal<{
		id: string;
		labelId: string;
		panelId: string;
		placeholder: Signal<string>;
		isExpanded: boolean;
		multiple: Signal<boolean>;
		disabled: Signal<boolean>;
		disabledBySetDisabled: Signal<boolean>;
		dir: Signal<BrnReadDirection>;
		selectedOptions: Array<CdkOption | null>;
		possibleOptions: Array<CdkOption | null>;
		value: string | string[];
		triggerWidth: number;
	}>({
		id: '',
		labelId: '',
		panelId: '',
		isExpanded: false,
		placeholder: signal(''),
		multiple: signal(false),
		disabled: signal(false),
		disabledBySetDisabled: signal(false),
		dir: signal('ltr' as BrnReadDirection),
		selectedOptions: [],
		possibleOptions: [],
		value: '',
		triggerWidth: 0,
	});

	public readonly id = computed(() => this.state().id);
	public readonly labelId = computed(() => this.state().labelId);
	public readonly panelId = computed(() => this.state().panelId);
	public readonly placeholder = computed(() => this.state().placeholder());
	public readonly disabled = computed(() => this.state().disabled() || this.state().disabledBySetDisabled());
	public readonly isExpanded = computed(() => this.state().isExpanded);
	public readonly multiple = computed(() => this.state().multiple());
	public readonly dir = computed(() => this.state().dir());
	public readonly selectedOptions = computed(() => this.state().selectedOptions);
	public readonly value = computed(() => this.state().value);
	public readonly triggerWidth = computed(() => this.state().triggerWidth);
	public readonly possibleOptions = computed(() => this.state().possibleOptions);

	private readonly _multiple$ = toObservable(this.multiple);

	public readonly listBoxValueChangeEvent$ = new Subject<ListboxValueChangeEvent<unknown>>();

	private _selectTrigger?: BrnSelectTriggerDirective;
	public get selectTrigger() {
		return this._selectTrigger;
	}

	constructor() {
		this.listBoxValueChangeEvent$.pipe(takeUntilDestroyed()).subscribe((listBoxChange) => {
			const updatedSelections = this.multiple() ? this.getUpdatedOptions(listBoxChange) : [listBoxChange.option];
			const value = this.multiple() ? listBoxChange.value : listBoxChange.value[0];
			this.state.update((state) => ({
				...state,
				selectedOptions: [...updatedSelections],
				value: value as string | string[],
			}));
		});

		// We need to skip the first value because we don't want to deselect all options when the component is initialized with a preselected value e.g. by the form control
		this._multiple$.pipe(skip(1), takeUntilDestroyed()).subscribe((multiple) => {
			if (!multiple && this.value().length > 1) {
				this.deselectAllOptions();
			}
		});
	}

	public setTriggerWidth(triggerWidth: number) {
		this.state.update((s) => ({ ...s, triggerWidth }));
	}

	public getUpdatedOptions(latestListboxChange: ListboxValueChangeEvent<unknown>): Array<CdkOption | null> {
		const isNewSelection = latestListboxChange.value.findIndex((value) => value === latestListboxChange.option?.value);
		if (isNewSelection === -1) {
			const removedOptionIndex = this.selectedOptions().findIndex((option) => latestListboxChange.option === option);
			const options = this.selectedOptions();
			options.splice(removedOptionIndex, 1);
			return options;
		}
		return [...this.selectedOptions(), latestListboxChange.option];
	}

	public deselectAllOptions() {
		this.state.update((state) => ({
			...state,
			selectedOptions: [],
			value: [],
		}));
	}

	// Needed due to https://github.com/angular/angular/issues/20810
	public _setSelectTrigger(trigger: BrnSelectTriggerDirective) {
		this._selectTrigger = trigger;
	}

	public setInitialSelectedOptions(value: unknown) {
		this.selectOptionByValue(value);
		this.state.update((state) => ({
			...state,
			value: value as string | string[],
			initialSelectedOptions: this.selectedOptions(),
			selectedOptions: this.selectedOptions(),
		}));
	}

	/**
	 * Sync the updated options with "possibleOptions" in the select service
	 */
	public updatePossibleOptions(options: readonly CdkOption[]) {
		this.state.update((state) => ({
			...state,
			possibleOptions: options as CdkOption[],
		}));
	}

	private selectOptionByValue(value: unknown) {
		const options = this.possibleOptions();
		if (value === null || value === undefined) {
			const nullOrUndefinedOption = options.find((o) => o && o.value === value);
			if (!nullOrUndefinedOption) {
				this.state.update((state) => ({
					...state,
					selectedOptions: [],
					value: this.multiple() ? [] : '',
				}));
				return;
			}
		}

		if (this.multiple()) {
			const selectedOptions = options.filter((option) => {
				if (Array.isArray(value)) {
					return value.includes(option?.value as string);
				}
				return value === option?.value;
			});
			this.state.update((state) => ({
				...state,
				selectedOptions,
				value: value as string[],
			}));
		} else {
			const selectedOption = options.find((option) => option?.value === value);
			if (!selectedOption) {
				return;
			}
			this.state.update((state) => ({
				...state,
				selectedOptions: [selectedOption as CdkOption | null],
				value: selectedOption.value as string,
			}));
		}
	}
}
