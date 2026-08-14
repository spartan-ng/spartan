describe('popover--default', () => {
	describe('default', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=popover--default');
			cy.injectAxe();
		});

		it('click on trigger should open, click on close should close, click outside should close', () => {
			cy.checkA11y('#storybook-root', {
				rules: {
					'page-has-heading-one': { enabled: false },
					'landmark-one-main': { enabled: false },
				},
			});

			cy.findByText(/open popover/i).should('have.attr', 'aria-haspopup', 'dialog');
			cy.findByText(/open popover/i).click();

			cy.findAllByText(/Dimensions/).should('have.length', 1);
			cy.findByRole('dialog');
			cy.findByRole('dialog').should('not.have.attr', 'aria-labelledby');
			cy.findByRole('dialog').should('not.have.attr', 'aria-modal');
			cy.findByRole('dialog').should('have.attr', 'tabindex', '-1');

			// click outside of dialog
			cy.get('#storybook-root').click({ force: true });
			cy.findAllByText(/open popover/i).should('have.length', 1);
			cy.findAllByText(/open popover/i).should('have.focus');
		});

		it('clicking an outside button should close the popover and activate the button', () => {
			cy.findByText(/open popover/i).click();
			cy.findByRole('dialog').should('be.visible');

			cy.findByText(/outside action/i).click();

			cy.get('[role="dialog"]').should('not.exist');
			cy.findByText(/outside clicks: 1/i).should('be.visible');
		});

		it('tab and enter on trigger should open, escape should close', () => {
			cy.checkA11y('#storybook-root', {
				rules: {
					'page-has-heading-one': { enabled: false },
					'landmark-one-main': { enabled: false },
				},
			});

			cy.findByText(/open popover/i).should('have.attr', 'aria-haspopup', 'dialog');
			cy.realPress('Tab');
			cy.realPress('Enter');

			cy.findAllByText(/Dimensions/).should('have.length', 1);
			cy.findByRole('dialog');
			cy.findByRole('dialog').should('not.have.attr', 'aria-labelledby');
			cy.findByRole('dialog').should('not.have.attr', 'aria-modal');
			cy.findByRole('dialog').should('have.attr', 'tabindex', '-1');

			cy.realPress('Escape');
			cy.findAllByText(/open popover/i).should('have.length', 1);
			cy.findAllByText(/open popover/i).should('have.focus');
			cy.realPress('Enter');
		});

		it('tab and space on trigger should open, tab through content, escape should close', () => {
			cy.checkA11y('#storybook-root', {
				rules: {
					'page-has-heading-one': { enabled: false },
					'landmark-one-main': { enabled: false },
				},
			});

			cy.findByText(/open popover/i).should('have.attr', 'aria-haspopup', 'dialog');
			cy.realPress('Tab');
			cy.realPress('Space');

			cy.findAllByText(/Dimensions/).should('have.length', 1);
			cy.findByRole('dialog');
			cy.findByRole('dialog').should('not.have.attr', 'aria-labelledby');
			cy.findByRole('dialog').should('not.have.attr', 'aria-modal');
			cy.findByRole('dialog').should('have.attr', 'tabindex', '-1');

			cy.realPress('Tab');
			cy.realPress('Tab');
			cy.realPress('Tab');
			cy.realPress('Escape');
			cy.findAllByText(/open popover/i).should('have.length', 1);
			cy.findAllByText(/open popover/i).should('have.focus');
			cy.realPress('Space');

			// click escape when dialog open
			cy.realPress('Escape');
			cy.findAllByText(/open popover/i).should('have.length', 1);
			cy.findAllByText(/open popover/i).should('have.focus');
		});
	});
});

describe('popover--near-viewport-edge', () => {
	/** Reading geometry before the opening animation ends is off by a pixel. */
	const settled = () =>
		cy
			.get('hlm-popover-content')
			.should('be.visible')
			.then(($content) => cy.wrap(Promise.all($content[0].getAnimations().map((a: Animation) => a.finished))));

	const geometry = () =>
		cy.get('#edge-trigger').then(($trigger) => {
			const trigger = $trigger[0].getBoundingClientRect();
			return cy.get('hlm-popover-content').then(($content) => {
				const content = $content[0].getBoundingClientRect();
				return { trigger, content, offsetY: Math.round(content.top - trigger.top) };
			});
		});

	/**
	 * Asserts on both boxes from a single retried query, so repositioning is awaited rather
	 * than slept through.
	 */
	const expectGeometry = (assert: (boxes: { trigger: DOMRect; content: DOMRect }) => void) =>
		cy.get('hlm-popover-content').should(($content) =>
			assert({
				trigger: Cypress.$('#edge-trigger')[0].getBoundingClientRect(),
				content: $content[0].getBoundingClientRect(),
			}),
		);

	/**
	 * Cypress scrolls by assigning `scrollTop`, which never reaches the listener
	 * `ScrollDispatcher` installs, so the reposition strategy would not run. Dispatching the
	 * event explicitly is what makes this a scroll as far as the overlay is concerned.
	 */
	const scrollTo = (y: number) => {
		cy.scrollTo(0, y);
		cy.document().then((doc) => doc.dispatchEvent(new Event('scroll')));
	};

	beforeEach(() => {
		cy.visit('/iframe.html?id=popover--near-viewport-edge');
		cy.get('#edge-trigger').click();
		settled();
	});

	it('keeps content at its own width rather than squeezing it into the space left', () => {
		cy.window().then((win) => {
			geometry().then(({ trigger, content }) => {
				// Without push the overlay is confined to the gap between the trigger and the
				// viewport edge, which collapses 288px of content down to about 68px.
				expect(content.width).to.be.greaterThan(win.innerWidth - trigger.left);
				expect(content.right).to.be.at.most(win.innerWidth);
				expect(content.left).to.be.at.least(0);
			});
		});
	});

	it('follows a trigger that scrolls out of view instead of holding itself against the edge', () => {
		scrollTo(400);
		scrollTo(900);
		scrollTo(1400);

		expectGeometry(({ trigger, content }) => {
			expect(trigger.top, 'the trigger should have scrolled above the viewport').to.be.lessThan(0);
			// This is the drift #955 removed: an overlay pushed back on every reposition stays
			// against the top edge while its trigger keeps travelling away from it.
			expect(content.top).to.be.lessThan(0);
		});
	});
});
