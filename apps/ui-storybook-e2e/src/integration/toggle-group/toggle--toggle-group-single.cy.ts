describe('toggle-group--toggle-group-single', () => {
	describe('default', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=toggle-group--toggle-group-single');
			cy.injectAxe();
		});

		const verifyToggleGroupSetup = () => {
			cy.checkA11y('#storybook-root', {
				rules: {
					'page-has-heading-one': { enabled: false },
					'landmark-one-main': { enabled: false },
				},
			});
			cy.findByText(/City selected/i).contains(/sparta/i);
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
    5. click on athens should unselect syracuse and select athens
    6. click on set-to-syracuse button should unselect athens and select syracuse
    7. click on syracuse should not unselect syracuse
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
			cy.findByText(/City selected/i).contains(/sparta/i);
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
			cy.findByText(/City selected/i).contains(/syracuse/i);
			// 5.
			cy.findByRole('group')
				.findByText(/athens/i)
				.click();
			cy.findByRole('group')
				.findByText(/athens/i)
				.should('have.attr', 'aria-pressed', 'true')
				.should('have.attr', 'data-state', 'on');
			cy.findByRole('group')
				.children('button')
				.not(':contains("Athens")')
				.each((btn) => cy.wrap(btn).should('have.attr', 'aria-pressed', 'false'));
			cy.findByText(/City selected/i).contains(/athens/i);
			// 6.
			cy.findByText(/set to syracuse/i).click();
			cy.findByRole('group')
				.findByText(/syracuse/i)
				.should('have.attr', 'aria-pressed', 'true')
				.should('have.attr', 'data-state', 'on');
			cy.findByRole('group')
				.children('button')
				.not(':contains("Syracuse")')
				.each((btn) => cy.wrap(btn).should('have.attr', 'aria-pressed', 'false'));
			cy.findByText(/City selected/i).contains(/syracuse/i);
			// 7.
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
			cy.findByText(/City selected/i).contains(/syracuse/i);
		});

		it(`
    1. should sparta selected by default.
    2. should have toggle-group with role=group and 3 buttons toggled off and sparta toggled on.
    3. tab to and space on sparta should not unselect sparta.
    4. tab to and enter on syracuse should unselect sparta and select syracuse
    5. tab to and space on athens should unselect syracuse and select athens
    6. tab to and enter on set-to-syracuse button should unselect athens and select syracuse
    7. tab to and space on syracuse should not unselect syracuse
    `, () => {
			// 1. + 2.
			verifyToggleGroupSetup();
			//3.
			cy.realPress('Tab');
			cy.realPress('Space');
			cy.findByRole('group')
				.findByText(/sparta/i)
				.should('have.attr', 'aria-pressed', 'true')
				.should('have.attr', 'data-state', 'on');
			cy.findByRole('group')
				.children('button')
				.not(':contains("Sparta")')
				.each((btn) => cy.wrap(btn).should('have.attr', 'aria-pressed', 'false'));
			cy.findByText(/City selected/i).contains(/sparta/i);
			// 4.
			cy.realPress('Tab');
			cy.realPress('Tab');
			cy.realPress('Tab');
			cy.realPress('Enter');
			cy.findByRole('group')
				.findByText(/syracuse/i)
				.should('have.attr', 'aria-pressed', 'true')
				.should('have.attr', 'data-state', 'on');
			cy.findByRole('group')
				.children('button')
				.not(':contains("Syracuse")')
				.each((btn) => cy.wrap(btn).should('have.attr', 'aria-pressed', 'false'));
			cy.findByText(/City selected/i).contains(/syracuse/i);
			// 5.
			cy.realPress(['Shift', 'Tab']);
			cy.realPress(['Shift', 'Tab']);
			cy.realPress('Enter');
			cy.findByRole('group')
				.findByText(/athens/i)
				.should('have.attr', 'aria-pressed', 'true')
				.should('have.attr', 'data-state', 'on');
			cy.findByRole('group')
				.children('button')
				.not(':contains("Athens")')
				.each((btn) => cy.wrap(btn).should('have.attr', 'aria-pressed', 'false'));
			cy.findByText(/City selected/i).contains(/athens/i);
			// 6.
			cy.realPress('Tab');
			cy.realPress('Tab');
			cy.realPress('Tab');
			cy.realPress('Enter');
			cy.findByRole('group')
				.findByText(/syracuse/i)
				.should('have.attr', 'aria-pressed', 'true')
				.should('have.attr', 'data-state', 'on');
			cy.findByRole('group')
				.children('button')
				.not(':contains("Syracuse")')
				.each((btn) => cy.wrap(btn).should('have.attr', 'aria-pressed', 'false'));
			cy.findByText(/City selected/i).contains(/syracuse/i);
			// 7.
			cy.realPress(['Shift', 'Tab']);
			cy.realPress('Enter');
			cy.findByRole('group')
				.findByText(/syracuse/i)
				.should('have.attr', 'aria-pressed', 'true')
				.should('have.attr', 'data-state', 'on');
			cy.findByRole('group')
				.children('button')
				.not(':contains("Syracuse")')
				.each((btn) => cy.wrap(btn).should('have.attr', 'aria-pressed', 'false'));
			cy.findByText(/City selected/i).contains(/syracuse/i);
		});
	});
});
