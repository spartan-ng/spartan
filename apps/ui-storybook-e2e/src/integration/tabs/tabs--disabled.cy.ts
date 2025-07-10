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
		cy.findByRole('tablist').should('have.attr', 'data-orientation', 'vertical');
		cy.findByRole('tablist').should('have.attr', 'aria-orientation', 'vertical');
		cy.findAllByRole('tab').should('have.length', 3);
		cy.findByRole('tab', { name: /account/i }).should('have.attr', 'aria-controls', 'brn-tabs-content-account');
		cy.findByRole('tab', { name: /password/i }).should('have.attr', 'aria-controls', 'brn-tabs-content-password');
		cy.findByRole('tab', { name: /danger zone/i }).should('have.attr', 'aria-controls', 'brn-tabs-content-danger');
		cy.findByRole('tabpanel').should('exist');
	};

	describe('default', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=tabs--disabled');
			cy.injectAxe();
		});

		it('click interactions should render with first tab selected and change to second tab when second tab is clicked', () => {
			verifyTabsSetup();

			cy.findByRole('tab', { name: /password/i }).click();

			cy.findByRole('tabpanel').should('have.attr', 'aria-labelledby', 'brn-tabs-label-password');
			cy.findByRole('tabpanel').should('have.attr', 'tabindex', '0');
			cy.findByRole('tab', { name: /password/i }).should('have.attr', 'aria-selected', 'true');
			cy.findByRole('tab', { name: /account/i }).should('have.attr', 'aria-selected', 'false');
			cy.findByRole('heading', { name: /password/i }).should('exist');

			cy.findByRole('tab', { name: /account/i }).click();

			cy.findByRole('tabpanel').should('have.attr', 'aria-labelledby', 'brn-tabs-label-account');
			cy.findByRole('tabpanel').should('have.attr', 'tabindex', '0');
			cy.findByRole('tab', { name: /account/i }).should('have.attr', 'aria-selected', 'true');
			cy.findByRole('tab', { name: /password/i }).should('have.attr', 'aria-selected', 'false');
			cy.findByRole('heading', { name: /account/i }).should('exist');
		});

		it('Should have the disabled control available', () => {
			verifyTabsSetup();
			// check that the disabled control is available in storybook
			cy.findByRole('switch', { name: /disabled/i }).should('exist');
		});

		it('Should be disabled by default', () => {
			verifyTabsSetup();
			cy.get('[hlmTabsTrigger="account"]').should('be.disabled');
			cy.get('[hlmTabsTrigger="password"]').should('be.disabled');
		});

		it('should enable tabs when storybook control is enabled', () => {
			verifyTabsSetup();

			// toggle from disabled to enabled using the storybook control
			cy.findByRole('switch', { name: /disabled/i }).click();

			cy.get('[hlmTabsTrigger="account"]').should('not.be.disabled');
			cy.get('[hlmTabsTrigger="password"]').should('not.be.disabled');
		});
	});
});
