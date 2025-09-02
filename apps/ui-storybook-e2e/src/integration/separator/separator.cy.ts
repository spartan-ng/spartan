describe('separator', () => {
	beforeEach(() => {
		cy.visit('/iframe.html?id=separator--default');
		cy.injectAxe();

		cy.checkA11y('#storybook-root', {
			rules: {
				'page-has-heading-one': { enabled: false },
				'landmark-one-main': { enabled: false },
			},
		});
	});

	it('should find one horizontal decorator and two vertical decorators, which are display only', () => {
		cy.get('hlm-separator').should('have.length', 3);
		cy.findAllByRole('separator').should('have.length', 1);
		cy.findAllByRole('separator').should('have.attr', 'data-orientation', 'horizontal');
		// not needed since it's the default
		cy.findAllByRole('none').should('not.have.attr', 'aria-orientation', 'horizontal');

		cy.findAllByRole('none').should('have.length', 2);
		cy.findAllByRole('none').should('have.attr', 'data-orientation', 'vertical');
		// horizontals are decorative so no aria functionalty included
		cy.findAllByRole('none').should('not.have.attr', 'aria-orientation', 'vertical');
	});
});
