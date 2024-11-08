describe('calendar', () => {
	describe('default', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=calendar--default');
			cy.injectAxe();
		});

		it('should select focus the selected date', () => {
			cy.get('[brnCalendarHeader]').as('header');
			cy.get('@header').should('contain.text', 'June 2024');
		});

		it('should navigate to the previous month', () => {
			cy.get('[brnCalendarHeader]').as('header');
			cy.get('@header').should('contain.text', 'June 2024');
			cy.get('[brnCalendarPreviousButton]').click();
			cy.get('@header').should('contain.text', 'May 2024');
		});

		it('should navigate to the next month', () => {
			cy.get('[brnCalendarHeader]').as('header');
			cy.get('@header').should('contain.text', 'June 2024');
			cy.get('[brnCalendarNextButton]').click();
			cy.get('@header').should('contain.text', 'July 2024');
		});

		it('should select the date', () => {
			cy.get('[brnCalendarCellButton]')
				.filter((_, element) => {
					return element.textContent.trim() === '1' && !element.hasAttribute('data-outside');
				})
				.should('have.attr', 'aria-selected', 'true')
				.should('have.attr', 'data-selected');
		});

		it('should select a date when clicked', () => {
			cy.get('[brnCalendarCellButton]')
				.filter((_, element) => {
					return element.textContent.trim() === '5' && !element.hasAttribute('data-outside');
				})
				.as('dateButton');

			cy.get('@dateButton').click();
			cy.get('@dateButton').should('have.attr', 'aria-selected', 'true');
		});

		it('should select the date when the enter key is pressed', () => {
			cy.get('[brnCalendarCellButton]')
				.filter((_, element) => {
					return element.textContent.trim() === '5' && !element.hasAttribute('data-outside');
				})
				.as('dateButton');

			cy.get('@dateButton').focus().type('{enter}');
			cy.get('@dateButton').should('have.attr', 'aria-selected', 'true');
		});

		it('should allow keyboard navigation on arrow right', () => {
			cy.get('[brnCalendarCellButton]')
				.filter((_, element) => {
					return element.textContent.trim() === '1' && !element.hasAttribute('data-outside');
				})
				.as('dateButton');

			cy.get('@dateButton').focus().trigger('keydown', { key: 'ArrowRight' });
			cy.get('[brnCalendarCellButton]')
				.filter((_, element) => {
					return element.textContent.trim() === '2' && !element.hasAttribute('data-outside');
				})
				.should('have.focus');
		});

		it('should allow keyboard navigation on arrow left', () => {
			cy.get('[brnCalendarCellButton]')
				.filter((_, element) => {
					return element.textContent.trim() === '1' && !element.hasAttribute('data-outside');
				})
				.as('dateButton');

			cy.get('@dateButton').focus().trigger('keydown', { key: 'ArrowLeft' });
			cy.get('[brnCalendarCellButton]')
				.filter((_, element) => {
					return element.textContent.trim() === '31' && !element.hasAttribute('data-outside');
				})
				.should('have.focus');
		});

		it('should allow keyboard navigation on arrow up', () => {
			cy.get('[brnCalendarCellButton]')
				.filter((_, element) => {
					return element.textContent.trim() === '1' && !element.hasAttribute('data-outside');
				})
				.as('dateButton');

			cy.get('@dateButton').focus().trigger('keydown', { key: 'ArrowUp' });
			cy.get('[brnCalendarCellButton]')
				.filter((_, element) => {
					return element.textContent.trim() === '25' && !element.hasAttribute('data-outside');
				})
				.should('have.focus');
		});

		it('should allow keyboard navigation on arrow down', () => {
			cy.get('[brnCalendarCellButton]')
				.filter((_, element) => {
					return element.textContent.trim() === '1' && !element.hasAttribute('data-outside');
				})
				.as('dateButton');

			cy.get('@dateButton').focus().trigger('keydown', { key: 'ArrowDown' });
			cy.get('[brnCalendarCellButton]')
				.filter((_, element) => {
					return element.textContent.trim() === '8' && !element.hasAttribute('data-outside');
				})
				.should('have.focus');
		});

		it('should allow keyboard navigation on home and end', () => {
			cy.get('[brnCalendarCellButton]')
				.filter((_, element) => {
					return element.textContent.trim() === '1' && !element.hasAttribute('data-outside');
				})
				.as('dateButton');

			cy.get('@dateButton').focus().trigger('keydown', { key: 'End' });
			cy.get('[brnCalendarCellButton]')
				.filter((_, element) => {
					return element.textContent.trim() === '30' && !element.hasAttribute('data-outside');
				})
				.should('have.focus');

			cy.get('@dateButton').focus().trigger('keydown', { key: 'Home' });
			cy.get('[brnCalendarCellButton]')
				.filter((_, element) => {
					return element.textContent.trim() === '1' && !element.hasAttribute('data-outside');
				})
				.should('have.focus');
		});
	});
});
