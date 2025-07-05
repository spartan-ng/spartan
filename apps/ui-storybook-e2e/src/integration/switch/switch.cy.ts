describe('brn-switch accessibility and functionality tests', () => {
	/**
	 * Utility function to verify the initial setup of the switch component.
	 * Ensures that the switch is present and has the correct accessible name.
	 */
	const verifySwitchSetup = (labelText: string | RegExp) => {
		// Check for accessibility violations on the page
		cy.checkA11y('#storybook-root', {
			rules: {
				'page-has-heading-one': { enabled: false },
				'landmark-one-main': { enabled: false },
			},
		});
		// Verify that the switch with the specified accessible name exists and has correct role
		cy.findByRole('switch', { name: labelText }).should('exist');

		// Verify that button exists and is properly associated
		cy.findByLabelText(labelText).should('exist').and('have.attr', 'type', 'button');
	};

	/**
	 * Utility function to verify that the switch is in the 'off' state.
	 * Checks both the visual state and the underlying input value.
	 */
	const verifySwitchOff = (labelText: string | RegExp) => {
		// The switch should have aria-checked set to 'false' for screen readers
		cy.findByRole('switch', { name: labelText }).should('exist').should('have.attr', 'aria-checked', 'false');

		// The hidden input should have value 'off' and not be checked
		cy.findByLabelText(labelText).should('exist').should('have.attr', 'value', 'off');

		// The component should have data-state attribute set to 'unchecked'
		cy.get('brn-switch').should('have.attr', 'data-state', 'unchecked');
	};

	/**
	 * Utility function to verify that the switch is in the 'on' state.
	 * Checks both the visual state and the underlying input value.
	 */
	const verifySwitchOn = (labelText: string | RegExp) => {
		// The switch should have aria-checked set to 'true' for screen readers
		cy.findByRole('switch', { name: labelText }).should('have.attr', 'aria-checked', 'true');

		// The hidden input should have value 'on' and be checked
		cy.findByLabelText(labelText).should('exist').should('have.attr', 'value', 'on');

		// The component should have data-state attribute set to 'checked'
		cy.get('brn-switch').should('have.attr', 'data-state', 'checked');
	};

	/**
	 * Utility function to verify that the switch value is 'true' in the UI.
	 */
	const verifySwitchValueTrue = () => cy.findByTestId('switchValue').should('include.text', 'true');

	/**
	 * Utility function to verify that the switch value is 'false' in the UI.
	 */
	const verifySwitchValueFalse = () => cy.findByTestId('switchValue').should('include.text', 'false');

	/**
	 * Utility function to verify that the 'changed' value is 'true' in the UI.
	 */
	const verifyChangedValueTrue = () => cy.findByTestId('changedValue').should('include.text', 'true');

	/**
	 * Utility function to verify that the 'changed' value is 'false' in the UI.
	 */
	const verifyChangedValueFalse = () => cy.findByTestId('changedValue').should('include.text', 'false');

	/**
	 * Utility function to verify that the switch has been touched (i.e., interacted with).
	 */
	const verifySwitchTouched = () => cy.get('hlm-switch').should('have.class', 'ng-touched');

	/**
	 * Executes tests for toggling the switch using [Tab] and [Enter] keys.
	 */
	const executeTabEnterTests = (labelText: string | RegExp) => {
		verifySwitchSetup(labelText);
		verifySwitchOff(labelText);

		// Focus on the switch using Tab and toggle using Enter
		cy.realPress('Tab');
		cy.realPress('Enter');
		verifySwitchOn(labelText);

		// Toggle back to 'off' state
		cy.realPress('Enter');
		verifySwitchOff(labelText);
	};

	/**
	 * Executes tests for toggling the switch using [Tab] and [Space] keys.
	 */
	const executeTabSpaceTests = (labelText: string | RegExp) => {
		verifySwitchSetup(labelText);
		verifySwitchOff(labelText);

		// Focus on the switch using Tab and toggle using Space
		cy.realPress('Tab');
		cy.realPress('Space');
		verifySwitchOn(labelText);

		// Toggle back to 'off' state
		cy.realPress('Space');
		verifySwitchOff(labelText);
	};

	/**
	 * Executes tests for toggling the switch by clicking on the associated label.
	 */
	const executeClickOnLabelTests = (labelText: string | RegExp) => {
		verifySwitchSetup(labelText);
		verifySwitchOff(labelText);

		// Click on the label to toggle the switch
		cy.findByText(labelText).click();
		verifySwitchOn(labelText);

		// Click again to toggle back to 'off' state
		cy.findByText(labelText).click();
		verifySwitchOff(labelText);
	};

	/**
	 * Executes tests for toggling the switch by clicking on the thumb.
	 */
	const executeClickOnThumb = (labelText: string | RegExp) => {
		verifySwitchSetup(labelText);
		verifySwitchOff(labelText);

		// Click on the label to toggle the switch
		cy.findByRole('switch').click();
		verifySwitchOn(labelText);

		// Click again to toggle back to 'off' state
		cy.findByRole('switch').click();
		verifySwitchOff(labelText);
	};

	/**
	 * Executes tests for toggling the switch by clicking on the thumb.
	 */
	const executeClickOnComponent = (labelText: string | RegExp) => {
		verifySwitchSetup(labelText);
		verifySwitchOff(labelText);

		// Click on the label to toggle the switch
		cy.get('brn-switch').find('button').click();
		verifySwitchOn(labelText);

		// Click again to toggle back to 'off' state
		cy.get('brn-switch').find('button').click();
		verifySwitchOff(labelText);
	};

	describe('default', () => {
		const labelText = /Test Switch/i;

		beforeEach(() => {
			cy.visit('/iframe.html?id=switch--default');
			cy.injectAxe();
		});

		it('should toggle switch state on component click', () => executeClickOnComponent(labelText));

		it('should toggle switch state on thumb click', () => executeClickOnThumb(labelText));

		it('should toggle switch state using [Tab][Enter] keys', () => {
			executeTabEnterTests(labelText);
		});

		it('should toggle switch state using [Tab][Space] keys', () => {
			executeTabSpaceTests(labelText);
		});

		it('should show visible focus indication for keyboard users', () => {
			const labelText = /Test Switch/i;

			// Start with no element focused
			cy.findByRole('switch', { name: labelText }).should('not.have.focus');

			// Move focus to the switch using keyboard navigation (how keyboard users would interact)
			cy.realPress('Tab');

			// The switch must have visible focus indicator that meets WCAG requirements
			// This ensures keyboard users can see which element they're interacting with
			cy.findByRole('switch', { name: labelText })
				.should('have.focus')
				// Focus styles should be visible - check for outline, ring, or other focus indicators
				// We're checking a few common CSS properties used for focus styling
				.and(($el) => {
					const styles = window.getComputedStyle($el[0]);
					const hasOutline = styles.outline !== 'none' && styles.outline !== '';
					const hasBoxShadow = styles.boxShadow !== 'none' && styles.boxShadow !== '';
					const hasBorder = styles.borderColor !== 'transparent';

					// At least one focus indicator should be present
					expect(hasOutline || hasBoxShadow || hasBorder).to.be.true;
				});

			// Ensure focus styles disappear when focus moves away
			cy.realPress('Tab');
			cy.findByRole('switch', { name: labelText }).should('not.have.focus');
		});
	});

	describe('inside label', () => {
		const labelText = /Test Switch/i;

		beforeEach(() => {
			cy.visit('/iframe.html?id=switch--inside-label');
			cy.injectAxe();
		});

		it('should toggle switch state by clicking on the label', () => executeClickOnLabelTests(labelText));

		it('should toggle switch state on component click', () => executeClickOnComponent(labelText));

		it('should toggle switch state on thumb click', () => executeClickOnThumb(labelText));

		it('should toggle switch state using [Tab][Enter] keys', () => executeTabEnterTests(labelText));

		it('should toggle switch state using [Tab][Space] keys', () => executeTabSpaceTests(labelText));
	});

	describe('labeled with aria-labelledby', () => {
		const labelText = /Test Switch/i;
		beforeEach(() => {
			cy.visit('/iframe.html?id=switch--labeled-with-aria-labeled-by');
			cy.injectAxe();
		});

		it('should toggle switch state by clicking on the label', () => executeClickOnLabelTests(labelText));

		it('should toggle switch state on component click', () => executeClickOnComponent(labelText));

		it('should toggle switch state on thumb click', () => executeClickOnThumb(labelText));

		it('should toggle switch state using [Tab][Enter] keys', () => executeTabEnterTests(labelText));

		it('should toggle switch state using [Tab][Space] keys', () => executeTabSpaceTests(labelText));
	});

	describe('form integration', () => {
		const labelText = /Test Switch/i;
		beforeEach(() => {
			cy.visit('/iframe.html?id=switch--form');
			cy.injectAxe();
		});

		it('should reflect changes in form values and touched state', () => {
			verifySwitchSetup(labelText);
			verifySwitchOff(labelText);

			// Click on the switch thumb to toggle
			cy.findByRole('switch').click();
			verifySwitchOn(labelText);
			verifySwitchValueTrue();
			verifyChangedValueTrue();

			// Click on the switch to toggle back
			cy.get('brn-switch').find('button').click();
			verifySwitchOff(labelText);
			verifySwitchValueFalse();
			verifyChangedValueFalse();

			// Navigate through form fields to trigger touched state
			cy.realPress('Tab');
			cy.realPress('Tab');
			verifySwitchTouched();
		});
	});

	describe('disabled switch', () => {
		const labelText = /Disabled Switch/i;

		beforeEach(() => {
			cy.visit('/iframe.html?id=switch--disabled');
			cy.injectAxe();
		});

		it('should not be interactive when disabled', () => {
			// Verify basic setup still applies to disabled switch
			verifySwitchSetup(labelText);
			verifySwitchOff(labelText);

			// A disabled switch must have proper attributes for screen readers
			cy.findByRole('switch', { name: labelText }).should('be.disabled');

			// The hidden input should also have the disabled attribute
			cy.findByLabelText(labelText).should('be.disabled');

			// Clicking should not toggle the switch when disabled (force: true bypasses Cypress's built-in disabled element detection)
			cy.get('brn-switch').find('button').click({ force: true });
			verifySwitchOff(labelText);

			// Keyboard users should not be able to focus disabled controls
			// First tab should skip the disabled control and go to next focusable element
			cy.realPress('Tab');
			cy.findByRole('switch', { name: labelText }).should('not.have.focus');

			// Label should also indicate the switch is disabled via data-disabled attribute
			cy.findByText(labelText).closest('label').should('have.attr', 'data-disabled', 'true');
		});
	});
});
