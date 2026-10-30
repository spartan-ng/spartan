import { ChangeDetectionStrategy, Component, input, viewChild } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { BrnCalendar } from './brn-calendar';
import { BrnCalendarNextButton } from './brn-calendar-next-button';
import { BrnCalendarPreviousButton } from './brn-calendar-previous-button';

@Component({
	selector: 'brn-calendar-nav-spec-host',
	imports: [BrnCalendar, BrnCalendarPreviousButton, BrnCalendarNextButton],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div
			brnCalendar
			[min]="min()"
			[max]="max()"
			[dateDisabled]="dateDisabled()"
			[defaultFocusedDate]="defaultFocusedDate()"
		>
			<button brnCalendarPreviousButton>prev</button>
			<button brnCalendarNextButton>next</button>
		</div>
	`,
})
class CalendarNavSpecHost {
	public readonly min = input<Date>();
	public readonly max = input<Date>();
	public readonly dateDisabled = input<(date: Date) => boolean>(() => false);
	public readonly defaultFocusedDate = input.required<Date>();
	public readonly calendar = viewChild.required(BrnCalendar);
}

const isWeekend = (date: Date): boolean => date.getDay() === 0 || date.getDay() === 6;

describe('calendar previous/next month buttons', () => {
	async function setup(options: {
		focus: Date;
		dateDisabled?: (date: Date) => boolean;
		min?: Date;
		max?: Date;
	}): Promise<ComponentFixture<CalendarNavSpecHost>> {
		await TestBed.configureTestingModule({
			imports: [CalendarNavSpecHost],
		}).compileComponents();

		const fixture = TestBed.createComponent(CalendarNavSpecHost);
		fixture.componentRef.setInput('defaultFocusedDate', options.focus);
		fixture.componentRef.setInput('dateDisabled', options.dateDisabled ?? (() => false));
		if (options.min) {
			fixture.componentRef.setInput('min', options.min);
		}
		if (options.max) {
			fixture.componentRef.setInput('max', options.max);
		}
		fixture.detectChanges();
		return fixture;
	}

	function button(fixture: ComponentFixture<CalendarNavSpecHost>, direction: 'previous' | 'next'): HTMLButtonElement {
		const selector = direction === 'next' ? 'button[brnCalendarNextButton]' : 'button[brnCalendarPreviousButton]';
		return fixture.nativeElement.querySelector(selector) as HTMLButtonElement;
	}

	function focused(fixture: ComponentFixture<CalendarNavSpecHost>): Date {
		return fixture.componentInstance.calendar().focusedDate() as Date;
	}

	it('keeps next enabled when dateDisabled rejects only the same day number in the target month', async () => {
		const fixture = await setup({
			focus: new Date(2026, 8, 18),
			dateDisabled: isWeekend,
		});
		const next = button(fixture, 'next');

		expect(next.disabled).toBe(false);
		expect(next.getAttribute('aria-disabled')).toBeNull();

		next.click();
		fixture.detectChanges();

		const date = focused(fixture);
		expect(date.getFullYear()).toBe(2026);
		expect(date.getMonth()).toBe(9);
		expect(isWeekend(date)).toBe(false);
	});

	it('keeps previous enabled when dateDisabled rejects only the same day number in the target month', async () => {
		const fixture = await setup({
			focus: new Date(2026, 9, 5),
			dateDisabled: isWeekend,
		});
		const previous = button(fixture, 'previous');

		expect(previous.disabled).toBe(false);
		expect(previous.getAttribute('aria-disabled')).toBeNull();

		previous.click();
		fixture.detectChanges();

		const date = focused(fixture);
		expect(date.getFullYear()).toBe(2026);
		expect(date.getMonth()).toBe(8);
		expect(isWeekend(date)).toBe(false);
	});

	it('focuses the same day number when that day is enabled in the target month', async () => {
		const fixture = await setup({
			focus: new Date(2026, 8, 14),
			dateDisabled: isWeekend,
		});

		button(fixture, 'next').click();
		fixture.detectChanges();

		const date = focused(fixture);
		expect(date.getFullYear()).toBe(2026);
		expect(date.getMonth()).toBe(9);
		expect(date.getDate()).toBe(14);
	});

	it('disables next when max is the last day of the focused month', async () => {
		const fixture = await setup({
			focus: new Date(2026, 8, 18),
			max: new Date(2026, 8, 30),
		});

		expect(button(fixture, 'next').disabled).toBe(true);
		expect(button(fixture, 'previous').disabled).toBe(false);
	});

	it('disables previous when min is the first day of the focused month', async () => {
		const fixture = await setup({
			focus: new Date(2026, 8, 18),
			min: new Date(2026, 8, 1),
		});

		expect(button(fixture, 'previous').disabled).toBe(true);
		expect(button(fixture, 'next').disabled).toBe(false);
	});

	it('focuses the constrained day when max cuts the target month and that day is enabled', async () => {
		const fixture = await setup({
			focus: new Date(2026, 8, 18),
			max: new Date(2026, 9, 15),
		});
		const next = button(fixture, 'next');

		expect(next.disabled).toBe(false);

		next.click();
		fixture.detectChanges();

		const date = focused(fixture);
		expect(date.getFullYear()).toBe(2026);
		expect(date.getMonth()).toBe(9);
		expect(date.getDate()).toBe(15);
	});

	it('disables next when dateDisabled rejects every day in the target month', async () => {
		const fixture = await setup({
			focus: new Date(2026, 8, 18),
			dateDisabled: (date) => date.getMonth() === 9,
		});

		expect(button(fixture, 'next').disabled).toBe(true);
		expect(button(fixture, 'previous').disabled).toBe(false);
	});
});
