import type { BooleanInput, NumberInput } from '@angular/cdk/coercion';
import { NgTemplateOutlet } from '@angular/common';
import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	computed,
	input,
	model,
	numberAttribute,
	viewChild,
} from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronLeft, lucideChevronRight } from '@ng-icons/lucide';
import { BrnCalendarImports, BrnCalendarRange, injectBrnCalendarI18n, type Weekday } from '@spartan-ng/brain/calendar';
import { injectDateAdapter } from '@spartan-ng/brain/date-time';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { buttonVariants } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-calendar-range',
	imports: [BrnCalendarImports, NgIcon, HlmIcon, HlmSelectImports, BrnSelectImports, NgTemplateOutlet],
	viewProviders: [provideIcons({ lucideChevronLeft, lucideChevronRight })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div
			brnCalendarRange
			[min]="min()"
			[max]="max()"
			[disabled]="disabled()"
			[(startDate)]="startDate"
			[(endDate)]="endDate"
			[dateDisabled]="dateDisabled()"
			[weekStartsOn]="weekStartsOn()"
			[defaultFocusedDate]="defaultFocusedDate()"
			[class]="_computedCalenderClass()"
		>
			<div class="inline-flex flex-col space-y-4">
				<!-- Header -->
				<div class="space-y-4">
					<div class="relative flex items-center justify-center pt-1">
						<div class="flex w-full items-center justify-center gap-1.5">
							<ng-template #month>
								<brn-select brnCalendarMonthSelect>
									<hlm-select-trigger size="sm" [class]="_selectClass">
										<brn-select-value />
									</hlm-select-trigger>
									<hlm-select-content class="max-h-80">
										@for (month of _i18n.config().months(); track month) {
											<hlm-option [value]="month">{{ month }}</hlm-option>
										}
									</hlm-select-content>
								</brn-select>
							</ng-template>
							<ng-template #year>
								<brn-select brnCalendarYearSelect>
									<hlm-select-trigger size="sm" [class]="_selectClass">
										<brn-select-value />
									</hlm-select-trigger>
									<hlm-select-content class="max-h-80">
										@for (year of _i18n.config().years(); track year) {
											<hlm-option [value]="year">{{ year }}</hlm-option>
										}
									</hlm-select-content>
								</brn-select>
							</ng-template>
							@let heading = _heading();
							@switch (captionLayout()) {
								@case ('dropdown') {
									<ng-container [ngTemplateOutlet]="month" />
									<ng-container [ngTemplateOutlet]="year" />
								}
								@case ('dropdown-months') {
									<ng-container [ngTemplateOutlet]="month" />
									<div brnCalendarHeader class="text-sm font-medium">{{ heading.year }}</div>
								}
								@case ('dropdown-years') {
									<div brnCalendarHeader class="text-sm font-medium">{{ heading.month }}</div>
									<ng-container [ngTemplateOutlet]="year" />
								}
								@case ('label') {
									<div brnCalendarHeader class="text-sm font-medium">{{ heading.header }}</div>
								}
							}
						</div>

						<div class="flex items-center space-x-1">
							<button
								brnCalendarPreviousButton
								class="ring-offset-background focus-visible:ring-ring border-input hover:bg-accent hover:text-accent-foreground absolute left-1 inline-flex h-7 w-7 items-center justify-center rounded-md border bg-transparent p-0 text-sm font-medium whitespace-nowrap opacity-50 transition-colors hover:opacity-100 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
							>
								<ng-icon hlm name="lucideChevronLeft" size="sm" />
							</button>

							<button
								brnCalendarNextButton
								class="ring-offset-background focus-visible:ring-ring border-input hover:bg-accent hover:text-accent-foreground absolute right-1 inline-flex h-7 w-7 items-center justify-center rounded-md border bg-transparent p-0 text-sm font-medium whitespace-nowrap opacity-50 transition-colors hover:opacity-100 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
							>
								<ng-icon hlm name="lucideChevronRight" size="sm" />
							</button>
						</div>
					</div>
				</div>

				<table class="w-full border-collapse space-y-1" brnCalendarGrid>
					<thead>
						<tr class="flex">
							<th
								*brnCalendarWeekday="let weekday"
								scope="col"
								class="text-muted-foreground w-8 rounded-md text-[0.8rem] font-normal"
								[attr.aria-label]="_i18n.config().labelWeekday(weekday)"
							>
								{{ _i18n.config().formatWeekdayName(weekday) }}
							</th>
						</tr>
					</thead>

					<tbody role="rowgroup">
						<tr *brnCalendarWeek="let week" class="mt-2 flex w-full">
							@for (date of week; track _dateAdapter.getTime(date)) {
								<td
									brnCalendarCell
									class="data-[selected]:data-[outside]:bg-accent/50 data-[selected]:bg-accent relative h-8 w-8 p-0 text-center text-sm focus-within:relative focus-within:z-20 first:data-[selected]:rounded-l-md last:data-[selected]:rounded-r-md [&:has([aria-selected].day-range-end)]:rounded-r-md"
								>
									<button brnCalendarCellButton [date]="date" [class]="_btnClass">
										{{ _dateAdapter.getDate(date) }}
									</button>
								</td>
							}
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	`,
})
export class HlmCalendarRange<T> {
	public readonly calendarClass = input<ClassValue>('');

	protected readonly _computedCalenderClass = computed(() => hlm('rounded-md border p-3', this.calendarClass()));

	/** Access the calendar i18n */
	protected readonly _i18n = injectBrnCalendarI18n();

	/** Access the date time adapter */
	protected readonly _dateAdapter = injectDateAdapter<T>();

	/** The minimum date that can be selected.*/
	public readonly min = input<T>();

	/** The maximum date that can be selected. */
	public readonly max = input<T>();

	/** Show dropdowns to navigate between months or years. */
	public readonly captionLayout = input<'dropdown' | 'label' | 'dropdown-months' | 'dropdown-years'>('label');

	/** Determine if the date picker is disabled. */
	public readonly disabled = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	/** The start date of the range. */
	public readonly startDate = model<T>();

	/** The end date of the range. */
	public readonly endDate = model<T>();

	/** Whether a specific date is disabled. */
	public readonly dateDisabled = input<(date: T) => boolean>(() => false);

	/** The day the week starts on */
	public readonly weekStartsOn = input<Weekday, NumberInput>(undefined, {
		transform: (v: unknown) => numberAttribute(v) as Weekday,
	});

	/** The default focused date. */
	public readonly defaultFocusedDate = input<T>();

	/** Access the calendar directive */
	private readonly _calendar = viewChild.required(BrnCalendarRange);

	/** Get the heading for the current month and year */
	protected readonly _heading = computed(() => {
		const config = this._i18n.config();
		const date = this._calendar().focusedDate();

		return {
			header: config.formatHeader(this._dateAdapter.getMonth(date), this._dateAdapter.getYear(date)),
			month: config.formatMonth(this._dateAdapter.getMonth(date)),
			year: config.formatYear(this._dateAdapter.getYear(date)),
		};
	});

	protected readonly _btnClass = hlm(
		buttonVariants({ variant: 'ghost' }),
		'size-8 p-0 font-normal aria-selected:opacity-100',
		'data-[outside]:text-muted-foreground data-[outside]:aria-selected:text-muted-foreground',
		'data-[today]:bg-accent data-[today]:text-accent-foreground',
		'data-[selected]:bg-primary data-[selected]:text-primary-foreground data-[selected]:focus:bg-primary data-[selected]:focus:text-primary-foreground',
		'data-[disabled]:text-muted-foreground data-[disabled]:opacity-50',
		'data-[range-start]:rounded-l-md',
		'data-[range-end]:rounded-r-md',
		'data-[range-between]:bg-accent data-[range-between]:text-accent-foreground data-[range-between]:rounded-none',
	);

	protected readonly _selectClass = 'gap-0 px-1.5 py-2 [&>ng-icon]:ml-1';
}
