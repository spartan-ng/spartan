describe('accordion', () => {
	const verifyAccordionSetup = () => {
		cy.get('hlm-accordion').should('have.attr', 'data-state', 'closed');
		cy.get('hlm-accordion-item').should('have.length', 3);
		cy.get('hlm-accordion-item').first().as('firstItem');
		cy.get('@firstItem').next().as('secondItem');
		cy.get('@secondItem').next().as('thirdItem');

		cy.get('@firstItem').should('have.attr', 'data-state', 'closed');
		cy.get('@secondItem').should('have.attr', 'data-state', 'closed');
		cy.get('@thirdItem').should('have.attr', 'data-state', 'closed');
	};

	const verifyStateOpen = (itemAlias: string) => {
		cy.get(itemAlias).should('have.attr', 'data-state', 'open');
		cy.get(itemAlias)
			.find('[hlmAccordionTrigger]')
			.should('have.attr', 'data-state', 'open')
			.should('have.attr', 'aria-expanded', 'true');
		cy.get(itemAlias).find('hlm-accordion-content').should('have.attr', 'data-state', 'open');
	};

	const verifyStateClosed = (itemAlias: string) => {
		cy.get(itemAlias).should('have.attr', 'data-state', 'closed');
		cy.get(itemAlias)
			.find('[hlmAccordionTrigger]')
			.should('have.attr', 'data-state', 'closed')
			.should('have.attr', 'aria-expanded', 'false');
		cy.get(itemAlias).find('hlm-accordion-content').should('have.attr', 'data-state', 'closed');
	};

	describe('ARIA semantics', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=accordion--default');
			cy.injectAxe();
		});

		it('buttons act as headers with proper ARIA attributes', () => {
			cy.get('hlm-accordion-item').first().as('firstItem');

			// Verify button element
			cy.get('@firstItem')
				.find('[hlmAccordionTrigger]')
				.then(($btn) => {
					expect($btn.prop('tagName')).to.equal('BUTTON');
				});

			// Collapsed by default
			cy.get('@firstItem').find('[hlmAccordionTrigger]').should('have.attr', 'aria-expanded', 'false');

			// Toggle updates aria-expanded
			cy.get('@firstItem').find('[hlmAccordionTrigger]').click();
			cy.get('@firstItem').find('[hlmAccordionTrigger]').should('have.attr', 'aria-expanded', 'true');

			// aria-controls points to content id
			cy.get('@firstItem')
				.find('[hlmAccordionTrigger]')
				.then(($trigger) => {
					const controlsId = $trigger.attr('aria-controls');
					expect(controlsId).to.match(/^brn-accordion-content-/);
					// Verify the panel exists with that id
					cy.get(`#${controlsId}`).should('exist');
				});
		});

		it('header button is wrapped in semantic heading', () => {
			cy.get('[hlmAccordionTrigger]')
				.first()
				.then(($btn) => {
					// Check if button is inside a heading element or has heading role
					const heading = $btn.closest('h1,h2,h3,h4,h5,h6,[role="heading"]');
					expect(heading.length).to.be.greaterThan(0);

					if (heading.attr('role') === 'heading') {
						expect(heading.attr('aria-level')).to.exist;
					}
				});
		});

		it('panel uses role="region" with aria-labelledby when open', () => {
			cy.get('hlm-accordion-item').first().as('firstItem');

			// Closed by default - region should have closed state
			cy.get('[role="region"]').first().should('have.attr', 'data-state', 'closed');

			// Open - region should be open and labeled by trigger
			cy.get('@firstItem').find('[hlmAccordionTrigger]').click();
			cy.get('@firstItem').find('[role="region"]').should('have.attr', 'data-state', 'open');

			cy.get('@firstItem')
				.find('[hlmAccordionTrigger]')
				.then(($trigger) => {
					const triggerId = $trigger.attr('id');
					cy.get('@firstItem').find('[role="region"]').should('have.attr', 'aria-labelledby', triggerId);
				});

			// Close - region should be closed again
			cy.get('@firstItem').find('[hlmAccordionTrigger]').click();
			cy.get('@firstItem').find('[role="region"]').should('have.attr', 'data-state', 'closed');
		});
	});

	describe('single accordion (default)', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=accordion--default');
			verifyAccordionSetup();
		});

		it('starts closed and is vertical by default', () => {
			cy.get('hlm-accordion').should('have.attr', 'data-orientation', 'vertical');
			verifyStateClosed('@firstItem');
			verifyStateClosed('@secondItem');
			verifyStateClosed('@thirdItem');
		});

		it('only one open at a time (click)', () => {
			// Open first
			cy.get('@firstItem').find('[hlmAccordionTrigger]').click();
			verifyStateOpen('@firstItem');
			verifyStateClosed('@secondItem');
			verifyStateClosed('@thirdItem');

			// Open second (first should close)
			cy.get('@secondItem').find('[hlmAccordionTrigger]').click();
			verifyStateClosed('@firstItem');
			verifyStateOpen('@secondItem');
			verifyStateClosed('@thirdItem');

			// Close second
			cy.get('@secondItem').find('[hlmAccordionTrigger]').click();
			verifyStateClosed('@firstItem');
			verifyStateClosed('@secondItem');
			verifyStateClosed('@thirdItem');

			// Open third
			cy.get('@thirdItem').find('[hlmAccordionTrigger]').click();
			verifyStateClosed('@firstItem');
			verifyStateClosed('@secondItem');
			verifyStateOpen('@thirdItem');
		});

		it('Space/Enter toggles like a button', () => {
			cy.get('@firstItem').find('[hlmAccordionTrigger]').focus();

			// Open with Space
			cy.realPress('Space');
			verifyStateOpen('@firstItem');

			// Close with Space
			cy.realPress('Space');
			verifyStateClosed('@firstItem');

			// Open with Enter
			cy.realPress('Enter');
			verifyStateOpen('@firstItem');

			// Close with Enter
			cy.realPress('Enter');
			verifyStateClosed('@firstItem');
		});
	});

	describe('multiple accordion', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=accordion--multiple');
			cy.get('hlm-accordion-item').should('have.length', 3);
			cy.get('hlm-accordion-item').first().as('firstItem');
			cy.get('@firstItem').next().as('secondItem');
			cy.get('@secondItem').next().as('thirdItem');
		});

		it('allows multiple items to remain open', () => {
			// All closed initially
			verifyStateClosed('@firstItem');
			verifyStateClosed('@secondItem');
			verifyStateClosed('@thirdItem');

			// Open first
			cy.get('@firstItem').find('[hlmAccordionTrigger]').click();
			verifyStateOpen('@firstItem');
			verifyStateClosed('@secondItem');
			verifyStateClosed('@thirdItem');

			// Open second (first stays open)
			cy.get('@secondItem').find('[hlmAccordionTrigger]').click();
			verifyStateOpen('@firstItem');
			verifyStateOpen('@secondItem');
			verifyStateClosed('@thirdItem');

			// Open third (all open)
			cy.get('@thirdItem').find('[hlmAccordionTrigger]').click();
			verifyStateOpen('@firstItem');
			verifyStateOpen('@secondItem');
			verifyStateOpen('@thirdItem');

			// Close second (others stay open)
			cy.get('@secondItem').find('[hlmAccordionTrigger]').click();
			verifyStateOpen('@firstItem');
			verifyStateClosed('@secondItem');
			verifyStateOpen('@thirdItem');
		});
	});

	describe('keyboard navigation between headers', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=accordion--default');
			verifyAccordionSetup();
		});

		it('ArrowDown/ArrowUp move focus between headers (vertical)', () => {
			cy.get('@firstItem').find('[hlmAccordionTrigger]').focus();

			// Arrow down to second
			cy.realPress('ArrowDown');
			cy.get('@secondItem').find('[hlmAccordionTrigger]').should('be.focused');

			// Arrow up back to first
			cy.realPress('ArrowUp');
			cy.get('@firstItem').find('[hlmAccordionTrigger]').should('be.focused');

			// Arrow up wraps to last
			cy.realPress('ArrowUp');
			cy.get('@thirdItem').find('[hlmAccordionTrigger]').should('be.focused');

			// Arrow down wraps to first
			cy.realPress('ArrowDown');
			cy.get('@firstItem').find('[hlmAccordionTrigger]').should('be.focused');
		});

		it('Home to first; End to last', () => {
			// Focus middle item
			cy.get('@secondItem').find('[hlmAccordionTrigger]').focus();

			// Home goes to first
			cy.realPress('Home');
			cy.get('@firstItem').find('[hlmAccordionTrigger]').should('be.focused');

			// End goes to last
			cy.realPress('End');
			cy.get('@thirdItem').find('[hlmAccordionTrigger]').should('be.focused');
		});

		it('Tab/Shift+Tab include inner focusables in page order', () => {
			// Open first item
			cy.get('@firstItem').find('[hlmAccordionTrigger]').click();
			cy.get('@firstItem').find('[hlmAccordionTrigger]').focus();

			// Tab should go to content if it has focusable elements
			// For default story, content has no focusables, so it goes to next trigger
			cy.realPress('Tab');
			cy.get('@secondItem').find('[hlmAccordionTrigger]').should('be.focused');

			// Shift+Tab goes back
			cy.realPress(['Shift', 'Tab']);
			cy.get('@firstItem').find('[hlmAccordionTrigger]').should('be.focused');
		});
	});

	describe('horizontal orientation', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=accordion--horizontal');
			cy.get('hlm-accordion-item').should('have.length', 3);
			cy.get('hlm-accordion-item').first().as('firstItem');
			cy.get('@firstItem').next().as('secondItem');
			cy.get('@secondItem').next().as('thirdItem');
		});

		it('Left/Right move focus when orientation="horizontal"', () => {
			cy.get('hlm-accordion').should('have.attr', 'data-orientation', 'horizontal');

			cy.get('@firstItem').find('[hlmAccordionTrigger]').focus();

			// Arrow right to second
			cy.realPress('ArrowRight');
			cy.get('@secondItem').find('[hlmAccordionTrigger]').should('be.focused');

			// Arrow left back to first
			cy.realPress('ArrowLeft');
			cy.get('@firstItem').find('[hlmAccordionTrigger]').should('be.focused');

			// Arrow left wraps to last
			cy.realPress('ArrowLeft');
			cy.get('@thirdItem').find('[hlmAccordionTrigger]').should('be.focused');

			// Arrow right wraps to first
			cy.realPress('ArrowRight');
			cy.get('@firstItem').find('[hlmAccordionTrigger]').should('be.focused');
		});
	});

	describe('keyboard guarding with form inputs', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=accordion--with-form-inputs');
		});

		it('typing in an input does not toggle accordion', () => {
			cy.get('hlm-accordion-item').first().as('firstItem');

			// Open accordion
			cy.get('@firstItem').find('[hlmAccordionTrigger]').click();
			verifyStateOpen('@firstItem');

			// Type in input
			cy.get('@firstItem').find('input').type('John Doe');
			cy.get('@firstItem').find('input').should('have.value', 'John Doe');

			// Accordion should still be open
			verifyStateOpen('@firstItem');

			// Enter key in input should not toggle
			cy.get('@firstItem').find('input').type('{enter}');
			verifyStateOpen('@firstItem');
		});

		it('textarea accepts newlines and accordion stays open', () => {
			cy.get('hlm-accordion-item').first().as('firstItem');

			// Open accordion
			cy.get('@firstItem').find('[hlmAccordionTrigger]').click();
			verifyStateOpen('@firstItem');

			// Type in textarea with newlines
			cy.get('@firstItem').find('textarea').type('Line 1{enter}Line 2');
			cy.get('@firstItem').find('textarea').should('have.value', 'Line 1\nLine 2');

			// Accordion should still be open
			verifyStateOpen('@firstItem');
		});

		it('select changes with arrows and does not toggle', () => {
			cy.get('hlm-accordion-item').first().as('firstItem');

			// Open accordion
			cy.get('@firstItem').find('[hlmAccordionTrigger]').click();
			verifyStateOpen('@firstItem');

			// Focus select and change value with arrow
			cy.get('@firstItem').find('select').focus();
			cy.get('@firstItem').find('select').select('Option Two');

			// Accordion should still be open
			verifyStateOpen('@firstItem');
		});

		it('contenteditable text edits do not toggle', () => {
			cy.get('hlm-accordion-item').first().as('firstItem');

			// Open accordion
			cy.get('@firstItem').find('[hlmAccordionTrigger]').click();
			verifyStateOpen('@firstItem');

			// Type in contenteditable
			cy.get('@firstItem').find('[contenteditable="true"]').type(' hello');
			cy.get('@firstItem').find('[contenteditable="true"]').should('contain', 'hello');

			// Accordion should still be open
			verifyStateOpen('@firstItem');
		});

		it('modifier combos (Ctrl/Meta/Alt) do not toggle', () => {
			cy.get('hlm-accordion-item').first().as('firstItem');

			// Open accordion
			cy.get('@firstItem').find('[hlmAccordionTrigger]').click();
			verifyStateOpen('@firstItem');
			cy.get('@firstItem').find('[hlmAccordionTrigger]').focus();

			// Test Ctrl combinations
			cy.realPress(['Control', 'ArrowDown']);
			verifyStateOpen('@firstItem');

			// Test Meta combinations
			cy.realPress(['Meta', 'ArrowDown']);
			verifyStateOpen('@firstItem');

			// Test Alt combinations
			cy.realPress(['Alt', 'ArrowDown']);
			verifyStateOpen('@firstItem');
		});
	});

	describe('inert behavior for closed panels', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=accordion--with-tapable');
		});

		it('button should not be focusable when panel is closed (inert)', () => {
			cy.get('hlm-accordion-item').first().as('firstItem');
			cy.get('@firstItem').next().as('secondItem');

			// First item is closed - button inside should not be focusable
			verifyStateClosed('@firstItem');

			// Try to tab to button - should skip it
			cy.realPress('Tab'); // Focus first trigger
			cy.get('@firstItem').find('[hlmAccordionTrigger]').should('be.focused');
			cy.realPress('Tab'); // Should skip to second trigger, not the button inside closed panel
			cy.get('@secondItem').find('[hlmAccordionTrigger]').should('be.focused');

			// Open first item - button should now be focusable
			cy.get('@firstItem').find('[hlmAccordionTrigger]').click();
			verifyStateOpen('@firstItem');
			cy.get('@firstItem').find('[hlmAccordionTrigger]').focus();
			cy.realPress('Tab');
			cy.get('[data-testid="not-tapable-when-closed"]').should('be.focused');

			// Open second item and verify its button is focusable
			cy.get('@secondItem').find('[hlmAccordionTrigger]').click();
			verifyStateOpen('@secondItem');
			cy.get('@secondItem').find('[hlmAccordionTrigger]').focus();
			cy.realPress('Tab');
			cy.get('[data-testid="tapable-when-open"]').should('be.focused');
		});
	});

	describe('accordion ARIA structure validation', () => {
		describe('valid structures', () => {
			it('accepts button wrapped in native heading', () => {
				cy.visit('/iframe.html?id=accordion--test-aria-valid-native-heading');
				// Should render without errors
				cy.get('h3 > button[hlmAccordionTrigger]').should('exist');
				cy.get('button[hlmAccordionTrigger]').should('have.attr', 'role', 'button');
			});
			it('accepts button wrapped in element with role="heading" and aria-level', () => {
				cy.visit('/iframe.html?id=accordion--test-aria-valid-role-heading');
				cy.get('[role="heading"][aria-level] > button[hlmAccordionTrigger]').should('exist');
			});
			it('accepts all heading levels h1-h6', () => {
				cy.visit('/iframe.html?id=accordion--test-aria-valid-all-headings');
				['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach((heading) => {
					cy.get(`${heading} > button[hlmAccordionTrigger]`).should('exist');
				});
			});
		});

		describe('invalid structures - should show errors', () => {
			it('throws error when trigger is not a button and lacks role="button"', () => {
				cy.on('uncaught:exception', (err) => {
					expect(err.message).to.include('must be a <button> or have role="button"');
					return false;
				});
				cy.visit('/iframe.html?id=accordion--test-aria-invalid-not-button');
			});
			it('throws error when button is not wrapped in heading', () => {
				cy.on('uncaught:exception', (err) => {
					expect(err.message).to.include('must be wrapped in a heading element');
					return false;
				});
				cy.visit('/iframe.html?id=accordion--test-aria-invalid-no-heading');
			});
			it('throws error when role="heading" lacks aria-level', () => {
				cy.on('uncaught:exception', (err) => {
					expect(err.message).to.include('must have an aria-level attribute');
					return false;
				});
				cy.visit('/iframe.html?id=accordion--test-aria-invalid-no-aria-level');
			});
			it('throws error for invalid aria-level values', () => {
				cy.on('uncaught:exception', (err) => {
					expect(err.message).to.include('aria-level must be a number between 1 and 6');
					return false;
				});
				cy.visit('/iframe.html?id=accordion--test-aria-invalid-aria-level-value');
			});
		});
	});

	describe('button state sync', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=accordion--button-state-sync');
			cy.get('hlm-accordion-item').should('have.length', 3);
			cy.get('hlm-accordion-item').first().as('firstItem');
			cy.get('@firstItem').next().as('secondItem');
			cy.get('@secondItem').next().as('thirdItem');
		});
		it(
			'should have the first item open by default, toggle all 3 items by pressing on them, ' +
				'close third item on button click, open third item on button click, close third item on click on its own trigger',
			() => {
				verifyStateOpen('@firstItem');
				verifyStateClosed('@secondItem');
				verifyStateClosed('@thirdItem');

				cy.get('@firstItem').find('[hlmAccordionTrigger]').click();
				verifyStateClosed('@firstItem');
				cy.get('@secondItem').find('[hlmAccordionTrigger]').click();

				verifyStateOpen('@secondItem');
				cy.get('@secondItem').find('[hlmAccordionTrigger]').click();
				verifyStateClosed('@secondItem');

				cy.get('@thirdItem').find('[hlmAccordionTrigger]').click();
				verifyStateOpen('@thirdItem');
				cy.findByText(/toggle third item/i).click();
				verifyStateClosed('@thirdItem');
				cy.findByText(/toggle third item/i).click();
				verifyStateOpen('@thirdItem');
				cy.get('@thirdItem').find('[hlmAccordionTrigger]').click();
				verifyStateClosed('@thirdItem');
			},
		);
	});

	describe('default accessibility', () => {
		['default', 'multiple', 'horizontal', 'with-form-inputs', 'with-tapable', 'accordion--button-state-sync'].forEach(
			(story) => {
				it(`should have no accessibility violations in ${story} story`, () => {
					cy.visit(`/iframe.html?id=accordion--${story}`);
					cy.injectAxe();
					cy.checkA11y('#storybook-root', {
						rules: {
							'page-has-heading-one': { enabled: false },
							'landmark-one-main': { enabled: false },
						},
					});
				});
			},
		);
	});
});
