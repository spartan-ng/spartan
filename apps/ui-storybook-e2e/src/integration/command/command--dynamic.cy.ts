describe('command', () => {
	describe('dynamic', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=command--dynamic-options');
			cy.injectAxe();
		});
		it(`
	  should render items without error.
	  `, () => {
			cy.checkA11y('#storybook-root', {
				rules: {
					'page-has-heading-one': { enabled: false },
					'landmark-one-main': { enabled: false },
				},
			});

			cy.findByTestId('toggleButton').click();
			cy.findByText('Profile').should('have.length', 1);
			cy.findByText('Billing').should('have.length', 1);
			cy.findByText('Settings').should('have.length', 1);
		});
	});
});
