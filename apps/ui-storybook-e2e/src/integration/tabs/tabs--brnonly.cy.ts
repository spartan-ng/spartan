describe('tabs--brnonly', () => {
	const verifyTabsSetup = () => {
		cy.findByRole('tablist').should('exist');
		cy.findByRole('tablist').should('have.attr', 'aria-label');
		cy.findByRole('tablist').should('have.attr', 'data-orientation', 'horizontal');
		cy.findByRole('tablist').should('have.attr', 'aria-orientation', 'horizontal');
		cy.findAllByRole('tab').should('have.length', 2);
		cy.findByRole('tab', { name: /account/i }).should('have.attr', 'aria-controls', 'brn-tabs-content-account');
		cy.findByRole('tab', { name: /password/i }).should('have.attr', 'aria-controls', 'brn-tabs-content-password');
		cy.findByRole('tabpanel').should('exist');
	};

	describe('default', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=tabs--brn-only');
			cy.injectAxe();
		});

		it('click interactions should render with first tab selected and change to second tab when second tab is clicked', () => {
			verifyTabsSetup();

			cy.findByRole('tab', { name: /password/i }).click();

			cy.findByRole('tabpanel').should('have.attr', 'aria-labelledby', 'brn-tabs-label-password');
			cy.findByRole('tabpanel').should('have.attr', 'tabindex', '0');
			cy.findByRole('tab', { name: /password/i }).should('have.attr', 'aria-selected', 'true');
			cy.findByRole('tab', { name: /account/i }).should('have.attr', 'aria-selected', 'false');
			cy.get('#brn-tabs-content-password').should('exist');

			cy.findByRole('tab', { name: /account/i }).click();

			cy.findByRole('tabpanel').should('have.attr', 'aria-labelledby', 'brn-tabs-label-account');
			cy.findByRole('tabpanel').should('have.attr', 'tabindex', '0');
			cy.findByRole('tab', { name: /account/i }).should('have.attr', 'aria-selected', 'true');
			cy.findByRole('tab', { name: /password/i }).should('have.attr', 'aria-selected', 'false');
			cy.get('#brn-tabs-content-account').should('exist');
		});

		it('tab and arrow interactions should render with first tab selected and change to second tab when second tab is focused with arrow right, return to first tab with arrow left and do nothing on arrow up or down', () => {
			verifyTabsSetup();

			cy.realPress('Tab');
			cy.realPress('ArrowRight');
			cy.findByRole('tabpanel').should('have.attr', 'aria-labelledby', 'brn-tabs-label-password');
			cy.findByRole('tabpanel').should('have.attr', 'tabindex', '0');
			cy.get('#brn-tabs-content-password').should('exist');

			cy.realPress('ArrowLeft');
			cy.findByRole('tabpanel').should('have.attr', 'aria-labelledby', 'brn-tabs-label-account');
			cy.findByRole('tabpanel').should('have.attr', 'tabindex', '0');
			cy.get('#brn-tabs-content-account').should('exist');

			// should ignore up and down
			cy.realPress('ArrowUp');
			cy.get('#brn-tabs-content-account').should('exist');

			cy.realPress('ArrowDown');
			cy.get('#brn-tabs-content-account').should('exist');

			// should jump to last on end
			cy.realPress('End');
			cy.findByRole('tabpanel').should('have.attr', 'aria-labelledby', 'brn-tabs-label-password');
			cy.findByRole('tabpanel').should('have.attr', 'tabindex', '0');
			cy.get('#brn-tabs-content-password').should('exist');

			// should wrap arround
			cy.realPress('ArrowRight');
			cy.findByRole('tabpanel').should('have.attr', 'aria-labelledby', 'brn-tabs-label-account');
			cy.findByRole('tabpanel').should('have.attr', 'tabindex', '0');
			cy.get('#brn-tabs-content-account').should('exist');

			// jump between list and panel on tab
			cy.realPress('Tab');
			cy.findByRole('tabpanel').should('be.focused');
			cy.realPress(['Shift', 'Tab']);
			cy.findByRole('tab', { name: /account/i }).should('be.focused');
		});
	});
});
