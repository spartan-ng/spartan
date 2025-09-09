describe('radio-group', () => {
	describe('default', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=radio-group--default');
			cy.injectAxe();
		});

		it(`
    1. should display default version.
    2. should update based on click of outside button setting to 16.0.0.
    3. should uncheck all checked radios when reset to none.
    4. should check correct version when clicked on 15.8.0 radio
    5. should not change when clicked on disabled radio
    `, () => {
			cy.checkA11y('#storybook-root', {
				rules: {
					'page-has-heading-one': { enabled: false },
					'landmark-one-main': { enabled: false },
				},
			});

			//1
			cy.findByTestId('currentVersion').should('have.text', '16.1.4');
			//2
			cy.findByText('Set to v16.0.0').realClick();
			cy.findByTestId('currentVersion').should('have.text', '16.0.0');
			cy.findByLabelText('v16.0.0').should('be.checked');
			//3
			cy.findByText('Reset').realClick();
			cy.findByTestId('currentVersion').should('have.text', 'none');
			cy.findByLabelText('v16.0.0').should('not.be.checked');
			//4
			cy.findByText('v15.8.0').realClick();
			cy.findByLabelText('v15.8.0').should('be.checked');
			cy.findByLabelText('v16.0.0').should('not.be.checked');
			cy.findByTestId('currentVersion').should('have.text', '15.8.0');
			//5
			cy.findByText('v15.2.0').realClick();

			cy.findByTestId('disabledLabel').should('have.css', 'cursor', 'not-allowed');

			cy.findByLabelText('v15.2.0').should('not.be.checked');
			cy.findByLabelText('v16.0.0').should('not.be.checked');
			cy.findByLabelText('v15.8.0').should('be.checked');
			cy.findByTestId('currentVersion').should('have.text', '15.8.0');
		});

		it(`
    1. should display default version.
    2. should focus first radio when tabbed in.
    3. should jump to next button when tabbed out and set version correctly when enter is hit on it
    4. should jump to newly selected radio when focus moved back to group
    5. should move checked radio with up and down arrows.
    6. should move checked radio with left and right arrows.
    5. should not move to disabled radio
    `, () => {
			cy.checkA11y('#storybook-root', {
				rules: {
					'page-has-heading-one': { enabled: false },
					'landmark-one-main': { enabled: false },
				},
			});

			//1
			cy.findByTestId('currentVersion').should('have.text', '16.1.4');
			//2
			cy.realPress('Tab');
			cy.findByLabelText('v16.1.4').should('have.focus');
			cy.realPress('Tab');
			cy.findByText('Set to v16.0.0').should('have.focus');
			cy.realPress('Enter');
			cy.findByTestId('currentVersion').should('have.text', '16.0.0');
			cy.findByLabelText('v16.0.0').should('be.checked');
			//3
			cy.realPress(['Shift', 'Tab']);
			cy.findByLabelText('v16.0.0').should('have.focus');
			cy.realPress('ArrowUp');
			cy.findByLabelText('v16.1.4').should('have.focus');
			cy.findByLabelText('v16.1.4').should('be.checked');
			cy.realPress('ArrowDown');
			cy.findByLabelText('v16.0.0').should('be.checked');
			cy.findByLabelText('v16.0.0').should('have.focus');
			//4
			cy.realPress('ArrowLeft');
			cy.findByLabelText('v16.1.4').should('have.focus');
			cy.findByLabelText('v16.1.4').should('be.checked');
			cy.realPress('ArrowRight');
			cy.findByLabelText('v16.0.0').should('be.checked');
			cy.findByLabelText('v16.0.0').should('have.focus');
			//5
			cy.realPress('ArrowDown');
			cy.realPress('ArrowDown');

			cy.findByLabelText('v15.2.0').should('not.have.focus');
			cy.findByLabelText('v16.1.4').should('have.focus');
			cy.findByLabelText('v16.1.4').should('be.checked');
		});
		describe('labelFor', () => {
			beforeEach(() => {
				cy.visit('/iframe.html?id=radio-group--label-for');
				cy.injectAxe();
			});

			it('should check the option when clicking the label', () => {
				cy.get('#brn-label-1').realClick();
				cy.get('#default-radio').realClick();
				cy.findByLabelText('Default').should('be.checked');
				cy.get('#brn-label-1').realClick();
				cy.get('#comfortable-radio').realClick();
				cy.findByLabelText('Comfortable').should('be.checked');
				cy.get('#brn-label-2').realClick();
				cy.get('#compact-radio').realClick();
				cy.findByLabelText('Compact').should('be.checked');
				cy.findByLabelText('Comfortable').should('not.be.checked');
				cy.findByLabelText('Default').should('not.be.checked');
			});
		});
	});
});
