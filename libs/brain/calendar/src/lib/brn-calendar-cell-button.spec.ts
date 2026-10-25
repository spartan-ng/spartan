import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { fireEvent, render, waitFor } from '@testing-library/angular';
import { BrnCalendar } from './brn-calendar';
import { BrnCalendarCellButton } from './brn-calendar-cell-button';

@Component({
	imports: [BrnCalendar, BrnCalendarCellButton],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<button type="button">Before</button>
		<div brnCalendar #calendar="brnCalendar" [defaultFocusedDate]="start()" [dateDisabled]="dateDisabled" [min]="min()" [max]="max()">
			@for (day of calendar.days(); track day.getTime()) {
				<button brnCalendarCellButton [date]="day">{{ day.getDate() }}</button>
			}
		</div>
		<button type="button">After</button>
	`,
})
class CalendarHost {
	readonly start = signal(new Date(2026, 8, 18));
	readonly min = signal<Date | undefined>(undefined);
	readonly max = signal<Date | undefined>(undefined);
	dateDisabled = (date: Date) => date.getDay() === 0 || date.getDay() === 6;
}

function dayButton(container: HTMLElement, day: number): HTMLButtonElement {
	const button = [...container.querySelectorAll<HTMLButtonElement>('button[brnCalendarCellButton]')].find(
		(el) => el.textContent?.trim() === String(day),
	);
	if (!button) throw new Error(`Missing calendar day ${day}`);
	return button;
}

describe('BrnCalendar keyboard navigation', () => {
	it('skips disabled weekends on ArrowRight', async () => {
		const { container, fixture } = await render(CalendarHost);
		fireEvent.keyDown(dayButton(container, 18), { key: 'ArrowRight' });
		fixture.detectChanges();
		await waitFor(() => expect(dayButton(container, 21).tabIndex).toBe(0));
		expect(dayButton(container, 19).disabled).toBe(true);
	});

	it('keeps the tab stop on an enabled day when the initial day is disabled', async () => {
		const { container, fixture } = await render(CalendarHost);
		fixture.componentInstance.start.set(new Date(2026, 8, 19));
		fixture.detectChanges();
		expect(dayButton(container, 21).tabIndex).toBe(0);
		expect(dayButton(container, 19).tabIndex).toBe(-1);
	});

	it('falls back when the max date blocks forward focus', async () => {
		const { container, fixture } = await render(CalendarHost);
		fixture.componentInstance.max.set(new Date(2026, 8, 19));
		fixture.componentInstance.start.set(new Date(2026, 8, 19));
		fixture.detectChanges();
		expect(dayButton(container, 18).tabIndex).toBe(0);
	});

	it('skips a disabled ArrowDown target', async () => {
		const { container, fixture } = await render(CalendarHost);
		fixture.componentInstance.dateDisabled = (date: Date) => date.getDate() === 25;
		fixture.detectChanges();
		fireEvent.keyDown(dayButton(container, 18), { key: 'ArrowDown' });
		fixture.detectChanges();
		await waitFor(() => expect(dayButton(container, 26).tabIndex).toBe(0));
	});
});
