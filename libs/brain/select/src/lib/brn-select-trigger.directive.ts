import { isPlatformBrowser } from '@angular/common';
import { type AfterViewInit, Directive, ElementRef, OnDestroy, PLATFORM_ID, computed, inject } from '@angular/core';
import { NgControl } from '@angular/forms';
import { injectBrnSelect } from './brn-select.token';

@Directive({
	selector: '[brnSelectTrigger]',
	standalone: true,
	host: {
		type: 'button',
		role: 'combobox',
		'[attr.id]': '_triggerId()',
		'[disabled]': '_disabled()',
		'[attr.aria-expanded]': '_select.open()',
		'[attr.aria-controls]': '_contentId()',
		'[attr.aria-labelledBy]': '_labelledBy()',
		'aria-autocomplete': 'none',
		'[attr.dir]': '_select.dir()',
		'[class.ng-invalid]': '_ngControl?.invalid || null',
		'[class.ng-dirty]': '_ngControl?.dirty || null',
		'[class.ng-valid]': '_ngControl?.valid || null',
		'[class.ng-touched]': '_ngControl?.touched || null',
		'[class.ng-untouched]': '_ngControl?.untouched || null',
		'[class.ng-pristine]': '_ngControl?.pristine || null',
		'(keydown.ArrowDown)': '_select.show()',
	},
})
export class BrnSelectTriggerDirective<T> implements AfterViewInit, OnDestroy {
	private readonly _elementRef = inject(ElementRef);
	protected readonly _select = injectBrnSelect<T>();
	protected readonly _ngControl = inject(NgControl, { optional: true });
	private readonly _platform = inject(PLATFORM_ID);
	protected readonly _triggerId = computed(() => `${this._select.id()}--trigger`);
	protected readonly _contentId = computed(() => `${this._select.id()}--content`);
	protected readonly _disabled = computed(() => this._select.disabled() || this._select._formDisabled());
	protected readonly _labelledBy = computed(() => {
		const value = this._select.value();

		if (Array.isArray(value) && value.length > 0) {
			return `${this._select.labelId()} ${this._select.id()}--value`;
		}
		return this._select.labelId();
	});

	private _resizeObserver?: ResizeObserver;

	constructor() {
		this._select.trigger.set(this);
	}

	ngAfterViewInit() {
		this._select.triggerWidth.set(this._elementRef.nativeElement.offsetWidth);

		// if we are on the client, listen for element resize events
		if (isPlatformBrowser(this._platform)) {
			this._resizeObserver = new ResizeObserver(() =>
				this._select.triggerWidth.set(this._elementRef.nativeElement.offsetWidth),
			);

			this._resizeObserver.observe(this._elementRef.nativeElement);
		}
	}

	ngOnDestroy(): void {
		this._resizeObserver?.disconnect();
	}

	focus(): void {
		this._elementRef.nativeElement.focus();
	}
}
