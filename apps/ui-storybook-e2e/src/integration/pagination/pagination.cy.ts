describe('Numbered Pagination', () => {
	const visibleItems = 'hlm-numbered-pagination nav li:visible';

	describe('on mobile', () => {
		beforeEach(() => {
			cy.viewport(320, 640);
			cy.visit('/iframe.html?id=pagination--numbered');
		});

		it('should show fewer page links so the controls fit the screen', () => {
			// previous, 1, ..., 5, ..., 10, next
			cy.get(visibleItems).should('have.length', 7);
			cy.document().then((doc) => {
				expect(doc.documentElement.scrollWidth).to.be.at.most(320);
			});
		});

		it('should place the page links above the page size select', () => {
			cy.get('hlm-numbered-pagination nav').then(($nav) => {
				cy.get('hlm-numbered-pagination hlm-select').then(($select) => {
					expect($nav[0].getBoundingClientRect().bottom).to.be.at.most($select[0].getBoundingClientRect().top);
				});
			});
		});
	});

	describe('on desktop', () => {
		beforeEach(() => {
			cy.viewport(1024, 768);
			cy.visit('/iframe.html?id=pagination--numbered');
		});

		it('should show maxSize page links in a single row', () => {
			// previous, 1, ..., 4, 5, 6, ..., 10, next
			cy.get(visibleItems).should('have.length', 9);
			cy.get('hlm-numbered-pagination nav').then(($nav) => {
				cy.get('hlm-numbered-pagination hlm-select').then(($select) => {
					expect($nav[0].getBoundingClientRect().top).to.be.lessThan($select[0].getBoundingClientRect().bottom);
					expect($select[0].getBoundingClientRect().top).to.be.lessThan($nav[0].getBoundingClientRect().bottom);
				});
			});
		});
	});
});
