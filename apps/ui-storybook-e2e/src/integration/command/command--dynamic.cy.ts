describe('command', () => {
	describe('dynamic', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=command--dynamic-options');
			cy.injectAxe();
		});
		it(`should render items without error.`, () => {
			cy.checkA11y('#storybook-root', {
				rules: {
					'page-has-heading-one': { enabled: false },
					'landmark-one-main': { enabled: false },
				},
			});

			/**       TEST initially it should only show Profiles   */
			cy.get('button[hlm-command-item]:not([data-hidden])').should('have.length', 1);

			/**       TEST after deleting search input it should show all items    */
			cy.findByText('Profile').should('have.length', 1);
			cy.get('input').type('{backspace}');
			cy.get('button[hlm-command-item]:not([data-hidden])').should('have.length', 4);
			cy.get('button[hlm-command-item][data-selected]').should('include.text', 'Profile');

			/**       TEST Focusing first if selected item is not visible          */
			cy.get('input').type('s');
			cy.get('button[hlm-command-item][data-selected]').should('include.text', 'Search Emoji');
			cy.get('input').type('e');
			cy.get('input').type('t');
			cy.get('button[hlm-command-item][data-selected]').should('have.length', 1);
			cy.get('button[hlm-command-item][data-selected]').should('include.text', 'Settings');
		});
	});
});
