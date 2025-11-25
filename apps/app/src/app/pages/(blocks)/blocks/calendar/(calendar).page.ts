import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BlockLink } from '@spartan-ng/app/app/shared/blocks/block-link';
import { BlockPreview } from '@spartan-ng/app/app/shared/blocks/block-preview';
import { OpenInButton } from '@spartan-ng/app/app/shared/blocks/open-in-button';

export const CALENDAR_REGISTRY = [
	{
		id: 'calendar-1',
		name: 'calendar-simple',
		description: 'A clean, minimal single-month calendar view',
	},
	{
		id: 'calendar-2',
		name: 'calendar-multi',
		description: 'Select multiple individual dates',
	},
	{
		id: 'calendar-3',
		name: 'calendar-date-picker',
		description: 'A date picker with a clickable input field',
	},
	{
		id: 'calendar-4',
		name: 'calendar-date-picker-with-button',
		description: 'Date picker that opens via a trigger button',
	},
	{
		id: 'calendar-5',
		name: 'calendar-date-picker-multi',
		description: 'A date picker supporting multi-date selection',
	},
	{
		id: 'calendar-6',
		name: 'calendar-date-picker-range',
		description: 'Select a start and end date as a continuous range',
	},
	{
		id: 'calendar-7',
		name: 'calendar-disabled-days',
		description: 'Calendar with certain days blocked from selection',
	},
	{
		id: 'calendar-8',
		name: 'calendar-disabled-weekends',
		description: 'Calendar where Saturdays and Sundays are not selectable',
	},
	{
		id: 'calendar-9',
		name: 'calendar-date-time-picker',
		description: 'Pick both a date and a specific time',
	},
	{
		id: 'calendar-10',
		name: 'calendar-month-year-dropdown',
		description: 'Calendar with dropdowns for month and year navigation',
	},
	{
		id: 'calendar-11',
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
		@for (item of _registry; track item.id) {
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
	protected readonly _registry = CALENDAR_REGISTRY;
}
