import { BooleanInput, NumberInput } from '@angular/cdk/coercion';
import {
	ChangeDetectionStrategy,
	Component,
	booleanAttribute,
	computed,
	input,
	model,
	numberAttribute,
	viewChild,
} from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronLeft, lucideChevronRight } from '@ng-icons/lucide';
import {
	BrnCalendarCellButtonDirective,
	BrnCalendarCellDirective,
	BrnCalendarDirective,
	BrnCalendarGridDirective,
	BrnCalendarHeaderDirective,
	BrnCalendarNextButtonDirective,
	BrnCalendarPreviousButtonDirective,
	BrnCalendarWeekDirective,
	BrnCalendarWeekdayDirective,
	Weekday,
	injectBrnCalendarI18n,
} from '@spartan-ng/brain/calendar';
import { hlm } from '@spartan-ng/brain/core';
import { injectDateAdapter } from '@spartan-ng/brain/date-time';
import { buttonVariants } from '@spartan-ng/helm/button';
import { HlmIconDirective } from '@spartan-ng/helm/icon';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-calendar',
	imports: [
		BrnCalendarDirective,
		BrnCalendarHeaderDirective,
		BrnCalendarNextButtonDirective,
		BrnCalendarPreviousButtonDirective,
		BrnCalendarWeekdayDirective,
		BrnCalendarWeekDirective,
		BrnCalendarCellButtonDirective,
		BrnCalendarCellDirective,
		BrnCalendarGridDirective,
		NgIcon,
		HlmIconDirective,
	],
	viewProviders: [provideIcons({ lucideChevronLeft, lucideChevronRight })],
	template: `
		<div
			brnCalendar
			[min]="min()"
			[max]="max()"
			[disabled]="disabled()"
			[(date)]="date"
			[dateDisabled]="dateDisabled()"
			[weekStartsOn]="weekStartsOn()"
			[defaultFocusedDate]="defaultFocusedDate()"
			[class]="_computedCalenderClass()"
		>
			<div class="inline-flex flex-col space-y-4">
				<!-- Header -->
				<div class="space-y-4">
					<div class="relative flex items-center justify-center pt-1">
						<div brnCalendarHeader class="text-sm font-medium">
							{{ heading() }}
						</div>

						<div class="flex items-center space-x-1">
							<button
								brnCalendarPreviousButton
								class="ring-offset-background focus-visible:ring-ring border-input hover:bg-accent hover:text-accent-foreground absolute left-1 inline-flex h-7 w-7 items-center justify-center whitespace-nowrap rounded-md border bg-transparent p-0 text-sm font-medium opacity-50 transition-colors hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
							>
								<ng-icon hlm name="lucideChevronLeft" size="sm" />
							</button>

							<button
								brnCalendarNextButton
								class="ring-offset-background focus-visible:ring-ring border-input hover:bg-accent hover:text-accent-foreground absolute right-1 inline-flex h-7 w-7 items-center justify-center whitespace-nowrap rounded-md border bg-transparent p-0 text-sm font-medium opacity-50 transition-colors hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
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
								class="text-muted-foreground w-9 rounded-md text-[0.8rem] font-normal"
								[attr.aria-label]="i18n.labelWeekday(weekday)"
							>
								{{ i18n.formatWeekdayName(weekday) }}
							</th>
						</tr>
					</thead>

					<tbody role="rowgroup">
						<tr *brnCalendarWeek="let week" class="mt-2 flex w-full">
							@for (date of week; track dateAdapter.getTime(date)) {
								<td
									brnCalendarCell
									class="data-[selected]:data-[outside]:bg-accent/50 data-[selected]:bg-accent relative h-9 w-9 p-0 text-center text-sm focus-within:relative focus-within:z-20 first:data-[selected]:rounded-l-md last:data-[selected]:rounded-r-md [&:has([aria-selected].day-range-end)]:rounded-r-md"
								>
									<button brnCalendarCellButton [date]="date" [class]="btnClass">
										{{ dateAdapter.getDate(date) }}
									</button>
								</td>
							}
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HlmCalendarComponent<T> {
	public readonly calendarClass = input<ClassValue>('');

	protected readonly _computedCalenderClass = computed(() => hlm('rounded-md border p-3', this.calendarClass()));

	/** Access the calendar i18n */
	protected readonly i18n = injectBrnCalendarI18n();

	/** Access the date time adapter */
	protected readonly dateAdapter = injectDateAdapter<T>();

	/** The minimum date that can be selected.*/
	public readonly min = input<T>();

	/** The maximum date that can be selected. */
	public readonly max = input<T>();

	/** Determine if the date picker is disabled. */
	public readonly disabled = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	/** The selected value. */
	public readonly date = model<T>();

	/** Whether a specific date is disabled. */
	public readonly dateDisabled = input<(date: T) => boolean>(() => false);

	/** The day the week starts on */
	public readonly weekStartsOn = input<Weekday, NumberInput>(0, {
		transform: (v: unknown) => numberAttribute(v) as Weekday,
	});

	/** The default focused date. */
	public readonly defaultFocusedDate = input<T>();

	/** Access the calendar directive */
	private readonly _calendar = viewChild.required(BrnCalendarDirective);

	/** Get the heading for the current month and year */
	protected heading = computed(() =>
		this.i18n.formatHeader(
			this.dateAdapter.getMonth(this._calendar().focusedDate()),
			this.dateAdapter.getYear(this._calendar().focusedDate()),
		),
	);

	protected readonly btnClass = hlm(
		buttonVariants({ variant: 'ghost' }),
		'h-9 w-9 p-0 font-normal aria-selected:opacity-100',
		'data-[outside]:text-muted-foreground data-[outside]:opacity-50 data-[outside]:aria-selected:bg-accent/50 data-[outside]:aria-selected:text-muted-foreground data-[outside]:aria-selected:opacity-30',
		'data-[today]:bg-accent data-[today]:text-accent-foreground',
		'data-[selected]:bg-primary data-[selected]:text-primary-foreground data-[selected]:hover:bg-primary data-[selected]:hover:text-primary-foreground data-[selected]:focus:bg-primary data-[selected]:focus:text-primary-foreground',
		'data-[disabled]:text-muted-foreground data-[disabled]:opacity-50',
	);
}
