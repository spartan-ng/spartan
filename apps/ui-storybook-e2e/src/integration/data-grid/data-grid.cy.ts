describe('data-grid--rest', () => {
	describe('rest', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=data-grid--rest');
			cy.get('data-grid-rest-story').should('exist');
		});

		it('renders rows with aria-busy and aria-live regions', () => {
			cy.get('data-grid-rest-story').within(() => {
				cy.contains('42 row(s)').should('exist');
				cy.get('table').should('have.attr', 'aria-busy');
				cy.get('[aria-live="polite"]').should('exist');
			});
		});

		it('paginates to page 2 and shows the next rows', () => {
			cy.get('data-grid-rest-story').within(() => {
				cy.get('tbody tr')
					.first()
					.invoke('text')
					.then((firstPage) => {
						cy.findByRole('button', { name: /^next$/i }).click();
						cy.get('tbody tr')
							.first()
							.invoke('text')
							.should((secondPage) => {
								expect(secondPage).not.to.equal(firstPage);
							});
						cy.contains('GET /api/users?').should('contain', 'page=2');
					});
			});
		});

		it('toggles email sort and reorders rows', () => {
			cy.get('data-grid-rest-story').within(() => {
				cy.findByRole('button', { name: /sort by email/i }).click();
				cy.contains('GET /api/users?').should('contain', 'sortBy=email');
				cy.get('tbody tr')
					.first()
					.invoke('text')
					.then((ascending) => {
						cy.findByRole('button', { name: /sort by email/i }).click();
						cy.contains('GET /api/users?').should('contain', 'sortDir=desc');
						cy.get('tbody tr')
							.first()
							.invoke('text')
							.should((descending) => {
								expect(descending).not.to.equal(ascending);
							});
					});
			});
		});

		it('sends the filter query when typing', () => {
			cy.get('data-grid-rest-story').within(() => {
				cy.findByPlaceholderText(/filter emails/i).type('ada');
				cy.contains('GET /api/users?').should('contain', 'filter');
			});
		});
	});
});

describe('data-grid--loading', () => {
	it('announces busy state while rows never resolve', () => {
		cy.visit('/iframe.html?id=data-grid--loading');
		cy.get('data-grid-loading-story').should('exist');
		cy.get('data-grid-loading-story').within(() => {
			cy.get('table').should('have.attr', 'aria-busy', 'true');
			cy.get('tbody tr td div.shimmer').should('contain', 'Loading');
			cy.get('[aria-live="polite"]').should('contain', 'Loading');
		});
	});
});
