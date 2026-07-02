import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronLeft, lucideChevronRight } from '@ng-icons/lucide';
import { injectBrnCalendarI18n } from '@spartan-ng/brain/calendar';
import { injectDateAdapter } from '@spartan-ng/brain/date-time';
import { BrnMonthYearCalendar, BrnMonthYearImports } from '@spartan-ng/brain/month-year-calendar';
import { buttonVariants, HlmButtonImports } from '@spartan-ng/helm/button';
import { classes, hlm } from '@spartan-ng/helm/utils';

@Component({
	selector: 'hlm-month-year-calendar',
	imports: [BrnMonthYearImports, NgIcon, HlmButtonImports],
	viewProviders: [provideIcons({ lucideChevronLeft, lucideChevronRight })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [
		{
			directive: BrnMonthYearCalendar,
			inputs: ['min', 'max', 'disabled', 'date', 'defaultFocusedDate'],
			outputs: ['dateChange'],
		},
	],
	host: { 'data-slot': 'month-year-calendar' },
	template: `
		<div class="flex flex-col gap-4">
			<!-- Header -->
			<div class="flex w-full items-center justify-between gap-1.5">
				<button
					brnMonthYearCalendarPreviousButton
					hlmBtn
					variant="ghost"
					class="order-first size-(--cell-size) p-0 select-none aria-disabled:opacity-50"
				>
					<ng-icon name="lucideChevronLeft" class="rtl:rotate-180" />
				</button>

				<button hlmBtn variant="ghost" brnMonthYearCalendarHeader>{{ _heading() }}</button>

				<button
					brnMonthYearCalendarNextButton
					hlmBtn
					variant="ghost"
					class="order-last size-(--cell-size) p-0 select-none aria-disabled:opacity-50"
				>
					<ng-icon name="lucideChevronRight" class="rtl:rotate-180" />
				</button>
			</div>

			<!-- Grid -->
			@switch (_picker.view()) {
				@case ('year') {
					<div brnMonthYearCalendarGrid class="grid grid-cols-4 gap-2">
						@for (year of _picker.years(); track _dateAdapter.getYear(year)) {
							<button brnMonthYearCalendarYearButton [date]="year" [class]="_btnClass">
								{{ _i18n.config().formatYear(_dateAdapter.getYear(year)) }}
							</button>
						}
					</div>
				}
				@case ('month') {
					<div brnMonthYearCalendarGrid class="grid grid-cols-4 gap-2">
						@for (month of _picker.months(); track _dateAdapter.getMonth(month)) {
							<button brnMonthYearCalendarMonthButton [date]="month" [class]="_btnClass">
								{{ _i18n.config().months()[_dateAdapter.getMonth(month)] }}
							</button>
						}
					</div>
				}
			}
		</div>
	`,
})
export class HlmMonthYearCalendar<T> {
	/** Access the calendar i18n */
	protected readonly _i18n = injectBrnCalendarI18n();

	/** Access the date adapter */
	protected readonly _dateAdapter = injectDateAdapter<T>();

	/** Access the picker directive */
	protected readonly _picker = inject(BrnMonthYearCalendar<T>);

	/** Show the year view first, then the month view. */
	public readonly view = input<'year' | 'month'>('year');

	/** The heading for the current view. */
	protected readonly _heading = computed(() => {
		const config = this._i18n.config();

		if (this._picker.view() === 'month') {
			return config.formatYear(this._dateAdapter.getYear(this._picker.focusedDate()));
		}

		const { start, end } = this._picker.yearRange();
		return `${config.formatYear(start)} – ${config.formatYear(end)}`;
	});

	protected readonly _btnClass = hlm(
		buttonVariants({ variant: 'ghost' }),
		'data-[today=true]:bg-muted',
		'data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground data-[selected=true]:hover:bg-primary data-[selected=true]:hover:text-primary-foreground',
		'data-[focused=true]:border-ring data-[focused=true]:ring-ring/50 data-[focused=true]:ring-[3px]',
		'aria-disabled:pointer-events-none aria-disabled:opacity-50',
		'h-(--cell-size)',
	);

	constructor() {
		classes(() => 'spartan-calendar bg-background block');

		// keep the brain view in sync with the `view` input.
		this._picker.view.set(this.view());
	}
}
