import { isPlatformBrowser } from '@angular/common';
import { type AfterViewInit, Directive, ElementRef, OnDestroy, PLATFORM_ID, computed, inject } from '@angular/core';
import { NgControl } from '@angular/forms';
import { injectBrnSelect } from './brn-select.token';

@Directive({
	selector: '[brnSelectTrigger]',
	standalone: true,
	host: {
		role: 'combobox',
		'[attr.id]': 'selectTriggerId()',
		'[disabled]': 'selectDisable()',
		'[attr.aria-expanded]': '_select.open()',
		'[attr.aria-controls]': "selectContentId() + ''",
		'[attr.aria-labelledBy]': 'selectTriggerLabelledBy()',
		'aria-autocomplete': 'none',
		'[attr.dir]': '_select.dir()',
		'[class.ng-invalid]': '_ngControl?.invalid || null',
		'[class.ng-dirty]': '_ngControl?.dirty || null',
		'[class.ng-valid]': '_ngControl?.valid || null',
		'[class.ng-touched]': '_ngControl?.touched || null',
		'[class.ng-untouched]': '_ngControl?.untouched || null',
		'[class.ng-pristine]': '_ngControl?.pristine || null',
		type: 'button',
	},
})
export class BrnSelectTriggerDirective<T> implements AfterViewInit, OnDestroy {
	private readonly _el = inject(ElementRef);
	protected readonly _select = injectBrnSelect<T>();
	protected readonly _ngControl = inject(NgControl, { optional: true });
	private readonly _platform = inject(PLATFORM_ID);
	public readonly selectTriggerId = computed(() => `${this._select.id()}--trigger`);
	public readonly selectContentId = computed(() => `${this._select.id()}--content`);
	public readonly selectDisable = computed(() => this._select.disabled() || this._select._formDisabled());
	public readonly selectTriggerLabelledBy = computed(() => {
		const value = this._select.value();

		if (Array.isArray(value) && value.length > 0) {
			return `${this._select.labelId()} ${this._select.id()}--value`;
		}
		return this._select.labelId();
	});

	private _resizeObserver?: ResizeObserver;

	constructor() {
		if (!this._select) return;
		this._select.trigger.set(this);
	}

	ngAfterViewInit() {
		this._select.triggerWidth.set(this._el.nativeElement.offsetWidth);

		// if we are on the client, listen for element resize events
		if (isPlatformBrowser(this._platform)) {
			this._resizeObserver = new ResizeObserver(() =>
				this._select.triggerWidth.set(this._el.nativeElement.offsetWidth),
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
