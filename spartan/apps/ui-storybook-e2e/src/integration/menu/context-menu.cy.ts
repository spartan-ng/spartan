describe('context-menu', () => {
	// we are using the angular cdk so we are just doing some sanity testing that all directives
	// were ported over correctly
	describe('default', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=context-menu--default');
			cy.injectAxe();
			cy.viewport(1000, 1000);
		});

		it('right click on area should open, hover over sub menu should open submenu, and click on open button again should close', () => {
			cy.checkA11y('#storybook-root', {
				rules: {
					'page-has-heading-one': { enabled: false },
					'landmark-one-main': { enabled: false },
				},
			});

			cy.findByText(/right click here/i).realClick({ button: 'right' });
			cy.findAllByRole('menu').should('have.length', 1);
			cy.findByText(/more tools/i).realHover();
			cy.findAllByRole('menu').should('have.length', 2);
			cy.findByText(/more/i).realHover();
			cy.findByText(/save page as/i).realClick();
		});
	});
});
