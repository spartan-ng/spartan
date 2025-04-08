describe('toggle-group--toggle-group-single', () => {
	describe('default', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=toggle-group--toggle-group-form');
			cy.injectAxe();
		});

		const verifyToggleGroupSetup = () => {
			cy.checkA11y('#storybook-root', {
				rules: {
					'page-has-heading-one': { enabled: false },
					'landmark-one-main': { enabled: false },
				},
			});
			cy.findByTestId(/selectedCity/i).contains(/sparta/i);
			cy.findByRole('group').should('exist');
			cy.findByRole('group').children('button').should('have.length', 4);
			cy.findByRole('group')
				.children('button')
				.not(':contains("Sparta")')
				.each((btn) => cy.wrap(btn).should('have.attr', 'aria-pressed', 'false'));
			cy.findByRole('group')
				.findByText(/sparta/i)
				.should('have.attr', 'aria-pressed', 'true')
				.should('have.attr', 'data-state', 'on');
		};

		it(`
    1. should sparta selected by default.
    2. should have toggle-group with role=group and 3 buttons toggled off and sparta toggled on.
    3. click on sparta should not unselect sparta.
    4. click on syracuse should unselect sparta and select syracuse
    `, () => {
			// 1. + 2.
			verifyToggleGroupSetup();
			//3.
			cy.findByRole('group')
				.findByText(/sparta/i)
				.click();
			cy.findByRole('group')
				.findByText(/sparta/i)
				.should('have.attr', 'aria-pressed', 'true')
				.should('have.attr', 'data-state', 'on');
			cy.findByRole('group')
				.children('button')
				.not(':contains("Sparta")')
				.each((btn) => cy.wrap(btn).should('have.attr', 'aria-pressed', 'false'));
			cy.findByTestId(/selectedCity/i).contains(/sparta/i);
			// 4.
			cy.findByRole('group')
				.findByText(/syracuse/i)
				.click();
			cy.findByRole('group')
				.findByText(/syracuse/i)
				.should('have.attr', 'aria-pressed', 'true')
				.should('have.attr', 'data-state', 'on');
			cy.findByRole('group')
				.children('button')
				.not(':contains("Syracuse")')
				.each((btn) => cy.wrap(btn).should('have.attr', 'aria-pressed', 'false'));
			cy.findByTestId(/selectedCity/i).contains(/syracuse/i);
		});
	});
});
