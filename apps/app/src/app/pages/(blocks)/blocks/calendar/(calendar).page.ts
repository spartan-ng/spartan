import { RouteMeta } from '@analogjs/router';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BlockLink } from '@spartan-ng/app/app/shared/blocks/block-link';
import { OpenInComponentButton } from '@spartan-ng/app/app/shared/blocks/open-in-component-button';
import { metaWith } from '@spartan-ng/app/app/shared/meta/meta.util';
import { CalendarDatePickerMultiComponent } from './calendar-date-picker-multi/calendar-date-picker-multi.component';
import { CalendarDatePickerRangeComponent } from './calendar-date-picker-range/calendar-date-picker-range.component';
import { CalendarDatePickerWithButtonComponent } from './calendar-date-picker-with-button/calendar-date-picker-with-button.component';
import { CalendarDatePickerComponent } from './calendar-date-picker/calendar-date-picker.component';
import { CalendarDateAndTimePickerComponent } from './calendar-date-time-picker/calendar-date-time-picker.component';
import { CalendarDisabledDaysComponent } from './calendar-disabled-days/calendar-disabled-days.component';
import { CalendarDisabledWeekendsComponent } from './calendar-disabled-weekends/calendar-disabled-weekends.component';
import { CalendarLocalizedComponent } from './calendar-localized/calendar-localized.component';
import { CalendarMonthAndYearComponent } from './calendar-month-year-dropdown/calendar-month-year-dropdown.component';
import { CalendarMultiComponent } from './calendar-multi/calendar-multi.component';
import { CalendarSimpleComponent } from './calendar-simple/calendar-simple.component';

export const routeMeta: RouteMeta = {
	meta: metaWith('spartan/blocks - Calendar', 'Calendar blocks using spartan/ui primitives'),
	title: 'spartan/blocks - Calendar',
};

@Component({
	selector: 'spartan-calendar',
	imports: [
		OpenInComponentButton,
		BlockLink,
		CalendarSimpleComponent,
		CalendarMultiComponent,
		CalendarMonthAndYearComponent,
		CalendarLocalizedComponent,
		CalendarDisabledDaysComponent,
		CalendarDisabledWeekendsComponent,
		CalendarDateAndTimePickerComponent,
		CalendarDatePickerRangeComponent,
		CalendarDatePickerMultiComponent,
		CalendarDatePickerComponent,
		CalendarDatePickerWithButtonComponent,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex flex-col gap-12 md:gap-24',
	},
	template: `
		<div id="calendar-1" class="flex flex-col gap-4">
			<div class="flex items-center justify-between px-2">
				<spartan-block-link fragment="calendar-1">A simple calendar</spartan-block-link>
				<spartan-open-in-component-button block="calendar-simple" />
			</div>

			<spartan-calendar-simple />
		</div>

		<div id="calendar-2" class="flex flex-col gap-4">
			<div class="flex items-center justify-between px-2">
				<spartan-block-link fragment="calendar-2">A calendar with multiple date selection</spartan-block-link>
				<spartan-open-in-component-button block="calendar-multi" />
			</div>

			<spartan-calendar-multi />
		</div>

		<div id="calendar-3" class="flex flex-col gap-4">
			<div class="flex items-center justify-between px-2">
				<spartan-block-link fragment="calendar-3" class="line-camp-1">A calendar with date picker</spartan-block-link>
				<spartan-open-in-component-button block="calendar-date-picker" />
			</div>

			<spartan-calendar-date-picker />
		</div>

		<div id="calendar-4" class="flex flex-col gap-4">
			<div class="flex items-center justify-between px-2">
				<spartan-block-link fragment="calendar-4">A calendar with date picker and buttons</spartan-block-link>
				<spartan-open-in-component-button block="calendar-date-picker-with-button" />
			</div>

			<spartan-calendar-date-picker-with-button />
		</div>

		<div id="calendar-5" class="flex flex-col gap-4">
			<div class="flex items-center justify-between px-2">
				<spartan-block-link fragment="calendar-5">A calendar with multiple date picker</spartan-block-link>
				<spartan-open-in-component-button block="calendar-date-picker-multi" />
			</div>

			<spartan-calendar-date-picker-multi />
		</div>

		<div id="calendar-6" class="flex flex-col gap-4">
			<div class="flex items-center justify-between px-2">
				<spartan-block-link fragment="calendar-6">A calendar with continuous range</spartan-block-link>
				<spartan-open-in-component-button block="calendar-date-picker-range" />
			</div>

			<spartan-calendar-date-picker-range />
		</div>

		<div id="calendar-7" class="flex flex-col gap-4">
			<div class="flex items-center justify-between px-2">
				<spartan-block-link fragment="calendar-7">
					A calendar with certain days blocked from selection
				</spartan-block-link>
				<spartan-open-in-component-button block="calendar-disabled-days" />
			</div>

			<spartan-calendar-disabled-days />
		</div>

		<div id="calendar-8" class="flex flex-col gap-4">
			<div class="flex items-center justify-between px-2">
				<spartan-block-link fragment="calendar-8">
					A calendar where Saturdays and Sundays are not selectable
				</spartan-block-link>
				<spartan-open-in-component-button block="calendar-disabled-weekends" />
			</div>

			<spartan-calendar-disabled-weekends />
		</div>

		<div id="calendar-9" class="flex flex-col gap-4">
			<div class="flex items-center justify-between px-2">
				<spartan-block-link fragment="calendar-9">A calendar with date and time picker</spartan-block-link>
				<spartan-open-in-component-button block="calendar-date-and-time-picker" />
			</div>

			<spartan-calendar-date-and-time-picker />
		</div>

		<div id="calendar-10" class="flex flex-col gap-4">
			<div class="flex items-center justify-between px-2">
				<spartan-block-link fragment="calendar-10">
					A calendar with dropdowns for month and year navigation
				</spartan-block-link>
				<spartan-open-in-component-button block="calendar-month-and-year-dropdown" />
			</div>

			<spartan-calendar-month-and-year-dropdown />
		</div>

		<div id="calendar-11" class="flex flex-col gap-4">
			<div class="flex items-center justify-between px-2">
				<spartan-block-link fragment="calendar-11">
					A calendar with dynamic language and locale support
				</spartan-block-link>
				<spartan-open-in-component-button block="calendar-localized" />
			</div>

			<spartan-calendar-localized />
		</div>
	`,
})
export default class CalendarPage {}
