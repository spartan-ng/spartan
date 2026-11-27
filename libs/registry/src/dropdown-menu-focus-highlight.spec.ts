import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { STYLES } from './styles/style';

/**
 * These tests verify that dropdown menu items are highlighted only via
 * hover or keyboard focus (focus-visible), never via plain :focus.
 *
 * Plain :focus triggers on mouse clicks too, which causes a flash of
 * the accent background when the user opens the menu with a pointer.
 * Using hover: + focus-visible: ensures items are highlighted only when
 * the user is actually hovering or navigating with the keyboard.
 *
 * Scenarios covered:
 *  1. Hover — item highlights on pointer hover.
 *  2. Keyboard focus — item highlights when keyboard-focused (focus-visible).
 *  3. No plain :focus — clicking with the mouse must NOT produce a sticky highlight.
 *  4. Shortcut text — follows item highlight via group-hover / group-focus-visible.
 *  5. Checkbox item — same hover/focus-visible rules applied.
 *  6. Radio item    — same hover/focus-visible rules applied.
 */

const itemClasses = [
	'spartan-dropdown-menu-item',
	'spartan-dropdown-menu-checkbox-item',
	'spartan-dropdown-menu-radio-item',
] as const;

function getBlock(style: (typeof STYLES)[number], selector: string): string {
	const stylesheet = readFileSync(new URL(`./styles/style-${style}.css`, import.meta.url), 'utf8');
	// Match the class block; handle nested selectors inside a parent scope block
	return stylesheet.match(new RegExp(`\\.${selector}\\s*\\{([^}]*)\\}`))?.[1] ?? '';
}

function getShortcutBlock(style: (typeof STYLES)[number]): string {
	return getBlock(style, 'spartan-dropdown-menu-shortcut');
}

describe('dropdown menu item focus highlight', () => {
	for (const style of STYLES) {
		describe(`style-${style}`, () => {
			// Scenario 1 & 2: hover and keyboard focus (focus-visible) must highlight items
			for (const cls of itemClasses) {
				it(`${cls}: highlights on hover`, () => {
					const block = getBlock(style, cls);
					expect(block, `${cls} in ${style} is missing hover:bg-accent`).toContain('hover:bg-accent');
					expect(block, `${cls} in ${style} is missing hover:text-accent-foreground`).toContain(
						'hover:text-accent-foreground',
					);
				});

				it(`${cls}: highlights on keyboard focus (focus-visible)`, () => {
					const block = getBlock(style, cls);
					expect(block, `${cls} in ${style} is missing focus-visible:bg-accent`).toContain(
						'focus-visible:bg-accent',
					);
					expect(block, `${cls} in ${style} is missing focus-visible:text-accent-foreground`).toContain(
						'focus-visible:text-accent-foreground',
					);
				});

				// Scenario 3: plain :focus must NOT be used — it fires on mouse clicks and
				// would cause the item to stay highlighted after a pointer interaction.
				it(`${cls}: does NOT highlight on plain :focus (would fire on mouse click)`, () => {
					const block = getBlock(style, cls);
					// Accept focus-visible: but reject bare focus: for background/text highlights
					expect(
						block,
						`${cls} in ${style} uses focus:bg-accent — replace with focus-visible:bg-accent`,
					).not.toMatch(/(?<![a-z-])focus:bg-accent(?![a-z-])/);
					expect(
						block,
						`${cls} in ${style} uses focus:text-accent-foreground — replace with focus-visible:text-accent-foreground`,
					).not.toMatch(/(?<![a-z-])focus:text-accent-foreground(?![a-z-])/);
				});
			}

			// Scenario 4: shortcut text colour must follow item hover AND keyboard focus,
			// but not plain :focus
			it('shortcut: colour follows item hover', () => {
				const block = getShortcutBlock(style);
				expect(
					block,
					`shortcut in ${style} is missing group-hover/dropdown-menu-item:text-accent-foreground`,
				).toContain('group-hover/dropdown-menu-item:text-accent-foreground');
			});

			it('shortcut: colour follows keyboard focus (focus-visible)', () => {
				const block = getShortcutBlock(style);
				expect(
					block,
					`shortcut in ${style} is missing group-focus-visible/dropdown-menu-item:text-accent-foreground`,
				).toContain('group-focus-visible/dropdown-menu-item:text-accent-foreground');
			});

			it('shortcut: does NOT use plain group-focus (fires on mouse click)', () => {
				const block = getShortcutBlock(style);
				expect(
					block,
					`shortcut in ${style} uses group-focus/dropdown-menu-item — replace with group-focus-visible`,
				).not.toMatch(/group-focus\/dropdown-menu-item:text-accent-foreground/);
			});
		});
	}
});
