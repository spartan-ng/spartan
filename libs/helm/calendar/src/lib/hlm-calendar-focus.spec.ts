import { ChangeDetectionStrategy, Component, type DebugElement, input, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
	BrnCalendarCellButton,
	BrnCalendarMonthSelect,
	BrnCalendarToken,
	BrnCalendarYearSelect,
} from '@spartan-ng/brain/calendar';
import { BrnPopover } from '@spartan-ng/brain/popover';
import { BrnSelect } from '@spartan-ng/brain/select';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';
import { HlmCalendar } from './hlm-calendar';
import { HlmCalendarMulti } from './hlm-calendar-multi';
import { HlmCalendarRange } from './hlm-calendar-range';

type CalendarKind = 'single' | 'range' | 'multi';

@Component({
	selector: 'hlm-calendar-focus-host',
	imports: [HlmPopoverImports, HlmCalendar, HlmCalendarRange, HlmCalendarMulti],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<input #input data-testid="input" />
		<hlm-popover [autoFocus]="false">
			<hlm-popover-content *hlmPopoverPortal="let ctx">
				@switch (kind()) {
					@case ('single') {
						<hlm-calendar captionLayout="dropdown" [defaultFocusedDate]="start" />
					}
					@case ('range') {
						<hlm-calendar-range captionLayout="dropdown" [defaultFocusedDate]="start" />
					}
					@case ('multi') {
						<hlm-calendar-multi captionLayout="dropdown" [defaultFocusedDate]="start" />
					}
				}
			</hlm-popover-content>
		</hlm-popover>
	`,
})
class CalendarInPopoverHost {
	public readonly kind = input.required<CalendarKind>();
	public readonly popover = viewChild.required(BrnPopover);
	public readonly start = new Date(2026, 5, 15);
}

async function openFromFocusedInput(kind: CalendarKind) {
	const fixture = TestBed.createComponent(CalendarInPopoverHost);
	fixture.componentRef.setInput('kind', kind);
	fixture.autoDetectChanges();
	await fixture.whenStable();

	const input = document.querySelector<HTMLInputElement>('[data-testid="input"]')!;
	input.focus();
	const popover = fixture.componentInstance.popover();
	popover.setOrigin(input);
	popover.open();
	await fixture.whenStable();

	return { fixture, input };
}

const selectFor = (
	fixture: { debugElement: DebugElement },
	directive: typeof BrnCalendarMonthSelect | typeof BrnCalendarYearSelect,
) => fixture.debugElement.query(By.directive(directive)).injector.get(BrnSelect);

const focusedDate = (fixture: { debugElement: DebugElement }) =>
	fixture.debugElement.query(By.directive(BrnCalendarMonthSelect)).injector.get(BrnCalendarToken).focusedDate() as Date;

const dayButtonFor = (fixture: { debugElement: DebugElement }, date: Date) =>
	fixture.debugElement.queryAll(By.directive(BrnCalendarCellButton)).find((el) => {
		const day = el.injector.get(BrnCalendarCellButton).date() as Date;
		return (
			day.getFullYear() === date.getFullYear() && day.getMonth() === date.getMonth() && day.getDate() === date.getDate()
		);
	})?.nativeElement as HTMLElement | undefined;

// let afterNextRender focus callbacks run
async function waitForRender(fixture: { whenStable: () => Promise<unknown> }) {
	await new Promise((resolve) => setTimeout(resolve));
	await fixture.whenStable();
}

describe.each<CalendarKind>(['single', 'range', 'multi'])(
	'calendar (%s) with dropdown caption in a popover',
	(kind) => {
		afterEach(() => {
			document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
		});

		it('keeps focus on the input that opened the popover', async () => {
			const { fixture, input } = await openFromFocusedInput(kind);

			expect(fixture.debugElement.query(By.directive(BrnCalendarMonthSelect))).toBeTruthy();
			await waitForRender(fixture);

			expect(document.activeElement).toBe(input);
		});

		it('still updates the focused date when a month or year is picked', async () => {
			const { fixture } = await openFromFocusedInput(kind);

			selectFor(fixture, BrnCalendarMonthSelect).select('Mar');
			await waitForRender(fixture);
			expect(focusedDate(fixture).getMonth()).toBe(2);
			const marchDay = dayButtonFor(fixture, new Date(2026, 2, 15));
			expect(marchDay).toBeTruthy();
			expect(document.activeElement).toBe(marchDay);

			selectFor(fixture, BrnCalendarYearSelect).select(2024);
			await waitForRender(fixture);
			expect(focusedDate(fixture).getFullYear()).toBe(2024);
			expect(focusedDate(fixture).getMonth()).toBe(2);
			const yearDay = dayButtonFor(fixture, new Date(2024, 2, 15));
			expect(yearDay).toBeTruthy();
			expect(document.activeElement).toBe(yearDay);
		});
	},
);
