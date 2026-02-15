describe('autocomplete', () => {
	describe('Default', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=autocomplete--default');
			cy.injectAxe();
		});

		it('should render autocomplete input', () => {
			cy.get('hlm-autocomplete').should('exist');
			cy.get('input[hlmInputGroupInput]').should('exist');
		});

		it('should show options when typing', () => {
			cy.get('input[hlmInputGroupInput]').type('Mar');
			cy.get('[hlmAutocompleteList]').should('exist');
			cy.get('hlm-autocomplete-item').should('have.length.gt', 0);
			cy.get('hlm-autocomplete-item').first().should('contain.text', 'Marty McFly');
		});

		it('should select an option', () => {
			cy.get('input[hlmInputGroupInput]').type('Mar');
			cy.get('hlm-autocomplete-item').first().click();
			cy.get('input[hlmInputGroupInput]').should('have.value', 'Marty McFly');
		});

		it('should close popup when tabbing out', () => {
			cy.get('input[hlmInputGroupInput]').type('Mar');
			cy.get('hlm-autocomplete-content').should('exist');
			cy.get('input[hlmInputGroupInput]').realPress('Tab');
			cy.get('hlm-autocomplete-content').should('not.exist');
		});

		it('should select highlighted option on tab out', () => {
			cy.get('input[hlmInputGroupInput]').type('Mar');
			cy.get('hlm-autocomplete-item').should('have.length.gt', 1);
			cy.get('input[hlmInputGroupInput]').realPress('ArrowDown');
			cy.get('input[hlmInputGroupInput]').realPress('Tab');
			cy.get('hlm-autocomplete-content').should('not.exist');
			cy.get('input[hlmInputGroupInput]').should('have.value', 'Marty McFly');
		});

		it('should pass accessibility checks', () => {
			cy.checkA11y(undefined, {
				rules: {
					'page-has-heading-one': { enabled: false },
					'landmark-one-main': { enabled: false },
				},
			});
		});
	});

	describe('Form', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=autocomplete--form');
			cy.injectAxe();
		});

		it('should work within a form', () => {
			cy.get('form').should('exist');
			cy.get('input[hlmInputGroupInput]').clear();
			cy.get('input[hlmInputGroupInput]').type('Doc');
			cy.get('hlm-autocomplete-item').contains('Doc Brown').click();
			cy.get('input[hlmInputGroupInput]').should('have.value', 'Doc Brown');
		});
	});

	describe('Async', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=autocomplete--async');
			cy.injectAxe();
		});

		it('should show loading state', () => {
			cy.get('input[hlmInputGroupInput]').type('test');
			cy.get('hlm-autocomplete-item').should('have.length.gt', 0);
		});
	});
});
