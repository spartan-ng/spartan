describe('popover--default', () => {
	describe('default', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=popover--default');
			cy.injectAxe();
		});

		it('click on trigger should open, click on close should close, click outside should close', () => {
			cy.checkA11y('#storybook-root', {
				rules: {
					'page-has-heading-one': { enabled: false },
					'landmark-one-main': { enabled: false },
				},
			});

			cy.findByText(/open popover/i).should('have.attr', 'aria-haspopup', 'dialog');
			cy.findByText(/open popover/i).click();

			cy.findAllByText(/Dimensions/).should('have.length', 1);
			cy.findByRole('dialog');
			cy.findByRole('dialog').should('not.have.attr', 'aria-labelledby');
			cy.findByRole('dialog').should('have.attr', 'aria-modal', 'true');
			cy.findByRole('dialog').should('have.attr', 'tabindex', '-1');

			// click outside of dialog
			cy.get('#storybook-root').click({ force: true });
			cy.findAllByText(/open popover/i).should('have.length', 1);
			cy.findAllByText(/open popover/i).should('have.focus');
		});

		it('tab and enter on trigger should open, enter on close should close, escape should close', () => {
			cy.checkA11y('#storybook-root', {
				rules: {
					'page-has-heading-one': { enabled: false },
					'landmark-one-main': { enabled: false },
				},
			});

			cy.findByText(/open popover/i).should('have.attr', 'aria-haspopup', 'dialog');
			cy.realPress('Tab');
			cy.realPress('Enter');

			cy.findAllByText(/Dimensions/).should('have.length', 1);
			cy.findByRole('dialog');
			cy.findByRole('dialog').should('not.have.attr', 'aria-labelledby');
			cy.findByRole('dialog').should('have.attr', 'aria-modal', 'true');
			cy.findByRole('dialog').should('have.attr', 'tabindex', '-1');

			cy.realPress(['Shift', 'Tab']);
			cy.realPress('Escape');
			cy.findAllByText(/open popover/i).should('have.length', 1);
			cy.findAllByText(/open popover/i).should('have.focus');
			cy.realPress('Enter');
		});

		it('tab and space on trigger should open, tabs should wrap, space on close should close', () => {
			cy.checkA11y('#storybook-root', {
				rules: {
					'page-has-heading-one': { enabled: false },
					'landmark-one-main': { enabled: false },
				},
			});

			cy.findByText(/open popover/i).should('have.attr', 'aria-haspopup', 'dialog');
			cy.realPress('Tab');
			cy.realPress('Space');

			cy.findAllByText(/Dimensions/).should('have.length', 1);
			cy.findByRole('dialog');
			cy.findByRole('dialog').should('not.have.attr', 'aria-labelledby');
			cy.findByRole('dialog').should('have.attr', 'aria-modal', 'true');
			cy.findByRole('dialog').should('have.attr', 'tabindex', '-1');

			cy.realPress('Tab');
			cy.realPress('Tab');
			cy.realPress('Tab');
			cy.realPress('Escape');
			cy.findAllByText(/open popover/i).should('have.length', 1);
			cy.findAllByText(/open popover/i).should('have.focus');
			cy.realPress('Space');

			// click escape when dialog open
			cy.realPress('Escape');
			cy.findAllByText(/open popover/i).should('have.length', 1);
			cy.findAllByText(/open popover/i).should('have.focus');
		});
	});
});
