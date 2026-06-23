// data-side is derived from the transform-origin CDK sets on the content (no _spartanLastPosition hack).
// Default story: the root menu opens below (=> "bottom") and the "Invite Users" submenu opens right (=> "right").
describe('dropdown-menu data-side', () => {
	it('derives data-side for the root menu and submenu from the resolved position', () => {
		cy.visit('/iframe.html?id=dropdown-menu--default');
		cy.viewport(1000, 1000);

		cy.findByText(/open/i).realClick();
		cy.get('[data-slot="dropdown-menu"]').should('have.attr', 'data-side', 'bottom');

		cy.findByText(/invite users/i).realHover();
		cy.get('[data-slot="dropdown-menu-sub"]').should('have.attr', 'data-side', 'right');
	});
});
