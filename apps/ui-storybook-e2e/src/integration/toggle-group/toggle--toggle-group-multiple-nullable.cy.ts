describe('toggle-group--toggle-group-multiple-nullable', () => {
	describe('default', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=toggle-group--toggle-group-multiple-nullable');
			cy.injectAxe();
		});

		const verifyToggleGroupSetup = () => {
			cy.checkA11y('#storybook-root', {
				rules: {
					'page-has-heading-one': { enabled: false },
					'landmark-one-main': { enabled: false },
				},
			});
			cy.findByText(/Cities selected/i).contains(/no cities/i);
			cy.findByRole('group').should('exist');
			cy.findByRole('group').children('button').should('have.length', 4);
			cy.findByRole('group')
				.children('button')
				.each((btn) => cy.wrap(btn).should('have.attr', 'aria-pressed', 'false'));
		};

		it(`
    1. should have no city selected by default.
    2. should have toggle-group with role=group and 4 buttons all toggled off.
    3. click on sparta should select sparta.
    4. click on syracuse should keep sparta selected and select syracuse
    5. click on athens should keep sparta, syracuse selected and select athens
    6. click on syracuse should unselect syracuse, but keep sparta and athens selected
    7. click on set-to-syracuse button should unselect all others but syracuse
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
			cy.findByText(/Cities selected/i).contains(/sparta/i);
			// 4.
			cy.findByRole('group')
				.findByText(/syracuse/i)
				.click();
			cy.findByRole('group')
				.findByText(/sparta/i)
				.should('have.attr', 'aria-pressed', 'true')
				.should('have.attr', 'data-state', 'on');
			cy.findByRole('group')
				.findByText(/syracuse/i)
				.should('have.attr', 'aria-pressed', 'true')
				.should('have.attr', 'data-state', 'on');
			cy.findByRole('group')
				.children('button')
				.not(':contains("Sparta")')
				.not(':contains("Syracuse")')
				.each((btn) => cy.wrap(btn).should('have.attr', 'aria-pressed', 'false'));
			cy.findByText(/Cities selected/i).contains(/sparta/i);
			cy.findByText(/Cities selected/i).contains(/syracuse/i);
			// 5.
			cy.findByRole('group')
				.findByText(/athens/i)
				.click();
			cy.findByRole('group')
				.findByText(/sparta/i)
				.should('have.attr', 'aria-pressed', 'true')
				.should('have.attr', 'data-state', 'on');
			cy.findByRole('group')
				.findByText(/syracuse/i)
				.should('have.attr', 'aria-pressed', 'true')
				.should('have.attr', 'data-state', 'on');
			cy.findByRole('group')
				.findByText(/athens/i)
				.should('have.attr', 'aria-pressed', 'true')
				.should('have.attr', 'data-state', 'on');
			cy.findByRole('group')
				.children('button')
				.not(':contains("Sparta")')
				.not(':contains("Syracuse")')
				.not(':contains("Athens")')
				.each((btn) => cy.wrap(btn).should('have.attr', 'aria-pressed', 'false'));
			cy.findByText(/Cities selected/i).contains(/sparta/i);
			cy.findByText(/Cities selected/i).contains(/syracuse/i);
			cy.findByText(/Cities selected/i).contains(/athens/i);
			// 6.
			cy.findByRole('group')
				.findByText(/syracuse/i)
				.click();
			cy.findByRole('group')
				.findByText(/syracuse/i)
				.should('have.attr', 'aria-pressed', 'false')
				.should('have.attr', 'data-state', 'off');
			cy.findByRole('group')
				.findByText(/sparta/i)
				.should('have.attr', 'aria-pressed', 'true')
				.should('have.attr', 'data-state', 'on');
			cy.findByRole('group')
				.findByText(/athens/i)
				.should('have.attr', 'aria-pressed', 'true')
				.should('have.attr', 'data-state', 'on');
			cy.findByRole('group')
				.children('button')
				.not(':contains("Sparta")')
				.not(':contains("Athens")')
				.each((btn) => cy.wrap(btn).should('have.attr', 'aria-pressed', 'false'));
			cy.findByText(/Cities selected/i).contains(/sparta/i);
			cy.findByText(/Cities selected/i).contains(/athens/i);
			// 7.
			cy.findByText(/set to syracuse/i).click();
			cy.findByRole('group')
				.findByText(/syracuse/i)
				.should('have.attr', 'aria-pressed', 'true')
				.should('have.attr', 'data-state', 'on');
			cy.findByRole('group')
				.children('button')
				.not(':contains("Syracuse")')
				.each((btn) => cy.wrap(btn).should('have.attr', 'aria-pressed', 'false'));
			cy.findByText(/Cities selected/i).contains(/syracuse/i);
		});

		it(`
    1. should have no city selected by default.
    2. should have toggle-group with role=group and 4 buttons all toggled off.
    3. tab to and space on sparta should select sparta.
    4. tab to and enter on syracuse should keep sparta selected and select syracuse
    5. tab to and space on athens should keep sparta, syracuse selected and select athens
    6. tab to and enter on syracuse should unselect syracuse, but keep sparta and athens selected
    7. tab to and space on set-to-syracuse button should unselect all others but syracuse
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
			cy.findByText(/Cities selected/i).contains(/sparta/i);
			// 4.
			cy.realPress('Tab');
			cy.realPress('Tab');
			cy.realPress('Tab');
			cy.realPress('Enter');
			cy.findByRole('group')
				.findByText(/sparta/i)
				.should('have.attr', 'aria-pressed', 'true')
				.should('have.attr', 'data-state', 'on');
			cy.findByRole('group')
				.findByText(/syracuse/i)
				.should('have.attr', 'aria-pressed', 'true')
				.should('have.attr', 'data-state', 'on');
			cy.findByRole('group')
				.children('button')
				.not(':contains("Sparta")')
				.not(':contains("Syracuse")')
				.each((btn) => cy.wrap(btn).should('have.attr', 'aria-pressed', 'false'));
			cy.findByText(/Cities selected/i).contains(/sparta/i);
			cy.findByText(/Cities selected/i).contains(/syracuse/i);
			// 5.
			cy.realPress(['Shift', 'Tab']);
			cy.realPress(['Shift', 'Tab']);
			cy.realPress('Space');
			cy.findByRole('group')
				.findByText(/sparta/i)
				.should('have.attr', 'aria-pressed', 'true')
				.should('have.attr', 'data-state', 'on');
			cy.findByRole('group')
				.findByText(/syracuse/i)
				.should('have.attr', 'aria-pressed', 'true')
				.should('have.attr', 'data-state', 'on');
			cy.findByRole('group')
				.findByText(/athens/i)
				.should('have.attr', 'aria-pressed', 'true')
				.should('have.attr', 'data-state', 'on');
			cy.findByRole('group')
				.children('button')
				.not(':contains("Sparta")')
				.not(':contains("Syracuse")')
				.not(':contains("Athens")')
				.each((btn) => cy.wrap(btn).should('have.attr', 'aria-pressed', 'false'));
			cy.findByText(/Cities selected/i).contains(/sparta/i);
			cy.findByText(/Cities selected/i).contains(/syracuse/i);
			cy.findByText(/Cities selected/i).contains(/athens/i);
			// 6.
			cy.realPress('Tab');
			cy.realPress('Tab');
			cy.realPress('Enter');
			cy.findByRole('group')
				.findByText(/syracuse/i)
				.should('have.attr', 'aria-pressed', 'false')
				.should('have.attr', 'data-state', 'off');
			cy.findByRole('group')
				.findByText(/sparta/i)
				.should('have.attr', 'aria-pressed', 'true')
				.should('have.attr', 'data-state', 'on');
			cy.findByRole('group')
				.findByText(/athens/i)
				.should('have.attr', 'aria-pressed', 'true')
				.should('have.attr', 'data-state', 'on');
			cy.findByRole('group')
				.children('button')
				.not(':contains("Sparta")')
				.not(':contains("Athens")')
				.each((btn) => cy.wrap(btn).should('have.attr', 'aria-pressed', 'false'));
			cy.findByText(/Cities selected/i).contains(/sparta/i);
			cy.findByText(/Cities selected/i).contains(/athens/i);
			// 7.
			cy.realPress('Tab');
			cy.realPress('Space');
			cy.findByRole('group')
				.findByText(/syracuse/i)
				.should('have.attr', 'aria-pressed', 'true')
				.should('have.attr', 'data-state', 'on');
			cy.findByRole('group')
				.children('button')
				.not(':contains("Syracuse")')
				.each((btn) => cy.wrap(btn).should('have.attr', 'aria-pressed', 'false'));
			cy.findByText(/Cities selected/i).contains(/syracuse/i);
		});
	});
});
