import { ChangeDetectionStrategy, Component, computed, forwardRef, input, model, viewChildren } from '@angular/core';
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideClock } from '@ng-icons/lucide';
import {
	BrnTimeInput,
	BrnTimeInputSegment,
	BrnTimePicker,
	BrnTimePickerColumn,
	type BrnTimePeriod,
	type BrnTimeValue,
} from '@spartan-ng/brain/time-input';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';
import { HlmTimeInputSegment } from './hlm-time-input-segment';

const HLM_TIME_INPUT_VALUE_ACCESSOR = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => HlmTimeInput),
	multi: true,
};

@Component({
	selector: 'hlm-time-input',
	imports: [
		BrnTimeInput,
		BrnTimeInputSegment,
		BrnTimePicker,
		BrnTimePickerColumn,
		HlmTimeInputSegment,
		NgIcon,
		HlmPopoverImports,
		HlmIconImports,
		HlmButtonImports,
	],
	providers: [HLM_TIME_INPUT_VALUE_ACCESSOR, provideIcons({ lucideClock })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'data-slot': 'time-input',
	},
	template: `
		<hlm-popover align="end">
			<div [class]="_computedClass()">
				<brn-time-input
					class="inline-flex items-center gap-0.5"
					[value]="value()"
					[disabled]="disabled()"
					(valueChange)="_onValueChange($event)"
				>
					<brn-time-input-segment hlm segment="hours" />
					<span class="text-muted-foreground" aria-hidden="true">:</span>
					<brn-time-input-segment hlm segment="minutes" />
					@if (displaySeconds()) {
						<span class="text-muted-foreground" aria-hidden="true">:</span>
						<brn-time-input-segment hlm segment="seconds" />
					}
					<brn-time-input-segment hlm segment="period" />
				</brn-time-input>

				<button
					hlmPopoverTrigger
					hlmBtn
					size="icon"
					variant="ghost"
					type="button"
					[disabled]="disabled()"
					(keydown)="_onTriggerKeydown($event)"
				>
					<ng-icon hlm name="lucideClock" size="sm" />
				</button>
			</div>

			<hlm-popover-content class="w-fit min-w-0 rounded-xl p-0" *hlmPopoverPortal="let ctx">
				<div brnTimePicker class="flex divide-x overflow-hidden">
					<!-- Hours column -->
					<div brnTimePickerColumn class="flex h-56 w-16 shrink-0 flex-col overflow-y-auto p-1" aria-label="Hours">
						@for (h of _hours; track h) {
							<button
								type="button"
								class="hover:bg-accent focus-visible:bg-accent min-w-9 rounded-sm px-3 py-1.5 text-center text-sm transition-colors outline-none"
								[class.bg-accent]="h === value().hours"
								[class.font-semibold]="h === value().hours"
								[attr.data-selected]="h === value().hours || null"
								(click)="_setHours(h)"
								#hourBtn
							>
								{{ h.toString().padStart(2, '0') }}
							</button>
						}
					</div>

					<!-- Minutes column -->
					<div brnTimePickerColumn class="flex h-56 w-16 shrink-0 flex-col overflow-y-auto p-1" aria-label="Minutes">
						@for (m of _minuteSeconds; track m) {
							<button
								type="button"
								class="hover:bg-accent focus-visible:bg-accent min-w-9 rounded-sm px-3 py-1.5 text-center text-sm transition-colors outline-none"
								[class.bg-accent]="m === value().minutes"
								[class.font-semibold]="m === value().minutes"
								[attr.data-selected]="m === value().minutes || null"
								(click)="_setMinutes(m)"
								#minuteBtn
							>
								{{ m.toString().padStart(2, '0') }}
							</button>
						}
					</div>

					<!-- Seconds column (conditional) -->
					@if (displaySeconds()) {
						<div brnTimePickerColumn class="flex h-56 w-16 shrink-0 flex-col overflow-y-auto p-1" aria-label="Seconds">
							@for (s of _minuteSeconds; track s) {
								<button
									type="button"
									class="hover:bg-accent focus-visible:bg-accent min-w-9 rounded-sm px-3 py-1.5 text-center text-sm transition-colors outline-none"
									[class.bg-accent]="s === value().seconds"
									[class.font-semibold]="s === value().seconds"
									[attr.data-selected]="s === value().seconds || null"
									(click)="_setSeconds(s)"
									#secondBtn
								>
									{{ s.toString().padStart(2, '0') }}
								</button>
							}
						</div>
					}

					<!-- Period column -->
					<div brnTimePickerColumn class="flex h-56 w-14 shrink-0 flex-col p-1" aria-label="Period">
						@for (p of _periods; track p) {
							<button
								type="button"
								class="hover:bg-accent focus-visible:bg-accent min-w-9 rounded-sm px-3 py-1.5 text-center text-sm font-medium transition-colors outline-none"
								[class.bg-accent]="p === value().period"
								[class.font-semibold]="p === value().period"
								[attr.data-selected]="p === value().period || null"
								(click)="_setPeriod(p)"
							>
								{{ p }}
							</button>
						}
					</div>
				</div>
			</hlm-popover-content>
		</hlm-popover>
	`,
})
export class HlmTimeInput implements ControlValueAccessor {
	private readonly _segments = viewChildren(BrnTimeInputSegment);

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	public readonly displaySeconds = input(false);

	public readonly value = model<BrnTimeValue>({ hours: 12, minutes: 0, seconds: 0, period: 'AM' });
	public readonly disabled = model(false);

	protected readonly _computedClass = computed(() =>
		hlm(
			'border-input bg-background inline-flex h-9 items-center gap-0.5 rounded-md border px-3 text-sm shadow-xs',
			'focus-within:ring-ring/50 focus-within:ring-2 focus-within:outline-none',
			'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
			this.userClass(),
		),
	);

	// Static data for the picker columns
	protected readonly _hours = Array.from({ length: 12 }, (_, i) => i + 1);
	protected readonly _minuteSeconds = Array.from({ length: 60 }, (_, i) => i);
	protected readonly _periods: BrnTimePeriod[] = ['AM', 'PM'];

	// -- CVA --
	/* eslint-disable-next-line @typescript-eslint/no-empty-function */
	private _onChange: (value: BrnTimeValue) => void = () => {};
	/* eslint-disable-next-line @typescript-eslint/no-empty-function */
	private _onTouched: () => void = () => {};

	writeValue(value: BrnTimeValue | null): void {
		if (value) {
			this.value.set(value);
		}
	}

	registerOnChange(fn: (value: BrnTimeValue) => void): void {
		this._onChange = fn;
	}

	registerOnTouched(fn: () => void): void {
		this._onTouched = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		this.disabled.set(isDisabled);
	}

	/** Focuses the first segment (hours) of the time input. */
	focus(): void {
		const segments = this._segments();
		if (segments.length > 0) {
			segments[0].focus();
		}
	}

	protected _onTriggerKeydown(event: KeyboardEvent): void {
		if (event.key === 'ArrowLeft') {
			event.preventDefault();
			const btn = event.target as HTMLElement;
			const container = btn.parentElement;
			if (!container) return;
			const focusable = Array.from(
				container.querySelectorAll<HTMLElement>('span[role="spinbutton"], button:not([disabled])'),
			);
			const idx = focusable.indexOf(btn);
			if (idx > 0) {
				focusable[idx - 1].focus();
			}
		}
	}

	protected _onValueChange(value: BrnTimeValue): void {
		this.value.set(value);
		this._onChange(value);
		this._onTouched();
	}

	// -- Picker column handlers --
	protected _setHours(h: number): void {
		this._updateFromPicker({ ...this.value(), hours: h });
	}

	protected _setMinutes(m: number): void {
		this._updateFromPicker({ ...this.value(), minutes: m });
	}

	protected _setSeconds(s: number): void {
		this._updateFromPicker({ ...this.value(), seconds: s });
	}

	protected _setPeriod(p: BrnTimePeriod): void {
		this._updateFromPicker({ ...this.value(), period: p });
	}

	private _updateFromPicker(value: BrnTimeValue): void {
		this.value.set(value);
		this._onChange(value);
	}
}
