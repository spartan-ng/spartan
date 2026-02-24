import { isPlatformBrowser } from '@angular/common';
import {
	type AfterViewInit,
	ChangeDetectorRef,
	computed,
	DestroyRef,
	Directive,
	ElementRef,
	inject,
	type OnDestroy,
	type OnInit,
	PLATFORM_ID,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgControl, TouchedChangeEvent } from '@angular/forms';
import { EMPTY, merge } from 'rxjs';
import { filter } from 'rxjs/operators';
import { injectBrnSelect } from './brn-select.token';

@Directive({
	selector: '[brnSelectTrigger]',
	host: {
		role: 'combobox',
		'[attr.id]': '_triggerId()',
		'[attr.disabled]': '_disabled() || null',
		'[attr.aria-expanded]': '_select.open()',
		'[attr.aria-controls]': '_contentId()',
		'[attr.aria-labelledby]': '_labelledBy()',
		'[attr.aria-autocomplete]': '"none"',
		'[attr.readonly]': '_select.readonly()',
		'[value]': '_select.displayValue()',
		'[attr.placeholder]': '_select.placeholder() || null',
		'[attr.dir]': '_select.direction()',
		'[class.ng-invalid]': '_ngControl?.invalid || null',
		'[class.ng-dirty]': '_ngControl?.dirty || null',
		'[class.ng-valid]': '_ngControl?.valid || null',
		'[class.ng-touched]': '_ngControl?.touched || null',
		'[class.ng-untouched]': '_ngControl?.untouched || null',
		'[class.ng-pristine]': '_ngControl?.pristine || null',
		'(keydown.ArrowDown)': '_select.show()',
		'(keydown.ArrowUp)': '_select.show(); $event.preventDefault()',
		'(keydown.Space)': '_select.show()',
		'(keydown.Enter)': '_select.show(); $event.preventDefault()',
	},
})
export class BrnSelectTrigger<T> implements AfterViewInit, OnDestroy, OnInit {
	private readonly _elementRef = inject(ElementRef);
	/** Access the change detector */
	private readonly _changeDetector = inject(ChangeDetectorRef);
	protected readonly _select = injectBrnSelect<T>();
	protected readonly _destroyRef = inject(DestroyRef);
	protected readonly _ngControl = inject(NgControl, { optional: true });
	private readonly _platform = inject(PLATFORM_ID);
	protected readonly _triggerId = computed(() => `${this._select.id()}--trigger`);
	protected readonly _contentId = computed(() => `${this._select.id()}--content`);
	protected readonly _disabled = computed(() => this._select.disabled() || this._select.formDisabled());
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

	ngOnInit() {
		if (this._ngControl) {
			const control = this._ngControl.control;
			merge(
				this._ngControl.statusChanges ?? EMPTY,
				control?.events.pipe(filter((e) => e instanceof TouchedChangeEvent)) ?? EMPTY,
			)
				.pipe(takeUntilDestroyed(this._destroyRef))
				.subscribe(() => {
					this._changeDetector.markForCheck();
				});
		}
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
