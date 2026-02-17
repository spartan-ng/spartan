describe('item', () => {
	describe('Default', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=item--default');
			cy.injectAxe();
		});

		it('should render basic item correctly', () => {
			cy.get('[hlmItem]').first().should('exist');
			cy.get('[hlmItemTitle]').first().should('contain.text', 'Basic Item');
			cy.get('[hlmItemDescription]').first().should('contain.text', 'A simple item with title and description');
			cy.get('[hlmItemActions]').first().find('button').should('contain.text', 'Action');
		});

		it('should render link item correctly', () => {
			cy.get('a[hlmItem]').should('exist');
			cy.get('a[hlmItem]').find('ng-icon[name="lucideBadgeCheck"]').should('exist');
			cy.get('a[hlmItem]').find('[hlmItemTitle]').should('contain.text', 'Your profile has been verified');
		});

		it('should pass accessibility checks', () => {
			cy.get('[hlmItem]').should('exist');
			cy.checkA11y('[hlmItem]');
		});
	});

	describe('Avatar', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=item--avatar');
			cy.injectAxe();
		});

		it('should render items with avatars', () => {
			cy.get('[hlmItem]').should('have.length.at.least', 2);
			cy.get('[hlmItem]').first().find('hlm-avatar').should('exist');
			cy.get('[hlmItem]').first().find('[hlmItemTitle]').should('contain.text', 'Evil Rabbit');
		});

		it('should pass accessibility checks', () => {
			cy.get('[hlmItem]').should('exist');
			cy.checkA11y('[hlmItem]', {
				rules: {
					'color-contrast': { enabled: false },
				},
			});
		});
	});

	describe('Dropdown', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=item--dropdown');
			cy.injectAxe();
		});

		it('should open dropdown and show items', () => {
			cy.get('button[hlmBtn]').click();
			cy.get('hlm-dropdown-menu').should('exist');
			cy.get('[hlmDropdownMenuItem]').should('have.length', 3);
			cy.get('[hlmDropdownMenuItem]').first().find('[hlmItem]').should('exist');
		});

		it('should pass accessibility checks', () => {
			cy.get('button[hlmBtn]').should('exist');
			cy.checkA11y('button[hlmBtn]', {
				rules: {
					'color-contrast': { enabled: false },
				},
			});
			cy.get('button[hlmBtn]').click();
			cy.get('hlm-dropdown-menu').should('exist');
			cy.checkA11y('hlm-dropdown-menu', {
				rules: {
					'color-contrast': { enabled: false },
				},
			});
		});
	});

	describe('Group', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=item--group');
			cy.injectAxe();
		});

		it('should render item group', () => {
			cy.get('[hlmItemGroup]').should('exist');
			cy.get('[hlmItem]').should('have.length', 3);
		});

		it('should pass accessibility checks', () => {
			cy.get('[hlmItemGroup]').should('exist');
			cy.checkA11y('[hlmItemGroup]');
		});
	});

	describe('Header', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=item--header');
			cy.injectAxe();
		});

		it('should render items with headers', () => {
			cy.get('[hlmItem]').should('have.length', 3);
			cy.get('[hlmItemHeader]').should('exist');
			cy.get('[hlmItemHeader] img').should('exist');
		});

		it('should pass accessibility checks', () => {
			cy.get('[hlmItemGroup]').should('exist');
			cy.checkA11y('[hlmItemGroup]');
		});
	});

	describe('Icon', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=item--icon');
			cy.injectAxe();
		});

		it('should render item with icon media', () => {
			cy.get('[hlmItem]').should('exist');
			cy.get('[hlmItemMedia][variant="icon"]').should('exist');
		});

		it('should pass accessibility checks', () => {
			cy.get('[hlmItem]').should('exist');
			cy.checkA11y('[hlmItem]');
		});
	});

	describe('Image', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=item--image');
			cy.injectAxe();
		});

		it('should render items with image media', () => {
			cy.get('[hlmItem]').should('have.length', 3);
			cy.get('[hlmItemMedia][variant="image"]').should('exist');
		});
	});

	describe('Link', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=item--link');
			cy.injectAxe();
		});

		it('should render link items', () => {
			cy.get('a[hlmItem]').should('have.length', 2);
		});

		it('should pass accessibility checks', () => {
			cy.get('a[hlmItem]').should('exist');
			cy.checkA11y('a[hlmItem]');
		});
	});

	describe('Size', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=item--size');
			cy.injectAxe();
		});

		it('should render items', () => {
			cy.get('[hlmItem]').should('have.length', 2);
		});

		it('should pass accessibility checks', () => {
			cy.get('[hlmItem]').should('exist');
			cy.checkA11y('[hlmItem]');
		});
	});

	describe('Variants', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=item--variants');
			cy.injectAxe();
		});

		it('should render different variants', () => {
			cy.get('[hlmItem]').should('have.length', 3);
			cy.get('[hlmItem]:not([variant])').should('exist');
			cy.get('[hlmItem][variant="outline"]').should('exist');
			cy.get('[hlmItem][variant="muted"]').should('exist');
		});

		it('should pass accessibility checks', () => {
			cy.get('[hlmItem]').should('exist');
			cy.checkA11y('[hlmItem]');
		});
	});
});
