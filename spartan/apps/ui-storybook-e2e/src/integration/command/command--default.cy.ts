describe('command', () => {
	describe('default', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=command--default');
			cy.injectAxe();
		});
		it(`
	  first option should be selected by default.
	  Typing bil, should show and select only billing
	  Typing BIL, should show and select only billing
	  Typing ca should show calendar and calculator and select calendar because it comes first
	  Typing CA should show calendar and calculator and select calendar because it comes first
	  Click on billing should select billing
	  `, () => {
			cy.checkA11y('#storybook-root', {
				rules: {
					'page-has-heading-one': { enabled: false },
					'landmark-one-main': { enabled: false },
				},
			});
			cy.realPress('Tab');
			cy.realPress('Tab');
			cy.findByText(/calendar/i).should('have.attr', 'aria-selected', 'true');
			cy.findByText(/calendar/i).should('be.visible');
			cy.findByText(/billing/i).should('have.attr', 'aria-selected', 'false');
			cy.findByText(/billing/i).should('be.visible');
			cy.get('input').type('bil');
			cy.findByText(/calendar/i).should('have.attr', 'aria-selected', 'false');
			cy.findByText(/calendar/i).should('not.be.visible');
			cy.findByText(/billing/i).should('have.attr', 'aria-selected', 'true');
			cy.findByText(/billing/i).should('be.visible');
			cy.get('input').clear();
			cy.findByText(/calendar/i).should('have.attr', 'aria-selected', 'true');
			cy.findByText(/calendar/i).should('be.visible');
			cy.findByText(/billing/i).should('have.attr', 'aria-selected', 'false');
			cy.findByText(/billing/i).should('be.visible');
			cy.get('input').type('BIL');
			cy.findByText(/calendar/i).should('have.attr', 'aria-selected', 'false');
			cy.findByText(/calendar/i).should('not.be.visible');
			cy.findByText(/billing/i).should('have.attr', 'aria-selected', 'true');
			cy.findByText(/billing/i).should('be.visible');
			cy.get('input').clear();
			cy.findByText(/calendar/i).should('have.attr', 'aria-selected', 'true');
			cy.findByText(/calendar/i).should('be.visible');
			cy.findByText(/billing/i).should('have.attr', 'aria-selected', 'false');
			cy.findByText(/billing/i).should('be.visible');
			cy.findByText(/calculator/i).should('have.attr', 'aria-selected', 'false');
			cy.findByText(/calculator/i).should('be.visible');
			cy.get('input').type('ca');
			cy.findByText(/calendar/i).should('have.attr', 'aria-selected', 'true');
			cy.findByText(/calendar/i).should('be.visible');
			cy.findByText(/billing/i).should('have.attr', 'aria-selected', 'false');
			cy.findByText(/billing/i).should('not.be.visible');
			cy.findByText(/calculator/i).should('have.attr', 'aria-selected', 'false');
			cy.findByText(/calculator/i).should('be.visible');
			cy.get('input').clear();
			cy.findByText(/calendar/i).should('have.attr', 'aria-selected', 'true');
			cy.findByText(/calendar/i).should('be.visible');
			cy.findByText(/billing/i).should('have.attr', 'aria-selected', 'false');
			cy.findByText(/billing/i).should('be.visible');
			cy.findByText(/calculator/i).should('have.attr', 'aria-selected', 'false');
			cy.findByText(/calculator/i).should('be.visible');
			cy.get('input').type('CA');
			cy.findByText(/calendar/i).should('have.attr', 'aria-selected', 'true');
			cy.findByText(/calendar/i).should('be.visible');
			cy.findByText(/billing/i).should('have.attr', 'aria-selected', 'false');
			cy.findByText(/billing/i).should('not.be.visible');
			cy.findByText(/calculator/i).should('have.attr', 'aria-selected', 'false');
			cy.findByText(/calculator/i).should('be.visible');
			cy.get('input').clear();
			cy.findByText(/billing/i).click();
			cy.findByText(/billing/i).should('have.attr', 'aria-selected', 'true');
		});
		it(`
	  first option should be selected by default.
	  Typing bil, should show and select only billing
	  Typing BIL, should show and select only billing
	  Typing ca should show calendar and calculator and select calendar because it comes first
	  Typing CA should show calendar and calculator and select calendar because it comes first
	  Arrow down on billing should select billing
	  Arrow up to calculator should select calculator
	  Arrow up should skip disabled search emoji and select calendar
	  `, () => {
			cy.checkA11y('#storybook-root', {
				rules: {
					'page-has-heading-one': { enabled: false },
					'landmark-one-main': { enabled: false },
				},
			});
			cy.realPress('Tab');
			cy.realPress('Tab');
			cy.findByText(/calendar/i).should('have.attr', 'aria-selected', 'true');
			cy.findByText(/calendar/i).should('be.visible');
			cy.findByText(/billing/i).should('have.attr', 'aria-selected', 'false');
			cy.findByText(/billing/i).should('be.visible');
			cy.get('input').type('bil');
			cy.findByText(/calendar/i).should('have.attr', 'aria-selected', 'false');
			cy.findByText(/calendar/i).should('not.be.visible');
			cy.findByText(/billing/i).should('have.attr', 'aria-selected', 'true');
			cy.findByText(/billing/i).should('be.visible');
			cy.get('input').clear();
			cy.findByText(/calendar/i).should('have.attr', 'aria-selected', 'true');
			cy.findByText(/calendar/i).should('be.visible');
			cy.findByText(/billing/i).should('have.attr', 'aria-selected', 'false');
			cy.findByText(/billing/i).should('be.visible');
			cy.get('input').type('BIL');
			cy.findByText(/calendar/i).should('have.attr', 'aria-selected', 'false');
			cy.findByText(/calendar/i).should('not.be.visible');
			cy.findByText(/billing/i).should('have.attr', 'aria-selected', 'true');
			cy.findByText(/billing/i).should('be.visible');
			cy.get('input').clear();
			cy.findByText(/calendar/i).should('have.attr', 'aria-selected', 'true');
			cy.findByText(/calendar/i).should('be.visible');
			cy.findByText(/billing/i).should('have.attr', 'aria-selected', 'false');
			cy.findByText(/billing/i).should('be.visible');
			cy.findByText(/calculator/i).should('have.attr', 'aria-selected', 'false');
			cy.findByText(/calculator/i).should('be.visible');
			cy.get('input').type('ca');
			cy.findByText(/calendar/i).should('have.attr', 'aria-selected', 'true');
			cy.findByText(/calendar/i).should('be.visible');
			cy.findByText(/billing/i).should('have.attr', 'aria-selected', 'false');
			cy.findByText(/billing/i).should('not.be.visible');
			cy.findByText(/calculator/i).should('have.attr', 'aria-selected', 'false');
			cy.findByText(/calculator/i).should('be.visible');
			cy.get('input').clear();
			cy.findByText(/calendar/i).should('have.attr', 'aria-selected', 'true');
			cy.findByText(/calendar/i).should('be.visible');
			cy.findByText(/billing/i).should('have.attr', 'aria-selected', 'false');
			cy.findByText(/billing/i).should('be.visible');
			cy.findByText(/calculator/i).should('have.attr', 'aria-selected', 'false');
			cy.findByText(/calculator/i).should('be.visible');
			cy.get('input').type('CA');
			cy.findByText(/calendar/i).should('have.attr', 'aria-selected', 'true');
			cy.findByText(/calendar/i).should('be.visible');
			cy.findByText(/billing/i).should('have.attr', 'aria-selected', 'false');
			cy.findByText(/billing/i).should('not.be.visible');
			cy.findByText(/calculator/i).should('have.attr', 'aria-selected', 'false');
			cy.findByText(/calculator/i).should('be.visible');
			cy.get('input').clear();
			cy.realPress('ArrowDown');
			cy.realPress('ArrowDown');
			cy.realPress('ArrowDown');
			cy.findByText(/billing/i).should('have.attr', 'aria-selected', 'true');
			cy.realPress('ArrowUp');
			cy.realPress('ArrowUp');
			cy.findByText(/billing/i).should('have.attr', 'aria-selected', 'false');
			cy.findByText(/calculator/i).should('have.attr', 'aria-selected', 'true');
			cy.realPress('ArrowUp');
			cy.findByText(/search emoji/i).should('have.attr', 'aria-selected', 'false');
			cy.findByText(/calendar/i).should('have.attr', 'aria-selected', 'true');
		});
	});
});
