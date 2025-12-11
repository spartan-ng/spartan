describe('Breadcrumb Directive', () => {
	beforeEach(() => {
		cy.visit('/iframe.html?id=breadcrumb--default');
	});

	it('should render the breadcrumb directive', () => {
		cy.get('[hlmBreadcrumb]').should('exist');
	});

	it('should contain the correct breadcrumb items', () => {
		cy.get('[hlmBreadcrumb] ol li').should('have.length', 7);
		cy.get('[hlmBreadcrumb] ol li').eq(0).contains('Home');
		cy.get('[hlmBreadcrumb] ol li').eq(4).contains('Components');
		cy.get('[hlmBreadcrumb] ol li').eq(6).contains('Breadcrumb');
	});

	it('should contain breadcrumb separators', () => {
		cy.get('[hlmBreadcrumbSeparator]').should('have.length', 3);
	});

	it('should contain breadcrumb ellipsis', () => {
		cy.get('hlm-breadcrumb-ellipsis').should('exist');
	});
});
