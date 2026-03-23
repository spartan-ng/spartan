import { isPlatformBrowser } from '@angular/common';
import {
	type AfterViewInit,
	computed,
	Directive,
	ElementRef,
	inject,
	type OnDestroy,
	PLATFORM_ID,
} from '@angular/core';
import { injectBrnSelect } from './brn-select.token';

@Directive({
	selector: '[brnSelectTrigger]',
	host: {
		type: 'button',
		role: 'combobox',
		'[attr.id]': 'triggerId()',
		'[disabled]': '_disabled()',
		'[attr.aria-expanded]': '_select.open()',
		'[attr.aria-controls]': '_contentId()',
		'[attr.aria-labelledBy]': '_labelledBy()',
		'[attr.aria-invalid]': '_invalid() ? "true" : null',
		'[attr.data-dirty]': '_dirty?.() ? "true": null',
		'[attr.data-touched]': '_touched?.() ? "true" : null',
		'[attr.data-matches-spartan-invalid]': '_spartanInvalid?.() ? "true" : null',
		'aria-autocomplete': 'none',
		'[attr.dir]': '_select.direction()',
		'(keydown.ArrowDown)': '_select.show()',
	},
})
export class BrnSelectTrigger<T> implements AfterViewInit, OnDestroy {
	private readonly _elementRef = inject(ElementRef);
	protected readonly _select = injectBrnSelect<T>();
	private readonly _platform = inject(PLATFORM_ID);

	public readonly triggerId = computed(() => `${this._select.id()}--trigger`);
	protected readonly _contentId = computed(() => `${this._select.id()}--content`);
	protected readonly _disabled = computed(() => this._select.disabled() || this._select.formDisabled());
	protected readonly _labelledBy = computed(() => {
		const value = this._select.value();

		if (Array.isArray(value) && value.length > 0) {
			return `${this._select.labelId()} ${this._select.id()}--value`;
		}
		return this._select.labelId();
	});

	protected readonly _invalid = computed(() => this._select?.controlState?.()?.invalid);
	protected readonly _touched = computed(() => this._select?.controlState?.()?.touched);
	protected readonly _dirty = computed(() => this._select?.controlState?.()?.dirty);
	protected readonly _spartanInvalid = computed(() => this._select?.controlState?.()?.spartanInvalid);

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
