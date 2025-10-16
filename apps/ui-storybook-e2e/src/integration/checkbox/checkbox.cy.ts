describe('checkbox', () => {
	const verifyCheckboxSetup = (id: string) => {
		cy.checkA11y('#storybook-root', {
			rules: {
				'page-has-heading-one': { enabled: false },
				'landmark-one-main': { enabled: false },
			},
		});
		cy.findByRole('checkbox').should('exist').should('have.attr', 'type', 'button').should('have.id', id);
	};
	const verifyCheckboxOff = () => {
		cy.findByLabelText(/test checkbox/i).should('have.attr', 'aria-checked', 'false');
		cy.get('brn-checkbox').should('have.attr', 'data-state', 'unchecked');
		cy.findByRole('checkbox').should('have.attr', 'aria-checked', 'false');
	};
	const verifyCheckboxOn = () => {
		cy.findByLabelText(/test checkbox/i).should('have.attr', 'aria-checked', 'true');
		cy.get('brn-checkbox').should('have.attr', 'data-state', 'checked');
		cy.findByRole('checkbox').should('have.attr', 'aria-checked', 'true');
	};

	const verifyIndeterminateAttr = () => {
		cy.get('brn-checkbox').should('have.attr', 'data-state', 'indeterminate');
		cy.findByRole('checkbox').should('have.attr', 'aria-checked', 'mixed');
	};

	const executeTabEnterTests = (id: string) => {
		verifyCheckboxSetup(id);
		verifyCheckboxOff();

		cy.realPress('Tab');
		cy.realPress('Enter');
		verifyCheckboxOn();

		cy.realPress('Enter');
		verifyCheckboxOff();
	};
	const executeTabSpaceTests = (id: string) => {
		verifyCheckboxSetup(id);
		verifyCheckboxOff();

		cy.realPress('Tab');
		cy.realPress('Space');
		verifyCheckboxOn();

		cy.realPress('Space');
		verifyCheckboxOff();
	};
	const executeClickOnLabelTests = (id: string) => {
		verifyCheckboxSetup(id);
		verifyCheckboxOff();

		cy.findByText(/test checkbox/i).click();
		verifyCheckboxOn();

		cy.findByText(/test checkbox/i).click();
		verifyCheckboxOff();
	};

	describe('default', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=checkbox--default');
			cy.injectAxe();
		});

		it('click interactions should render as unchecked, become checked on label click, become unchecked on checkbox click', () => {
			verifyCheckboxSetup('testCheckbox');
			verifyCheckboxOff();

			cy.findByLabelText(/test checkbox/i).click();
			verifyCheckboxOn();

			cy.get('brn-checkbox').find('button').click();
			verifyCheckboxOff();
		});

		it('[Tab][Enter] interactions should render as unchecked, become checked when pressing enter, become unchecked when pressing enter again', () =>
			executeTabEnterTests('testCheckbox'));

		it('[Tab][Space] interactions should render as unchecked, become checked when pressing space, become unchecked when pressing enter space', () =>
			executeTabSpaceTests('testCheckbox'));
	});

	describe('inside label', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=checkbox--inside-label');
			cy.injectAxe();
		});

		it('click interactions should render as unchecked, become checked on label click, become unchecked on checkbox click', () =>
			executeClickOnLabelTests('testCheckbox'));

		it('[Tab][Enter] interactions should render as unchecked, become checked when pressing enter, become unchecked when pressing enter again', () =>
			// this is the same as label does not change keyboard interaction
			executeTabEnterTests('testCheckbox'));

		it('[Tab][Space] interactions should render as unchecked, become checked when pressing space, become unchecked when pressing enter space', () =>
			// this is the same as label does not change keyboard interaction
			executeTabSpaceTests('testCheckbox'));
	});

	describe('labeled with aria-labelledby', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=checkbox--labeled-with-aria-labeled-by');
			cy.injectAxe();
		});

		it('click interactions should render as unchecked, become checked on label click, become unchecked on checkbox click', () =>
			executeClickOnLabelTests('testCheckboxAria'));

		it('[Tab][Enter] interactions should render as unchecked, become checked when pressing enter, become unchecked when pressing enter again', () =>
			// this is the same as label does not change keyboard interaction
			executeTabEnterTests('testCheckboxAria'));

		it('[Tab][Space] interactions should render as unchecked, become checked when pressing space, become unchecked when pressing enter space', () =>
			// this is the same as label does not change keyboard interaction
			executeTabSpaceTests('testCheckboxAria'));
	});

	describe('indeterminate', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=checkbox--indeterminate');
			cy.injectAxe();
		});

		it('click interactions should render as indeterminate, become checked on label click, become unchecked on checkbox click', () => {
			// click to get to the default state of unchecked
			verifyCheckboxSetup('testCheckboxIndeterminate');
			verifyIndeterminateAttr();

			cy.findByText(/test checkbox/i).click();
			verifyCheckboxOn();

			cy.findByText(/test checkbox/i).click();
			verifyCheckboxOff();
		});

		it('[Tab][Enter] interactions should render as indeterminate, become checked when pressing enter, become unchecked when pressing enter again', () => {
			// this is the same as label does not change keyboard interaction
			// click to get to the default state of unchecked
			verifyCheckboxSetup('testCheckboxIndeterminate');
			verifyIndeterminateAttr();

			cy.realPress('Tab');
			cy.realPress('Enter');
			verifyCheckboxOn();

			cy.realPress('Enter');
			verifyCheckboxOff();
		});

		it('[Tab][Space] interactions should render as indeterminate, become checked when pressing space, become unchecked when pressing enter space', () => {
			// click to get to the default state of unchecked
			verifyCheckboxSetup('testCheckboxIndeterminate');
			verifyIndeterminateAttr();

			cy.realPress('Tab');
			cy.realPress('Space');
			verifyCheckboxOn();

			cy.realPress('Space');
			verifyCheckboxOff();
		});
	});
});
