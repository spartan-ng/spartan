describe('command', () => {
	describe('dynamic with ngModel', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=command--dynamic-options');
			cy.injectAxe();
		});
		it(`should show items based on input value without error.`, () => {
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

	describe('dynamic with reactive form', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=command--reactive-form');
			cy.injectAxe();
		});
		it(`should show items based on input value without error.`, () => {
			cy.checkA11y('#storybook-root', {
				rules: {
					'page-has-heading-one': { enabled: false },
					'landmark-one-main': { enabled: false },
				},
			});

			/**       TEST initially it should only show Profile and Search Emoji    */
			cy.get('button[hlm-command-item]:not([data-hidden])').should('have.length', 2);

			cy.findByText('Profile').should('have.length', 1);
			cy.findByText('Search Emoji').should('have.length', 1);
		});
	});

	describe('dynamic with direct value binding', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=command--bound-value');
			cy.injectAxe();
		});
		it(`should show items based on input value without error.`, () => {
			cy.checkA11y('#storybook-root', {
				rules: {
					'page-has-heading-one': { enabled: false },
					'landmark-one-main': { enabled: false },
				},
			});

			/**       TEST initially it should only show Search and Settings   */
			cy.get('button[hlm-command-item]:not([data-hidden])').should('have.length', 2);
			cy.findByText('Search Emoji').should('have.length', 1);
			cy.findByText('Settings').should('have.length', 1);
		});
	});
});
