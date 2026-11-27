import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BrnCalendarRange } from '@spartan-ng/brain/calendar';
import { HlmCalendarRange } from './hlm-calendar-range';

@Component({
	selector: 'hlm-calendar-range-months-host',
	imports: [HlmCalendarRange],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-calendar-range captionLayout="dropdown" [numberOfMonths]="2" [defaultFocusedDate]="start" />
	`,
})
class CalendarRangeMonthsHost {
	public readonly start = new Date(2026, 5, 15);
	public readonly calendar = viewChild.required(BrnCalendarRange);
}

describe('HlmCalendarRange with multiple months and dropdown caption', () => {
	it('does not move the focused date when the selects are synced on render', async () => {
		const fixture = TestBed.createComponent(CalendarRangeMonthsHost);
		fixture.autoDetectChanges();
		await fixture.whenStable();
		await new Promise((resolve) => setTimeout(resolve));
		await fixture.whenStable();

		const calendar = fixture.componentInstance.calendar();
		const focusedDate = calendar.focusedDate() as Date;

		expect([focusedDate.getFullYear(), focusedDate.getMonth(), focusedDate.getDate()]).toEqual([2026, 5, 15]);
		expect(calendar.months().map(({ month }) => [(month as Date).getFullYear(), (month as Date).getMonth()])).toEqual([
			[2026, 5],
			[2026, 6],
		]);
	});
});
