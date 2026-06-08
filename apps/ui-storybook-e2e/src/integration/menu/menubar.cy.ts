// cypress-real-events dispatches arrow keys as a CDP `rawKeyDown`, which CDK 21's menubar does not
// fully act on (it moves focus but skips the close-current/open-next menu step). Dispatching a
// native `keydown` reproduces real keyboard navigation reliably, so use it for arrow keys here.
const pressArrow = (key: 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight') => {
	const keyCode = { ArrowLeft: 37, ArrowUp: 38, ArrowRight: 39, ArrowDown: 40 }[key];
	cy.focused().trigger('keydown', { key, code: key, keyCode, which: keyCode });
};

describe('menubar', () => {
	describe('default', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=menubar--default');
			cy.injectAxe();
			cy.viewport(1000, 1000);
		});

		it('click on file should open menu and hovering around should open/close appropriate menus', () => {
			cy.checkA11y('#storybook-root', {
				rules: {
					'page-has-heading-one': { enabled: false },
					'landmark-one-main': { enabled: false },
				},
			});
			cy.findByText('File').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('Edit').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('View').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('Profiles').should('have.attr', 'aria-expanded', 'false');

			cy.findByText('File').realClick();
			cy.findByText('File').should('have.attr', 'aria-expanded', 'true');
			cy.findByText('Edit').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('View').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('Profiles').should('have.attr', 'aria-expanded', 'false');

			cy.findByText('Edit').realHover();
			cy.findByText('File').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('Edit').should('have.attr', 'aria-expanded', 'true');
			cy.findByText('View').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('Profiles').should('have.attr', 'aria-expanded', 'false');

			cy.findByText('Share').realHover();
			cy.findByText('File').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('Edit').should('have.attr', 'aria-expanded', 'true');
			cy.findByText('View').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('Profiles').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('Share').should('have.attr', 'aria-expanded', 'true');

			cy.findByText('View').realHover();
			cy.findByText('File').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('Edit').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('View').should('have.attr', 'aria-expanded', 'true');
			cy.findByText('Profiles').should('have.attr', 'aria-expanded', 'false');

			cy.findByText('Profiles').realHover();
			cy.findByText('File').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('Edit').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('View').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('Profiles').should('have.attr', 'aria-expanded', 'true');

			cy.findByText('File').realClick();
			cy.findByText('File').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('Edit').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('View').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('Profiles').should('have.attr', 'aria-expanded', 'false');
		});

		it('arrowdown on file should open menu and arrow left/right around should open/close appropriate menus', () => {
			cy.checkA11y('#storybook-root', {
				rules: {
					'page-has-heading-one': { enabled: false },
					'landmark-one-main': { enabled: false },
				},
			});
			cy.findByText('File').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('Edit').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('View').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('Profiles').should('have.attr', 'aria-expanded', 'false');

			cy.realPress('Tab');
			pressArrow('ArrowDown');
			cy.findByText('File').should('have.attr', 'aria-expanded', 'true');
			cy.findByText('Edit').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('View').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('Profiles').should('have.attr', 'aria-expanded', 'false');

			pressArrow('ArrowRight');
			cy.findByText('File').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('Edit').should('have.attr', 'aria-expanded', 'true');
			cy.findByText('View').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('Profiles').should('have.attr', 'aria-expanded', 'false');
			//
			pressArrow('ArrowDown');
			pressArrow('ArrowDown');
			pressArrow('ArrowDown');
			pressArrow('ArrowRight');
			cy.findByText('File').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('Edit').should('have.attr', 'aria-expanded', 'true');
			cy.findByText('View').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('Profiles').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('Share').should('have.attr', 'aria-expanded', 'true');

			pressArrow('ArrowLeft');
			pressArrow('ArrowUp');
			pressArrow('ArrowUp');
			pressArrow('ArrowUp');
			pressArrow('ArrowUp');
			pressArrow('ArrowRight');
			cy.findByText('File').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('Edit').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('View').should('have.attr', 'aria-expanded', 'true');
			cy.findByText('Profiles').should('have.attr', 'aria-expanded', 'false');

			pressArrow('ArrowRight');
			cy.findByText('File').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('Edit').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('View').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('Profiles').should('have.attr', 'aria-expanded', 'true');

			cy.realPress('Escape');
			cy.findByText('File').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('Edit').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('View').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('Profiles').should('have.attr', 'aria-expanded', 'false');
			cy.findByText('Profiles').should('be.focused');

			pressArrow('ArrowRight');
			cy.findByText('File').should('be.focused');
		});
	});
});
