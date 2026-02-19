import {
	ChangeDetectionStrategy,
	Component,
	computed,
	ElementRef,
	input,
	viewChild,
} from '@angular/core';
import type { BrnTimeSegment } from './brn-time-input';
import { injectBrnTimeInput } from './brn-time-input.token';

@Component({
	selector: 'brn-time-input-segment',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'[attr.data-segment]': 'segment()',
		'[attr.data-active]': '_isActive() || null',
		'[attr.aria-label]': 'segment()',
		'[attr.data-disabled]': '_timeInput.disabled() || null',
	},
	template: `
		<span
			#segmentEl
			role="spinbutton"
			[tabIndex]="_timeInput.disabled() ? -1 : 0"
			[attr.aria-valuenow]="_numericValue()"
			[attr.aria-valuemin]="_min()"
			[attr.aria-valuemax]="_max()"
			[attr.aria-label]="segment()"
			[attr.inputmode]="segment() === 'period' ? 'text' : 'numeric'"
			(keydown)="_onKeydown($event)"
			(focus)="_onFocus()"
			(blur)="_onBlur()"
		>{{ _displayValue() }}</span>
	`,
})
export class BrnTimeInputSegment {
	protected readonly _timeInput = injectBrnTimeInput();

	/** Which segment this represents: 'hours', 'minutes', or 'period'. */
	readonly segment = input.required<BrnTimeSegment>();

	private readonly _segmentEl = viewChild<ElementRef<HTMLSpanElement>>('segmentEl');

	protected readonly _isActive = computed(() => this._timeInput.activeSegment() === this.segment());

	protected readonly _displayValue = computed(() => {
		switch (this.segment()) {
			case 'hours':
				return this._timeInput.displayHours();
			case 'minutes':
				return this._timeInput.displayMinutes();
			case 'seconds':
				return this._timeInput.displaySeconds();
			case 'period':
				return this._timeInput.displayPeriod();
		}
	});

	protected readonly _numericValue = computed(() => {
		switch (this.segment()) {
			case 'hours':
				return this._timeInput.value().hours;
			case 'minutes':
				return this._timeInput.value().minutes;
			case 'seconds':
				return this._timeInput.value().seconds;
			case 'period':
				return this._timeInput.value().period === 'AM' ? 0 : 1;
		}
	});

	protected readonly _min = computed(() => {
		switch (this.segment()) {
			case 'hours':
				return 1;
			case 'minutes':
				return 0;
			case 'seconds':
				return 0;
			case 'period':
				return 0;
		}
	});

	protected readonly _max = computed(() => {
		switch (this.segment()) {
			case 'hours':
				return 12;
			case 'minutes':
				return 59;
			case 'seconds':
				return 59;
			case 'period':
				return 1;
		}
	});

	/** Focus this segment's editable span. */
	focus(): void {
		this._segmentEl()?.nativeElement.focus();
	}

	protected _onFocus(): void {
		this._timeInput.activeSegment.set(this.segment());
	}

	protected _onBlur(): void {
		if (this._timeInput.activeSegment() === this.segment()) {
			this._timeInput.activeSegment.set(null);
		}
		this._timeInput.markAsTouched();
	}

	protected _onKeydown(event: KeyboardEvent): void {
		const seg = this.segment();

		switch (event.key) {
			case 'ArrowUp':
				event.preventDefault();
				this._timeInput.incrementSegment(seg);
				break;
			case 'ArrowDown':
				event.preventDefault();
				this._timeInput.decrementSegment(seg);
				break;
			case 'ArrowRight':
				event.preventDefault();
				this._focusNextSegment();
				break;
			case 'ArrowLeft':
				event.preventDefault();
				this._focusPreviousSegment();
				break;
			default:
				if (seg === 'period') {
					if (event.key === 'a' || event.key === 'A') {
						event.preventDefault();
						this._timeInput.setPeriod('AM');
					} else if (event.key === 'p' || event.key === 'P') {
						event.preventDefault();
						this._timeInput.setPeriod('PM');
					}
				} else {
					const digit = parseInt(event.key, 10);
					if (!isNaN(digit)) {
						event.preventDefault();
						this._timeInput.setSegmentDigit(seg, digit);
					}
				}
				break;
		}
	}

	private _focusNextSegment(): void {
		const el = this._segmentEl()?.nativeElement;
		if (!el) return;
		const container = el.closest('brn-time-input')?.parentElement;
		if (!container) return;
		const focusable = Array.from(container.querySelectorAll<HTMLElement>('span[role="spinbutton"], button:not([disabled])'));
		const idx = focusable.indexOf(el);
		if (idx >= 0 && idx < focusable.length - 1) {
			focusable[idx + 1].focus();
		}
	}

	private _focusPreviousSegment(): void {
		const el = this._segmentEl()?.nativeElement;
		if (!el) return;
		const container = el.closest('brn-time-input')?.parentElement;
		if (!container) return;
		const focusable = Array.from(container.querySelectorAll<HTMLElement>('span[role="spinbutton"], button:not([disabled])'));
		const idx = focusable.indexOf(el);
		if (idx > 0) {
			focusable[idx - 1].focus();
		}
	}
}
