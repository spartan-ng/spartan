const a11yRules = {
	rules: {
		'page-has-heading-one': { enabled: false },
		'landmark-one-main': { enabled: false },
	},
};

/** Drags the element matching `selector` with the mouse by `deltaY`, slowly enough not to count as a flick. */
function drag(selector: string, deltaY: number) {
	cy.get(selector).then(($el) => {
		const rect = $el[0].getBoundingClientRect();
		const x = rect.left + rect.width / 2;
		const startY = rect.top + rect.height / 2;
		const steps = 10;
		const pointer = { pointerId: 1, pointerType: 'mouse', isPrimary: true, button: 0, force: true };

		cy.get(selector).trigger('pointerdown', { ...pointer, buttons: 1, clientX: x, clientY: startY });
		for (let step = 1; step <= steps; step++) {
			cy.get(selector).trigger('pointermove', {
				...pointer,
				buttons: 1,
				clientX: x,
				clientY: startY + (deltaY * step) / steps,
			});
			// The swipe reads its speed from event timestamps, so the moves need real time between them.
			// eslint-disable-next-line cypress/no-unnecessary-waiting
			cy.wait(20);
		}
		// Rest before releasing, so only the distance counts and not the release velocity.
		// eslint-disable-next-line cypress/no-unnecessary-waiting
		cy.wait(200);
		cy.get(selector).trigger('pointerup', { ...pointer, buttons: 0, clientX: x, clientY: startY + deltaY });
	});
}

describe('drawer', () => {
	describe('default', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=drawer--default');
			cy.injectAxe();
		});

		it('click on trigger should open, click on close should close, click outside should close', () => {
			cy.checkA11y('#storybook-root', a11yRules);

			cy.findByText(/open drawer/i).should('have.attr', 'aria-haspopup', 'dialog');
			cy.findByText(/open drawer/i).should('have.attr', 'aria-expanded', 'false');
			cy.findByText(/open drawer/i).click();

			cy.findByText(/open drawer/i).should('have.attr', 'aria-expanded', 'true');
			cy.findByRole('dialog').should('have.attr', 'aria-modal', 'true');
			cy.get('[data-slot="drawer-popup"]').should('have.focus').and('have.attr', 'data-state', 'open');
			cy.checkA11y('[data-slot="drawer-popup"]', a11yRules);

			cy.findByText(/cancel/i).click();
			cy.findByRole('dialog').should('not.exist');
			cy.findByText(/open drawer/i).should('have.focus');

			cy.findByText(/open drawer/i).click();
			cy.get('.cdk-overlay-backdrop').click({ force: true });
			cy.findByRole('dialog').should('not.exist');
			cy.findByText(/open drawer/i).should('have.focus');
		});

		it('enter on trigger should open, escape should close', () => {
			cy.findByText(/open drawer/i).focus();
			cy.realPress('Enter');
			cy.findByRole('dialog').should('exist');

			cy.realPress('Escape');
			cy.findByRole('dialog').should('not.exist');
			cy.findByText(/open drawer/i).should('have.focus');
		});

		it('dragging the swipe handle down past the threshold should close', () => {
			cy.findByText(/open drawer/i).click();
			cy.get('[data-slot="drawer-popup"]').should('have.attr', 'data-state', 'open');

			drag('hlm-drawer-swipe-handle', 300);
			cy.findByRole('dialog').should('not.exist');
		});

		it('a short drag on the swipe handle should snap back open', () => {
			cy.findByText(/open drawer/i).click();
			cy.get('[data-slot="drawer-popup"]').should('have.attr', 'data-state', 'open');

			drag('hlm-drawer-swipe-handle', 20);
			cy.get('[data-slot="drawer-popup"]').should('have.attr', 'data-state', 'open');
			cy.get('[data-slot="drawer-popup"]').should('not.have.attr', 'data-swiping');
		});
	});

	describe('nested', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=drawer--nested');
		});

		it('should keep the parent open behind a nested drawer and return to it on close', () => {
			cy.findByText(/^open drawer$/i).click();
			cy.findByText(/open nested drawer/i).click();

			cy.findAllByRole('dialog').should('have.length', 2);
			cy.get('[data-slot="drawer-popup"]').first().should('have.attr', 'data-nested-drawer-open');

			cy.findByText(/close nested/i).click();
			cy.findAllByRole('dialog').should('have.length', 1);
			cy.get('[data-slot="drawer-popup"]').should('not.have.attr', 'data-nested-drawer-open');
			cy.findByText(/open nested drawer/i).should('have.focus');

			cy.realPress('Escape');
			cy.findAllByRole('dialog').should('have.length', 0);
		});
	});

	describe('snap points', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=drawer--snap-points');
		});

		it('should open at the first snap point and expand when dragged up', () => {
			cy.findByText(/open snap drawer/i).click();
			cy.get('[data-slot="drawer-popup"]').should('have.attr', 'data-snap-points');
			// The 10rem peek leaves most of the popup below the viewport edge.
			cy.get('[data-slot="drawer-popup"]').should(($popup) => {
				expect(parseFloat($popup[0].style.getPropertyValue('--drawer-snap-point-offset'))).to.be.greaterThan(0);
			});

			drag('hlm-drawer-swipe-handle', -400);
			cy.get('[data-slot="drawer-popup"]').should(($popup) => {
				expect($popup[0].style.getPropertyValue('--drawer-snap-point-offset')).to.equal('0px');
			});
		});
	});

	describe('non modal', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=drawer--non-modal');
		});

		it('should leave the page interactive while open', () => {
			cy.findByText(/non modal/i).click();
			cy.findByRole('dialog').should('exist');
			cy.get('.cdk-overlay-backdrop').should('not.exist');

			cy.findByText(/^outside$/i).click();
			cy.findByText(/^outside$/i).should('have.focus');
			cy.findByRole('dialog').should('exist');

			cy.findByText(/^close$/i).click();
			cy.findByRole('dialog').should('not.exist');
		});
	});

	describe('swipe area', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=drawer--swipe-area');
		});

		it('swiping up from the edge should open the drawer and keep it open', () => {
			cy.get('[data-testid="swipe-area"]').should('have.attr', 'data-closed');

			drag('[data-testid="swipe-area"]', -400);
			cy.findByRole('dialog').should('exist');
			cy.get('[data-slot="drawer-popup"]').should('have.attr', 'data-state', 'open');
			cy.get('[data-slot="drawer-popup"]').should('not.have.attr', 'data-swiping');

			cy.realPress('Escape');
			cy.findByRole('dialog').should('not.exist');
		});
	});
});
