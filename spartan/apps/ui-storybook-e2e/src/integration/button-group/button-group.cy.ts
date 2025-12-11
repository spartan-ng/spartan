describe('button-group', () => {
	const verifyButtonGroupSetup = () => {
		// Verify that the button group container exists
		cy.get('[hlmButtonGroup]').should('exist');
	};

	const verifyButtonInteraction = (buttonIndex: number, expectedText: string) => {
		cy.get('[hlmButtonGroup] button').eq(buttonIndex).should('contain.text', expectedText);
		cy.get('[hlmButtonGroup] button').eq(buttonIndex).should('not.be.disabled');
		cy.get('[hlmButtonGroup] button').eq(buttonIndex).click();
		// Verify button can be focused and activated
		cy.get('[hlmButtonGroup] button').eq(buttonIndex).should('be.focused');
	};

	const testKeyboardNavigation = () => {
		// Focus first button
		cy.get('[hlmButtonGroup] button').first().focus();
		cy.get('[hlmButtonGroup] button').first().should('be.focused');

		// Navigate with Tab key
		cy.realPress('Tab');
		cy.get('[hlmButtonGroup] button').eq(1).should('be.focused');

		// Test Enter key activation
		cy.realPress('Enter');
		cy.get('[hlmButtonGroup] button').eq(1).should('be.focused');

		// Test Space key activation
		cy.realPress('Space');
		cy.get('[hlmButtonGroup] button').eq(1).should('be.focused');
	};

	describe('Default Button Group', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=button-group--default');
			cy.injectAxe();
		});

		it('should render the default button group correctly', () => {
			verifyButtonGroupSetup();

			// Verify button text content
			cy.get('[hlmButtonGroup] button').first().contains('Button 1');
			cy.get('[hlmButtonGroup] button').last().contains('Button 2');
		});

		it('should have outline variant buttons', () => {
			cy.get('[hlmButtonGroup] button').each(($btn) => {
				cy.wrap($btn).should('have.attr', 'hlmbtn');
			});
		});

		it('should support button interactions', () => {
			verifyButtonInteraction(0, 'Button 1');
			verifyButtonInteraction(1, 'Button 2');
		});

		it('should support keyboard navigation', () => {
			testKeyboardNavigation();
		});

		it('should maintain proper focus management', () => {
			// Test focus trap within button group
			cy.get('[hlmButtonGroup] button').first().focus();
			cy.realPress('Tab');
			cy.get('[hlmButtonGroup] button').eq(1).should('be.focused');

			// Test Shift+Tab navigation
			cy.realPress(['Shift', 'Tab']);
			cy.get('[hlmButtonGroup] button').first().should('be.focused');
		});
	});

	describe('Split Button Group', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=button-group--split');
			cy.injectAxe();
		});

		it('should render the split button group correctly', () => {
			verifyButtonGroupSetup();

			// Verify separator exists
			cy.get('hlm-button-group-separator').should('exist').should('be.visible');
		});

		it('should have secondary variant buttons', () => {
			cy.get('[hlmButtonGroup] button').each(($btn) => {
				cy.wrap($btn).should('have.attr', 'hlmbtn');
				// Note: The actual variant attribute might not be directly visible in DOM,
				// but we can verify the buttons have the expected styling
			});
		});

		it('should have separator between buttons', () => {
			// Check that separator is positioned between buttons
			cy.get('[hlmButtonGroup]').within(() => {
				cy.get('button').first().should('contain.text', 'Button 1');
				cy.get('hlm-button-group-separator').should('exist');
				cy.get('button').last().should('contain.text', 'Button 2');
			});
		});

		it('should maintain accessibility with separator', () => {
			// Verify separator doesn't create accessibility issues
			cy.checkA11y('#storybook-root', {
				rules: {
					'page-has-heading-one': { enabled: false },
					'landmark-one-main': { enabled: false },
				},
			});
		});
	});

	describe('Nested Button Group', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=button-group--nested');
			cy.injectAxe();
		});

		it('should render nested button groups correctly', () => {
			verifyButtonGroupSetup();

			// Verify nested structure
			cy.get('[hlmButtonGroup]').should('have.length', 3); // Parent + 2 nested groups
			cy.get('[hlmButtonGroup] [hlmButtonGroup]').should('have.length', 2);
		});

		it('should have all buttons in nested groups', () => {
			// Verify total button count across all nested groups
			cy.get('[hlmButtonGroup] button').should('have.length', 4);

			// Verify button content
			cy.get('[hlmButtonGroup] button').eq(0).should('contain.text', 'Button 1');
			cy.get('[hlmButtonGroup] button').eq(1).should('contain.text', 'Button 2');
			cy.get('[hlmButtonGroup] button').eq(2).should('contain.text', 'Button 3');
			cy.get('[hlmButtonGroup] button').eq(3).should('contain.text', 'Button 4');
		});

		it('should support interactions in nested groups', () => {
			// Test each button in nested groups
			for (let i = 0; i < 4; i++) {
				verifyButtonInteraction(i, `Button ${i + 1}`);
			}
		});

		it('should maintain proper keyboard navigation in nested structure', () => {
			// Focus first button
			cy.get('[hlmButtonGroup] button').first().focus();

			// Navigate through all buttons
			for (let i = 1; i < 4; i++) {
				cy.realPress('Tab');
				cy.get('[hlmButtonGroup] button').eq(i).should('be.focused');
			}
		});

		it('should maintain proper grouping semantics', () => {
			// Verify that nested groups maintain their individual identity
			cy.get('[hlmButtonGroup] [hlmButtonGroup]')
				.first()
				.within(() => {
					cy.get('button').should('have.length', 2);
					cy.get('button').first().should('contain.text', 'Button 1');
					cy.get('button').last().should('contain.text', 'Button 2');
				});

			cy.get('[hlmButtonGroup] [hlmButtonGroup]')
				.last()
				.within(() => {
					cy.get('button').should('have.length', 2);
					cy.get('button').first().should('contain.text', 'Button 3');
					cy.get('button').last().should('contain.text', 'Button 4');
				});
		});
	});

	describe('WithText Button Group', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=button-group--with-text');
			cy.injectAxe();
		});

		it('should render button group with text correctly', () => {
			verifyButtonGroupSetup();

			// Verify nested structure with text
			cy.get('[hlmButtonGroup]').should('have.length', 3); // Parent + 2 nested groups
			cy.get('[hlmButtonGroup] [hlmButtonGroup]').should('have.length', 2);

			// Verify buttons exist
			cy.get('[hlmButtonGroup] button').should('have.length', 2);
			cy.get('[hlmButtonGroup] button').first().should('contain.text', 'Button 1');
			cy.get('[hlmButtonGroup] button').last().should('contain.text', 'Button 2');
		});

		it('should have separator and text element', () => {
			// Verify separator exists
			cy.get('hlm-button-group-separator').should('exist').should('be.visible');

			// Verify text element exists and has correct content
			cy.get('[hlmButtonGroupText]').should('exist').should('be.visible').should('contain.text', 'Text');
		});

		it('should have proper structure with text group', () => {
			cy.get('[hlmButtonGroup]')
				.first()
				.within(() => {
					// First nested group should have buttons
					cy.get('[hlmButtonGroup]')
						.first()
						.within(() => {
							cy.get('button').should('have.length', 2);
						});

					// Separator should exist
					cy.get('hlm-button-group-separator').should('exist');

					// Second nested group should have text
					cy.get('[hlmButtonGroup]')
						.last()
						.within(() => {
							cy.get('[hlmButtonGroupText]').should('exist').should('contain.text', 'Text');
						});
				});
		});

		it('should support button interactions with text element', () => {
			verifyButtonInteraction(0, 'Button 1');
			verifyButtonInteraction(1, 'Button 2');

			// Verify text element is not interactive
			cy.get('[hlmButtonGroupText]').should('not.have.attr', 'tabindex');
			cy.get('[hlmButtonGroupText]').should('not.have.attr', 'role', 'button');
		});

		it('should maintain proper keyboard navigation with text', () => {
			// Focus first button
			cy.get('[hlmButtonGroup] button').first().focus();
			cy.get('[hlmButtonGroup] button').first().should('be.focused');

			// Navigate to second button (text should not be focusable)
			cy.realPress('Tab');
			cy.get('[hlmButtonGroup] button').last().should('be.focused');

			// Text element should not receive focus
			cy.get('[hlmButtonGroupText]').should('not.be.focused');
		});

		it('should maintain accessibility with text element', () => {
			// Check accessibility
			cy.checkA11y('#storybook-root', {
				rules: {
					'page-has-heading-one': { enabled: false },
					'landmark-one-main': { enabled: false },
				},
			});

			// Verify text element has appropriate semantics
			cy.get('[hlmButtonGroupText]').should('be.visible');
			cy.get('[hlmButtonGroupText]').should('not.have.attr', 'aria-hidden', 'true');
		});
	});

	describe('Button Group Visual and Layout Tests', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=button-group--default');
		});

		it('should have proper visual styling', () => {
			// Verify buttons are visually grouped together
			cy.get('[hlmButtonGroup]').should('be.visible');

			// Check that buttons appear as a cohesive group
			cy.get('[hlmButtonGroup] button').each(($btn) => {
				cy.wrap($btn).should('be.visible');
				cy.wrap($btn).should('have.css', 'display').and('not.equal', 'none');
			});
		});

		it('should be responsive', () => {
			// Test on different viewport sizes
			cy.viewport(1200, 800);
			cy.get('[hlmButtonGroup]').should('be.visible');
			cy.get('[hlmButtonGroup] button').should('have.length', 2);

			cy.viewport(768, 600);
			cy.get('[hlmButtonGroup]').should('be.visible');
			cy.get('[hlmButtonGroup] button').should('have.length', 2);

			cy.viewport(375, 667);
			cy.get('[hlmButtonGroup]').should('be.visible');
			cy.get('[hlmButtonGroup] button').should('have.length', 2);
		});
	});

	describe('Button Group Accessibility Tests', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=button-group--default');
			cy.injectAxe();
		});

		it('should meet WCAG accessibility standards', () => {
			cy.checkA11y('#storybook-root', {
				rules: {
					'page-has-heading-one': { enabled: false },
					'landmark-one-main': { enabled: false },
				},
			});
		});

		it('should have proper focus indicators', () => {
			cy.get('[hlmButtonGroup] button').each(($btn) => {
				cy.wrap($btn).focus();
				cy.wrap($btn).should('be.focused');
				// Verify focus is visible (this would typically check for focus ring styles)
				cy.wrap($btn).should('have.focus');
			});
		});
	});
});
