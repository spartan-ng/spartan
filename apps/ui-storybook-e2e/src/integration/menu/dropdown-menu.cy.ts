describe('dropdown-menu', () => {
	// We are using the Angular CDK, so we are just doing some sanity testing
	// that all directives were ported over correctly
	describe('default', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=dropdown-menu--default');
			cy.injectAxe();
			cy.viewport(1000, 1000);
		});

		// prettier-ignore
		it(`click on open button should open, menu item GitHub that has [disabled]="false" should not be disabled. ` +
			'Support that has [disabled]="true" should be disabled', () => {
			cy.checkA11y('#storybook-root', {
				rules: {
					'page-has-heading-one': {enabled: false},
					'landmark-one-main': {enabled: false},
				},
			});

			cy.findByText(/open/i).realClick();

			cy.findByText(/github/i)
				.parent()
				.should('not.be.disabled');

			cy.findByText(/support/i)
				.parent()
				.should('be.disabled');
		});

		it('click on open button should open, hover over sub menu should open submenu, and click on open button again should close', () => {
			cy.checkA11y('#storybook-root', {
				rules: {
					'page-has-heading-one': { enabled: false },
					'landmark-one-main': { enabled: false },
				},
			});

			cy.findByText(/open/i)
				.should('have.attr', 'aria-expanded', 'false')
				.realClick()
				.should('have.attr', 'aria-expanded', 'true');

			cy.findByRole('menu');

			cy.findByText(/invite users/i).realHover();

			cy.findAllByRole('menu').should('have.length', 2);

			cy.findByText(/more/i).realHover();

			cy.findByText(/open/i).realClick().should('have.attr', 'aria-expanded', 'false');
		});

		it('down on open button should open, up and down should navigate, right over sub menu should open submenu, and left on sub should close it, and escape open should close dropdown completely', () => {
			cy.checkA11y('#storybook-root', {
				rules: {
					'page-has-heading-one': { enabled: false },
					'landmark-one-main': { enabled: false },
				},
			});

			cy.findByText(/open/i).should('have.attr', 'aria-expanded', 'false');

			cy.realPress('Tab');

			cy.findByText(/open/i).should('have.focus').realPress('ArrowDown');

			cy.findByText(/open/i).should('have.attr', 'aria-expanded', 'true');

			cy.findByRole('menu');

			// Navigate down multiple times
			for (let i = 0; i < 5; i++) {
				cy.realPress('ArrowDown');
			}

			cy.realPress('ArrowRight');
			cy.findAllByRole('menu').should('have.length', 2);

			cy.realPress('ArrowDown');
			cy.realPress('ArrowLeft');
			cy.realPress('Escape');

			cy.findByText(/open/i).should('have.focus').should('have.attr', 'aria-expanded', 'false');
		});
	});
});
