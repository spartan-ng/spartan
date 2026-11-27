import { ChangeDetectionStrategy, Component, input, output, viewChild, viewChildren } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { BrnSelect } from '@spartan-ng/brain/select';
import { BrnCalendarCellButton } from '../brn-calendar-cell-button';
import { BrnCalendarGrid } from '../brn-calendar-grid';
import { BrnCalendarHeader } from '../brn-calendar-header';
import { BrnCalendarMonth } from '../brn-calendar-month';
import { BrnCalendarMonthSelect } from '../brn-calendar-month-select';
import { BrnCalendarNextButton } from '../brn-calendar-next-button';
import { BrnCalendarPreviousButton } from '../brn-calendar-previous-button';
import { BrnCalendarWeek } from '../brn-calendar-week';
import { BrnCalendarYearSelect } from '../brn-calendar-year-select';
import { BrnCalendarRange } from './brn-calendar-range';

@Component({
	selector: 'brn-calendar-range-months-spec-host',
	imports: [
		BrnCalendarRange,
		BrnCalendarMonth,
		BrnCalendarHeader,
		BrnCalendarGrid,
		BrnCalendarWeek,
		BrnCalendarCellButton,
		BrnCalendarPreviousButton,
		BrnCalendarNextButton,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div brnCalendarRange [numberOfMonths]="numberOfMonths()" [defaultFocusedDate]="defaultFocusedDate()">
			<button brnCalendarPreviousButton>prev</button>
			<button brnCalendarNextButton>next</button>
			@for (month of calendar().months(); track $index) {
				<div brnCalendarMonth [offset]="$index">
					<div brnCalendarHeader>{{ month.month.getMonth() }}</div>
					<table brnCalendarGrid>
						<tbody>
							<tr *brnCalendarWeek="let week">
								@for (date of week; track date.getTime()) {
									<td>
										<button brnCalendarCellButton [date]="date">{{ date.getDate() }}</button>
									</td>
								}
							</tr>
						</tbody>
					</table>
				</div>
			}
		</div>
	`,
})
class CalendarRangeMonthsSpecHost {
	public readonly numberOfMonths = input(2);
	public readonly defaultFocusedDate = input.required<Date>();
	public readonly calendar = viewChild.required<BrnCalendarRange<Date>>(BrnCalendarRange);
}

describe('BrnCalendarRange numberOfMonths', () => {
	async function setup(focus: Date, numberOfMonths = 2): Promise<ComponentFixture<CalendarRangeMonthsSpecHost>> {
		await TestBed.configureTestingModule({ imports: [CalendarRangeMonthsSpecHost] }).compileComponents();

		const fixture = TestBed.createComponent(CalendarRangeMonthsSpecHost);
		fixture.componentRef.setInput('defaultFocusedDate', focus);
		fixture.componentRef.setInput('numberOfMonths', numberOfMonths);
		fixture.detectChanges();
		fixture.detectChanges();
		return fixture;
	}

	const displayedMonths = (fixture: ComponentFixture<CalendarRangeMonthsSpecHost>) =>
		fixture.componentInstance
			.calendar()
			.months()
			.map(({ month }) => [month.getFullYear(), month.getMonth()]);

	const monthElements = (fixture: ComponentFixture<CalendarRangeMonthsSpecHost>): HTMLElement[] =>
		Array.from(fixture.nativeElement.querySelectorAll('[brnCalendarMonth]'));

	it('renders the given number of consecutive months', async () => {
		const fixture = await setup(new Date(2026, 11, 10), 3);

		expect(displayedMonths(fixture)).toEqual([
			[2026, 11],
			[2027, 0],
			[2027, 1],
		]);
		expect(monthElements(fixture)).toHaveLength(3);
	});

	it('marks days outside of the month they are rendered in', async () => {
		const fixture = await setup(new Date(2026, 10, 10));
		const [november, december] = monthElements(fixture);

		const outsideInNovember = november.querySelector('button[data-outside="true"]') as HTMLButtonElement;
		expect(outsideInNovember).not.toBeNull();

		const novemberDays = Array.from(november.querySelectorAll('button:not([data-outside])'));
		const decemberDays = Array.from(december.querySelectorAll('button:not([data-outside])'));
		expect(novemberDays).toHaveLength(30);
		expect(decemberDays).toHaveLength(31);
	});

	it('only makes the focused day focusable within its own month', async () => {
		const fixture = await setup(new Date(2026, 10, 10));
		// the 1st of December is also rendered as an outside day of November
		fixture.componentInstance.calendar().setFocusedDate(new Date(2026, 11, 1));
		fixture.detectChanges();

		const focusable = fixture.nativeElement.querySelectorAll('button[brnCalendarCellButton][tabindex="0"]');
		expect(focusable).toHaveLength(1);
		expect(focusable[0].closest('[brnCalendarMonth]')).toBe(monthElements(fixture)[1]);
	});

	it('labels each grid by the header of its month', async () => {
		const fixture = await setup(new Date(2026, 10, 10));

		for (const month of monthElements(fixture)) {
			const header = month.querySelector('[brnCalendarHeader]') as HTMLElement;
			const grid = month.querySelector('[brnCalendarGrid]') as HTMLElement;
			expect(grid.getAttribute('aria-labelledby')).toBe(header.id);
		}
	});

	it('does not shift the displayed months when focus moves within them', async () => {
		const fixture = await setup(new Date(2026, 10, 10));

		fixture.componentInstance.calendar().setFocusedDate(new Date(2026, 11, 3));
		fixture.detectChanges();

		expect(displayedMonths(fixture)).toEqual([
			[2026, 10],
			[2026, 11],
		]);
	});

	it('shifts the displayed months when focus leaves them', async () => {
		const fixture = await setup(new Date(2026, 10, 10));

		fixture.componentInstance.calendar().setFocusedDate(new Date(2027, 0, 3));
		fixture.detectChanges();
		expect(displayedMonths(fixture)).toEqual([
			[2026, 11],
			[2027, 0],
		]);

		fixture.componentInstance.calendar().setFocusedDate(new Date(2026, 9, 3));
		fixture.detectChanges();
		expect(displayedMonths(fixture)).toEqual([
			[2026, 9],
			[2026, 10],
		]);
	});

	it('navigates one month at a time with the previous and next buttons', async () => {
		const fixture = await setup(new Date(2026, 10, 10));

		(fixture.nativeElement.querySelector('button[brnCalendarNextButton]') as HTMLButtonElement).click();
		fixture.detectChanges();
		expect(displayedMonths(fixture)).toEqual([
			[2026, 11],
			[2027, 0],
		]);

		(fixture.nativeElement.querySelector('button[brnCalendarPreviousButton]') as HTMLButtonElement).click();
		fixture.detectChanges();
		expect(displayedMonths(fixture)).toEqual([
			[2026, 10],
			[2026, 11],
		]);
	});

	it('shows a month at a given offset', async () => {
		const fixture = await setup(new Date(2026, 10, 10));

		const calendar = fixture.componentInstance.calendar();
		calendar.setFocusedDate(new Date(2026, 4, 1));
		calendar.showMonth(calendar.focusedDate(), 0);
		fixture.detectChanges();

		expect(displayedMonths(fixture)).toEqual([
			[2026, 4],
			[2026, 5],
		]);
	});
});

@Component({
	// eslint-disable-next-line @angular-eslint/component-selector -- matches the selector of the calendar selects
	selector: 'hlm-select',
	providers: [{ provide: BrnSelect, useExisting: SelectStub }],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: '',
})
class SelectStub {
	public readonly value = output<unknown>();
	public written: unknown;

	public writeValue(value: unknown): void {
		this.written = value;
	}
}

@Component({
	selector: 'brn-calendar-range-selects-spec-host',
	imports: [BrnCalendarRange, BrnCalendarMonth, BrnCalendarMonthSelect, BrnCalendarYearSelect, SelectStub],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div brnCalendarRange [numberOfMonths]="2" [defaultFocusedDate]="defaultFocusedDate" [dateDisabled]="dateDisabled">
			@for (month of calendar().months(); track $index) {
				<div brnCalendarMonth [offset]="$index">
					<hlm-select brnCalendarMonthSelect #monthSelect />
					<hlm-select brnCalendarYearSelect #yearSelect />
				</div>
			}
		</div>
	`,
})
class CalendarRangeSelectsSpecHost {
	public readonly defaultFocusedDate = new Date(2026, 5, 10);
	public readonly dateDisabled = (date: Date) => date.getMonth() === 8 || date.getFullYear() === 2027;
	public readonly calendar = viewChild.required<BrnCalendarRange<Date>>(BrnCalendarRange);
	public readonly monthSelects = viewChildren('monthSelect', { read: SelectStub });
	public readonly yearSelects = viewChildren('yearSelect', { read: SelectStub });
}

describe('BrnCalendarRange numberOfMonths with month and year selects', () => {
	async function setup(): Promise<ComponentFixture<CalendarRangeSelectsSpecHost>> {
		await TestBed.configureTestingModule({ imports: [CalendarRangeSelectsSpecHost] }).compileComponents();

		const fixture = TestBed.createComponent(CalendarRangeSelectsSpecHost);
		fixture.detectChanges();
		fixture.detectChanges();
		return fixture;
	}

	const displayedMonths = (fixture: ComponentFixture<CalendarRangeSelectsSpecHost>) =>
		fixture.componentInstance
			.calendar()
			.months()
			.map(({ month }) => [month.getFullYear(), month.getMonth()]);

	it('keeps the selected month at the position of its select', async () => {
		const fixture = await setup();

		fixture.componentInstance.monthSelects()[1].value.emit('Oct');
		fixture.detectChanges();

		expect(displayedMonths(fixture)).toEqual([
			[2026, 8],
			[2026, 9],
		]);
	});

	it('does not move the displayed months when the selected month is rejected', async () => {
		const fixture = await setup();

		fixture.componentInstance.monthSelects()[1].value.emit('Sep');
		fixture.detectChanges();

		expect(displayedMonths(fixture)).toEqual([
			[2026, 5],
			[2026, 6],
		]);
		expect(fixture.componentInstance.monthSelects()[1].written).toBe('Jul');
	});

	it('does not move the displayed months when the selected year is rejected', async () => {
		const fixture = await setup();

		fixture.componentInstance.yearSelects()[1].value.emit(2027);
		fixture.detectChanges();

		expect(displayedMonths(fixture)).toEqual([
			[2026, 5],
			[2026, 6],
		]);
		expect(fixture.componentInstance.yearSelects()[1].written).toBe(2026);
	});
});
