import { ChangeDetectionStrategy, Component, input, type Provider } from '@angular/core';
import { render } from '@testing-library/angular';
import { provideBrnCalendarI18n } from '../i18n/calendar-i18n';
import { BrnMonthYearCalendar } from './brn-month-year-calendar';
import { BrnMonthYearCalendarNextButton } from './brn-month-year-calendar-next-button';
import { BrnMonthYearCalendarPreviousButton } from './brn-month-year-calendar-previous-button';
import type { BrnMonthYearCalendarView } from './brn-month-year-calendar.token';

@Component({
	imports: [BrnMonthYearCalendar, BrnMonthYearCalendarPreviousButton, BrnMonthYearCalendarNextButton],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div brnMonthYearCalendar [view]="view()">
			<button brnMonthYearCalendarPreviousButton data-testid="previous">‹</button>
			<button brnMonthYearCalendarNextButton data-testid="next">›</button>
		</div>
	`,
})
class MonthYearCalendarHost {
	public readonly view = input<BrnMonthYearCalendarView>('year');
}

async function setup(view: BrnMonthYearCalendarView, providers: Provider[] = []) {
	const { getByTestId } = await render(MonthYearCalendarHost, {
		inputs: { view },
		providers,
	});
	return { previous: getByTestId('previous'), next: getByTestId('next') };
}

describe('BrnMonthYearCalendar navigation buttons', () => {
	describe('default labels', () => {
		it('should use the default English labels in the year view', async () => {
			const { previous, next } = await setup('year');

			expect(previous).toHaveAttribute('aria-label', 'Go to the previous years');
			expect(next).toHaveAttribute('aria-label', 'Go to the next years');
		});

		it('should use the default English labels in the month view', async () => {
			const { previous, next } = await setup('month');

			expect(previous).toHaveAttribute('aria-label', 'Go to the previous year');
			expect(next).toHaveAttribute('aria-label', 'Go to the next year');
		});

		it('should keep the default labels when only other i18n keys are provided', async () => {
			const { previous, next } = await setup('month', [
				provideBrnCalendarI18n({ labelPrevious: () => 'Mois précédent', labelNext: () => 'Mois suivant' }),
			]);

			expect(previous).toHaveAttribute('aria-label', 'Go to the previous year');
			expect(next).toHaveAttribute('aria-label', 'Go to the next year');
		});
	});

	describe('translated labels', () => {
		const frenchI18n = provideBrnCalendarI18n({
			labelPreviousYear: () => 'Année précédente',
			labelNextYear: () => 'Année suivante',
			labelPreviousYears: () => 'Années précédentes',
			labelNextYears: () => 'Années suivantes',
		});

		it('should use the translated labels in the year view', async () => {
			const { previous, next } = await setup('year', [frenchI18n]);

			expect(previous).toHaveAttribute('aria-label', 'Années précédentes');
			expect(next).toHaveAttribute('aria-label', 'Années suivantes');
		});

		it('should use the translated labels in the month view', async () => {
			const { previous, next } = await setup('month', [frenchI18n]);

			expect(previous).toHaveAttribute('aria-label', 'Année précédente');
			expect(next).toHaveAttribute('aria-label', 'Année suivante');
		});
	});
});
