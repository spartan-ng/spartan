/**
 * e2e coverage for the date picker family:
 * - trigger + calendar selection for single / multi / range / month-year pickers
 * - the text-input variants (`hlm-date-picker-input`, `hlm-date-multi-input`,
 *   `hlm-date-range-input`, `hlm-month-year-input`), including the enter-then-blur
 *   regression where committing with Enter and then blurring must NOT clear the value.
 *
 * The Input stories render a hidden `hlm-date-picker-trigger` next to the input. Its
 * `data-placeholder` attribute mirrors the picker's model: present == empty, absent == a
 * date is committed. That makes the underlying model observable from the DOM.
 */

const modelIsSet = () => cy.get('#date-trigger').should('not.have.attr', 'data-placeholder');
const modelIsEmpty = () => cy.get('#date-trigger').should('have.attr', 'data-placeholder');

const type = (value: string) => cy.get('#date-input').type(value);
const blurInput = () => cy.get('#date-input').blur();

describe('date picker', () => {
	describe('single - trigger', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=date-picker--default');
			cy.injectAxe();
		});

		it('opens the calendar and selects a date', () => {
			cy.get('#date').should('have.attr', 'data-placeholder');
			cy.get('#date').click();
			cy.get('hlm-calendar').should('exist');

			cy.get('[brnCalendarCellButton]')
				.filter((_, el) => el.textContent.trim() === '15' && !el.hasAttribute('data-outside'))
				.first()
				.click();

			cy.get('#date').should('not.have.attr', 'data-placeholder');
		});

		it('passes accessibility checks', () => {
			cy.checkA11y(undefined, {
				rules: {
					'page-has-heading-one': { enabled: false },
					'landmark-one-main': { enabled: false },
				},
			});
		});
	});

	describe('single - input', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=date-picker--input');
		});

		it('renders the input', () => {
			cy.get('#date-input').should('exist');
			modelIsEmpty();
		});

		it('keeps the caret position while editing in the middle', () => {
			type('15/06/2024');
			cy.get('#date-input').type('{moveToStart}9');
			cy.get('#date-input').should('have.value', '915/06/2024');
			cy.get('#date-input').then(($el) => {
				expect(($el[0] as HTMLInputElement).selectionStart).to.eq(1);
			});
		});

		it('commits a typed date on blur and shows the display format', () => {
			type('15/06/2024');
			blurInput();
			cy.get('#date-input').should('have.value', 'Sat Jun 15 2024');
			modelIsSet();
		});

		it('commits on Enter and keeps focus, then blur shows the display format', () => {
			cy.get('#date-input').focus();
			cy.get('#date-input').type('{downArrow}');
			cy.get('hlm-calendar').should('exist');
			type('15/06/2024{enter}');
			cy.get('hlm-calendar').should('not.exist');
			// Still focused after Enter: the edit format is kept so a later blur re-parses correctly.
			cy.get('#date-input').should('have.value', '15/06/2024');
			modelIsSet();
			blurInput();
			cy.get('#date-input').should('have.value', 'Sat Jun 15 2024');
			modelIsSet();
		});

		it('keeps the value when blurring after Enter (regression)', () => {
			type('15/06/2024{enter}');
			// After Enter the field keeps focus and the edit format - blur must re-parse it, not clear.
			cy.get('#date-input').should('have.value', '15/06/2024');
			blurInput();
			cy.get('#date-input').should('have.value', 'Sat Jun 15 2024');
			modelIsSet();
		});

		it('clears the value with the clear button', () => {
			type('15/06/2024');
			blurInput();
			modelIsSet();
			cy.get('button[aria-label="Clear date"]').click();
			cy.get('#date-input').should('have.value', '');
			modelIsEmpty();
		});

		it('keeps invalid text but leaves the model empty', () => {
			type('not a date');
			blurInput();
			cy.get('#date-input').should('have.value', 'not a date');
			modelIsEmpty();
		});
	});

	describe('multi - trigger', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=date-picker-multi--default');
		});

		it('opens the calendar and selects a date', () => {
			cy.get('#date').click();
			cy.get('hlm-calendar-multi').should('exist');
			cy.get('[brnCalendarCellButton]')
				.filter((_, el) => el.textContent.trim() === '15' && !el.hasAttribute('data-outside'))
				.first()
				.click();
			cy.get('#date').should('not.have.attr', 'data-placeholder');
		});
	});

	describe('multi - input', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=date-picker-multi--input');
		});

		it('renders the input', () => {
			cy.get('#date-input').should('exist');
			modelIsEmpty();
		});

		it('keeps the caret position while editing in the middle', () => {
			type('15/06/2024');
			cy.get('#date-input').type('{moveToStart}9');
			cy.get('#date-input').should('have.value', '915/06/2024');
			cy.get('#date-input').then(($el) => {
				expect(($el[0] as HTMLInputElement).selectionStart).to.eq(1);
			});
		});

		it('commits typed dates on blur and shows the display format', () => {
			type('15/06/2024');
			blurInput();
			cy.get('#date-input').should('have.value', 'Sat Jun 15 2024');
			modelIsSet();
		});

		it('keeps the value when blurring after Enter (regression)', () => {
			type('15/06/2024{enter}');
			cy.get('#date-input').should('have.value', '15/06/2024');
			blurInput();
			cy.get('#date-input').should('have.value', 'Sat Jun 15 2024');
			modelIsSet();
		});

		it('keeps invalid text but leaves the model empty', () => {
			type('not a date');
			blurInput();
			cy.get('#date-input').should('have.value', 'not a date');
			modelIsEmpty();
		});
	});

	describe('range - trigger', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=date-range-picker--default');
		});

		it('opens the calendar and selects a range', () => {
			cy.get('#date').click();
			cy.get('hlm-calendar-range').should('exist');

			cy.get('[brnCalendarCellButton]')
				.filter((_, el) => el.textContent.trim() === '15' && !el.hasAttribute('data-outside'))
				.first()
				.click();
			cy.get('[brnCalendarCellButton]')
				.filter((_, el) => el.textContent.trim() === '20' && !el.hasAttribute('data-outside'))
				.first()
				.click();

			cy.get('#date').should('not.have.attr', 'data-placeholder');
		});
	});

	describe('range - input', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=date-range-picker--input');
		});

		it('renders the input', () => {
			cy.get('#date-input').should('exist');
			modelIsEmpty();
		});

		it('keeps the caret position while editing in the middle', () => {
			type('15/06/2024 - 20/06/2024');
			cy.get('#date-input').type('{moveToStart}9');
			cy.get('#date-input').should('have.value', '915/06/2024 - 20/06/2024');
			cy.get('#date-input').then(($el) => {
				expect(($el[0] as HTMLInputElement).selectionStart).to.eq(1);
			});
		});

		it('commits a typed range on blur and shows the display format', () => {
			type('15/06/2024 - 20/06/2024');
			blurInput();
			cy.get('#date-input').should('have.value', 'Sat Jun 15 2024 to Thu Jun 20 2024');
			modelIsSet();
		});

		it('keeps the value when blurring after Enter (regression)', () => {
			type('15/06/2024 - 20/06/2024{enter}');
			cy.get('#date-input').should('have.value', '15/06/2024 - 20/06/2024');
			blurInput();
			cy.get('#date-input').should('have.value', 'Sat Jun 15 2024 to Thu Jun 20 2024');
			modelIsSet();
		});

		it('keeps invalid text but leaves the model empty', () => {
			type('not a range');
			blurInput();
			cy.get('#date-input').should('have.value', 'not a range');
			modelIsEmpty();
		});
	});

	describe('month-year - trigger', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=month-year-picker--default');
		});

		it('opens the month-year calendar', () => {
			cy.get('#date').click();
			cy.get('hlm-month-year-calendar').should('exist');
		});
	});

	describe('month-year - input', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=month-year-picker--input');
		});

		it('renders the input', () => {
			cy.get('#date-input').should('exist');
			modelIsEmpty();
		});

		it('keeps the caret position while editing in the middle', () => {
			type('06/2024');
			cy.get('#date-input').type('{moveToStart}9');
			cy.get('#date-input').should('have.value', '906/2024');
			cy.get('#date-input').then(($el) => {
				expect(($el[0] as HTMLInputElement).selectionStart).to.eq(1);
			});
		});

		it('commits a typed month/year on blur and shows the display format', () => {
			type('06/2024');
			blurInput();
			cy.get('#date-input').should('have.value', '06.2024');
			modelIsSet();
		});

		it('keeps the value when blurring after Enter (regression)', () => {
			type('06/2024{enter}');
			cy.get('#date-input').should('have.value', '06/2024');
			blurInput();
			cy.get('#date-input').should('have.value', '06.2024');
			modelIsSet();
		});

		it('keeps invalid text but leaves the model empty', () => {
			type('13/2024');
			blurInput();
			cy.get('#date-input').should('have.value', '13/2024');
			modelIsEmpty();
		});
	});
});
