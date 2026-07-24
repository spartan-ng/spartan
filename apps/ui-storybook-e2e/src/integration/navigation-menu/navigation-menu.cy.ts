// cypress-real-events sends keyboard input as CDP `rawKeyDown`, which is dropped when the spec runs
// without window focus. Our navigation-menu moves focus imperatively from its Tab/Arrow handlers
// (preventDefault + .focus()), so dispatching a native KeyboardEvent on the focused element
// exercises the real behaviour reliably. A native event (not jQuery's .trigger) is required so
// Angular's `keydown.arrowDown` host binding sees the right `event.key`.
const TAB: KeyboardEventInit = { key: 'Tab' };
const pressKey = (init: KeyboardEventInit) =>
	cy.focused().then(($el) => {
		$el[0].dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init }));
	});

describe('navigation-menu', () => {
	const checkA11y = () =>
		cy.checkA11y('#storybook-root', {
			rules: {
				'page-has-heading-one': { enabled: false },
				'landmark-one-main': { enabled: false },
			},
		});

	const openHome = () => {
		cy.findByRole('button', { name: /home/i }).realHover();
		cy.findByRole('button', { name: /home/i }).should('have.attr', 'aria-expanded', 'true');
	};

	describe('default (open on hover)', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=navigation-menu--default');
			cy.injectAxe();
			cy.viewport(1000, 1000);
		});

		it('has no a11y violations and wires aria-expanded/controls only while open', () => {
			checkA11y();

			cy.findByRole('button', { name: /home/i })
				.should('have.attr', 'aria-expanded', 'false')
				.and('not.have.attr', 'aria-controls');

			openHome();
			cy.findByRole('link', { name: /introduction/i }).should('be.visible');
			cy.findByRole('button', { name: /home/i }).should('have.attr', 'aria-controls');
		});

		it('renders a single chevron per trigger', () => {
			cy.findByRole('button', { name: /home/i }).find('ng-icon').should('have.length', 1);
		});

		it('enters the panel with ArrowDown', () => {
			openHome();

			cy.findByRole('button', { name: /home/i }).focus();
			pressKey({ key: 'ArrowDown' });
			cy.findByRole('link', { name: /spartan\.ng/i }).should('be.focused');
		});

		it('enters the panel when tabbing from the trigger', () => {
			openHome();

			cy.findByRole('button', { name: /home/i }).focus();
			pressKey(TAB);
			cy.findByRole('link', { name: /spartan\.ng/i }).should('be.focused');
		});

		it('walks through the panel items with Tab / Shift+Tab', () => {
			openHome();

			cy.findByRole('link', { name: /spartan\.ng/i }).focus();
			pressKey(TAB);
			cy.findByRole('link', { name: /introduction/i }).should('be.focused');

			pressKey({ ...TAB, shiftKey: true });
			cy.findByRole('link', { name: /spartan\.ng/i }).should('be.focused');
		});

		it('keeps focus in the menu when tabbing past the last item (issue #1484)', () => {
			openHome();

			// Tab once more after the final dropdown link - this used to drop focus out of the nav.
			cy.findByRole('link', { name: /typography/i }).focus();
			pressKey(TAB);

			cy.findByRole('button', { name: /components/i }).should('be.focused');
			cy.findByRole('button', { name: /home/i }).should('have.attr', 'aria-expanded', 'false');
		});

		it('returns focus to the trigger on Shift+Tab from the first item', () => {
			openHome();

			cy.findByRole('link', { name: /spartan\.ng/i }).focus();
			pressKey({ ...TAB, shiftKey: true });
			cy.findByRole('button', { name: /home/i }).should('be.focused');
		});

		it('closes on Escape and restores focus to the trigger', () => {
			openHome();

			cy.findByRole('link', { name: /introduction/i }).focus();
			pressKey({ key: 'Escape' });

			cy.findByRole('button', { name: /home/i }).should('be.focused').and('have.attr', 'aria-expanded', 'false');
		});
	});

	describe('click to open', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=navigation-menu--click-to-open');
			cy.injectAxe();
			cy.viewport(1000, 1000);
		});

		it('opens on click and toggles closed on a second click', () => {
			cy.findByRole('button', { name: /home/i }).should('have.attr', 'aria-expanded', 'false');

			cy.findByRole('button', { name: /home/i }).click();
			cy.findByRole('button', { name: /home/i }).should('have.attr', 'aria-expanded', 'true');
			cy.findByRole('link', { name: /introduction/i }).should('be.visible');

			cy.findByRole('button', { name: /home/i }).click();
			cy.findByRole('button', { name: /home/i }).should('have.attr', 'aria-expanded', 'false');
		});
	});
});
