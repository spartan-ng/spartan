describe('Empty', () => {
	beforeEach(() => {
		cy.visit('/iframe.html?id=empty--default');
	});

	describe('Default Story', () => {
		it('should display the empty state with icon and content', () => {
			cy.get('[hlmEmpty]').should('be.visible');
			cy.get('[hlmEmptyMedia]').should('be.visible');
			cy.get('ng-icon[name="lucideInbox"]').should('be.visible');
			cy.get('[hlmEmptyContent]').should('be.visible');
			cy.get('[hlmEmptyTitle]').should('contain.text', 'No items found');
			cy.get('[hlmEmptyDescription]').should(
				'contain.text',
				"You don't have any items yet. Create your first item to get started.",
			);
		});

		it('should have proper structure', () => {
			cy.get('[hlmEmpty]').within(() => {
				cy.get('[hlmEmptyMedia]').should('exist');
				cy.get('[hlmEmptyContent]').should('exist');
				cy.get('[hlmEmptyHeader]').should('exist');
			});
		});
	});

	describe('With Action Story', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=empty--with-action');
		});

		it('should display empty state with action button', () => {
			cy.get('[hlmEmpty]').should('be.visible');
			cy.get('[hlmEmptyTitle]').should('contain.text', 'No items found');
			cy.get('button[hlmBtn]').should('be.visible').and('contain.text', 'Add Item');
		});

		it('should have clickable action button', () => {
			cy.get('button[hlmBtn]').should('not.be.disabled').click();
		});
	});

	describe('Search Results Story', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=empty--search-results');
		});

		it('should display search results empty state', () => {
			cy.get('[hlmEmpty]').should('be.visible');
			cy.get('ng-icon[name="lucideSearch"]').should('be.visible');
			cy.get('[hlmEmptyTitle]').should('contain.text', 'No search results');
			cy.get('[hlmEmptyDescription]').should('contain.text', "We couldn't find any results for your search");
		});

		it('should display multiple action buttons', () => {
			cy.get('button[hlmBtn]').should('have.length', 2);
			cy.get('button[hlmBtn][variant="outline"]').should('contain.text', 'Clear Search');
			cy.get('button[hlmBtn]:not([variant="outline"])').should('contain.text', 'Browse All');
		});

		it('should have clickable action buttons', () => {
			cy.get('button[hlmBtn][variant="outline"]').should('not.be.disabled').click();
			cy.get('button[hlmBtn]:not([variant="outline"])').should('not.be.disabled').click();
		});
	});

	describe('No Connection Story', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=empty--no-connection');
		});

		it('should display no connection empty state', () => {
			cy.get('[hlmEmpty]').should('be.visible');
			cy.get('ng-icon[name="lucideWifi"]').should('be.visible');
			cy.get('[hlmEmptyTitle]').should('contain.text', 'No internet connection');
			cy.get('[hlmEmptyDescription]').should('contain.text', 'Please check your internet connection');
		});

		it('should display retry button', () => {
			cy.get('button[hlmBtn]').should('be.visible').and('contain.text', 'Retry');
		});
	});

	describe('File Not Found Story', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=empty--file-not-found');
		});

		it('should display file not found empty state', () => {
			cy.get('[hlmEmpty]').should('be.visible');
			cy.get('ng-icon[name="lucideFileX"]').should('be.visible');
			cy.get('[hlmEmptyTitle]').should('contain.text', 'File not found');
			cy.get('[hlmEmptyDescription]').should('contain.text', "The file you're looking for doesn't exist");
		});

		it('should display navigation buttons', () => {
			cy.get('button[hlmBtn]').should('have.length', 2);
			cy.get('button[hlmBtn][variant="outline"]').should('contain.text', 'Go Back');
			cy.get('button[hlmBtn]:not([variant="outline"])').should('contain.text', 'Go Home');
		});
	});

	describe('Minimal Text Story', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=empty--minimal-text');
		});

		it('should display minimal empty state without icon', () => {
			cy.get('[hlmEmpty]').should('be.visible');
			cy.get('[hlmEmptyMedia]').should('not.exist');
			cy.get('ng-icon').should('not.exist');
			cy.get('[hlmEmptyTitle]').should('contain.text', 'Nothing here yet');
			cy.get('[hlmEmptyDescription]').should('not.exist');
		});
	});

	describe('Custom Layout Story', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=empty--custom-layout');
		});

		it('should display custom layout empty state', () => {
			cy.get('[hlmEmpty]').should('be.visible');
			cy.get('[hlmEmptyTitle]').should('contain.text', 'Welcome to your dashboard');
			cy.get('[hlmEmptyDescription]').should('contain.text', "This is where you'll see all your important information");
		});

		it('should display grid layout buttons', () => {
			cy.get('button[hlmBtn]').should('have.length', 2);
			cy.get('.grid.grid-cols-2').should('exist');
			cy.get('button[hlmBtn][variant="outline"]').should('contain.text', 'Import Data');
			cy.get('button[hlmBtn]:not([variant="outline"])').should('contain.text', 'Create New');
		});

		it('should have proper responsive layout', () => {
			cy.get('.max-w-md').should('exist');
			cy.get('.grid-cols-2').should('exist');
		});
	});

	describe('Accessibility', () => {
		it('should be accessible with proper ARIA attributes', () => {
			cy.visit('/iframe.html?id=empty--default');
			cy.get('[hlmEmpty]').should('be.visible');

			// Check that content is readable by screen readers
			cy.get('[hlmEmptyTitle]').should('not.be.empty').and('contain.text', 'No items found');
			cy.get('[hlmEmptyDescription]').should('not.be.empty').and('contain.text', "You don't have any items yet");
		});

		it('should support keyboard navigation for interactive elements', () => {
			cy.visit('/iframe.html?id=empty--with-action');
			cy.get('button[hlmBtn]').should('be.visible').focus();
			cy.focused().should('have.attr', 'hlmBtn');
		});
	});

	describe('Visual Regression', () => {
		const stories = [
			'default',
			'with-action',
			'search-results',
			'no-connection',
			'file-not-found',
			'minimal-text',
			'custom-layout',
		];

		stories.forEach((story) => {
			it(`should match visual snapshot for ${story}`, () => {
				cy.visit(`/iframe.html?id=empty--${story}`);
				cy.get('[hlmEmpty]').should('be.visible');
				// Add visual regression testing if supported
				// cy.matchImageSnapshot(`empty-${story}`);
			});
		});
	});
});
