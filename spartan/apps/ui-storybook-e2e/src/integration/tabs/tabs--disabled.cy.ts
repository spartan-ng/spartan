describe('tabs--disabled', () => {
	const verifyTabsSetup = () => {
		// TODO: investigate why this fails
		// cy.checkA11y('#storybook-root', {
		//   rules: {
		//     'page-has-heading-one': { enabled: false },
		//     'landmark-one-main': { enabled: false },
		//   },
		// });

		cy.findByRole('tablist').should('exist');
		cy.findByRole('tablist').should('have.attr', 'aria-label');
		cy.findByRole('tablist').should('have.attr', 'data-orientation', 'horizontal');
		cy.findByRole('tablist').should('have.attr', 'aria-orientation', 'horizontal');
		cy.findAllByRole('tab').should('have.length', 2);
		cy.findByRole('tab', { name: /account/i }).should('have.attr', 'aria-controls', 'brn-tabs-content-account');
		cy.findByRole('tab', { name: /password/i }).should('have.attr', 'aria-controls', 'brn-tabs-content-password');
	};

	describe('default', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=tabs--disabled');
			cy.injectAxe();
		});

		it('click interactions should render with first tab selected and change to second tab when second tab is clicked', () => {
			verifyTabsSetup();

			cy.findByRole('switch').click();

			// Now we can test the tab interactions
			cy.findByRole('tab', { name: /password/i }).click();

			cy.findByRole('tab', { name: /password/i }).should('have.attr', 'aria-selected', 'true');
			cy.findByRole('tab', { name: /account/i }).should('have.attr', 'aria-selected', 'false');

			cy.findByRole('tab', { name: /account/i }).click();

			cy.findByRole('tab', { name: /account/i }).should('have.attr', 'aria-selected', 'true');
			cy.findByRole('tab', { name: /password/i }).should('have.attr', 'aria-selected', 'false');
		});

		it('should default to disabled with aria tags', () => {
			verifyTabsSetup();
			cy.findByRole('tab', { name: /account/i }).should('be.disabled');
			cy.findByRole('tab', { name: /account/i }).should('have.attr', 'aria-disabled', 'true');
			cy.findByRole('tab', { name: /password/i }).should('be.disabled');
			cy.findByRole('tab', { name: /password/i }).should('have.attr', 'aria-disabled', 'true');
		});

		it('should toggle to active with no disabled attributes or classes', () => {
			verifyTabsSetup();

			// Click the toggle button to enable the tabs
			cy.findByRole('switch').click();
			// Verify tabs are no longer disabled
			cy.findByRole('tab', { name: /account/i }).should('not.be.disabled');
			cy.findByRole('tab', { name: /account/i }).should('have.attr', 'aria-disabled', 'false');
			cy.findByRole('tab', { name: /password/i }).should('not.be.disabled');
			cy.findByRole('tab', { name: /password/i }).should('have.attr', 'aria-disabled', 'false');

			// Verify tabs are now interactive
			cy.findByRole('tab', { name: /password/i }).click();
			cy.findByRole('tab', { name: /password/i }).should('have.attr', 'aria-selected', 'true');
			cy.findByRole('tab', { name: /account/i }).should('have.attr', 'aria-selected', 'false');
		});
	});
});
