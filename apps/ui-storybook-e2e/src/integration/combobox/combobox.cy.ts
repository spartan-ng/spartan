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
			cy.findByText('Angular').should('be.visible');
			cy.findByText('Angular').realClick();
			cy.findByText('Angular').should('not.exist');
		});

		it('should open the framework dropdown, type "Vue", and ensure "Angular" is hidden', () => {
			cy.findByText(/Angular/i).should('not.exist');
			cy.findByText(/Select framework.../i)
				.should('be.visible')
				.realClick();
			cy.findByRole('combobox').type('Vue');
			cy.findByText('Angular').should('not.be.visible');
		});

		it('should open the framework dropdown, and a scrollbar should be shown', () => {
			cy.findByText(/Angular/i).should('not.exist');
			cy.findByText(/Select framework.../i)
				.should('be.visible')
				.realClick();
			cy.get('[role="listbox"]').should(($el) => {
				expect($el[0].scrollHeight).to.be.greaterThan($el[0].clientHeight);
			});
		});
	});
});
