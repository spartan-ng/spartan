/* eslint-disable @typescript-eslint/naming-convention */
import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, inject, signal, viewChild } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';

import { lucideCalendar, lucideX } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmCalendarImports } from '@spartan-ng/helm/calendar';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';
import { RangeOperators } from '../engine/operators';
import { FieldClose } from './utils/field-close';
import { FieldLabel } from './utils/field-label';
import { FieldOperator } from './utils/field-operator';
import { DatePipe } from '@angular/common';
import { FHandler } from '../engine/handlers';
import { FILTER_HANDLER } from '../engine/token';
import { FieldTypes } from '../engine/types';
import { FocusMonitor } from '@angular/cdk/a11y';
import { FocusElementOptions } from './utils/focus-element';
import { FAKE_FOCUS_ORIGIN } from '../engine/constants';

@Component({selector: 'spartan-rich-filter-daterange-field',
imports: [
		NgIcon,
		HlmInputGroupImports,
		HlmButtonGroupImports,
		HlmIconImports,
		HlmButtonImports,
		HlmPopoverImports,
		HlmCalendarImports,
		FieldClose,
		FieldLabel,
		FieldOperator,
		DatePipe,
	],
providers: [provideIcons({ lucideCalendar, lucideX })],
changeDetection: ChangeDetectionStrategy.OnPush,
host: {},
template: `
		<hlm-popover sideOffset="5" align="end">
			<div
				hlmButtonGroup
				class="[&>brn-select>div>hlm-select-trigger>button]:rounded-l-none [&>brn-select>div>hlm-select-trigger>button]:rounded-r-none"
			>
				<!-- label -->
				<spartan-rich-filter-field-label [label]="service.controlLabel()" [for]="service.formId()" />
				<!-- operator dropdown -->
				<spartan-rich-filter-field-operator
					[operatorValue]="service.operatorValue()"
					(operatorValueChange)="service.setOperator($event)"
					[operators]="operators"
				/>

				<!-- popover with range calendar -->
				<button
					class="focus:border-ring focus:ring-ring/50 focus:ring-[3px]"
					#monitoredInput
					hlmPopoverTrigger
					hlmBtn
					variant="outline"
					#dateRangeTrigger
				>
					<ng-icon hlm name="lucideCalendar" size="sm" />
					{{ startDate() | date: 'MMM d' }} - {{ endDate() | date: 'MMM d' }}
				</button>
				<hlm-popover-content class="w-auto rounded-xl p-0" *hlmPopoverPortal="let ctx">
					<hlm-calendar-range
						[min]="service.min()"
						[max]="service.max()"
						[startDate]="startDate()"
						(startDateChange)="updateStartDate($event)"
						[endDate]="endDate()"
						(endDateChange)="updateEndDate($event)"
					/>
				</hlm-popover-content>

				<!-- close button -->
				<spartan-rich-filter-field-close (fieldclosed)="service.closeField()" />
			</div>
		</hlm-popover>
	`})
export class DateRangeField implements FocusElementOptions {
	private readonly popoverBtn = viewChild<ElementRef<HTMLButtonElement>>('dateRangeTrigger');
	private readonly tempStart = signal<Date | null>(null);

	protected readonly service = inject(FILTER_HANDLER) as FHandler<typeof FieldTypes.daterange>;
	protected readonly operators = RangeOperators;

	public readonly startDate = computed(() => this.service.controlValue()[0]);
	public readonly endDate = computed(() => this.service.controlValue()[1]);

	// update start date should not trigger a change in the model
	// until both start and end date are selected,
	protected updateStartDate(date: Date) {
		this.tempStart.set(date);
	}

	protected updateEndDate(date: Date) {
		const start = this.tempStart();
		if (!start || !date) {
			return;
		}

		this.service.updateControl([start, date]);
		this.tempStart.set(null);

		// close popover after selecting range;
		// wrapped in promise to let change detection settle
		Promise.resolve().then(() => {
			this.popoverBtn()?.nativeElement.click();
		});
		// TODO: Does BrainPopoverTrigger expose a method to close the popover programmatically?
	}

	public readonly focusMonitor = inject(FocusMonitor);

	public readonly monitoredInput = viewChild.required('monitoredInput', { read: ElementRef<HTMLElement> });

	public readonly onFocusElement = effect(() => {
		this.service.isFocused() && this.focusMonitor.focusVia(this.monitoredInput(), FAKE_FOCUS_ORIGIN);
	});
}
