describe('label', () => {
	describe('default', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=carousel--default');
			cy.injectAxe();
		});

		it('should have correct aria attributes on the root element', () => {
			cy.get('hlm-carousel').as('carousel');
			cy.get('@carousel').should('have.attr', 'role', 'region');
			cy.get('@carousel').should('have.attr', 'aria-roledescription', 'carousel');
		});

		it('should have correct aria attributes on the item elements', () => {
			cy.get('hlm-carousel-item').as('carouselItem');
			cy.get('@carouselItem').should('have.attr', 'role', 'group');
			cy.get('@carouselItem').should('have.attr', 'aria-roledescription', 'slide');
		});
	});
});
