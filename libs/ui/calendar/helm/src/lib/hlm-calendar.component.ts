import { BooleanInput, NumberInput } from '@angular/cdk/coercion';
import { Component, booleanAttribute, computed, input, model, numberAttribute, viewChild } from '@angular/core';
import { lucideChevronLeft, lucideChevronRight } from '@ng-icons/lucide';
import { buttonVariants } from '@spartan-ng/ui-button-helm';
import {
	BrnCalendarCellButtonDirective,
	BrnCalendarDirective,
	BrnCalendarGridDirective,
	BrnCalendarHeaderDirective,
	BrnCalendarNextButtonDirective,
	BrnCalendarPreviousButtonDirective,
	BrnCalendarWeekDirective,
	BrnCalendarWeekdayDirective,
	Weekday,
	injectCalendarI18n,
} from '@spartan-ng/ui-calendar-brain';
import { hlm } from '@spartan-ng/ui-core';
import { injectDateAdapter } from '@spartan-ng/ui-date-time';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';

@Component({
	standalone: true,
	selector: 'hlm-calendar',
	imports: [
		BrnCalendarDirective,
		BrnCalendarHeaderDirective,
		BrnCalendarNextButtonDirective,
		BrnCalendarPreviousButtonDirective,
		BrnCalendarWeekdayDirective,
		BrnCalendarWeekDirective,
		BrnCalendarCellButtonDirective,
		BrnCalendarGridDirective,
		HlmIconComponent,
	],
	viewProviders: [provideIcons({ lucideChevronLeft, lucideChevronRight })],
	template: `
		<div brnCalendar
				 [min]="min()"
				 [max]="max()"
				 [disabled]="disabled()"
				 [(date)]="date"
				 [dateDisabled]="dateDisabled()"
				 [weekStartsOn]="weekStartsOn()"
				 [defaultFocusedDate]="defaultFocusedDate()"
				 class="p-3 rounded-md border">
			<div class="inline-flex flex-col space-y-4">

				<!-- Header -->
				<div class="space-y-4">
				<div class="flex justify-center pt-1 relative items-center">

					<div brnCalendarHeader class="text-sm font-medium">
						{{ heading() }}
					</div>

					<div class="space-x-1 flex items-center">
						<button brnCalendarPreviousButton class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-1">
							<hlm-icon name="lucideChevronLeft" class="size-4" />
						</button>

						<button brnCalendarNextButton class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-1">
							<hlm-icon name="lucideChevronRight" class="size-4" />
						</button>
					</div>

				</div>
			</div>

		<table class="w-full border-collapse space-y-1" brnCalendarGrid>
			<thead>
				<tr class="flex">
					<th *brnCalendarWeekday="let weekday"
							scope="col"
							class="text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]"
							[attr.aria-label]="i18n.labelWeekday(weekday)">
						{{ i18n.formatWeekdayName(weekday) }}
					</th>
				</tr>
			</thead>

			<tbody role="rowgroup">
				<tr *brnCalendarWeek="let week" class="flex w-full mt-2">
					@for (date of week; track dateAdapter.getTime(date)) {
					<td brnCalendarCell class='h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md data-[selected]:data-[outside]:bg-accent/50 data-[selected]:bg-accent first:data-[selected]:rounded-l-md last:data-[selected]:rounded-r-md focus-within:relative focus-within:z-20'>
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
})
export class HlmCalendarComponent<T> {
	/** Access the calendar i18n */
	protected readonly i18n = injectCalendarI18n();
	/** Access the date time adapter */
	protected readonly dateAdapter = injectDateAdapter<T>();

	/** The minimum date that can be selected.*/
	readonly min = input<T | undefined>(undefined);

	/* * The maximum date that can be selected. */
	readonly max = input<T | undefined>(undefined);

	/** Determine if the date picker is disabled. */
	readonly disabled = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	/** The selected value. */
	readonly date = model<T | undefined>();

	/** Whether a specific date is disabled. */
	readonly dateDisabled = input<(date: T) => boolean>(() => false);

	/** The day the week starts on */
	readonly weekStartsOn = input<Weekday, NumberInput>(0, {
		transform: (v: unknown) => numberAttribute(v) as Weekday,
	});

	/** The default focused date. */
	readonly defaultFocusedDate = input<T>();

	/** Access the calendar directive */
	private readonly calendar = viewChild.required(BrnCalendarDirective);

	/** Get the heading for the current month and year */
	protected heading = computed(() =>
		this.i18n.formatHeader(
			this.dateAdapter.getMonth(this.calendar().focusedDate()),
			this.dateAdapter.getYear(this.calendar().focusedDate()),
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
