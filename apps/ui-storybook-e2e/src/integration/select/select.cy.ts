describe('select', () => {
	const verifySelectSetup = ({ multiple = false, disabled = false, groups = false } = {}) => {
		cy.get('hlm-select').find('label').should('not.be.visible');

		cy.get('[brnselecttrigger]').invoke('attr', 'id').then((idAttr) => {
			const triggerId = idAttr as string;
			const baseId = triggerId.replace('--trigger', '');
			const labelId = `${baseId}--label`;
			const listboxtId = `${baseId}--content`;

			cy.get('hlm-select').find('label').should('have.id', labelId);

			cy.get('[brnselecttrigger]').should('have.id', triggerId);
			cy.get('[brnselecttrigger]').should('have.attr', 'role', 'combobox');
			cy.get('[brnselecttrigger]').should('have.attr', 'aria-autocomplete', 'none');
			cy.get('[brnselecttrigger]').should('have.attr', 'aria-expanded', 'false');

			if (!disabled) {
				cy.get('[brnselecttrigger]').click();

				cy.get('hlm-select-content').should('have.id', listboxtId);

				cy.get('hlm-select-content').should('have.attr', 'role', 'listbox');
				cy.get('hlm-select-content').should('have.attr', 'aria-disabled', 'false');
				cy.get('hlm-select-content').should('have.attr', 'aria-multiselectable', `${multiple}`);
				cy.get('hlm-select-content').should('have.attr', 'aria-orientation', 'vertical');
				cy.get('hlm-select-content').should('have.attr', 'aria-labelledby', labelId);

				cy.get('hlm-option').should('have.attr', 'role', 'option');
				cy.get('hlm-option').should('have.attr', 'aria-selected', 'false');
				cy.get('hlm-option').should('have.attr', 'aria-disabled', 'false');

				if (groups) {
					cy.get('hlm-select-group').each(($group, index) => {
						cy.wrap($group).should('have.attr', 'role', 'group');
						cy.wrap($group)
							.find('hlm-select-label')
							.then(($el) => {
								cy.get('hlm-select-group').eq(index).should('have.attr', 'aria-labelledBy', $el.attr('id'));
							});
					});
				}

				cy.get('body').click();
				cy.get('[brnselecttrigger]').should('have.focus');
			}
		});
	};

	describe('default', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=select--default');
			cy.injectAxe();
		});

		it('click on trigger should open and close it content', () => {
			verifySelectSetup();
			cy.get('[brnselecttrigger]').click();
			cy.get('[brnselecttrigger]').should('have.attr', 'aria-expanded', 'true');
			cy.get('body').click();
			cy.get('[brnselecttrigger]').should('have.attr', 'aria-expanded', 'false');
		});

		it('should close after selecting an option in single mode', () => {
			verifySelectSetup();
			cy.get('[brnselecttrigger]').click();

			cy.get('hlm-option')
				.eq(0)
				.then(($el) => {
					const optionLabel = ($el.text() as string).trim();
					cy.get('hlm-option').eq(0).click();
					cy.get('hlm-select-content').should('not.exist');
					cy.get('[brnselecttrigger]').should('have.attr', 'aria-expanded', 'false');
					cy.get('[brnselecttrigger]').invoke('val').should('include', optionLabel);
				});
		});
	});

	describe('multiple', () => {
		beforeEach(() => {
			cy.injectAxe();
		});

		it('should stay open after selecting an option in multi mode', () => {
			cy.visit('/iframe.html?id=select--default&args=multiple:true');
			verifySelectSetup({ multiple: true });
			cy.get('[brnselecttrigger]').click();
			cy.get('hlm-select-content').should('exist');
			cy.get('hlm-option').eq(0).click();
			cy.get('hlm-select-content').should('exist');
			cy.get('hlm-option')
				.eq(0)
				.then(($el) => {
					const optionLabel = ($el.text() as string).trim();
					cy.get('hlm-option').eq(1).click();
					cy.get('hlm-option')
						.eq(1)
						.then(($el2) => {
							const optionLabel2 = ($el2.text() as string).trim();
							cy.get('[brnselecttrigger]').invoke('val').should('include', optionLabel);
							cy.get('[brnselecttrigger]').invoke('val').should('include', optionLabel2);

							cy.get('body').click();
							cy.get('hlm-select-content').should('not.exist');
							cy.get('[brnselecttrigger]').should('have.attr', 'aria-expanded', 'false');
						});
				});
		});

		it('should stay open after selecting an option in multi mode', () => {
			cy.visit('/iframe.html?id=select--default&args=multiple:true');
			verifySelectSetup({ multiple: true });
			cy.get('[brnselecttrigger]').click();
			cy.get('hlm-select-content').should('exist');
			cy.get('hlm-option').eq(0).click();
			cy.get('hlm-select-content').should('exist');
			cy.get('hlm-option')
				.eq(0)
				.then(($el) => {
					const optionLabel = ($el.text() as string).trim();
					cy.get('hlm-option').eq(1).click();
					cy.get('hlm-option')
						.eq(1)
						.then(($el2) => {
							const optionLabel2 = ($el2.text() as string).trim();
							cy.get('[brnselecttrigger]').invoke('val').should('include', optionLabel);
							cy.get('[brnselecttrigger]').invoke('val').should('include', optionLabel2);

							cy.get('body').click();
							cy.get('hlm-select-content').should('not.exist');
							cy.get('[brnselecttrigger]').should('have.attr', 'aria-expanded', 'false');
						});
				});
		});

		it('should toggle an item on keypress', () => {
			cy.visit('/iframe.html?id=select--default&args=multiple:true');
			verifySelectSetup({ multiple: true });
			cy.get('[brnselecttrigger]').click();

			// select the first item
			cy.get('hlm-option').eq(0).realType('{enter}');
			cy.get('hlm-option').eq(0).should('have.attr', 'aria-selected', 'true');

			cy.get('[brnselecttrigger]').invoke('val').should('match', /apple/i);

			// deselect the first item
			cy.get('hlm-option').eq(0).realType('{enter}');

			// check if the first item is deselected
			cy.get('hlm-option').eq(0).should('have.attr', 'aria-selected', 'false');

			cy.get('[brnselecttrigger]').invoke('val').should('not.match', /apple/i);
		});
	});

	describe('disabled', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=select--default&args=disabled:true');
			cy.injectAxe();
		});

		it('should not open if disabled', () => {
			verifySelectSetup({ disabled: true });
			cy.get('[brnselecttrigger]').should('be.disabled');
			cy.get('[brnselecttrigger]').click({ force: true });
			cy.get('hlm-select-content').should('not.exist');
		});
	});

	describe('disabled option', () => {
		it('should not be able to select a disabled option', () => {
			cy.visit('/iframe.html?id=select--disabled-option');
			cy.get('[brnselecttrigger]').click();
			cy.get('hlm-option').eq(0).should('not.have.attr', 'data-disabled');
			cy.get('[data-testid="banana-option"]').should('have.attr', 'aria-disabled', 'true');
			cy.get('[data-testid="banana-option"]').should('have.attr', 'data-disabled', '');
			cy.get('[data-testid="banana-option"]').click({ force: true });
			cy.get('pre').should('have.text', 'Form Control Value: ""');
			cy.get('hlm-option').eq(0).click();
			cy.get('pre').should('have.text', 'Form Control Value: "apple"');
		});
	});

	describe('Custom Value Transform function', () => {
		it('should be able to use a custom value transform function', () => {
			cy.visit('/iframe.html?id=select--select-value-transform-fn');
			cy.get('[brnselecttrigger]').click();
			cy.get('hlm-option').eq(0).click();
			cy.get('hlm-option').eq(2).click();
			cy.get('body').click();
			cy.get('[brnselecttrigger]').should('have.value', 'Apple, Blueberry');
		});
	});

	describe('form validation', () => {
		beforeEach(() => {
			cy.injectAxe();
		});

		it('should have form validation classes and reflect control status', () => {
			cy.visit('/iframe.html?id=select--reactive-form-control-with-validation');

			// initial
			cy.get('[brnselecttrigger]').should('have.class', 'ng-untouched');
			cy.get('[brnselecttrigger]').should('have.class', 'ng-pristine');
			cy.get('[brnselecttrigger]').should('have.class', 'ng-invalid');

			// on open
			cy.get('[brnselecttrigger]').click();
			cy.get('[brnselecttrigger]').should('have.class', 'ng-untouched');
			cy.get('[brnselecttrigger]').should('have.class', 'ng-pristine');
			cy.get('[brnselecttrigger]').should('have.class', 'ng-invalid');
			cy.get('body').click();

			// no selection
			cy.get('[brnselecttrigger]').should('have.class', 'ng-touched');
			cy.get('[brnselecttrigger]').should('have.class', 'ng-pristine');
			cy.get('[brnselecttrigger]').should('have.class', 'ng-invalid');

			// force error
			cy.get('[brnselecttrigger]').click();
			cy.get('hlm-option').first().click();
			cy.get('[brnselecttrigger]').click();
			cy.get('hlm-option').last().click();
			cy.get('[brnselecttrigger]').should('have.class', 'ng-touched');
			cy.get('[brnselecttrigger]').should('have.class', 'ng-dirty');
			cy.get('[brnselecttrigger]').should('have.class', 'ng-invalid');

			// on real selection
			cy.get('[brnselecttrigger]').click();
			cy.get('hlm-option').eq(0).click();
			cy.get('[brnselecttrigger]').should('have.class', 'ng-touched');
			cy.get('[brnselecttrigger]').should('have.class', 'ng-dirty');
			cy.get('[brnselecttrigger]').should('have.class', 'ng-valid');
		});

		it('should have initial value set correctly when options are provided in a for loop', () => {
			cy.visit('/iframe.html?id=select--reactive-form-control-with-for-and-initial-value&args=initialValue:banana');

			// initial
			cy.get('[brnselecttrigger]').should('have.class', 'ng-untouched');
			cy.get('[brnselecttrigger]').should('have.class', 'ng-pristine');
			cy.get('[brnselecttrigger]').should('have.class', 'ng-valid');

			// on open
			cy.get('[brnselecttrigger]').click();
			cy.get('[brnselecttrigger]').should('have.class', 'ng-untouched');
			cy.get('[brnselecttrigger]').should('have.class', 'ng-pristine');
			cy.get('[brnselecttrigger]').should('have.class', 'ng-valid');
			cy.get('body').click();

			// no selection
			cy.get('[brnselecttrigger]').should('have.class', 'ng-touched');
			cy.get('[brnselecttrigger]').should('have.class', 'ng-pristine');
			cy.get('[brnselecttrigger]').should('have.class', 'ng-valid');

			// on real selection
			cy.get('[brnselecttrigger]').click();
			cy.get('hlm-option').eq(0).click();
			cy.get('[brnselecttrigger]').should('have.class', 'ng-touched');
			cy.get('[brnselecttrigger]').should('have.class', 'ng-dirty');
			cy.get('[brnselecttrigger]').should('have.class', 'ng-valid');
		});

		it('should have form validation classes and reflect control status with label', () => {
			cy.visit('/iframe.html?id=select--reactive-form-control-with-validation-with-label');

			// initial
			cy.get('[brnselecttrigger]').should('have.class', 'ng-untouched');
			cy.get('[brnselecttrigger]').should('have.class', 'ng-pristine');
			cy.get('[brnselecttrigger]').should('have.class', 'ng-invalid');

			// on open
			cy.get('[brnselecttrigger]').click();
			cy.get('[brnselecttrigger]').should('have.class', 'ng-untouched');
			cy.get('[brnselecttrigger]').should('have.class', 'ng-pristine');
			cy.get('[brnselecttrigger]').should('have.class', 'ng-invalid');
			cy.get('body').click();

			// no selection
			cy.get('[brnselecttrigger]').should('have.class', 'ng-touched');
			cy.get('[brnselecttrigger]').should('have.class', 'ng-pristine');
			cy.get('[brnselecttrigger]').should('have.class', 'ng-invalid');

			// force error
			cy.get('[brnselecttrigger]').click();
			cy.get('hlm-option').first().click();
			cy.get('[brnselecttrigger]').click();
			cy.get('hlm-option').last().click();
			cy.get('[brnselecttrigger]').should('have.class', 'ng-touched');
			cy.get('[brnselecttrigger]').should('have.class', 'ng-dirty');
			cy.get('[brnselecttrigger]').should('have.class', 'ng-invalid');

			// on real selection
			cy.get('[brnselecttrigger]').click();
			cy.get('hlm-option').eq(0).click();
			cy.get('[brnselecttrigger]').should('have.class', 'ng-touched');
			cy.get('[brnselecttrigger]').should('have.class', 'ng-dirty');
			cy.get('[brnselecttrigger]').should('have.class', 'ng-valid');
		});

		it('should have form validation classes and reflect control status when assigned with initial value', () => {
			cy.visit('/iframe.html?id=select--reactive-form-control-with-validation&args=initialValue:apple');

			// initial
			cy.get('[brnselecttrigger]').should('have.class', 'ng-untouched');
			cy.get('[brnselecttrigger]').should('have.class', 'ng-pristine');
			cy.get('[brnselecttrigger]').should('have.class', 'ng-valid');

			// on open
			cy.get('[brnselecttrigger]').click();
			cy.get('[brnselecttrigger]').should('have.class', 'ng-untouched');
			cy.get('[brnselecttrigger]').should('have.class', 'ng-pristine');
			cy.get('[brnselecttrigger]').should('have.class', 'ng-valid');
			cy.get('body').click();

			// no selection
			cy.get('[brnselecttrigger]').should('have.class', 'ng-touched');
			cy.get('[brnselecttrigger]').should('have.class', 'ng-pristine');
			cy.get('[brnselecttrigger]').should('have.class', 'ng-valid');

			// force error
			cy.get('[brnselecttrigger]').click();
			cy.get('hlm-option').last().click();

			cy.get('[brnselecttrigger]').should('have.class', 'ng-touched');
			cy.get('[brnselecttrigger]').should('have.class', 'ng-dirty');
			cy.get('[brnselecttrigger]').should('have.class', 'ng-invalid');

			// on real selection
			cy.get('[brnselecttrigger]').click();
			cy.get('hlm-option').eq(0).click();
			cy.get('[brnselecttrigger]').should('have.class', 'ng-touched');
			cy.get('[brnselecttrigger]').should('have.class', 'ng-dirty');
			cy.get('[brnselecttrigger]').should('have.class', 'ng-valid');
		});

		it('should have form validation classes and reflect control status', () => {
			cy.visit('/iframe.html?id=select--reactive-form-control');

			// initial
			cy.get('[brnselecttrigger]').should('have.class', 'ng-untouched');
			cy.get('[brnselecttrigger]').should('have.class', 'ng-pristine');
			cy.get('[brnselecttrigger]').should('have.class', 'ng-valid');

			// on open
			cy.get('[brnselecttrigger]').click();
			cy.get('[brnselecttrigger]').should('have.class', 'ng-untouched');
			cy.get('[brnselecttrigger]').should('have.class', 'ng-pristine');
			cy.get('[brnselecttrigger]').should('have.class', 'ng-valid');
			cy.get('body').click();

			// no selection
			cy.get('[brnselecttrigger]').should('have.class', 'ng-touched');
			cy.get('[brnselecttrigger]').should('have.class', 'ng-pristine');
			cy.get('[brnselecttrigger]').should('have.class', 'ng-valid');

			// on real selection
			cy.get('[brnselecttrigger]').click();
			cy.get('hlm-option').eq(0).click();
			cy.get('[brnselecttrigger]').should('have.class', 'ng-touched');
			cy.get('[brnselecttrigger]').should('have.class', 'ng-dirty');
			cy.get('[brnselecttrigger]').should('have.class', 'ng-valid');
		});

		it('should allow to set an undefined value and show the associated option', () => {
			cy.visit('/iframe.html?id=select--with-label-and-form');

			// initial — no option explicitly selected yet, input is empty
			cy.get('[brnselecttrigger]').should('have.class', 'ng-untouched');
			cy.get('[brnselecttrigger]').should('have.class', 'ng-pristine');
			cy.get('[brnselecttrigger]').should('have.class', 'ng-invalid');
			cy.get('[brnselecttrigger]').should('have.value', '');

			// on open
			cy.get('[brnselecttrigger]').click();
			cy.get('[brnselecttrigger]').should('have.class', 'ng-untouched');
			cy.get('[brnselecttrigger]').should('have.class', 'ng-pristine');
			cy.get('[brnselecttrigger]').should('have.class', 'ng-invalid');
			cy.get('[brnselecttrigger]').should('have.value', '');
			cy.get('body').click();

			// no selection
			cy.get('[brnselecttrigger]').should('have.class', 'ng-touched');
			cy.get('[brnselecttrigger]').should('have.class', 'ng-pristine');
			cy.get('[brnselecttrigger]').should('have.class', 'ng-invalid');

			// on real selection
			cy.get('[brnselecttrigger]').click();
			cy.get('hlm-option').eq(1).click();
			cy.get('[brnselecttrigger]').should('have.class', 'ng-touched');
			cy.get('[brnselecttrigger]').should('have.class', 'ng-dirty');
			cy.get('[brnselecttrigger]').should('have.class', 'ng-valid');

			// on reset selection — selecting "No fruit" (value=undefined) shows the option label
			cy.get('[brnselecttrigger]').click();
			cy.get('hlm-option').eq(0).click();
			cy.get('[brnselecttrigger]').should('have.class', 'ng-touched');
			cy.get('[brnselecttrigger]').should('have.class', 'ng-dirty');
			cy.get('[brnselecttrigger]').should('have.class', 'ng-invalid');
			cy.get('[brnselecttrigger]').should('have.value', 'No fruit');
		});
	});

	describe('scrollable', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=select--scrollable');
			cy.injectAxe();
		});

		it('should be scrollable', () => {
			verifySelectSetup({ groups: true });
			cy.get('[brnselecttrigger]').click();
			cy.get('hlm-select-content').should('exist');
			cy.get('hlm-select-scroll-up').should('not.exist');
			cy.get('hlm-select-scroll-down').should('exist');

			// Scroll a down from top
			cy.get('hlm-select-content').realMouseWheel({ deltaY: 500 });
			cy.get('hlm-select-scroll-up').should('exist');
			cy.get('hlm-select-scroll-down').should('exist');

			// Scroll to bottom
			cy.get('hlm-select-content').realMouseWheel({ deltaY: 2000 });
			cy.get('hlm-select-scroll-up').should('exist');
			cy.get('hlm-select-scroll-down').should('not.exist');

			// Scroll back up a bit
			cy.get('hlm-select-content').realMouseWheel({ deltaY: -500 });
			cy.get('hlm-select-scroll-up').should('exist');
			cy.get('hlm-select-scroll-down').should('exist');
		});
	});

	describe('scrollable with sticky headers', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=select--scrollable-with-sticky-labels');
			cy.injectAxe();
		});

		it('should be scrollable with sticky headers', () => {
			verifySelectSetup({ groups: true });
			cy.get('[brnselecttrigger]').click();
			cy.get('hlm-select-content').should('exist');
			cy.get('hlm-select-scroll-up').should('not.exist');
			cy.get('hlm-select-scroll-down').should('exist');

			cy.get('hlm-select-label')
				.eq(0)
				.then(($el) => {
					const elementHeight = $el.height();

					// ensure we scrolled
					cy.get('hlm-select-content').realMouseWheel({ deltaY: elementHeight * 2 });
					cy.get('hlm-select-label').eq(0).should('be.visible');
					cy.get('hlm-select-label').eq(0).should('have.class', 'sticky');
				});
		});
	});
});
