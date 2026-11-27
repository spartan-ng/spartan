describe('select', () => {
	const verifySelectSetup = ({ disabled = false, groups = false } = {}) => {
		// Trigger
		cy.get('[hlmselecttrigger]')
			.invoke('attr', 'id')
			.should('match', /^brn-select-trigger-\d+$/);
		cy.get('[hlmselecttrigger]').should('have.attr', 'role', 'combobox');
		cy.get('[hlmselecttrigger]').should('have.attr', 'aria-haspopup', 'listbox');
		cy.get('[hlmselecttrigger]').should('have.attr', 'aria-expanded', 'false');

		if (!disabled) {
			// Open select
			cy.get('[hlmselecttrigger]').click();

			// Listbox
			cy.get('hlm-select-content>div').should('have.attr', 'role', 'listbox');

			// Item
			cy.get('hlm-select-item').should('have.attr', 'role', 'option');
			cy.get('hlm-select-item').should('have.attr', 'aria-selected', 'false');
			cy.get('hlm-select-item').should('have.attr', 'aria-disabled', 'false');

			if (groups) {
				// validate groups and labels
				cy.get('hlm-select-group').each(($group, index) => {
					cy.wrap($group).should('have.attr', 'role', 'group');
					cy.wrap($group)
						.find('hlm-select-label')
						.then(($el) => {
							cy.get('hlm-select-group').eq(index).should('have.attr', 'aria-labelledBy', $el.attr('id'));
						});
				});
			}

			// close select
			cy.get('body').click();
			cy.get('[hlmselecttrigger]').should('have.focus');
			cy.get('[hlmselecttrigger]').should('have.attr', 'aria-expanded', 'false');
		}
	};

	describe('default', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=select--default');
			cy.injectAxe();
		});

		it('click on trigger should open and close it content', () => {
			verifySelectSetup();
			cy.get('[hlmselecttrigger]').click();
			cy.get('[hlmselecttrigger]').should('have.attr', 'aria-expanded', 'true');
			cy.get('body').click();
			cy.get('[hlmselecttrigger]').should('have.attr', 'aria-expanded', 'false');
		});

		it('click outside should close the content', () => {
			verifySelectSetup();
			cy.get('[hlmselecttrigger]').click();
			cy.get('[hlmselecttrigger]').should('have.attr', 'aria-expanded', 'true');
			cy.get('body').click();
			cy.get('[hlmselecttrigger]').should('have.attr', 'aria-expanded', 'false');
		});

		it('second click on trigger should close the content', () => {
			verifySelectSetup();
			cy.get('[hlmselecttrigger]').click();
			cy.get('[hlmselecttrigger]').should('have.attr', 'aria-expanded', 'true');
			cy.get('[hlmselecttrigger]').click();
			cy.get('[hlmselecttrigger]').should('have.attr', 'aria-expanded', 'false');
		});

		it('should close after selecting an option in single mode', () => {
			verifySelectSetup();
			cy.get('[hlmselecttrigger]').click();

			cy.get('hlm-select-item')
				.eq(0)
				.then(($el) => {
					const optionValue = $el.attr('value');
					cy.get('hlm-select-item').eq(0).click();
					cy.get('hlm-select-content').should('not.exist');
					cy.get('[hlmselecttrigger]').should('have.attr', 'aria-expanded', 'false');
					cy.get('hlm-select-value').contains(optionValue, { matchCase: false });
				});
		});
	});

	describe('multiple', () => {
		beforeEach(() => {
			cy.injectAxe();
		});

		it('should stay open after selecting an option in multi mode', () => {
			cy.visit('/iframe.html?id=select--multiple');
			verifySelectSetup();
			cy.get('[hlmselecttrigger]').click();
			cy.get('hlm-select-content').should('exist');
			cy.get('hlm-select-item').eq(0).click();
			cy.get('hlm-select-content').should('exist');
			cy.get('hlm-select-item')
				.eq(0)
				.then(($el) => {
					const optionValue = $el.attr('value');
					cy.get('hlm-select-item').eq(1).click();
					cy.get('hlm-select-item')
						.eq(1)
						.then(($el2) => {
							const optionValue2 = $el2.attr('value');
							cy.get('[hlmSelectTrigger]').contains(optionValue, { matchCase: false });
							cy.get('[hlmSelectTrigger]').contains(optionValue2, { matchCase: false });

							cy.get('body').click();
							cy.get('hlm-select-content').should('not.exist');
							cy.get('[hlmselecttrigger]').should('have.attr', 'aria-expanded', 'false');
						});
				});
		});

		it('should stay open after selecting an option in multi mode', () => {
			cy.visit('/iframe.html?id=select--multiple');
			verifySelectSetup();
			cy.get('[hlmselecttrigger]').click();
			cy.get('hlm-select-content').should('exist');
			cy.get('hlm-select-item').eq(0).click();
			cy.get('hlm-select-content').should('exist');
			cy.get('hlm-select-item')
				.eq(0)
				.then(($el) => {
					const optionValue = $el.attr('value');
					cy.get('hlm-select-item').eq(1).click();
					cy.get('hlm-select-item')
						.eq(1)
						.then(($el2) => {
							const optionValue2 = $el2.attr('value');
							cy.get('[hlmSelectTrigger]').contains(optionValue, { matchCase: false });
							cy.get('[hlmSelectTrigger]').contains(optionValue2, { matchCase: false });

							cy.get('[hlmselecttrigger]').click();
							cy.get('hlm-select-content').should('not.exist');
							cy.get('[hlmselecttrigger]').should('have.attr', 'aria-expanded', 'false');
						});
				});
		});

		it('should toggle an item on keypress', () => {
			cy.visit('/iframe.html?id=select--multiple');
			verifySelectSetup();
			cy.get('[hlmselecttrigger]').click();

			// select the first item
			cy.get('hlm-select-item').eq(0).realType('{enter}');
			cy.get('hlm-select-item').eq(0).should('have.attr', 'aria-selected', 'true');

			cy.get('[hlmSelectTrigger]').contains('Apple', { matchCase: false });

			// deselect the first item
			cy.get('hlm-select-item').eq(0).realType('{enter}');

			// check if the first item is deselected
			cy.get('hlm-select-item').eq(0).should('have.attr', 'aria-selected', 'false');

			cy.get('[hlmSelectTrigger]').should('not.contain.text', 'Apple');
		});
	});

	describe('disabled', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=select--default&args=disabled:true');
			cy.injectAxe();
		});

		it('should not open if disabled', () => {
			verifySelectSetup({ disabled: true });
			cy.get('[hlmselecttrigger]').should('be.disabled');
			cy.get('[hlmSelectTrigger]').click({ force: true });
			cy.get('hlm-select-content').should('not.exist');
		});
	});

	describe('disabled option', () => {
		it('should not be able to select a disabled option', () => {
			cy.visit('/iframe.html?id=select--disabled-option');
			cy.get('[hlmselecttrigger]').click();
			cy.get('hlm-select-item').eq(0).should('not.have.attr', 'data-disabled');
			cy.get('[data-testid="banana-option"]').should('have.attr', 'aria-disabled', 'true');
			cy.get('[data-testid="banana-option"]').should('have.attr', 'data-disabled', '');
			cy.get('[data-testid="banana-option"]').click({ force: true });
			cy.get('pre').should('have.text', 'Form Control Value: ""');
			cy.get('hlm-select-item').eq(0).click();
			cy.get('pre').should('have.text', 'Form Control Value: "apple"');
		});
	});

	describe('form validation', () => {
		beforeEach(() => {
			cy.injectAxe();
		});

		it('should have form validation classes and reflect control status', () => {
			cy.visit('/iframe.html?id=select--reactive-form-control-with-validation');

			// initial
			cy.get('[hlmselecttrigger]').should('not.have.attr', 'data-touched');
			cy.get('[hlmselecttrigger]').should('not.have.attr', 'data-dirty');
			cy.get('[hlmselecttrigger]').should('not.have.attr', 'aria-invalid');
			cy.get('[hlmselecttrigger]').should('not.have.attr', 'data-matches-spartan-invalid');

			// on open
			cy.get('[hlmselecttrigger]').click();
			cy.get('[hlmselecttrigger]').should('not.have.attr', 'data-touched');
			cy.get('[hlmselecttrigger]').should('not.have.attr', 'data-dirty');
			cy.get('[hlmselecttrigger]').should('not.have.attr', 'aria-invalid');
			cy.get('[hlmselecttrigger]').should('not.have.attr', 'data-matches-spartan-invalid');
			cy.get('body').click();

			// no selection
			cy.get('[hlmselecttrigger]').should('have.attr', 'data-touched', 'true');
			cy.get('[hlmselecttrigger]').should('not.have.attr', 'data-dirty');
			cy.get('[hlmselecttrigger]').should('have.attr', 'aria-invalid', 'true');
			cy.get('[hlmselecttrigger]').should('have.attr', 'data-matches-spartan-invalid', 'true');

			cy.get('[hlmselecttrigger]').click();
			cy.get('hlm-select-item').first().click();
			cy.get('[hlmselecttrigger]').click();
			cy.get('hlm-select-item').last().click();
			cy.get('[hlmselecttrigger]').should('have.attr', 'data-touched', 'true');
			cy.get('[hlmselecttrigger]').should('have.attr', 'data-dirty', 'true');
			cy.get('[hlmselecttrigger]').should('not.have.attr', 'aria-invalid', 'true');
			cy.get('[hlmselecttrigger]').should('not.have.attr', 'data-matches-spartan-invalid', 'true');

			// on real selection
			cy.get('[hlmselecttrigger]').click();
			cy.get('hlm-select-item').eq(0).click();
			cy.get('[hlmselecttrigger]').should('have.attr', 'data-touched', 'true');
			cy.get('[hlmselecttrigger]').should('have.attr', 'data-dirty', 'true');
			cy.get('[hlmselecttrigger]').should('not.have.attr', 'aria-invalid');
			cy.get('[hlmselecttrigger]').should('not.have.attr', 'data-matches-spartan-invalid');
		});

		it('should have initial value set correctly when options are provided in a for loop', () => {
			cy.visit('/iframe.html?id=select--reactive-form-control-with-for-and-initial-value&args=initialValue:banana');

			// initial
			cy.get('[hlmselecttrigger]').should('not.have.attr', 'data-touched');
			cy.get('[hlmselecttrigger]').should('not.have.attr', 'data-dirty');
			cy.get('[hlmselecttrigger]').should('not.have.attr', 'aria-invalid');
			cy.get('[hlmselecttrigger]').should('not.have.attr', 'data-matches-spartan-invalid');

			// on open
			cy.get('[hlmselecttrigger]').click();
			cy.get('[hlmselecttrigger]').should('not.have.attr', 'data-touched');
			cy.get('[hlmselecttrigger]').should('not.have.attr', 'data-dirty');
			cy.get('[hlmselecttrigger]').should('not.have.attr', 'aria-invalid');
			cy.get('[hlmselecttrigger]').should('not.have.attr', 'data-matches-spartan-invalid');
			cy.get('[hlmselecttrigger]').click();

			// no selection
			cy.get('[hlmselecttrigger]').should('have.attr', 'data-touched', 'true');
			cy.get('[hlmselecttrigger]').should('not.have.attr', 'data-dirty');
			cy.get('[hlmselecttrigger]').should('not.have.attr', 'aria-invalid');
			cy.get('[hlmselecttrigger]').should('not.have.attr', 'data-matches-spartan-invalid');

			// on real selection
			cy.get('[hlmselecttrigger]').click();
			cy.get('hlm-select-item').eq(0).click();
			cy.get('[hlmselecttrigger]').should('have.attr', 'data-touched', 'true');
			cy.get('[hlmselecttrigger]').should('have.attr', 'data-dirty', 'true');
			cy.get('[hlmselecttrigger]').should('not.have.attr', 'aria-invalid');
			cy.get('[hlmselecttrigger]').should('not.have.attr', 'data-matches-spartan-invalid');
		});

		it('should have form validation classes and reflect control status with label', () => {
			cy.visit('/iframe.html?id=select--reactive-form-control-with-validation-with-label');

			// initial
			cy.get('[hlmselecttrigger]').should('not.have.attr', 'data-touched');
			cy.get('[hlmselecttrigger]').should('not.have.attr', 'data-dirty');
			cy.get('[hlmselecttrigger]').should('not.have.attr', 'aria-invalid');
			cy.get('[hlmselecttrigger]').should('not.have.attr', 'data-matches-spartan-invalid');

			// on open
			cy.get('[hlmselecttrigger]').click();
			cy.get('[hlmselecttrigger]').should('not.have.attr', 'data-touched');
			cy.get('[hlmselecttrigger]').should('not.have.attr', 'data-dirty');
			cy.get('[hlmselecttrigger]').should('not.have.attr', 'aria-invalid');
			cy.get('[hlmselecttrigger]').should('not.have.attr', 'data-matches-spartan-invalid');
			cy.get('[hlmselecttrigger]').click();

			// no selection
			cy.get('[hlmselecttrigger]').should('have.attr', 'data-touched', 'true');
			cy.get('[hlmselecttrigger]').should('not.have.attr', 'data-dirty');
			cy.get('[hlmselecttrigger]').should('have.attr', 'aria-invalid', 'true');
			cy.get('[hlmselecttrigger]').should('have.attr', 'data-matches-spartan-invalid', 'true');

			// on real selection
			cy.get('[hlmselecttrigger]').click();
			cy.get('hlm-select-item').eq(0).click();
			cy.get('[hlmselecttrigger]').should('have.attr', 'data-touched', 'true');
			cy.get('[hlmselecttrigger]').should('have.attr', 'data-dirty', 'true');
			cy.get('[hlmselecttrigger]').should('not.have.attr', 'aria-invalid');
			cy.get('[hlmselecttrigger]').should('not.have.attr', 'data-matches-spartan-invalid');
		});

		it('should have form validation classes and reflect control status when assigned with initial value', () => {
			cy.visit('/iframe.html?id=select--reactive-form-control-with-validation&args=value:apple');

			// initial
			cy.get('[hlmselecttrigger]').should('not.have.attr', 'data-touched');
			cy.get('[hlmselecttrigger]').should('not.have.attr', 'data-dirty');
			cy.get('[hlmselecttrigger]').should('not.have.attr', 'aria-invalid');
			cy.get('[hlmselecttrigger]').should('not.have.attr', 'data-matches-spartan-invalid');

			// on open
			cy.get('[hlmselecttrigger]').click();
			cy.get('[hlmselecttrigger]').should('not.have.attr', 'data-touched');
			cy.get('[hlmselecttrigger]').should('not.have.attr', 'data-dirty');
			cy.get('[hlmselecttrigger]').should('not.have.attr', 'aria-invalid');
			cy.get('[hlmselecttrigger]').should('not.have.attr', 'data-matches-spartan-invalid');
			cy.get('[hlmselecttrigger]').click();

			// no selection
			cy.get('[hlmselecttrigger]').should('have.attr', 'data-touched', 'true');
			cy.get('[hlmselecttrigger]').should('not.have.attr', 'data-dirty');
			cy.get('[hlmselecttrigger]').should('not.have.attr', 'aria-invalid');
			cy.get('[hlmselecttrigger]').should('not.have.attr', 'data-matches-spartan-invalid');

			// on real selection
			cy.get('[hlmselecttrigger]').click();
			cy.get('hlm-select-item').eq(0).click();
			cy.get('[hlmselecttrigger]').should('have.attr', 'data-touched', 'true');
			cy.get('[hlmselecttrigger]').should('have.attr', 'data-dirty', 'true');
			cy.get('[hlmselecttrigger]').should('not.have.attr', 'aria-invalid');
			cy.get('[hlmselecttrigger]').should('not.have.attr', 'data-matches-spartan-invalid');
		});

		it('should have form validation classes and reflect control status', () => {
			cy.visit('/iframe.html?id=select--reactive-form-control');

			// initial
			cy.get('[hlmselecttrigger]').should('not.have.attr', 'data-touched');
			cy.get('[hlmselecttrigger]').should('not.have.attr', 'data-dirty');
			cy.get('[hlmselecttrigger]').should('not.have.attr', 'aria-invalid');
			cy.get('[hlmselecttrigger]').should('not.have.attr', 'data-matches-spartan-invalid');

			// on open
			cy.get('[hlmselecttrigger]').click();
			cy.get('[hlmselecttrigger]').should('not.have.attr', 'data-touched');
			cy.get('[hlmselecttrigger]').should('not.have.attr', 'data-dirty');
			cy.get('[hlmselecttrigger]').should('not.have.attr', 'aria-invalid');
			cy.get('[hlmselecttrigger]').should('not.have.attr', 'data-matches-spartan-invalid');
			cy.get('[hlmselecttrigger]').click();

			// no selection
			cy.get('[hlmselecttrigger]').should('have.attr', 'data-touched', 'true');
			cy.get('[hlmselecttrigger]').should('not.have.attr', 'data-dirty');
			cy.get('[hlmselecttrigger]').should('not.have.attr', 'aria-invalid');
			cy.get('[hlmselecttrigger]').should('not.have.attr', 'data-matches-spartan-invalid');

			// on real selection
			cy.get('[hlmselecttrigger]').click();
			cy.get('hlm-select-item').eq(0).click();
			cy.get('[hlmselecttrigger]').should('have.attr', 'data-touched', 'true');
			cy.get('[hlmselecttrigger]').should('have.attr', 'data-dirty', 'true');
			cy.get('[hlmselecttrigger]').should('not.have.attr', 'aria-invalid');
			cy.get('[hlmselecttrigger]').should('not.have.attr', 'data-matches-spartan-invalid');
		});
	});

	describe('scrollable', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=select--scrollable');
			cy.injectAxe();
		});

		it('should be scrollable', () => {
			verifySelectSetup({ groups: true });
			cy.get('[hlmselecttrigger]').click();
			cy.get('hlm-select-content').should('exist');
			cy.get('hlm-select-scroll-up').should('have.attr', 'data-hidden', '');
			cy.get('hlm-select-scroll-down').should('exist');

			// Scroll a down from top
			cy.get('hlm-select-content').realMouseWheel({ deltaY: 500 });
			cy.get('hlm-select-scroll-up').should('exist');
			cy.get('hlm-select-scroll-down').should('exist');

			// Scroll to bottom
			cy.get('hlm-select-content').realMouseWheel({ deltaY: 2000 });
			cy.get('hlm-select-scroll-up').should('exist');
			cy.get('hlm-select-scroll-down').should('have.attr', 'data-hidden', '');

			// Scroll back up a bit
			cy.get('hlm-select-content').realMouseWheel({ deltaY: -500 });
			cy.get('hlm-select-scroll-up').should('exist');
			cy.get('hlm-select-scroll-down').should('exist');
		});
	});

	describe('falsy value', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=select--falsy-value');
			cy.injectAxe();
		});

		it('should select an option with a falsy value on enter keypress', () => {
			cy.get('[hlmselecttrigger]').click();

			cy.realPress('ArrowDown');
			cy.realPress('Enter');

			// the falsy value is committed and the panel closes
			cy.get('hlm-select-content').should('not.exist');
			cy.get('[hlmselecttrigger]').should('have.attr', 'aria-expanded', 'false');
			cy.get('[data-testid="value"]').should('contain.text', 'false');
		});
	});
});
