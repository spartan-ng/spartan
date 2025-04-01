describe('Slider', () => {
	beforeEach(() => {
		cy.visit('/iframe.html?id=slider--default');
	});

	it('should render the slider with the correct initial value', () => {
		cy.get('hlm-slider').find('[role="slider"]').should('have.attr', 'aria-valuenow', '0');
	});

	it('should allow dragging to change the value', () => {
		cy.get('[role="slider"]').then(($thumb) => {
			const initialPosition = $thumb.position().left;

			cy.wrap($thumb).trigger('mousedown', { which: 1 });
			cy.get('body').trigger('mousemove', { clientX: initialPosition + 50 });
			cy.get('body').trigger('mouseup');

			cy.get('[role="slider"]').invoke('attr', 'aria-valuenow').should('not.equal', '9');
		});
	});

	it('should support keyboard interactions', () => {
		cy.get('[role="slider"]').focus();

		cy.get('[role="slider"]').type('{rightarrow}');

		cy.get('[role="slider"]')
			.invoke('attr', 'aria-valuenow')
			.then((newValue) => {
				expect(Number(newValue)).to.be.equal(1);
			});

		// press left arrow key
		cy.get('[role="slider"]').type('{leftarrow}');
		cy.get('[role="slider"]')
			.invoke('attr', 'aria-valuenow')
			.then((newValue) => {
				expect(Number(newValue)).to.be.equal(0);
			});

		// press shift + right arrow key
		cy.get('[role="slider"]').type('{shift}{rightarrow}');
		cy.get('[role="slider"]')
			.invoke('attr', 'aria-valuenow')
			.then((newValue) => {
				expect(Number(newValue)).to.be.equal(10);
			});
		// press shift + left arrow key
		cy.get('[role="slider"]').type('{shift}{leftarrow}');
		cy.get('[role="slider"]')
			.invoke('attr', 'aria-valuenow')
			.then((newValue) => {
				expect(Number(newValue)).to.be.equal(0);
			});

		// press end key
		cy.get('[role="slider"]').type('{end}');
		cy.get('[role="slider"]')
			.invoke('attr', 'aria-valuenow')
			.then((newValue) => {
				expect(Number(newValue)).to.be.equal(100);
			});

		// press home key
		cy.get('[role="slider"]').type('{home}');
		cy.get('[role="slider"]')
			.invoke('attr', 'aria-valuenow')
			.then((newValue) => {
				expect(Number(newValue)).to.be.equal(0);
			});
	});

	it('should not exceed min and max values', () => {
		cy.get('[role="slider"]').focus();
		cy.get('[role="slider"]').type('{leftarrow}{leftarrow}{leftarrow}');

		cy.get('[role="slider"]')
			.invoke('attr', 'aria-valuenow')
			.then((value) => {
				expect(Number(value)).to.be.at.least(0);
			});

		cy.get('[role="slider"]').focus();
		cy.get('[role="slider"]').type('{rightarrow}'.repeat(150));

		cy.get('[role="slider"]')
			.invoke('attr', 'aria-valuenow')
			.then((value) => {
				expect(Number(value)).to.be.at.most(100);
			});
	});
});
