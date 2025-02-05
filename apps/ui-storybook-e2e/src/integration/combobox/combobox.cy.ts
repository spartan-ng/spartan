describe('combobox--default', () => {
	describe('default', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=combobox--default');
			cy.injectAxe();
		});

		it('click on combobox should open, click on Angular option should closed', () => {
			cy.checkA11y('#storybook-root', {
				rules: {
					'page-has-heading-one': { enabled: false },
					'landmark-one-main': { enabled: false },
				},
			});

			cy.findByText(/Angular/i).should('not.exist');
			cy.findByText(/Select framework.../i)
				.should('be.visible')
				.realClick();
			cy.findByText(/Angular/i).should('be.visible');
			cy.findByText(/Angular/i).realClick();
			cy.findByText(/Angular/i).should('not.exist');
		});
	});
});
