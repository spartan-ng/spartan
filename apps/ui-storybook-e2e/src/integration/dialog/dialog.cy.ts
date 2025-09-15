describe('dialog--default', () => {
	describe('default', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=dialog--default');
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
			cy.findByText(/edit profile/i).should('have.attr', 'aria-expanded', 'false');
			cy.findByText(/edit profile/i).click();

			cy.findAllByText(/edit profile/i).should('have.length', 2);
			cy.findAllByText(/edit profile/i)
				.first()
				.should('have.attr', 'aria-expanded', 'true');
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

	describe('nested dialog', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=dialog--nested-dialog');
			cy.injectAxe();
		});

		it('click on trigger should open the first dialog, click on button inside first dialog should open a nested dialog, click on button inside nested dialog closes nested dialog', () => {
			cy.findByText(/open dialog/i).should('have.attr', 'aria-haspopup', 'dialog');
			cy.findByText(/open dialog/i).click();

			cy.get('#brn-dialog-1');
			cy.get('#brn-dialog-1').should('have.attr', 'aria-labelledby', 'brn-dialog-title-1');
			cy.get('#brn-dialog-1').should('have.attr', 'aria-labelledby', 'brn-dialog-title-1');
			cy.get('#brn-dialog-1').should('have.attr', 'aria-modal', 'true');
			cy.get('#brn-dialog-1').should('have.attr', 'tabindex', '-1');

			cy.findByText(/first dialog/i);
			cy.findByText(/open nested dialog/i).should('have.attr', 'aria-haspopup', 'dialog');
			cy.findByText(/open nested dialog/i).click();

			cy.get('#brn-dialog-2');
			cy.get('#brn-dialog-2').should('have.attr', 'aria-labelledby', 'brn-dialog-title-2');
			cy.get('#brn-dialog-2').should('have.attr', 'aria-labelledby', 'brn-dialog-title-2');
			cy.get('#brn-dialog-2').should('have.attr', 'aria-modal', 'true');
			cy.get('#brn-dialog-2').should('have.attr', 'tabindex', '-1');

			cy.get('#brn-dialog-2')
				.findByText(/close nested dialog/i)
				.click();

			// eslint-disable-next-line cypress/no-unnecessary-waiting
			cy.wait(100);

			cy.get('.cdk-overlay-backdrop').click({ force: true });

			cy.findAllByText(/open dialog/i).should('have.length', 1);
			cy.findAllByText(/open dialog/i).should('have.focus');
		});
	});
});

describe('dialog--dynamic-component', () => {
	describe('dynamic-component', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=dialog--dynamic-component');
			cy.injectAxe();
		});

		it('click on button should open dyanmic component, click on close should close, click outside should close', () => {
			cy.findAllByText(/select user/i).click();
			cy.findByRole('dialog');
			cy.findByRole('dialog').should('have.attr', 'aria-labelledby', 'brn-dialog-title-1');
			cy.findByRole('dialog').should('have.attr', 'aria-labelledby', 'brn-dialog-title-1');
			cy.findByRole('dialog').should('have.attr', 'aria-modal', 'true');
			cy.findByRole('dialog').should('have.attr', 'tabindex', '-1');
			cy.get('dynamic-content');

			// close on click close button
			cy.findByRole('dialog').get('ng-icon').click();
			cy.findAllByText(/select user/i).should('have.length', 1);
			cy.findAllByText(/select user/i).should('have.focus');
			cy.findByText(/select user/i).click();

			// close on click backdrop
			cy.get('dynamic-content');
			cy.get('.cdk-overlay-backdrop').click({ force: true });
			cy.findAllByText(/select user/i).should('have.length', 1);
			cy.findAllByText(/select user/i).should('have.focus');
		});
	});

	describe('nested dialog', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=dialog--nested-dynamic-component');
			cy.injectAxe();
		});

		it('click on trigger should open the first dialog, click on button inside first dialog should open a nested dialog, click on button inside nested dialog closes nested dialog', () => {
			cy.findByText(/open dialog/i).click();

			cy.get('#brn-dialog-1');
			cy.get('#brn-dialog-1').should('have.attr', 'aria-labelledby', 'brn-dialog-title-1');
			cy.get('#brn-dialog-1').should('have.attr', 'aria-labelledby', 'brn-dialog-title-1');
			cy.get('#brn-dialog-1').should('have.attr', 'aria-modal', 'true');
			cy.get('#brn-dialog-1').should('have.attr', 'tabindex', '-1');

			cy.findByText(/first dialog/i);
			cy.findByText(/open nested dialog/i).click();

			cy.get('#brn-dialog-2');
			cy.get('#brn-dialog-2').should('have.attr', 'aria-labelledby', 'brn-dialog-title-2');
			cy.get('#brn-dialog-2').should('have.attr', 'aria-labelledby', 'brn-dialog-title-2');
			cy.get('#brn-dialog-2').should('have.attr', 'aria-modal', 'true');
			cy.get('#brn-dialog-2').should('have.attr', 'tabindex', '-1');

			cy.get('#brn-dialog-2')
				.findByText(/close nested dialog/i)
				.click();

			// eslint-disable-next-line cypress/no-unnecessary-waiting
			cy.wait(100);

			cy.get('.cdk-overlay-backdrop').click({ force: true });

			cy.findAllByText(/open dialog/i).should('have.length', 1);
			cy.findAllByText(/open dialog/i).should('have.focus');
		});
	});
});
