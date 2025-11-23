import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BlockLink } from '@spartan-ng/app/app/shared/blocks/block-link';
import { BlockPreview } from '@spartan-ng/app/app/shared/blocks/block-preview';
import { OpenInButton } from '@spartan-ng/app/app/shared/blocks/open-in-button';

export const CALENDAR_REGISTRY = [
	{
		id: 'calendar-simple',
		name: 'calendar-simple',
		description: 'A clean, minimal single-month calendar view',
	},
	{
		id: 'calendar-multi',
		name: 'calendar-multi',
		description: 'Select multiple individual dates',
	},
	{
		id: 'calendar-date-picker',
		name: 'calendar-date-picker',
		description: 'A date picker with a clickable input field',
	},
	{
		id: 'calendar-date-picker-with-button',
		name: 'calendar-date-picker-with-button',
		description: 'Date picker that opens via a trigger button',
	},
	{
		id: 'calendar-date-picker-multi',
		name: 'calendar-date-picker-multi',
		description: 'A date picker supporting multi-date selection',
	},
	{
		id: 'calendar-date-picker-range',
		name: 'calendar-date-picker-range',
		description: 'Select a start and end date as a continuous range',
	},
	{
		id: 'calendar-disabled-days',
		name: 'calendar-disabled-days',
		description: 'Calendar with certain days blocked from selection',
	},
	{
		id: 'calendar-disabled-weekends',
		name: 'calendar-disabled-weekends',
		description: 'Calendar where Saturdays and Sundays are not selectable',
	},
	{
		id: 'calendar-date-time-picker',
		name: 'calendar-date-time-picker',
		description: 'Pick both a date and a specific time',
	},
	{
		id: 'calendar-month-year-dropdown',
		name: 'calendar-month-year-dropdown',
		description: 'Calendar with dropdowns for month and year navigation',
	},
	{
		id: 'calendar-localized',
		name: 'calendar-localized',
		description: 'Calendar with dynamic language and locale support',
	},
];

@Component({
	selector: 'spartan-calendar',
	imports: [BlockPreview, OpenInButton, BlockLink],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex flex-col gap-12 md:gap-24 [&_spartan-block-preview>div]:!h-[600px]',
	},
	template: `
		@for (item of registry; track item.id) {
			<div [id]="item.id" class="flex flex-col gap-4">
				<div class="flex items-center justify-between px-2">
					<spartan-block-link [fragment]="item.id">
						{{ item.description }}
					</spartan-block-link>

					<spartan-open-in-button [block]="item.name" />
				</div>

				<spartan-block-preview [name]="item.name" />
			</div>
		}
	`,
})
export default class CalendarPage {
	registry = CALENDAR_REGISTRY;
}
