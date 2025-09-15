describe('sheet--default', () => {
	describe('default', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=sheet--default');
			cy.injectAxe();
		});

		it('click on trigger should open, click on close should close, click outside should close', () => {
			cy.checkA11y('#storybook-root', {
				rules: {
					'page-has-heading-one': { enabled: false },
					'landmark-one-main': { enabled: false },
				},
			});

			cy.findByText(/edit profile/i).should('have.attr', 'aria-haspopup', 'dialog');
			cy.findByText(/edit profile/i).click();

			cy.findAllByText(/edit profile/i).should('have.length', 2);
			cy.findByRole('dialog');
			cy.findByRole('dialog').should('have.attr', 'aria-labelledby', 'brn-dialog-title-1');
			cy.findByRole('dialog').should('have.attr', 'aria-labelledby', 'brn-dialog-title-1');
			cy.findByRole('dialog').should('have.attr', 'aria-modal', 'true');
			cy.findByRole('dialog').should('have.attr', 'tabindex', '-1');

			cy.findByRole('dialog').get('ng-icon').click();
			cy.findAllByText(/edit profile/i).should('have.length', 1);
			cy.findAllByText(/edit profile/i).should('have.focus');
			cy.findByText(/edit profile/i).click();

			// click outside of dialog
			cy.get('.cdk-overlay-backdrop').click({ force: true });
			cy.findAllByText(/edit profile/i).should('have.length', 1);
			cy.findAllByText(/edit profile/i).should('have.focus');
		});

		it('tab and enter on trigger should open, enter on close should close, escape should close', () => {
			cy.checkA11y('#storybook-root', {
				rules: {
					'page-has-heading-one': { enabled: false },
					'landmark-one-main': { enabled: false },
				},
			});

			cy.findByText(/edit profile/i).should('have.attr', 'aria-haspopup', 'dialog');
			cy.realPress('Tab');
			cy.realPress('Enter');

			cy.findAllByText(/edit profile/i).should('have.length', 2);
			cy.findByRole('dialog');
			cy.findByRole('dialog').should('have.attr', 'aria-labelledby', 'brn-dialog-title-1');
			cy.findByRole('dialog').should('have.attr', 'aria-labelledby', 'brn-dialog-title-1');
			cy.findByRole('dialog').should('have.attr', 'aria-modal', 'true');
			cy.findByRole('dialog').should('have.attr', 'tabindex', '-1');

			cy.realPress(['Shift', 'Tab']);
			cy.realPress('Enter');
			cy.findAllByText(/edit profile/i).should('have.length', 1);
			cy.findAllByText(/edit profile/i).should('have.focus');
			cy.realPress('Enter');

			// click escape when dialog open
			cy.realPress('Escape');
			cy.findAllByText(/edit profile/i).should('have.length', 1);
			cy.findAllByText(/edit profile/i).should('have.focus');
		});

		it('tab and space on trigger should open, tabs should wrap, space on close should close', () => {
			cy.checkA11y('#storybook-root', {
				rules: {
					'page-has-heading-one': { enabled: false },
					'landmark-one-main': { enabled: false },
				},
			});

			cy.findByText(/edit profile/i).should('have.attr', 'aria-haspopup', 'dialog');
			cy.realPress('Tab');
			cy.realPress('Space');

			cy.findAllByText(/edit profile/i).should('have.length', 2);
			cy.findByRole('dialog');
			cy.findByRole('dialog').should('have.attr', 'aria-labelledby', 'brn-dialog-title-1');
			cy.findByRole('dialog').should('have.attr', 'aria-labelledby', 'brn-dialog-title-1');
			cy.findByRole('dialog').should('have.attr', 'aria-modal', 'true');
			cy.findByRole('dialog').should('have.attr', 'tabindex', '-1');

			cy.realPress('Tab');
			cy.realPress('Tab');
			cy.realPress('Tab');
			cy.realPress('Space');
			cy.findAllByText(/edit profile/i).should('have.length', 1);
			cy.findAllByText(/edit profile/i).should('have.focus');
			cy.realPress('Space');

			// click escape when dialog open
			cy.realPress('Escape');
			cy.findAllByText(/edit profile/i).should('have.length', 1);
			cy.findAllByText(/edit profile/i).should('have.focus');
		});
	});
});
