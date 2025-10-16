describe('menubar', () => {
	describe('default', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=menubar--default');
			cy.injectAxe();
			cy.viewport(1000, 1000);
		});

		it('click on file should open menu and hovering around should open/close appropriate menus', () => {
			cy.checkA11y('#storybook-root', {
				rules: {
					'page-has-heading-one': { enabled: false },
					'landmark-one-main': { enabled: false },
				},
			});
			cy.findByText('File').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('Edit').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('View').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('Profiles').should('have.attr', 'aria-expanded', 'false');

			cy.findByText('File').realClick();
			cy.findByText('File').should('have.attr', 'aria-expanded', 'true');
			cy.findByText('Edit').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('View').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('Profiles').should('have.attr', 'aria-expanded', 'false');

			cy.findByText('Edit').realHover();
			cy.findByText('File').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('Edit').should('have.attr', 'aria-expanded', 'true');
			cy.findByText('View').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('Profiles').should('have.attr', 'aria-expanded', 'false');

			cy.findByText('Share').realHover();
			cy.findByText('File').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('Edit').should('have.attr', 'aria-expanded', 'true');
			cy.findByText('View').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('Profiles').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('Share').should('have.attr', 'aria-expanded', 'true');

			cy.findByText('View').realHover();
			cy.findByText('File').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('Edit').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('View').should('have.attr', 'aria-expanded', 'true');
			cy.findByText('Profiles').should('have.attr', 'aria-expanded', 'false');

			cy.findByText('Profiles').realHover();
			cy.findByText('File').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('Edit').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('View').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('Profiles').should('have.attr', 'aria-expanded', 'true');

			cy.findByText('File').realClick();
			cy.findByText('File').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('Edit').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('View').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('Profiles').should('have.attr', 'aria-expanded', 'false');
		});

		it('arrowdown on file should open menu and arrow left/right around should open/close appropriate menus', () => {
			cy.checkA11y('#storybook-root', {
				rules: {
					'page-has-heading-one': { enabled: false },
					'landmark-one-main': { enabled: false },
				},
			});
			cy.findByText('File').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('Edit').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('View').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('Profiles').should('have.attr', 'aria-expanded', 'false');

			cy.realPress('Tab');
			cy.realPress('ArrowDown');
			cy.findByText('File').should('have.attr', 'aria-expanded', 'true');
			cy.findByText('Edit').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('View').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('Profiles').should('have.attr', 'aria-expanded', 'false');

			cy.realPress('ArrowRight');
			cy.findByText('File').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('Edit').should('have.attr', 'aria-expanded', 'true');
			cy.findByText('View').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('Profiles').should('have.attr', 'aria-expanded', 'false');
			//
			cy.realPress('ArrowDown');
			cy.realPress('ArrowDown');
			cy.realPress('ArrowDown');
			cy.realPress('ArrowRight');
			cy.findByText('File').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('Edit').should('have.attr', 'aria-expanded', 'true');
			cy.findByText('View').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('Profiles').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('Share').should('have.attr', 'aria-expanded', 'true');

			cy.realPress('ArrowLeft');
			cy.realPress('ArrowUp');
			cy.realPress('ArrowUp');
			cy.realPress('ArrowUp');
			cy.realPress('ArrowUp');
			cy.realPress('ArrowRight');
			cy.findByText('File').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('Edit').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('View').should('have.attr', 'aria-expanded', 'true');
			cy.findByText('Profiles').should('have.attr', 'aria-expanded', 'false');

			cy.realPress('ArrowRight');
			cy.findByText('File').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('Edit').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('View').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('Profiles').should('have.attr', 'aria-expanded', 'true');

			cy.realPress('Escape');
			cy.findByText('File').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('Edit').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('View').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('Profiles').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('Profiles').should('be.focused');

			cy.realPress('ArrowRight');
			cy.findByText('File').should('be.focused');
		});
	});
});
