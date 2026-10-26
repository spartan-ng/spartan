import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { fireEvent, render, waitFor } from '@testing-library/angular';
import { BrnCalendar } from './brn-calendar';
import { BrnCalendarCellButton } from './brn-calendar-cell-button';

@Component({
	imports: [BrnCalendar, BrnCalendarCellButton],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<button type="button">Before</button>
		<div brnCalendar #calendar="brnCalendar" [defaultFocusedDate]="start()" [dateDisabled]="dateDisabled()" [min]="min()" [max]="max()">
			@for (day of calendar.days(); track day.getTime()) {
				<button brnCalendarCellButton [date]="day">{{ day.getDate() }}</button>
			}
		</div>
		<button type="button">After</button>
	`,
})
class CalendarHost {
	public readonly start = signal(new Date(2026, 8, 18));
	public readonly min = signal<Date | undefined>(undefined);
	public readonly max = signal<Date | undefined>(undefined);
	public readonly dateDisabled = signal<(date: Date) => boolean>((date) => date.getDay() === 0 || date.getDay() === 6);
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
		dayButton(container, 18).focus();
		fireEvent.keyDown(dayButton(container, 18), { key: 'ArrowRight' });
		fixture.detectChanges();
		await waitFor(() => expect(document.activeElement).toBe(dayButton(container, 21)));
		expect(dayButton(container, 21).tabIndex).toBe(0);
		expect(dayButton(container, 19).disabled).toBe(true);
	});

	it('moves actual keyboard focus across a month boundary', async () => {
		const { container, fixture } = await render(CalendarHost);
		fixture.componentInstance.start.set(new Date(2026, 8, 30));
		fixture.detectChanges();
		dayButton(container, 30).focus();
		fireEvent.keyDown(dayButton(container, 30), { key: 'ArrowRight' });
		fixture.detectChanges();
		await waitFor(() => expect(document.activeElement).toBe(dayButton(container, 1)));
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
		fixture.componentInstance.dateDisabled.set((date: Date) => date.getDate() === 25);
		fixture.detectChanges();
		fireEvent.keyDown(dayButton(container, 18), { key: 'ArrowDown' });
		fixture.detectChanges();
		await waitFor(() => expect(dayButton(container, 26).tabIndex).toBe(0));
	});

	it('finds the first enabled day on Home', async () => {
		const { container, fixture } = await render(CalendarHost);
		fixture.componentInstance.start.set(new Date(2026, 10, 18));
		fixture.detectChanges();
		fireEvent.keyDown(dayButton(container, 18), { key: 'Home' });
		fixture.detectChanges();
		await waitFor(() => expect(dayButton(container, 2).tabIndex).toBe(0));
	});

	it('skips a disabled same-numbered day on PageUp', async () => {
		const { container, fixture } = await render(CalendarHost);
		fixture.componentInstance.start.set(new Date(2026, 9, 19));
		fixture.detectChanges();
		fireEvent.keyDown(dayButton(container, 19), { key: 'PageUp' });
		fixture.detectChanges();
		await waitFor(() => expect(dayButton(container, 18).tabIndex).toBe(0));
	});

	it('uses the previous enabled date for ArrowRight in RTL', async () => {
		const { container, fixture } = await render(CalendarHost);
		const button = dayButton(container, 18);
		button.style.direction = 'rtl';
		fireEvent.keyDown(button, { key: 'ArrowRight' });
		fixture.detectChanges();
		await waitFor(() => expect(dayButton(container, 17).tabIndex).toBe(0));
	});
});
